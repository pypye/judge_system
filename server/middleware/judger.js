const util = require('util');
const exec = util.promisify(require('child_process').exec);

const compare = async (file1, file2, method) => {
    try {
        await exec(`fc ${method} ${file1} ${file2}`, { cwd: "server\\middleware\\" })
        return 0
    } catch (e) {
        return e.code
    }

}

const compile = async (submission_id) => {
    try {
        await exec(`compilers\\mingw\\bin\\g++ -o ${submission_id}.cpp ${submission_id}.exe`, { cwd: "server\\middleware\\" })
        return 0
    } catch (e) {
        return e.code
    }
}

const run = async (submission_id, test) => {
    try {
        await exec(`${submission_id}.exe < ${test}`, { cwd: "server\\middleware\\", timeout: 1000 })
        return 0
    } catch (e) {
        return e.code
    }
}

const judge = async (submission, problem) => {
    var x1 = await compile(submission)
    for(i in test){
        await run(submission, test[i])
        await compare("env0\\text1", "env0\\text2", "/w")
    }   
}
