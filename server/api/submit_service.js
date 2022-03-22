const fs = require("fs");
var path = require('path');
const uploadFilePro = require("../middleware/upload_single");
var sqlite = require("better-sqlite3");
var db = new sqlite('./data/database.db');
const randomHex = require('crypto-random-hex')

module.exports = function (app, database) {
  app.post('/submit/:userId/:problemId',async (req, res) => {
    if (req.session.username){
      if (req.session.cur == req.params.userId) {
        username = db.prepare(`SELECT username FROM users WHERE id='${req.params.userId}'`).all()
        if (username.length <=0) return res.status(400).send({ message: "user does not exist" });
        username = username[0].username
        problem = db.prepare(`SELECT problem_name FROM problems WHERE id='${req.params.problemId}'`).all()
        if (problem.length <=0) return res.status(400).send({ message: "problem does not exist" });
        problem = problem[0].problem_name
        try {
            await uploadFilePro(req, res);
        
            if (req.file == undefined) {
              return res.status(400).send({ message: "Please upload a file!" });
            }
            
            file_name = req.file.originalname
            time_submit = new Date().getTime()
            submit_Id = randomHex(4)
            type = path.extname(file_name)
            var oldPath = __basedir + "/resources/static/assets/uploads/" + file_name
            var newPath = __basedir + "/resources/static/assets/uploads/submit/" + submit_Id + type
            fs.rename(oldPath, newPath, function (err) {
              if (err) throw err
            })
            //chamdiem
            score = 0
            db.prepare(`INSERT INTO submit (id, user_id, problem_id, type, time, score) VALUES ('${submit_Id}',  '${req.params.userId}', '${req.params.problemId}', '${type}', '${time_submit}', '${score}')`).run()

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
      else {
        res.send({ success: false, message: 'Không được cấp quyền' })
      }
    }
    else {
        res.send({ logged_in: false })
    }
})

app.get('/submission/all', (req, res) => {
  if (req.session.username) {
      data = db.prepare(`select * FROM submit`).all()
      res.status(200).send(data);
  }
  else {
      res.send({ logged_in: false })
  }
})

app.get('/submission', (req, res) => {
  if (req.session.username) {
      data = db.prepare(`SELECT * FROM submit WHERE user_id='${req.session.cur}'`).all()
      res.status(200).send(data);
  }
  else {
      res.send({ logged_in: false })
  }
})

app.get('/submission/:problemId', (req, res) => {
  if (req.session.username) {
      data = db.prepare(`SELECT * FROM submit WHERE user_id='${req.session.cur}' and problem_id='${req.params.problemId}'`).all()
      res.status(200).send(data);
  }
  else {
      res.send({ logged_in: false })
  }
})

app.get('/submission/show/:submitId',async (req, res) => {
  if (req.session.username) {
      data = db.prepare(`SELECT * FROM submit WHERE id='${req.params.submitId}'`).all()
      if (req.session.role ==1 || req.session.cur == data[0].userId){
        const fileName = __basedir + "/resources/static/assets/uploads/submit/" + req.params.submitId + data[0].type;
        fs.readFile(fileName,"utf8" ,function(err, contents){
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.write(contents);
          res.end();
          });
      }
      else {
        res.status(500).send({
          message: `Không được cấp quyền`,
          });
        }
      }
  else {
      res.send({ logged_in: false })
  }
})

}