const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3009;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    port: 3306,
    database: "mydb"
})
con.connect(err => {
    if (err) throw (err);
    else {
        console.log("MySQL connected");
    }
})
const queryDB = (sql) => {
    return new Promise((resolve, reject) => {
        // query method
        con.query(sql, (err, result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

app.post('/regisDB', async (req, res) => {
    let sql = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, username VARCHAR(255),email VARCHAR(100),password VARCHAR(100),img VARCHAR(100), phone VARCHAR(255))";
    let result = await queryDB(sql);
    sql = `INSERT INTO userInfo (username, email, password,img,phone) VALUES ("${req.body.username}", "${req.body.email}", "${req.body.password}",'avatar.png',"${req.body.phone}")`;
    result = await queryDB(sql);

    let sql_msg = "CREATE TABLE IF NOT EXISTS msgInfo (msg_id INT AUTO_INCREMENT PRIMARY KEY, user VARCHAR(255), message VARCHAR(100))";
    result = await queryDB(sql_msg);

    console.log("New record created successfullyone");
    return res.redirect('index.html');
})

let tablename = "userinfo";
//ทำให้สมบูรณ์
app.post('/checkLogin', async (req, res) => {
    // ถ้าเช็คแล้ว username และ password ถูกต้อง
    // return res.redirect('feed.html');
    // ถ้าเช็คแล้ว username และ password ไม่ถูกต้อง
    // return res.redirect('login.html?error=1')
    let sql = `SELECT id, email, password, img FROM ${tablename}`;
    let result = await queryDB(sql);
    result = Object.assign({}, result);
    console.log(result);
    const email = req.body.email;
    const password = req.body.password;

    let obj = Object.keys(result);
    var isCorrect = false;
    for (var i = 0; i < obj.length; i++) {
        var temp = result[obj[i]];
        var dataemail = temp.email;
        var dataPassword = temp.password;
        if (dataemail == email && dataPassword == password) {
            console.log("ooo");
            isCorrect = true;
            res.cookie('email', email);
            res.cookie('img', temp.img);
        }
    }

    if (isCorrect == true) {
        console.log("Correct");
        // return res.redirect('feed.html');
        // // return res.redirect('register.html');
    }
    else {
        console.log("Wrong");
        return res.redirect('index.html?error=1');
    }
})



app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/index.html`);
});