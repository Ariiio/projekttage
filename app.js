const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3000;
dotenv.config();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/client"));

mongoose.pluralize(null);
mongoose.set('strictQuery', false);
mongoose.connect(process.env.URI);

const loginSchema = {
    username: String,
    password: String,
    email: String
};

const studentSchema = {
    name: String,
    last_name: String,
    class: String,
    optone: String,
    opttwo: String,
    optthree: String
};

const Login = mongoose.model('Login', loginSchema);
const Student = mongoose.model('Students', studentSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/index.html");
});

app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/client/register.html");
});

app.get("/main", (req, res) => {
    res.sendFile(__dirname + "/client/main.html");
});

app.post("/register", async (req, res) => {
    let newLogin = new Login({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });
    let loginUser = newLogin.get("username");
    let loginEmail = newLogin.get("email");

    let userTest = await Login.find({username: loginUser});
    let emailTest = await Login.find({email: loginEmail});

    if (userTest.length == 0 && emailTest.length == 0) {
        newLogin.save();
    }
    else if (userTest.length != 0 || emailTest.length != 0) {
        res.redirect("/");
    }
});

app.post("/", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let userTest = await Login.find({username: username});
    let passTest = await Login.find({password: password});

    if (passTest.length != 0) {
        if (userTest.length != 0 && passTest[0].get("password") == password) {
            res.redirect("/main");
        }
        else {
            res.send('gay');
        }
    }
    
    else {
        res.redirect('/register');
    }
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});