const express = require("express")
const cors = require("cors")
const session = require("express-session")
const fileUpload = require('express-fileupload')
const bodyParser = require("body-parser")

const PORT = process.env.PORT || 3001;
const app = express()
const sqlite3 = require('sqlite3').verbose();
const database = new sqlite3.Database('./data/database.db');    

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(bodyParser.json({ limit: '2048mb' }))
app.use(bodyParser.urlencoded({ limit: '2048mb', extended: true, parameterLimit: 2048000 }))
app.use(express.json())
app.use(fileUpload())
app.use(session({
    key: "chyojxdxd",
    secret: "chyojsecretxdxd",
    resave: false,
    saveUninitialized: true
}))

require('./api/session.js')(app, database)


app.listen(PORT, console.log(`Server started on port ${PORT}`));