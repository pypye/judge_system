const uploadFilePro = require("../middleware/upload_single")
var path = require('path')
const fs = require("fs")
const problem_url = "/resources/static/assets/uploads/problem/"
var sqlite = require("better-sqlite3")
var db = new sqlite('./data/database.db')
var unzipper = require('unzipper')

module.exports = function (app, database) {

    //http://localhost:3001/problems
    app.get('/problems', (req, res) => {
        if (req.session.username) {
            database.all(`SELECT * FROM problems`, function (err, data) {
                if (data) {
                    res.send(data)
                } else {
                    res.send({ success: false, message: 'error syntax' })
                }
            })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    //http://localhost:3001/problem?problem_code=10
    app.get('/problem', (req, res) => {
        if (req.session.username) {
            problem_code_pro = req.query.problem_code
            database.all(`SELECT * FROM problems WHERE problem_code='${problem_code_pro}'`, function (err, data) {
                if (data.length != 0) {
                    const description = fs.readFileSync(__basedir + problem_url + problem_code_pro + "/statement.txt")
                    data[0]['description'] = JSON.parse(description)
                    res.send(data[0])
                } else {
                    res.send({ success: false, message: 'error syntax' })
                }
            })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.post('/problem', (req, res) => {
        const problem_code = req.body.problem_code
        const problem_name = req.body.problem_name
        const level = req.body.level
        const description = req.body.description
        const file_input = req.body.file_input
        const file_output = req.body.file_output
        const limit_time = req.body.limit_time
        const limit_memory = req.body.limit_memory

        if (req.session.username) {
            if (req.session.role == 1) {
                db.prepare(`INSERT INTO problems (problem_code, problem_name, level, file_input, file_output, limit_time, limit_memory) VALUES ('${problem_code}',  '${problem_name}', '${level}', '${file_input}',  '${file_output}', ${limit_time},  ${limit_memory})`).run()
                var newPath = __basedir + problem_url + problem_code + "/"
                if (!fs.existsSync(newPath)) {
                    fs.mkdirSync(newPath)
                }
                fs.writeFileSync(newPath + 'statement.txt', JSON.stringify(description))
                res.send({ success: true, message: 'Thêm thành công' })
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.delete('/problem/:problem_code', (req, res) => {
        if (req.session.username) {
            problem = db.prepare(`SELECT problem_code FROM problems WHERE problem_code='${req.params.problem_code}'`).all()
            if (problem.length <= 0) return res.status(400).send({ message: "File không tồn tại" })
            problem = problem[0].problem_code
            var oldPath = __basedir + problem_url + problem
            if (!fs.existsSync(oldPath)) {
                res.send({ success: false, message: 'File không tồn tại' })
                return
            }
            if (req.session.role == 1) {
                database.run(`DELETE FROM problems WHERE problem_code=?`, problem, function (err) {
                    fs.rmSync(oldPath, { recursive: true, force: true })
                    res.send({ success: true, message: 'Xóa thành công' })
                })
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.put('/problem/:problem_code', (req, res) => {
        const level = req.body.level
        const description = req.body.description
        const file_input = req.body.file_input
        const file_output = req.body.file_output
        const limit_memory = req.body.limit_memory
        const limit_time = req.body.limit_time
        if (req.session.username) {
            problem = db.prepare(`SELECT problem_code FROM problems WHERE problem_code='${req.params.problem_code}'`).all()
            if (problem.length <= 0) return res.status(400).send({ message: "File không tồn tại" })
            problem = problem[0].problem_code
            let data = [level, file_input, file_output, limit_memory, limit_time, problem]
            if (req.session.role == 1) {
                database.run(`UPDATE problems SET level=?, file_input=?, file_output=?, limit_memory=?, limit_time=? WHERE problem_code=?`, data, function (err) {
                    var newPath = __basedir + problem_url + problem + "/"
                    if (!fs.existsSync(newPath)) {
                        fs.mkdirSync(newPath)
                    }
                    fs.writeFileSync(newPath + 'statement.txt', JSON.stringify(description))
                    res.send({ success: true, message: 'Sửa thành công' })
                })

            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    // http://localhost:3001/problem/upload/ATSM
    // app.post('/problem/upload/:problem_code', async (req, res) => {
    //     problem = db.prepare(`SELECT problem_name FROM problems WHERE problem_code='${req.params.problem_code}'`).all()
    //     if (problem.length <= 0) return res.status(400).send({ message: "File không tồn tại" })
    //     problem = problem[0].problem_name
    //     var oldPath = __basedir + problem_url + problem
    //     if (!fs.existsSync(oldPath)) {
    //         res.send({ success: false, message: 'File không tồn tại' })
    //         return
    //     }
    //     if (req.session.username) {
    //         if (req.session.role == 1) {
    //             try {
    //                 await uploadFilePro(req, res)

    //                 if (req.file == undefined) {
    //                     return res.status(400).send({ message: "Please upload a file!" })
    //                 }
    //                 file_name = req.file.originalname
    //                 var oldPath = __basedir + "/resources/static/assets/uploads/" + file_name
    //                 var newPath = __basedir + problem_url + problem + "/" + problem + path.extname(file_name)
    //                 fs.rename(oldPath, newPath, function (err) {
    //                     if (err) throw err
    //                 })

    //                 res.status(200).send({
    //                     message: "Uploaded the file successfully",
    //                 })
    //             } catch (err) {

    //                 if (err.code == "LIMIT_FILE_SIZE") {
    //                     return res.status(500).send({
    //                         message: "File size cannot be larger than 4MB!",
    //                     })
    //                 }

    //                 res.status(500).send({
    //                     message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    //                 })
    //             }
    //         }
    //         else res.send({ success: false, message: 'Không được cấp quyền' })
    //     }
    //     else {
    //         res.send({ logged_in: false })
    //     }
    // })

    // app.get('/problem/download/:problem_code', async (req, res) => {
    //     problem = db.prepare(`SELECT problem_name FROM problems WHERE problem_code='${req.params.problem_code}'`).all()
    //     if (problem.length <= 0) return res.status(400).send({ message: "File không tồn tại" })
    //     problem = problem[0].problem_name
    //     if (req.session.username) {
    //         const fileName = problem + ".pdf"
    //         const directoryPath = __basedir + problem_url + problem + "/"
    //         if (!fs.existsSync(directoryPath + fileName)) {
    //             res.send({ success: false, message: 'File không tồn tại' })
    //             return
    //         }
    //         res.download(directoryPath + fileName, fileName, (err) => {
    //             if (err) {
    //                 res.status(500).send({
    //                     message: "Could not download the file. " + err,
    //                 })
    //             }
    //         })
    //     }
    //     else {
    //         res.send({ logged_in: false })
    //     }
    // })

    // app.get('/problem/show/:problem_code', async (req, res) => {
    //     problem = db.prepare(`SELECT problem_name FROM problems WHERE problem_code='${req.params.problem_code}'`).all()
    //     if (problem.length <= 0) return res.status(400).send({ message: "File không tồn tại" })
    //     problem = problem[0].problem_name
    //     if (req.session.username) {
    //         const fileName = problem + ".pdf"
    //         const directoryPath = __basedir + problem_url + problem + "/"
    //         if (!fs.existsSync(directoryPath + fileName)) {
    //             res.send({ success: false, message: 'File không tồn tại' })
    //             return
    //         }
    //         res.contentType("application/pdf")
    //         fs.createReadStream(directoryPath + fileName).pipe(res)
    //     }
    //     else {
    //         res.send({ logged_in: false })
    //     }
    // })

    app.post('/problem/test/upload/:problem_code', async (req, res) => {
        problem = db.prepare(`SELECT problem_code FROM problems WHERE problem_code='${req.params.problem_code}'`).all()
        if (problem.length <= 0) return res.status(400).send({ message: "File không tồn tại" })
        problem = problem[0].problem_code
        var oldPath = __basedir + problem_url + problem
        if (!fs.existsSync(oldPath)) {
            res.send({ success: false, message: 'File không tồn tại' })
            return
        }
        if (req.session.username) {
            if (req.session.role == 1) {
                try {
                    await uploadFilePro(req, res)

                    if (req.file == undefined) {
                        return res.status(400).send({ message: "Please upload a file!" })
                    }
                    file_name = req.file.originalname
                    var oldPath = __basedir + "/resources/static/assets/uploads/" + file_name
                    var newPath = __basedir + problem_url + problem + "/" + problem + path.extname(file_name)
                    fs.rename(oldPath, newPath, function (err) {
                        if (err) throw err
                    })
                    if (fs.existsSync(__basedir + problem_url + problem + "/" + problem)) fs.rmdirSync(__basedir + problem_url + problem + "/" + problem, { recursive: true, force: true })
                    fs.createReadStream(newPath).pipe(unzipper.Extract({ path: __basedir + problem_url + problem })
                        .on('close', function () {
                            fs.rmSync(newPath)
                        })
                    )
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
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.get('/problem/test/download/:problem_code', async (req, res) => {
        problem = db.prepare(`SELECT problem_code FROM problems WHERE problem_code='${req.params.problem_code}'`).all()
        if (problem.length <= 0) return res.status(400).send({ message: "File không tồn tại" })
        problem = problem[0].problem_code
        if (req.session.username) {
            if (req.session.role == 1) {
                const fileName = problem + ".zip"
                const directoryPath = __basedir + problem_url + problem + "/"
                if (!fs.existsSync(directoryPath + fileName)) {
                    res.send({ success: false, message: 'File không tồn tại' })
                    return
                }
                res.download(directoryPath + fileName, fileName, (err) => {
                    if (err) {
                        res.status(500).send({
                            message: "Could not download the file. " + err,
                        })
                    }
                })
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })

}