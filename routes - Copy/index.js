var express = require('express');
var router = express.Router();
var passport = require('passport');
var LacalStrategy = require('passport-local').Strategy;
var connection = require('../config/connection');
var bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  console.log(req.isAuthenticated());
  res.render('index', { title: 'Express' });
});
router.get('/register', function(req, res, next) {
  res.render('contact', { title: 'Express' ,title1:'Registration' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' ,title1:'Registration'});
});

router.post('/adduser',function(req,res){
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pharmacy"
});


const user_id = req.body.ID;
const username = req.body.Name;
const Owner = req.body.Owner;
const Adderss = req.body.Adderss;
const password= req.body.Password;

con.connect(function(err) {
  if (err) throw err;
 bcrypt.hash(password, saltRounds, function(err, hash){
    //console.log("Connected!");
    //var sql = "INSERT INTO user SET ?";
    con.query('INSERT INTO user(user_id,username,Owner,Adderss,password) VALUES (?,?,?,?,?)',[user_id,username,Owner,Adderss,hash], function (err, result) {
    if (err) throw err;
    //console.log("1 record inserted");
    con.query('SELECT LAST_INSERT_ID() as user_id',function(err,results,fields){
    if(err) throw err;
    const user_id = results[0];
    console.log(results[0]);
    req.login(user_id,function(err){
    res.redirect('/');
  }
  )
  
    });
       //res.redirect('/');

   });
   // res.render('contact', {title1:'Registration Complete'});
  });
});
});

router.post('/login',passport.authenticate('local',{
	successRedirect:'/',
	failureRedirect:'/login',
  failureFlash:true
}),
function(req, res){
  res.redirect('/');
}
);


function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/login')
	}
        res.redirect('/login')

}

passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
  
    done(null, user_id);
  
});





module.exports = router;

