module.exports = function (app, database) {

    app.post('/login', (req, res) => {
        const username = req.body.username
        const password = req.body.password
        database.all(`SELECT id, username, role FROM users WHERE username='${username}' AND password='${password}'`, function (err, data) {
            if (data[0]) {
                req.session.cur = data[0].id
                req.session.username = data[0].username
                req.session.role = data[0].role
                res.send({ success: true, message: 'Đăng nhập thành công' })
            } else {
                res.send({ success: false, message: 'Thông tin tài khoản hoặc mật khẩu không chính xác' })
            }
        })
    })

    app.get('/login', (req, res) => {
        if (req.session.username) {
            res.send({
                logged_in: true,
                username: req.session.username,
                role: req.session.role
            })
        }
        else {
            res.send({ logged_in: false })
        }
    })

    app.post('/logout', (req, res) => {
        if (req.session.username) {
            req.session.destroy()
            res.send({ success: true })
        } else {
            res.send({ success: false })
        }
    })
}