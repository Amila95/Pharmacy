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
      connection.query('SELECT * FROM bill ORDER BY oder_id DESC LIMIT 1',function(err,row1){
        const oder_id =  (row1[0].oder_id + 1);
        console.log(oder_id);
        connection.query('SELECT * FROM oderlist WHERE oder_id = ?',[oder_id],function(err,row2){
          console.log(row2);
          res.render('order',{companys:rows , items:row2});
        })
      })

      //console.log(rows);
      //res.render('order', {companys:rows, });

  })
});

router.get('/submitOrder', function(req,res,next){
  const user_id = req.user.user_id;
  connection.query('SELECT * FROM bill ORDER BY oder_id DESC LIMIT 1 ',function(err,row){
    const oder_id = (row[0].oder_id+1);
    connection.query('INSERT INTO bill(oder_id,user_id) VALUES(?,?)',[oder_id,user_id],function(err){
      if(err) throw err;
      res.redirect('/order');
    
  })
})
})



router.get('/ordercompany:id',function(req, res ){
  var company_id = req.params.id;
  console.log(company_id);
  connection.query('SELECT * FROM products WHERE company_id = ?',[company_id],function(err,row1){
      connection.query('SELECT * FROM company WHERE company_id = ?',[company_id],function(err,row2){
    console.log(row1);

    console.log(row2);
    res.render('prean', {products:row1 , company:row2});
  });

  });
  
  

});

router.get('/products:id1:id2', function(req, res){
  var company_id = req.params.id1;
  console.log(company_id);

  var product_id = req.params.id2;
  console.log(product_id);

  connection.query('SELECT * FROM products WHERE company_id = ?',[company_id],function(err,row1){
      connection.query('SELECT * FROM products WHERE product_id = ?',[product_id],function(err,row2){
        if(err){throw err;};
    console.log(row1);

    console.log(row2);
    //res.send("bdud");

    res.render('orderitem', {products:row1 , product:row2});
  });

  });
//res.send("bdud");

})

router.post('/oderlist:id', function(req,res){
  connection.query('SELECT * FROM bill ORDER BY oder_id DESC LIMIT 1',function(err,row){
  const oder_id =  (row[0].oder_id + 1);
  console.log(oder_id);
  const units = req.body.units;
  var product_id = req.params.id;
  connection.query('SELECT * FROM products WHERE product_id = ?',[product_id],function(err,row1){
    const item_name = row1[0].product_name;
    const price = row1[0].price;
  
  connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price) VALUES (?,?,?,?,?)',[oder_id,product_id,units,item_name,price],function(err){
    if(err) throw err;
    res.redirect('back');
  })
  });

  })
  /*const units = req.body.units;
  var product_id = req.params.id;
  console.log(units);
  console.log(product_id);
  console.log(order_id);
  connection.query('INSERT INTO oderlist(order_id,item_id,units) VALUES (?,?,?)',[order_id,product_id,units],function(err){
    if(err) throw err;
    res.redirect('/products:id1:id2');
  });*/
});



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

