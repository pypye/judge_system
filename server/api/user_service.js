module.exports = function (app, database) {
    app.get('/users', (req, res) => {
        if (req.session.username) {
            database.all(`SELECT * FROM users`, function (err, data) {
                if (data) {
                    var res_user = []
                    for (a of data) {
                        if (req.session.role == 1) {
                            obj = {
                                username: a.username,
                                role: a.role,
                                total_score: a.total_score
                            }
                        }
                        else {
                            obj = {
                                username: a.username,
                                total_score: a.total_score
                            }
                        }
                        res_user.push(obj)
                    }
                    res.send(res_user)
                } else res.status(400).send({ message: 'Syntax error' })
            })
        }
        else res.status(400).send({ message: 'Please login first' })
    })

    app.get('/user', (req, res) => {
        if (req.session.username) {
            id_pro = req.query.id;
            database.all(`SELECT * FROM users WHERE id='${id_pro}'`, function (err, data) {
                if (data.length != 0) {
                    a = data[0]
                    if (req.session.role == 1) {
                        obj = {
                            username: a.username,
                            role: a.role,
                            total_score: a.total_score
                        }
                    }
                    else {
                        obj = {
                            username: a.username,
                            total_score: a.total_score
                        }
                    }
                    res.send(obj)
                } else {
                    res.send({ success: false, message: 'error syntax' })
                }
            })
        }
        else res.status(400).send({ message: 'Please login first' })
    })

    app.post('/user', (req, res) => {
        const username = req.body.username
        const password = req.body.password
        const role = req.body.role
        if (req.session.username) {
            if (req.session.role == 1) {
                database.all(`INSERT INTO users (username, password, role) VALUES ('${username}', '${password}', '${role}')`, function (err, data) {
                    res.send({ message: 'Add user sucessfully' })
                })
            }
            else res.status(400).send({ message: 'Only admin can access' })
        }
        else res.status(400).send({ message: 'Please login first' })
    })

    app.delete('/user', (req, res) => {
        if (req.session.username) {
            id_pro = req.query.id;
            if (req.session.role == 1) {
                database.run(`DELETE FROM users WHERE id=?`, id_pro, function (err) {
                    res.send({ message: 'Delete user sucessfully' })
                })
            }
            else res.status(400).send({ message: 'Only admin can access' })
        }
        else res.status(400).send({ message: 'Please login first' })
    })

    // http://localhost:3001/user?id=3
    app.put('/user', (req, res) => {
        const password = req.body.password
        if (req.session.username) {
            id_pro = req.query.id;
            let data = [password, id_pro]
            database.all(`SELECT role FROM users WHERE id='${id_pro}'`, function (err, data) {
                id_role = data[0].role
                if ((req.session.role == 1 && id_role != 1) || req.session.cur == id_pro) {
                    database.run(`UPDATE users SET password=? WHERE id=?`, data, function (err) {
                        res.send({ message: 'Modify user successfully' })
                    })
                }
                else res.status(400).send({ message: 'Only admin can access' })
            })

        }
        else res.status(400).send({ message: 'Please login first' })
    })
}