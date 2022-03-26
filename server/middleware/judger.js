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
        return { code: e.code, details: JSON.parse(e.stdout) }
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

const judge = async (sid, problem, stdin, stdout, timeLimit, memoryLimit) => {
    var exitCode = 0
    var point = 0, usage_time = 0, usage_memory = 0, test_count = 0
    exitCode = await init(sid)
    if (exitCode) {
        return { point: 'Internal Error', usage_time: 0, usage_memory: 0 }
    }
    exitCode = await compile(sid)
    if (exitCode) {
        return { point: "Compilation Error", usage_time: 0, usage_memory: 0 }
    }

    problem_path = `${TESTS_DIR}\\${problem}\\${problem}`
    var g = fs.readdirSync(problem_path)
    for (let i = 0; i < g.length; i++) {
        var test = g[i]
        if (fs.lstatSync(`${problem_path}\\${test}`).isDirectory()) {
            test_count++
            var dir = `${problem_path}\\${test}\\${problem}`

            var _run = await run(sid, `${dir}.inp`, stdin, stdout, timeLimit, memoryLimit)
            usage_time += _run.details.time
            usage_memory += _run.details.memory
            if (_run.code) continue
            var _compare
            if (stdout) {
                _compare = await compare(`${get_submission_des(sid)}\\${stdout}`, `${dir}.out`, "/w")
            } else {
                _compare = await compare(`${get_submission_des(sid)}\\a.txt`, `${dir}.out`, "/w")
            }
            if (_compare == 0) point += 1
        }
    }
    clean_up(sid)
    return { point: `${point}/${test_count}`, usage_time: parseInt(usage_time / test_count), usage_memory: parseInt(usage_memory / test_count) }
}

const judge_process = async function (queue, database) {
    if (queue.length && worker) {
        worker--
        var g = queue.shift()
        console.log('[Judger] Judge', g.id)
        var x = await judge(g.id, g.problem_code, null, null, 1000, 256)
        await database.run(`UPDATE submissions SET verdict=?, usage_time=?, usage_memory=? WHERE id=?`, [x.point, x.usage_time, x.usage_memory, g.id], function (err) {
            console.log('[Database] Error:', err)
            console.log('[Database] Update score to database')
        })
        worker++
        console.log('[Judger] Result', x)
        console.log("[Judger] Current queue:", queue)
    }
}

module.exports = function (queue, database) {
    console.log("[Judger] Starting to create infinite process to judge")
    setInterval(judge_process, 100, queue, database)
    console.log("[Judger] Create infinite process to judge successfully")
}
