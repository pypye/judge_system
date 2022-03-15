module.exports = function (app, database) {

    app.post('/login', (req, res) => {
        const username = req.body.username
        const password = req.body.password
        database.all(`SELECT username, name, is_admin FROM users WHERE username='${username}' AND password='${password}'`, function (err, data) {
            if (data[0]) {
                req.session.username = data[0].username
                req.session.name = data[0].name
                req.session.is_admin = data[0].is_admin
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
                name: req.session.name,
                is_admin: req.session.is_admin
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