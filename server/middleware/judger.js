const util = require('util')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs')

const MIDDLEWARE_DIR = "middleware"
const DATA_DIR = "resources\\static\\assets\\uploads"
const SUBMISSIONS_DIR = `${DATA_DIR}\\submit`
const TESTS_DIR = `${DATA_DIR}\\problem`

const COMPILERS_DIR = `${MIDDLEWARE_DIR}\\compilers`
const CPP_COMPILER_DIR = `${COMPILERS_DIR}\\mingw\\bin\\g++`
const WRAPPER = `${MIDDLEWARE_DIR}\\wrapper.exe`

var worker = 2
const get_submission_src = (sid) => {
    return `${SUBMISSIONS_DIR}\\${sid}`
}
const get_submission_des = (sid) => {
    return `${MIDDLEWARE_DIR}\\env_${sid}`
}
const get_submission_path = (sid) => {
    return `${get_submission_des(sid)}\\${sid}`
}
const init = async (sid) => {
    try {
        let submission_src = get_submission_src(sid)
        let submission_des = get_submission_des(sid)
        if (!fs.existsSync(submission_des)) await exec(`mkdir ${submission_des}`)
        await exec(`copy ${submission_src}.cpp ${submission_des}\\${sid}.cpp`)
        return 0
    } catch (e) {
        return e.code
    }
}


const compile = async (sid) => {
    try {
        let submission_path = get_submission_path(sid)
        await exec(`${CPP_COMPILER_DIR} -o ${submission_path}.exe ${submission_path}.cpp`)
        return 0
    } catch (e) {
        return e.code
    }
}

const run = async (sid, test_input, stdin, stdout, timeLimit, memoryLimit) => {
    try {
        let submission_des = get_submission_des(sid)
        var command = `..\\..\\${WRAPPER} -t ${timeLimit} -m ${memoryLimit} ${sid}.exe`
        if (!stdin) command += ` -i ..\\..\\${test_input}`
        else {
            await exec(`copy ..\\..\\${test_input} ${stdin}`, { cwd: submission_des })
        }
        if (!stdout) command += ` -o a.txt`
        var x = await exec(command, { cwd: submission_des })
        return { code: 0, details: JSON.parse(x.stdout) }
    } catch (e) {
        return { code: e.code, details: JSON.parse(e.stdout)}
    }
}
const compare = async (file1, file2, method) => {
    try {
        await exec(`fc ${method} ${file1} ${file2}`)
        return 0
    } catch (e) {
        return e.code
    }
}

const clean_up = async (sid) => {
    try {
        await exec(`rmdir /s /q ${get_submission_des(sid)}`)
        return 0
    } catch (e) {
        return e.code
    }
}

const judge = async (sid, problem, stdin, stdout, timeLimit, memoryLimit, io, username) => {
    var exitCode = 0
    var point = 0, usage_time = 0, usage_memory = 0, test_count = 0
    var log_detail = []
    io.emit('get-status-' + username, { id: sid, verdict: `Judging`, usage_time: 0, usage_memory: 0 })
    exitCode = await init(sid)
    if (exitCode) {
        var ret = { verdict: 'Internal Error', usage_time: 0, usage_memory: 0 }
        io.emit('get-status-' + username, { id: sid, verdict: 'Internal Error', usage_time: 0, usage_memory: 0 })
        fs.writeFileSync(get_submission_src(sid) + "_log.txt", JSON.stringify({log_detail: [], log_total: ret}))
        return ret
    }
    exitCode = await compile(sid)
    if (exitCode) {
        var ret = { verdict: 'Compilation Error', usage_time: 0, usage_memory: 0 }
        io.emit('get-status-' + username, { id: sid, verdict: 'Compilation Error', usage_time: 0, usage_memory: 0 })
        fs.writeFileSync(get_submission_src(sid) + "_log.txt", JSON.stringify({log_detail: [], log_total: ret}))
        return ret
    }

    problem_path = `${TESTS_DIR}\\${problem}\\test`
    var g = fs.readdirSync(problem_path)
    for (let i = 0; i < g.length; i++) {
        var test = g[i]
        io.emit('get-status-' + username, { id: sid, verdict: `Running on test ${i}`, usage_time: 0, usage_memory: 0 })
        if (fs.lstatSync(`${problem_path}\\${test}`).isDirectory()) {
            test_count++
            var dir = `${problem_path}\\${test}\\${problem}`
            
            var _run = await run(sid, `${dir}.inp`, stdin, stdout, timeLimit, memoryLimit)
            usage_time = Math.max(usage_time, _run.details.time)
            usage_memory = Math.max(usage_memory, _run.details.memory)
            if (_run.code) {
                log_detail.push({test_name: test, exit_code: _run.code, time: _run.details.time, memory: _run.details.memory, point: 0, test_point: 1})
                continue
            }
            var _compare
            if (stdout) {
                _compare = await compare(`${get_submission_des(sid)}\\${stdout}`, `${dir}.out`, "/w")
            } else {
                _compare = await compare(`${get_submission_des(sid)}\\a.txt`, `${dir}.out`, "/w")
            }
            if (_compare == 0) point += 1
            log_detail.push({test_name: test, exit_code: _compare, time: _run.details.time, memory: _run.details.memory, point: (_compare == 0) ? 1 : 0, test_point: 1})
        }
    }
    clean_up(sid)
    var ret = { verdict: `${point}/${test_count}`, usage_time: usage_time, usage_memory: usage_memory }
    io.emit('get-status-' + username, { id: sid, verdict: `${point}/${test_count}`, usage_time: usage_time, usage_memory: usage_memory })
    fs.writeFileSync(get_submission_src(sid) + "_log.txt", JSON.stringify({log_detail: log_detail, log_total: ret}))
    return ret
}

const judge_process = async function (queue, database, io) {
    if (queue.length && worker) {
        worker--
        var g = queue.shift()
        console.log('[Judger] Judge', g.id)
        io.emit("push-status-" + g.username, { id: g.id, time_submit: g.time_submit, problem_code: g.problem_code, language: g.language, verdict: `Inqueue`, usage_time: 0, usage_memory: 0 })
        var x = await judge(g.id, g.problem_code, null, null, 1000, 256, io, g.username)
        await database.run(`UPDATE submissions SET verdict=?, usage_time=?, usage_memory=? WHERE id=?`, [x.verdict, x.usage_time, x.usage_memory, g.id], function (err) {
            console.log('[Database] Error:', err)
            console.log('[Database] Update score to database')
        })
        worker++
        console.log('[Judger] Result', x)
        console.log("[Judger] Current queue:", queue)
    }
}

module.exports = function (queue, database, io) {
    console.log("[Judger] Starting to create infinite process to judge")
    console.log("[Judger] Get last un-judged submission")
    database.all(`SELECT * FROM submissions WHERE verdict = 'Inqueue'`, function(err, data) {
        for (let i = 0; i < data.length; i++){
            queue.push({id: data[i].id, time_submit: data[i], username: data[i].username, problem_code: data[i].problem_code, language: data[i].language})
        }
        setInterval(judge_process, 100, queue, database, io)
        console.log("[Judger] Create infinite process to judge successfully")
    })
}
