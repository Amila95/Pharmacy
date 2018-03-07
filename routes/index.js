var express = require('express');
var router = express.Router();
var passport = require('passport');
var LacalStrategy = require('passport-local').Strategy;
var connection = require('../config/connection');
var bcrypt = require('bcrypt');

//var Validators = require('express-validators');

const saltRounds = 10;
//const user = false;
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  console.log(req.isAuthenticated());
  //user = req.isAuthenticated();

  res.render('index', { title: 'Express'});
});
router.get('/register', function(req, res, next) {
    console.log(req.isAuthenticated());

  res.render('contact', { title: 'Express' ,title1:'Registration'});
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' ,title1:'Registration'});
});

router.get('/order', function(req, res, next) {
  connection.query('SELECT * FROM company',function(err,rows){
      console.log(rows);
      res.render('order', {companys:rows});

  })
});

router.get('/ordercompany/:id',function(req,res){
  var userid = req.params.id;
  connecton.query('SELECT * FROM products WHERE compay_id = ?'[user_id], function(err,rows){
  if(err) throw err;
  res.render('prean',{products:rows})
  });
  console.log(userid);
  res.send("Id recevied");

})



router.post('/adduser',function(req,res){
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pharmacy"
});


const pharmacy_name = req.body.pharmacy_name;
const address = req.body.address;
const email = req.body.email;
const tel_number = req.body.tel_number;
const register_no= req.body.register_no;
const register = req.body.register;
const password = req.body.password;

con.connect(function(err) {
  if (err) throw err;
 bcrypt.hash(password, saltRounds, function(err, hash){
    //console.log("Connected!");
    //var sql = "INSERT INTO user SET ?";
    con.query('INSERT INTO users(pharmacy_name,address,email,tel_number,register_no,register,password) VALUES (?,?,?,?,?,?,?)',[pharmacy_name,address,email,tel_number,register_no,register,hash], function (err, result) {
    if (err) throw err;
    //console.log("1 record inserted");
    con.query('SELECT LAST_INSERT_ID() as user_id',function(err,results,fields){
    if(err) throw err;
    const user_id = results[0];
    //console.log(results[0]);
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
  //failureFlash:true
}),
function(req, res){
  res.redirect('/');
}
);
router.get('/logout', function(req, res){
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

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

