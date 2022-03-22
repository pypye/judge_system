const uploadFilePro = require("../middleware/upload_single");
var path = require('path');
const fs = require("fs");
const problem_url = "/resources/static/assets/uploads/problem/"
var sqlite = require("better-sqlite3");
var db = new sqlite('./data/database.db');
var unzipper = require('unzipper');

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

    //http://localhost:3001/problem?id=10
    app.get('/problem', (req, res) => {
        if (req.session.username) {
            id_pro = req.query.id;
            database.all(`SELECT * FROM problems WHERE id='${id_pro}'`, function (err, data) {
                if (data.length != 0) {
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

    app.post('/problem', (req, res) => {

        const problem_name = req.body.problem_name
        const level = req.body.level    
        const description = req.body.description
        const problem_input = req.body.problem_input
        const problem_output = req.body.problem_output
        const memory_limit = req.body.memory_limit
        const time_limit = req.body.time_limit
        
        if (req.session.username) {
            if (req.session.role == 1){
                var newPath = __basedir + problem_url + problem_name + "/"
                db.prepare(`INSERT INTO problems (problem_name, level, description, problem_input, problem_output, memory_limit, time_limit) VALUES ('${problem_name}',  '${level}', '${description}', '${problem_input}',  '${problem_output}', ${memory_limit},  ${time_limit})`).run()
                
                if (!fs.existsSync(newPath)){
                    fs.mkdirSync(newPath)
                  }
                res.send({ success: true, message: 'Thêm thành công' })
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.delete('/problem/:problemId', (req, res) => {
        if (req.session.username) {
            problem = db.prepare(`SELECT problem_name FROM problems WHERE id='${req.params.problemId}'`).all()
            if (problem.length <=0) return res.status(400).send({ message: "File không tồn tại" });
            problem = problem[0].problem_name
            var oldPath = __basedir + problem_url + problem
            if (!fs.existsSync(oldPath)) {
                res.send({ success: false, message: 'File không tồn tại' })
                return
            }
            if (req.session.role == 1){
                fs.rmSync(oldPath, { recursive: true, force: true });
                database.run(`DELETE FROM problems WHERE problem_name=?`, problem, function (err) {
                    res.send({ success: true, message: 'Xóa thành công' })
                })
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.put('/problem/:problemId', (req, res) => {
        const level = req.body.level    
        const description = req.body.description
        const problem_input = req.body.problem_input
        const problem_output = req.body.problem_output
        const memory_limit = req.body.memory_limit
        const time_limit = req.body.time_limit
        if (req.session.username) {
            problem = db.prepare(`SELECT problem_name FROM problems WHERE id='${req.params.problemId}'`).all()
            if (problem.length <=0) return res.status(400).send({ message: "File không tồn tại" });
            problem = problem[0].problem_name
            let data = [level, description, problem_input, problem_output, memory_limit, time_limit, req.params.problemId]
            if (req.session.role == 1){
                database.run(`UPDATE problems SET level=?, description=?, problem_input=?, problem_output=?, memory_limit=?, time_limit=? WHERE id=?`, data, function (err) {
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
    app.post('/problem/upload/:problemId',async (req, res) => {
        problem = db.prepare(`SELECT problem_name FROM problems WHERE id='${req.params.problemId}'`).all()
        if (problem.length <=0) return res.status(400).send({ message: "File không tồn tại" });
        problem = problem[0].problem_name
        var oldPath = __basedir + problem_url + problem
        if (!fs.existsSync(oldPath)) {
            res.send({ success: false, message: 'File không tồn tại' })
            return
        }
        if (req.session.username) {
            if (req.session.role == 1){
                try {
                    await uploadFilePro(req, res);
                
                    if (req.file == undefined) {
                      return res.status(400).send({ message: "Please upload a file!" });
                    }
                    file_name = req.file.originalname
                    var oldPath = __basedir + "/resources/static/assets/uploads/" + file_name
                    var newPath = __basedir + problem_url + problem + "/" + problem + path.extname(file_name)
                    fs.rename(oldPath, newPath, function (err) {
                      if (err) throw err
                    })

                    res.status(200).send({
                      message: "Uploaded the file successfully",
                    });
                  } catch (err) {
                
                    if (err.code == "LIMIT_FILE_SIZE") {
                      return res.status(500).send({
                        message: "File size cannot be larger than 4MB!",
                      });
                    }
            
                    res.status(500).send({
                      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
                     });
                    }
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.get('/problem/download/:problemId',async (req, res) => {
        problem = db.prepare(`SELECT problem_name FROM problems WHERE id='${req.params.problemId}'`).all()
        if (problem.length <=0) return res.status(400).send({ message: "File không tồn tại" });
        problem = problem[0].problem_name
        if (req.session.username) {
            const fileName = problem + ".pdf";
            const directoryPath = __basedir + problem_url + problem + "/"
            if (!fs.existsSync(directoryPath + fileName)) {
                res.send({ success: false, message: 'File không tồn tại' })
                return
            }
            res.download(directoryPath + fileName, fileName, (err) => {
                if (err) {
                res.status(500).send({
                    message: "Could not download the file. " + err,
                    });
                }
            });
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.get('/problem/show/:problemId',async (req, res) => {
        problem = db.prepare(`SELECT problem_name FROM problems WHERE id='${req.params.problemId}'`).all()
        if (problem.length <=0) return res.status(400).send({ message: "File không tồn tại" });
        problem = problem[0].problem_name
        if (req.session.username) {
            const fileName = problem + ".pdf";
            const directoryPath = __basedir + problem_url + problem + "/"
            if (!fs.existsSync(directoryPath + fileName)) {
                res.send({ success: false, message: 'File không tồn tại' })
                return
            }
            res.contentType("application/pdf");
            fs.createReadStream(directoryPath + fileName).pipe(res)
        }
        else {
            res.send({ logged_in: false })
        }
    })

   app.post('/problem/test/upload/:problemId',async (req, res) => {
    problem = db.prepare(`SELECT problem_name FROM problems WHERE id='${req.params.problemId}'`).all()
    if (problem.length <=0) return res.status(400).send({ message: "File không tồn tại" });
    problem = problem[0].problem_name
    var oldPath = __basedir + problem_url + problem
    if (!fs.existsSync(oldPath)) {
        res.send({ success: false, message: 'File không tồn tại' })
        return
    }
    if (req.session.username) {
        if (req.session.role == 1){
            try {
                await uploadFilePro(req, res);
            
                if (req.file == undefined) {
                  return res.status(400).send({ message: "Please upload a file!" });
                }
                file_name = req.file.originalname
                var oldPath = __basedir + "/resources/static/assets/uploads/" + file_name
                var newPath = __basedir + problem_url + problem + "/" + problem + path.extname(file_name)
                fs.rename(oldPath, newPath, function (err) {
                  if (err) throw err
                })
           
                fs.createReadStream(newPath).pipe(unzipper.Extract({ path: __basedir + problem_url + problem }));

                res.status(200).send({
                  message: "Uploaded the file successfully",
                });
              } catch (err) {
            
                if (err.code == "LIMIT_FILE_SIZE") {
                  return res.status(500).send({
                    message: "File size cannot be larger than 4MB!",
                  });
                }
        
                res.status(500).send({
                  message: `Could not upload the file: ${req.file.originalname}. ${err}`,
                 });
                }
        }
        else res.send({ success: false, message: 'Không được cấp quyền' })
    }
    else {
        res.send({ logged_in: false })
        }
    })

    app.get('/problem/test/download/:problemId',async (req, res) => {
        problem = db.prepare(`SELECT problem_name FROM problems WHERE id='${req.params.problemId}'`).all()
        if (problem.length <=0) return res.status(400).send({ message: "File không tồn tại" });
        problem = problem[0].problem_name
        if (req.session.username) {
            if (req.session.role == 1){
                const fileName = problem + ".zip";
                const directoryPath = __basedir + problem_url + problem + "/"
                if (!fs.existsSync(directoryPath + fileName)) {
                    res.send({ success: false, message: 'File không tồn tại' })
                    return
                }
                res.download(directoryPath + fileName, fileName, (err) => {
                if (err) {
                res.status(500).send({
                    message: "Could not download the file. " + err,
                    });
                }
            });
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
            }
    })

}