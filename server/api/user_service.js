const { response } = require("express")

module.exports = function (app, database) {

    app.get('/users', (req, res) => {
        if (req.session.username) {
            database.all(`SELECT * FROM users`, function (err, data) {
                if (data) {
                    var res_user = []
                    for (a of data){
                        if (req.session.role == 1){
                            obj = {
                                username: a.username,
                                role: a.role,
                                name: a.name,
                                total_score: a.total_score
                            }
                        }
                        else {
                            obj = {
                                username: a.username,
                                name: a.name,
                                total_score: a.total_score
                            }
                        }
                        console.log(a)
                        res_user.push(obj)
                    }
                    res.send(res_user)
                } else {
                    res.send({ success: false, message: 'error syntax' })
                }   
            })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.get('/user', (req, res) => {
        if (req.session.username) {
            id_pro = req.query.id;
            database.all(`SELECT * FROM users WHERE id='${id_pro}'`, function (err, data) {
                if (data.length != 0) {
                    a = data[0]
                    if (req.session.role == 1){
                        obj = {
                            username: a.username,
                            role: a.role,
                            name: a.name,
                            total_score: a.total_score
                        }
                    }
                    else {
                        obj = {
                            username: a.username,
                            name: a.name,
                            total_score: a.total_score
                        }
                    }
                    res.send(obj)
                } else {
                    res.send({ success: false, message: 'error syntax' })
                }   
            })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.post('/user', (req, res) => {

        const username = req.body.username
        const password = req.body.password
        const name = req.body.name
        const role = req.body.role
        if (req.session.username) {
            if (req.session.role == 1){
                database.all(`INSERT INTO users (username, password, name, role) VALUES ('${username}', '${password}', '${name}', '${role}')`, function (err, data) {
                    res.send({ success: true, message: 'Thêm thành công' })
                })
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.delete('/user', (req, res) => {
        if (req.session.username) {
            id_pro = req.query.id;
            if (req.session.role == 1){
                database.run(`DELETE FROM users WHERE id=?`, id_pro, function (err) {
                    res.send({ success: true, message: 'Xóa thành công' })
                })
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.put('/user', (req, res) => {

        const password = req.body.password
        const name = req.body.name
        if (req.session.username) {
            id_pro = req.query.id;
            let data = [password, name, id_pro]
            database.all(`SELECT role FROM users WHERE id='${id_pro}'`, function (err, data){
                id_role = data[0].role
                if ((req.session.role == 1 && id_role != 1)|| req.session.cur == id_pro){
                    database.run(`UPDATE users SET password=?, name=? WHERE id=?`, data, function (err) {
                        res.send({ success: true, message: 'Sửa thành công' })
                    })
                }
                else res.send({ success: false, message: 'Không được cấp quyền' })
            })
        }
        else {
            res.send({ logged_in: false })
        }
    })
}