var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var cors = require('cors')
var expressValidator = require('express-validator');
var expressSession = require('express-session');
const flash = require('connect-flash');


var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var mobile = require('./routes/mobile');

var app = express();
var hbs  = require('express-handlebars');
//var Validators = require('express-validators');

//Set Storage Engine


// view engine setup
app.engine('hbs', hbs({extname:'hbs',defaultLayout:'layout',layoutDir:__dirname+'/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


//Authentication Packages
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);
var bcrypt = require('bcryptjs');
const saltRounds = 10;



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(cors());
app.use(expressSession({ secret: "max", saveUninitialized: false, resave: false }));

//app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));
var options ={
  host:'localhost',
  user:'root',
  password:'',
  database:'pharmacy'
};
var sessionStore = new MySQLStore(options);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  store:sessionStore,
  saveUninitialized: false,
  //cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){


  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});
app.use('/', index);
app.use('/users', users);
app.use('/admin',admin);
app.use('/mobile', mobile);

app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

passport.use(new LocalStrategy(
  function(pharmacy_name, password, done) {
  	console.log(pharmacy_name);
  	console.log(password);
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pharmacy"
});



    /*const db = require('../config/connection');*/
  con.connect(function(err) {
  if (err) throw err;

  
    console.log("Connected!");

  con.query('SELECT password,user_id FROM users WHERE pharmacy_name = ?', [pharmacy_name], function(err,results,fields){
  if(err){
      done(err)
    }
  
  if(results.length === 0){
        //return done(null,false,{message:'Unknow User'});
    done(null,false);
    }else{const hash = results[0].password.toString();
    bcrypt.compare(password,hash,function(err, response){
      if(response === true){
        //req.isAuthenticated= true;
        //user_id = results[0].user_id;
        return done(null,{user_id:results[0].user_id});
        //return done(null, user);

      }else{
        return done(null,false);
      }

    })}
  
    
   // return done(null,'btfbj');
      
      //console.log("loging sucefuly");
      
    });

    });
    

  }
));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  //res.locals.isAuthenticated = req.isAuthenticated();

  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(4000, () => console.log("app listen port 4000"));
module.exports = app;
