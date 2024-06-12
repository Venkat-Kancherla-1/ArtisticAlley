const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const app = express();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

const postSchema = new mongoose.Schema({
    regdno:String,
    title:String,
    category:String,
    date:Date,
    image:String
})

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.get('/signup', (req, res) => {
    res.render('register.ejs');
});

app.get('/submission', (req, res) => {
    res.render('submission.ejs');
});

app.post('/login', async (req, res) => {
    const { regdno, password } = req.body;
    const user = await User.findOne({
        $or: [
            { regdno: regdno, verified: 1 },
            { mail: regdno, verified: 1 }
        ]
    });
    if (user) {
        if (password === user.password) {
            const token = jwt.sign({ username: user.name, regdno: user.regdno }, 'artistic');
            res.render('home.ejs');
        } else {
            res.render('login.ejs');
        }
    } else {
        res.render('login.ejs');
    }
});

app.post('/signup', async (req, res) => {
    const { name, mail, password, regdno } = req.body;

    // Log the entire request for debugging
    console.log('Received body:', req.body);

    const user = await User.findOne({
        $or: [
            { regdno: regdno },
            { mail: mail },
        ]
    });

    console.log('User:', user);

    if (user) {
        res.render('register.ejs');
    } else {
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const newUser = new User({
            name: name,
            mail: mail,
            password: password,
            regdno: regdno,
            verified: 0,
            verificationToken: verificationToken,
        });

        await newUser.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.gmail,
                pass: process.env.password,
            },
        });

        const mailOptions = {
            from: process.env.gmail,
            to: mail,
            subject: 'Verify Your Account',
            text: `Please verify your account by clicking the link: http://localhost:3000/verify/${verificationToken}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Verification email sent:', info.response);
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

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        let { regdno, Title, Category } = req.body;

        const file = req.file; // Assuming `req.file` contains the uploaded file

        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(dataUri);

        const uploadedImageUrl = result.secure_url;

        let currentDate = new Date();
        console.log(currentDate);
        
        const post = new Post({
            regdno: regdno,
            title: Title,
            category: Category,
            date: currentDate,
            image: uploadedImageUrl,
        });

        await post.save();

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
