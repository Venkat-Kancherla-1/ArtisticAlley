const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config()
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const app = express();
const axios = require('axios');
const port = process.env.port;
const jwt = require('jsonwebtoken');

app.use(express.urlencoded({ extended: true }));
cloudinary.config({
    cloud_name: process.env.cloud,
    api_key: process.env.api,
    api_secret: process.env.apis,
    secure: true,
});
  

// MongoDB connection
let password = process.env.mongopass;
let user = process.env.mongouser;
mongoose.connect('mongodb+srv://' + user + password + '@cluster0.g9bohxf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });


const userSchema = new mongoose.Schema({
    name: String,
    mail: String,
    password: String,
    regdno: String,
    verified: { type: Number, default: 0 },
    verificationToken: String,
  });

const User = mongoose.model('user', userSchema)

app.get('/', (req, res) => {
    res.render('home.ejs');
})

app.get('/login', (req, res) => {
    res.render('login.ejs');
})

app.get('/register', (req, res) => {
    res.render('register.ejs');
})


app.post('/login', async(req,res) => {
    const{ regdno, password} = req.body;
    const user = await User.find({
        $or: [
          { regdno: regdno , verified:1},
          { mail: regdno , verified:1}
        ]
      });
    if(user){
        if(password == user.password){
            const token = jwt.sign({ username: user.username }, 'artistic');
            res.render('home.ejs');
        }
        else{
            res.render('login.ejs');
        }
    }
    else{
        res.render('login.ejs');
    }
})

app.post('/signup', async (req, res) => {
    const { name, mail, password, regdno } = req.body;

    const user = await User.findOne({
        $or: [
        { regdno: regdno },
        { mail: mail },
        ]
    });

    if (user) {
        res.render('signup.ejs');
    } else {
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const newUser = await User.create({
        name: name,
        mail: mail,
        password: password,
        regdno: regdno,
        verified: 0,
        verificationToken: verificationToken,
        });

        const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: 'artisticalleyvit@gmail.com',
            pass: 'ArtisticAlley@vit1',
        },
        });

        const mailOptions = {
        from: 'artisticalleyvit@gmail.com',
        to: mail,
        subject: 'Verify Your Account',
        text: `Please verify your account by clicking the link: http://localhost:3000/verify/${verificationToken}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Verification email sent: ' + info.response);
        });

        res.render('login.ejs');
    }
});

app.get('/verify/:token', async (req, res) => {
const { token } = req.params;

const user = await User.findOne({ verificationToken: token });

if (user) {
    user.verified = 1;
    user.verificationToken = undefined; // Clear the token once verified
    await user.save();
    res.send('Your account has been verified. You can now log in.');
} else {
    res.send('Invalid or expired token.');
}
});
  


app.use(express.static('public'));
app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
