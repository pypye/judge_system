const uploadFile = require("../middleware/upload");
var path = require('path');
const fs = require("fs");
const baseUrl = "http://localhost:3000/files/";
const problem_url = "/resources/static/assets/uploads/problem/"

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
        
        if (req.session.username) {
            if (req.session.role == 1){
                var newPath = __basedir + problem_url + problem_name + "/"
                var inputPath = newPath + "input/"
                var outputPath = newPath + "output/"
                database.all(`INSERT INTO problems (problem_name, level) VALUES ('${problem_name}',  '${level}')`, function (err, data) {
                    res.send({ success: true, message: 'Thêm thành công' })
                })
                
                if (!fs.existsSync(newPath)){
                    fs.mkdirSync(newPath)
                    fs.mkdirSync(inputPath)
                    fs.mkdirSync(outputPath)
                  }
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.delete('/problem/:name', (req, res) => {
        var oldPath = __basedir + problem_url + req.params.name
        if (!fs.existsSync(oldPath)) {
            res.send({ success: false, message: 'File không tồn tại' })
            return
        }
        if (req.session.username) {
            if (req.session.role == 1){
                fs.rmSync(oldPath, { recursive: true, force: true });
                database.run(`DELETE FROM problems WHERE problem_name=?`, req.params.name, function (err) {
                    res.send({ success: true, message: 'Xóa thành công' })
                })
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.put('/problem/:name', (req, res) => {
        var oldPath = __basedir + problem_url + req.params.name
        if (!fs.existsSync(oldPath)) {
            res.send({ success: false, message: 'File không tồn tại' })
            return
        }
        const problem_name = req.body.problem_name
        const level = req.body.level
        if (req.session.username) {
            let data = [problem_name, level, req.params.name]
            if (req.session.role == 1){
                database.run(`UPDATE problems SET problem_name=?, level=? WHERE problem_name=?`, data, function (err) {
                    res.send({ success: true, message: 'Sửa thành công' })
                })
                
                var newPath = __basedir + problem_url + problem_name

                fs.rename(oldPath, newPath, function (err) {
                    if (err) throw err
                })
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    // http://localhost:3001/problem/upload/ATSM
    app.post('/problem/upload/:name',async (req, res) => {
        var oldPath = __basedir + problem_url + req.params.name
        if (!fs.existsSync(oldPath)) {
            res.send({ success: false, message: 'File không tồn tại' })
            return
        }
        if (req.session.username) {
            if (req.session.role == 1){
                try {
                    await uploadFile(req, res);
                
                    if (req.files == undefined) {
                      return res.status(400).send({ message: "Please upload a file!" });
                    }
                    file_name = req.files[0].originalname
                    var oldPath = __basedir + "/resources/static/assets/uploads/" + file_name
                    var newPath = __basedir + problem_url + req.params.name + "/problem" + path.extname(file_name)
                    fs.rename(oldPath, newPath, function (err) {
                      if (err) throw err
                    })

                    res.status(200).send({
                      message: "Uploaded the file successfully",
                    });
                  } catch (err) {
                
                    if (err.code == "LIMIT_FILE_SIZE") {
                      return res.status(500).send({
                        message: "File size cannot be larger than 2MB!",
                      });
                    }
            
                    res.status(500).send({
                      message: `Could not upload the file: ${req.files[0].originalname}. ${err}`,
                     });
                    }
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.get('/problem/download/:name',async (req, res) => {
        
        if (req.session.username) {
            const fileName = "problem.pdf";
            const directoryPath = __basedir + problem_url + req.params.name + "/"
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

    app.get('/problem/show/:name',async (req, res) => {
        
        if (req.session.username) {
            const fileName = "problem.pdf";
            const directoryPath = __basedir + problem_url + req.params.name + "/"
            res.contentType("application/pdf");
            fs.createReadStream(directoryPath + fileName).pipe(res)
        }
        else {
            res.send({ logged_in: false })
        }
    })

   app.post('/problem/input/upload/:name',async (req, res) => {
    var oldPath = __basedir + problem_url + req.params.name
    if (!fs.existsSync(oldPath)) {
        res.send({ success: false, message: 'File không tồn tại' })
        return
    }
    if (req.session.username) {
        if (req.session.role == 1){
            try {
                await uploadFile(req, res);
                if (req.files.length <= 0) {
                    return res.status(400).send({ message: `You must select at least 1 file.`});
                }
                for (i in req.files){
                    file_name = req.files[i].originalname
                    var oldPath = __basedir + "/resources/static/assets/uploads/" + file_name
                    var newPath = __basedir + problem_url + req.params.name + "/input/" + i + path.extname(file_name)
                    fs.rename(oldPath, newPath, function (err) {
                      if (err) throw err
                    })
                }
                return res.status(200).send({
                    message: "Uploaded the file successfully",
                  });
              } catch (error) {
                if (error.code === "LIMIT_UNEXPECTED_FILE") {
                    return res.status(500).send({
                        message: "Too many files to upload.",
                      });
                }
                return res.status(500).send({
                    message: `Error when trying upload many files: ${error}`,
                  });
              }
        }
        else res.send({ success: false, message: 'Không được cấp quyền' })
    }
    else {
        res.send({ logged_in: false })
        }
    })

    app.post('/problem/output/upload/:name',async (req, res) => {
        var oldPath = __basedir + problem_url + req.params.name
        if (!fs.existsSync(oldPath)) {
            res.send({ success: false, message: 'File không tồn tại' })
            return
        }
        if (req.session.username) {
            if (req.session.role == 1){
                try {
                    await uploadFile(req, res);
                    if (req.files.length <= 0) {
                        return res.status(400).send({ message: `You must select at least 1 file.`});
                    }
                    for (i in req.files){
                        file_name = req.files[i].originalname
                        var oldPath = __basedir + "/resources/static/assets/uploads/" + file_name
                        var newPath = __basedir + problem_url + req.params.name + "/output/" + i + path.extname(file_name)
                        fs.rename(oldPath, newPath, function (err) {
                          if (err) throw err
                        })
                    }
                    return res.status(200).send({
                        message: "Uploaded the file successfully",
                      });
                  } catch (error) {
                    if (error.code === "LIMIT_UNEXPECTED_FILE") {
                        return res.status(500).send({
                            message: "Too many files to upload.",
                          });
                    }
                    return res.status(500).send({
                        message: `Error when trying upload many files: ${error}`,
                      });
                  }
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })
}