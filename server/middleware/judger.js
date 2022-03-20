const util = require('util')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs')

const MIDDLEWARE_DIR = "server\\middleware"
const DATA_DIR = "server\\data"
const SUBMISSIONS_DIR = `${DATA_DIR}\\queue`
const TESTS_DIR = `${DATA_DIR}\\Tasks`

const COMPILERS_DIR = `${MIDDLEWARE_DIR}\\compilers`
const CPP_COMPILER_DIR = `${COMPILERS_DIR}\\mingw\\bin\\g++`
const WRAPPER = `${MIDDLEWARE_DIR}\\wrapper.exe`

const parse = (submission_id) => {
    submission_id = submission_id.split(".")
    submission_id.pop()
    submission_id = submission_id.join(".")
    return submission_id
}
const init = async (submission_id) => {
    try {
        let submission_src = `${SUBMISSIONS_DIR}\\${submission_id}`
        let submission_des = `${MIDDLEWARE_DIR}\\env_${submission_id}`
        if (!fs.existsSync(submission_des)) await exec(`mkdir ${submission_des}`)
        await exec(`copy ${submission_src}.cpp ${submission_des}\\${submission_id}.cpp`)
        return 0
    } catch (e) {
        return e.code
    }
}


const compile = async (submission_id) => {
    try {
        let submission_path = `${MIDDLEWARE_DIR}\\env_${submission_id}\\${submission_id}`
        await exec(`${CPP_COMPILER_DIR} -o ${submission_path}.exe ${submission_path}.cpp`)
        return 0
    } catch (e) {
        return e.code
    }
}

const run = async (submission_id, test_input, stdin, stdout, timeLimit, memoryLimit) => {
    try {
        let submission_dir = `${MIDDLEWARE_DIR}\\env_${submission_id}`
        var command = `..\\..\\..\\${WRAPPER} -t ${timeLimit} -m ${memoryLimit} ${submission_id}.exe`
        if (!stdin) command += ` -i ..\\..\\..\\${test_input}`
        else {
            await exec(`copy ..\\..\\..\\${test_input} ${stdin}`, { cwd: submission_dir })
        }
        if (!stdout) command += ` -o a.txt`
        var x = await exec(command, { cwd: submission_dir })
        return x.stdout
    } catch (e) {
        return e.code
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

const clean_up = async(submission_id) => {
    try {
        await exec(`rmdir /s /q ${MIDDLEWARE_DIR}\\env_${submission_id}`)
        return 0
    } catch(e){
        return e.code
    }
}

const judge = async (submission, problem, stdin, stdout, timeLimit, memoryLimit) => {
    submission = parse(submission)
    var exitCode = 0;
    exitCode = await init(submission)
    if (exitCode) {
        console.log("init error")
        console.log("exit code", exitCode)
        return { code: exitCode, verdict: 'Internal Error' }
    }
    exitCode = await compile(submission)
    if (exitCode) {
        console.log("compile error")
        console.log("exit code", exitCode)
        return { code: exitCode, verdict: "Compilation Error" }
    }

    problem_path = `${TESTS_DIR}\\${problem}`
    var g = fs.readdirSync(problem_path)
    for (let i = 0; i < g.length; i++) {
        var test = g[i]
        console.log("test", g[i])
        if (fs.lstatSync(`${problem_path}\\${test}`).isDirectory()) {
            var x2 = await run(submission, `${problem_path}\\${test}\\${problem}.inp`, stdin, stdout, timeLimit, memoryLimit)
            console.log("run", x2)
            if (x2) continue;
            var x3;
            if (stdout) {
                x3 = await compare(`${MIDDLEWARE_DIR}\\env_${submission}\\${stdout}`, `${problem_path}\\${test}\\${problem}.out`, "/w")
            } else {
                x3 = await compare(`${MIDDLEWARE_DIR}\\env_${submission}\\a.txt`, `${problem_path}\\${test}\\${problem}.out`, "/w")
            }
            console.log("compr", x3)
        }
    }
    console.log("ok")
    clean_up(submission)
}

judge("delseg.cpp", "delseg", null, null, 1000, 1)