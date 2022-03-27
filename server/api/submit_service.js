const fs = require("fs")
var path = require('path')
const uploadFilePro = require("../middleware/upload_single")
var sqlite = require("better-sqlite3")
var db = new sqlite('./data/database.db')
const randomHex = require('crypto-random-hex')

module.exports = function (app, database, submit_queue) {
    app.post('/submit/:problem_code', async (req, res) => {
        if (req.session.username) {
            problem = db.prepare(`SELECT problem_code FROM problems WHERE problem_code='${req.params.problem_code}'`).all()
            if (problem.length <= 0) return res.status(400).send({ message: "problem does not exist" })
            problem = problem[0].problem_code
            try {
                await uploadFilePro(req, res)

                if (req.file == undefined) {
                    return res.status(400).send({ message: "Please upload a file!" })
                }

                file_name = req.file.originalname
                time_submit = new Date().getTime()
                submit_id = randomHex(6)
                type = path.extname(file_name)
                var oldPath = __basedir + "/resources/static/assets/uploads/" + file_name
                var newPath = __basedir + "/resources/static/assets/uploads/submit/" + submit_id + type
                fs.rename(oldPath, newPath, function (err) {
                    if (err) throw err
                })
                db.prepare(`INSERT INTO submissions (id, time_submit, username, problem_code, language, usage_time, usage_memory, verdict) VALUES ('${submit_id}', '${time_submit}', '${req.session.username}', '${problem}', '${type}', 0, 0, 'Inqueue')`).run()
                submit_queue.push({id: submit_id, time_submit: time_submit, username: req.session.username, problem_code: problem, language: type})
                res.status(200).send({
                    message: "Uploaded the file successfully",
                })
            } catch (err) {

                if (err.code == "LIMIT_FILE_SIZE") {
                    return res.status(500).send({
                        message: "File size cannot be larger than 4MB!",
                    })
                }

                res.status(500).send({
                    message: `Could not upload the file: ${req.file.originalname}. ${err}`,
                })
            }

        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.get('/submissions/all', (req, res) => {
        if (req.session.username) {
            data = db.prepare(`SELECT * FROM submissions ORDER BY time_submit DESC`).all()
            res.status(200).send(data)
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.get('/submissions', (req, res) => {
        if (req.session.username) {
            data = db.prepare(`SELECT * FROM submissions WHERE username='${req.session.username}'`).all()
            res.status(200).send(data)
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.get('/submissions/:problem_code', (req, res) => {
        if (req.session.username) {
            data = db.prepare(`SELECT * FROM submissions WHERE username='${req.session.username}' and problem_id='${req.params.problem_code}'`).all()
            res.status(200).send(data)
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.get('/submissions/show/:submissions_id', async (req, res) => {
        if (req.session.username) {
            data = db.prepare(`SELECT * FROM submissions WHERE id='${req.params.submissions_id}'`).all()
            if (req.session.role == 1 || req.session.username == data[0].username) {
                const fileName = __basedir + "/resources/static/assets/uploads/submit/" + req.params.submissions_id + data[0].language
                fs.readFile(fileName, "utf8", function (err, contents) {
                    res.writeHead(200, { 'Content-Type': 'text/plain' })
                    res.write(contents)
                    res.end()
                })
            }
            else {
                res.status(500).send({
                    message: `Không được cấp quyền`,
                })
            }
        }
        else {
            res.send({ logged_in: false })
        }
    })

}