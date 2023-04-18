const express = require('express');

const user_route = express()

const bodyParser = require('body-parser');

const session = require('express-session');

const {SESSION_SECRET} = process.env

user_route.use(session({secret: SESSION_SECRET}))

user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded({extended: true}))

user_route.set('view engine', 'ejs')
user_route.set('views','./views')

user_route.use(express.static('public'))
user_route.use(express.static('layout/js'))


const path = require('path');
const multer = require('multer');

// Setting up multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,path.join(__dirname,'../public/images'))
    },
    filename: function(req, file, cb){
        const name = Date.now() + '-' + file.originalname
        cb(null,name)
    }
})

const userController = require('../controllers/userControllers')

const upload = multer({storage: storage})


// Registration of a user routes
user_route.get('/register',userController.registerLoad)
user_route.post('/register',upload.single('image'),userController.register)

//Login user routes
user_route.get('/',userController.loadLogin)
user_route.post('/',userController.login)

// Logout Routes
user_route.get('/logout',userController.logout)

// Dashboard routes
user_route.get('/dashboard',userController.loadDashboard)

user_route.post('/save-chat',userController.saveChat)

user_route.post('/delete-chat',userController.deleteChat)

user_route.get('*',function(req, res){
    res.redirect('/')
})


module.exports = user_route

