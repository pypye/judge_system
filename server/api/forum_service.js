var sqlite = require("better-sqlite3")
var db = new sqlite('./data/database.db')
const randomHex = require('crypto-random-hex')

module.exports = function (app, database) {

    app.get('/forum/all', (req, res) => {
        if (req.session.username) {
            database.all(`SELECT * FROM forum where parent_content=''`, function (err, data) {
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

    app.get('/forum', (req, res) => {
        if (req.session.username) {
            id_pro = req.query.id;
            database.all(`SELECT * FROM forum WHERE parent_content='${id_pro}'`, function (err, data) {
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

    app.post('/forum', (req, res) => {
        forum_id = randomHex(6)
        const username = req.session.username
        const content = req.body.content
        const parent_content = req.body.parent_content
        time_post = new Date().getTime()
        if (req.session.username) {
            database.all(`INSERT INTO forum (id, username, content, parent_content, time_post) VALUES ('${forum_id}', '${username}', '${content}', '${parent_content}', '${time_post}')`, function (err, data) {
                res.send({ success: true, message: 'Thêm thành công' })
            })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.delete('/forum', (req, res) => {
        if (req.session.username) {
            id_pro = req.query.id;
            data = db.prepare(`SELECT * FROM forum WHERE id='${id_pro}'`).all()
            if (req.session.username == data[0].username || req.session.role == 1) {
                database.run(`DELETE FROM forum WHERE id=?`, id_pro, function (err) {
                    database.run(`DELETE FROM forum WHERE parent_content=?`, id_pro, function (err) {
                        res.send({ success: true, message: 'Xóa thành công' })
                    })
                })
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    // http://localhost:3001/forum?id=3
    app.put('/forum', (req, res) => {

        const content = req.body.content
        if (req.session.username) {
            id_pro = req.query.id;
            data = db.prepare(`SELECT * FROM forum WHERE id='${id_pro}'`).all()
            if (req.session.username == data[0].username){
                let data = [content, id_pro]
                database.run(`UPDATE forum SET content=? WHERE id=?`, data, function (err) {
                    res.send({ success: true, message: 'Sửa thành công' })
                })
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })
}