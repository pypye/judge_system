module.exports = function (app, database) {

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
        const problem_path = req.body.problem_path
        const level = req.body.level
        const test_path = req.body.test_path
        if (req.session.username) {
            if (req.session.role == 1){
                database.all(`INSERT INTO problems (problem_name, problem_path, level, test_path) VALUES ('${problem_name}', '${problem_path}', '${level}', '${test_path}')`, function (err, data) {
                    res.send({ success: true, message: 'Thêm thành công' })
                })
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.delete('/problem', (req, res) => {
        if (req.session.username) {
            id_pro = req.query.id;
            if (req.session.role == 1){
                database.run(`DELETE FROM problems WHERE id=?`, id_pro, function (err) {
                    res.send({ success: true, message: 'Xóa thành công' })
                })
            }
            else res.send({ success: false, message: 'Không được cấp quyền' })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.put('/problem', (req, res) => {

        const problem_name = req.body.problem_name
        const problem_path = req.body.problem_path
        const level = req.body.level
        const test_path = req.body.test_path
        if (req.session.username) {
            id_pro = req.query.id;
            let data = [problem_name, problem_path, level, test_path, id_pro]
            if (req.session.role == 1){
                database.run(`UPDATE problems SET problem_name=?, problem_path=?, level=?,test_path=? WHERE id=?`, data, function (err) {
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