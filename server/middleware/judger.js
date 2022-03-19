const util = require('util')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs')

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
        await exec(`compilers\\mingw\\bin\\g++ -o ${submission_id}.exe ${submission_id}.cpp`, { cwd: "server\\middleware\\" })
        return 0
    } catch (e) {
        return [e.code, e.stderr]
    }
}

const run = async (submission_id, test) => {
    try {
        var x = await exec(`wrapper.exe -t 1000 -m 256 ${submission_id}.exe -i ${test} -o a.txt`, { cwd: "server\\middleware\\"})
        //var x = await exec(`${submission_id}.exe < ${test} > a.txt`, { cwd: "server\\middleware\\"})
        return 0
    } catch (e) {
        return e
    }
}

const judge = async (submission, problem) => {
    submission = submission.split(".")
    submission.pop()
    submission = submission.join(".")
    console.log(submission)
    var x1 = await compile(submission)
    if (x1) {
        console.log("err", x1)
        return { code: x1, verdict: "CE" }
    }
    console.log("compl", x1)
    //console.log(fs.readdirSync(problem))
    var g = fs.readdirSync(problem)
    for (let i = 0; i < g.length; i++) {
        var name = g[i]
        if (fs.lstatSync(problem + "\\" + name).isDirectory()) {
            var x2 = await run(submission, "..\\data\\Tasks\\ADDNUMGAME\\" + name + "\\ADDNUMGAME.inp")
            console.log("run", x2)
            if(x2) continue;
            var x3 = await compare("a.txt", "..\\data\\Tasks\\ADDNUMGAME\\" + name + "\\ADDNUMGAME.out", "/w")
            console.log("compr", x3)
            
        }

    }
}

judge("..\\data\\queue\\addnumgame.cpp", "server\\data\\Tasks\\ADDNUMGAME")