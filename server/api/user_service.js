module.exports = function (app, database) {
    app.get('/users', (req, res) => {
        if (req.session.username) {
            if (req.session.role == 1) {
                database.all(`SELECT * FROM users`, function (err, data) {
                    if (data) {
                        res.send(data)
                    } else res.status(400).send({ message: 'Syntax error' })
                })
            }
            else res.status(400).send({ message: 'Only admin can access' })
        }
        else res.status(400).send({ message: 'Please login first' })
    })

    app.get('/user', (req, res) => {
        if (req.session.username) {
            if (req.session.role == 1) {
                id_pro = req.query.id;
                database.all(`SELECT * FROM users WHERE username='${id_pro}'`, function (err, data) {
                    if (data.length != 0) {
                        res.send(data[0])
                    } else {
                        res.status(400).send({ message: 'Syntax error' })
                    }
                })
            }
            else res.status(400).send({ message: 'Please login first' })
        }
        else res.status(400).send({ message: 'Please login first' })
    })

    app.post('/user', (req, res) => {
        const username = req.body.username
        const name = req.body.name
        const password = req.body.password === '' ? '12345' : req.body.password
        const role = req.body.role
        if (req.session.username) {
            if (req.session.role == 1) {
                database.all(`INSERT INTO users (username, name, password, role) VALUES ('${username}', '${name}', ${password}, '${role}')`, function (err, data) {
                    if (err) {
                        console.log(err)
                        res.status(400).send({ message: 'Username has been taken' })
                    }
                    else res.send({ message: 'Add user sucessfully' })
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
                database.run(`DELETE FROM users WHERE username=?`, id_pro, function (err) {
                    if(err) console.log(err)
                    res.send({ message: 'Delete user sucessfully' })
                })
            }
            else res.status(400).send({ message: 'Only admin can access' })
        }
        else res.status(400).send({ message: 'Please login first' })
    })

    app.put('/user', (req, res) => {
        const username = req.body.username
        const password = req.body.password === '' ? '12345' : req.body.password 
        const name = req.body.name
        const role = req.body.role
        if (req.session.username) {
            if (req.session.role == 1) {
                database.all(`UPDATE users SET name='${name}', password='${password}', role='${role}' WHERE username='${username}'`, function (err, data) {
                    if (err) {
                        console.log(err)
                        res.status(400).send({ message: 'Username has been taken' })
                    }
                    else res.send({ message: 'Modify user sucessfully' })
                })
            }
            else res.status(400).send({ message: 'Only admin can access' })
        }
        else res.status(400).send({ message: 'Please login first' })
    })
}