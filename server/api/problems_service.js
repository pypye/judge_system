const uploadFilePro = require("../middleware/upload")
const fs = require("fs-extra")
const problem_url = "/resources/static/assets/uploads/problem/"
const sqlite = require("better-sqlite3")
const db = new sqlite('./data/database.db')
const randomHex = require("crypto-random-hex")

module.exports = function (app, database) {
    //http://localhost:3001/problems
    app.get('/problems', (req, res) => {
        if (req.session.username) {
            database.all(`SELECT * FROM problems`, function (err, data) {
                if (data) res.send(data)
                else res.status(400).send({ message: 'Syntex error' })
            })
        }
        else res.status(400).send({ message: 'Please login first' })    // if not login
    })

    //http://localhost:3001/problem?problem_code=10
    app.get('/problem', (req, res) => {
        if (req.session.username) {
            database.all(`SELECT * FROM problems WHERE problem_code='${req.query.problem_code}'`, function (err, data) {
                if (data.length != 0) {
                    const description = fs.readFileSync(__basedir + problem_url + req.query.problem_code + "\\statement.txt")
                    data[0]['description'] = JSON.parse(description)
                    res.send(data[0])
                }
                else res.status(400).send({ message: 'Syntax error' })
            })
        }
        else res.status(400).send({ message: 'Please login first' })
    })

    app.post('/problem', (req, res) => {
        if (req.session.username) {
            if (req.session.role == 1) {
                db.prepare(`
                    INSERT INTO problems (problem_code, problem_name, file_input, file_output, limit_time, limit_memory) 
                    VALUES ('${req.body.problem_code}', '${req.body.problem_name}', '${req.body.file_input}', '${req.body.file_output}', ${req.body.limit_time},  ${req.body.limit_memory})
                    `).run()
                var path = __basedir + problem_url + req.body.problem_code + "/"
                if (!fs.existsSync(path)) fs.mkdirSync(path)
                fs.writeFileSync(path + 'statement.txt', JSON.stringify(req.body.description))
                res.send({ message: 'Problem created successfully' })
            }
            else res.status(400).send({ message: 'Only admin can access' })
        }
        else res.status(400).send({ message: 'Please login first' })

    })

    app.delete('/problem/:problem_code', (req, res) => {
        if (req.session.username) {
            problem = db.prepare(`SELECT problem_code FROM problems WHERE problem_code='${req.params.problem_code}'`).all()
            if (problem.length <= 0) return res.status(400).send({ message: "Problem does not exist" })
            problem = problem[0].problem_code
            var oldPath = __basedir + problem_url + problem
            if (!fs.existsSync(oldPath)) {
                res.status(400).send({ message: 'Problem does not exist' })
                return
            }
            if (req.session.role == 1) {
                database.run(`DELETE FROM problems WHERE problem_code=?`, problem, function (err) {
                    fs.rmSync(oldPath, { recursive: true, force: true })
                    res.send({ message: 'Delete problem sucessfully' })
                })
            }
            else res.status(400).send({ message: 'Only admin can access' })
        }
        else res.status(400).send({ message: 'Please login first' })

    })

    app.put('/problem/:problem_code', (req, res) => {
        if (req.session.username) {
            problem = db.prepare(`SELECT problem_code FROM problems WHERE problem_code='${req.params.problem_code}'`).all()
            if (problem.length <= 0) return res.status(400).send({ message: "Problem does not exist" })
            let data = [req.body.file_input, req.body.file_output, req.body.limit_memory, req.body.limit_time, req.params.problem_code]
            if (req.session.role == 1) {
                database.run(`UPDATE problems SET file_input=?, file_output=?, limit_memory=?, limit_time=? WHERE problem_code=?`, data, function (err) {
                    var path = __basedir + problem_url + req.params.problem_code + "/"
                    if (!fs.existsSync(path)) {
                        fs.mkdirSync(path)
                    }
                    fs.writeFileSync(path + 'statement.txt', JSON.stringify(req.body.description))
                    res.send({ message: 'Modify problem sucessfully' })
                })

            }
            else res.status(400).send({ message: 'Only admin can access' })
        }
        else res.status(400).send({ message: 'Please login first' })
    })

    app.post('/problem/test/upload/:problem_code', async (req, res) => {
        problem = db.prepare(`SELECT problem_code FROM problems WHERE problem_code='${req.params.problem_code}'`).all()
        if (problem.length <= 0) return res.status(400).send({ message: "Problem does not exist" })
        problem = problem[0].problem_code
        var oldPath = __basedir + problem_url + problem
        if (!fs.existsSync(oldPath)) {
            res.send({ success: false, message: 'Problem does not exist' })
            return
        }
        if (req.session.username) {
            if (req.session.role == 1) {
                try {
                    req.test_hash = randomHex(6)
                    req.dir = __basedir + "/resources/static/assets/uploads/problem"
                    await uploadFilePro(req, res)
                    if (req.files == undefined) {
                        return res.status(400).send({ message: "Please upload a file!" })
                    }
                    if (fs.existsSync(__basedir + problem_url + problem + "\\test")) {
                        fs.rmdirSync(__basedir + problem_url + problem + "\\test", { recursive: true, force: true })
                    }
                    var oldPath = __basedir + problem_url + problem + "\\" + req.test_hash
                    var newPath = __basedir + problem_url + problem + "\\test"
                    fs.copySync(oldPath, newPath)
                    fs.removeSync(oldPath)
                    res.send({ message: "Upload file successfully" })
                } catch (err) {
                    if (err.code == "LIMIT_FILE_SIZE") {
                        return res.status(400).send({ message: "Upload file failed: File size cannot be larger than 1MB!"})
                    }
                    res.status(400).send({
                        message: `Upload file failed: ${err}`,
                    })
                }
            }
            else res.status(400).send({ message: 'Only admin can access' })
        }
        else res.status(400).send({ message: 'Please login first' })
    })

}