require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/images');
    },
    filename: function(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        } else {
            cb(null, file.originalname);
        }
    }
});
var upload = multer({
    storage: storage
}).single('file');


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit:50000 }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));
app.use("/uploads", express.static(__dirname + '/uploads'));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));

app.post('/upload', function(req, res) {
    console.log('dasdasd');
    upload(req, res, function(err) {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.json({ success: false, message: 'File size is too large. Max limit is 10MB' });
            } else if (err.code === 'filetype') {
                res.json({ success: false, message: 'Filetype is invalid. Must be .png' });
            } else {
                res.json({ success: false, message: 'Unable to upload file' });
            }
        } else {
            if (!req.file) {
                res.json({ success: false, message: 'No file was selected' });
            } else {
                res.json({ success: true, message: 'File uploaded!' });
            }
        }
    });
});

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

// start server
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});