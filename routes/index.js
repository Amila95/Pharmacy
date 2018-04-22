var express = require('express');
var router = express.Router();
var passport = require('passport');
var LacalStrategy = require('passport-local').Strategy;
var connection = require('../config/connection');
var bcrypt = require('bcrypt');
var multer = require('multer');
var bodyParser = require('body-parser');
var cors = require('cors')
var app = express()
 
app.use(cors())



//var Validators = require('express-validators');

const saltRounds = 10;
//const user = false;
/* GET home page. */
 var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
         callback(null, 'public/upload/');
     },
     filename: function(req, file, callback) {
         callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
     }
 });

 var upload = multer({
     storage: Storage
 }).any();

 router.post('/upload', function(req, res) {
     upload(req, res, function(err) {
         if (err) {
             return res.end("Something went wrong!");
         }
         console.log(req.files);
        console.log(req.files[0].path);

         res.render('pra/pratice',{file:'upload/'+req.files[0].filename});
     });
 });


/*var upload = multer({dest: 'public/upload/'});

router.post('/upload',upload.any(), function(req, res, next){
   res.send(req.files);

})*/

/*const multerConf = {
  storage : multer.diskStorage({
    destination :function(req,file, next){
      next(null, './public/images');
    },
    filename: function(req, file, next){
      const ext = file.minetype.split('/')[1];
      next(null, file.fieldname + '-' + Date.now() +'-'+ ext);

    }
  }),
  fileFliter: function(req, file, next){
    if(! file){
      next();
    }
    const image = file.minetype.startsWith('image/');
  if(image){
    next(null,true);
  }else{
    next(null,false);
  }
}
}*/


/*router.post('/upload',multer(multerConf).single('photo'),function(req,res){
  res.send('this is post rout upload');
})*/

/*router.get('/',function(req,res,next){
  res.json([
  {
    id: 1,
    message:"Hello Ionic"
  },
  {
    id: 2,
    message:"This is another message"
  }])
})*/

router.get('/', function(req, res, next) {
  console.log(req.user);
  console.log(req.isAuthenticated());
  connection.query('SELECT * FROM products WHERE special_list = 1',function(err,rows){
    connection.query('SELECT * FROM company', function(err, row1){
      connection.query('SELECT* FROM products WHERE new_list=1', function(err,row2){
          res.render('index', { title: 'Express', special:rows , companies:row1, new:row2});

      })

    })
  
  //user = req.isAuthenticated();

 
});
})
router.get('/register', function(req, res, next) {
    console.log(req.isAuthenticated());

  res.render('contact', { title: 'Express' ,title1:'Registration'});
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' ,title1:'Registration'});
});

router.get('/order', function(req, res, next) {
  var total = 0;
  connection.query('SELECT * FROM company',function(err,rows){
      connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1',function(err,row1){
        const oder_id =  (row1[0].order_id + 1);
        console.log(oder_id);
        connection.query('SELECT * FROM oderlist WHERE oder_id = ? ',[oder_id],function(err,row){
          for (var i = row.length - 1; i >= 0; i--) {
           total = total + row[i].price;
        }
          console.log(total)
          res.render('order',{companys:rows , items:row , price:total});
        })
      })

      //console.log(rows);
      //res.render('order', {companys:rows, });

  })
});

router.get('/submitOrder', function(req,res,next){
  const user_id = req.user.user_id;
  connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1 ',function(err,row){
    const oder_id = (row[0].order_id+1);
    connection.query('INSERT INTO payment(order_id,user_id,approval,order_date) VALUES(?,?,?,CURDATE())',[oder_id,user_id,0],function(err){
      connection.query('SELECT * FROM oderlist WHERE oder_id=?',[oder_id], function(err,row1){
        console.log(row1);
        for(var i = row1.length-1; i >= 0;i--){
          (function(product_id,units){
          product_id = row1[i].item_id
          console.log(product_id)
          units = parseInt(row1[i].units)
          connection.query('SELECT * FROM products WHERE product_id=?',[product_id],function(err,row2){
            console.log(product_id);
            cur_stock = parseInt(row2[0].stock);
            stock= cur_stock - units;
            /*console.log(cur_stock);
            console.log(stock);
            console.log(units);
            console.log(product_id);*/
            connection.query('UPDATE products set stock=? WHERE product_id=?',[stock,product_id],function(err){
              console.log('done');
            });
              
              //res.redirect('/order');
            })
          
         })() 
        }
        res.redirect('/order');
      })
      
    
  });
});
})

router.get('/updateorder:id1', function(req,res,next){
  var product_id = req.params.id1;
    connection.query('SELECT * FROM products WHERE product_id = ?',[product_id],function(err,row2){
      stock = parseInt(row2[0].stock);
        connection.query('SELECT * FROM payment ORDER BY oder_id DESC LIMIT 1',function(err,row){
        const oder_id = (row[0].order_id+1);
        console.log(oder_id);
        connection.query('SELECT * FROM oderlist WHERE item_id = ? AND oder_id = ?',[product_id,oder_id], function(err,row1){
          oder =parseInt(row1[0].units);
          remaining = stock - oder;
          console.log(row1);
            res.render('updateorder',{product:row2 , oder:row1, remaining:remaining});

        })
  //res.render('updateorder',{product:row2 , oder:row});
})
})
})



router.get('/ordercompany:id',function(req, res ){
  var company_id = req.params.id;
  console.log(company_id);
  connection.query('SELECT * FROM products WHERE company_id = ? AND stock> 0',[company_id],function(err,row1){
      connection.query('SELECT * FROM company WHERE company_id = ?',[company_id],function(err,row2){
    console.log(row1);

    console.log(row2);
    res.render('prean', {products:row1 , company:row2});
  });

  });
  
  

});

router.get('/products:id', function(req, res){
  var product_id = req.params.id;
  connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1',function(err,row){
    const oder_id =  (row[0].order_id + 1);
    connection.query('SELECT * FROM oderlist WHERE oder_id=? AND item_id=?',[oder_id,product_id],function(err,row1){
      if(row1.length>0){
        cur_oder=parseInt(row1[0].units);
        connection.query('SELECT * FROM products WHERE product_id = ?',[product_id],function(err,row2){
          stock = parseInt(row2[0].stock);
          remaining = stock - cur_oder;
          res.render('orderitem',{product:row2, remaining:remaining})
        })

      }
      else{
        connection.query('SELECT * FROM products WHERE product_id = ?',[product_id],function(err,row2){
        remaining = row2[0].stock;
        if(err) throw err;
        res.render('orderitem', {product:row2, remaining:remaining});
  });

      }
    })
  })


 


  });
//res.send("bdud");


router.post('/oderlist:id', function(req,res){
  connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1',function(err,row){
    const oder_id =  (row[0].order_id + 1);
    console.log(oder_id);
    const units = req.body.units;
    var product_id = req.params.id;
    connection.query('SELECT * FROM  products WHERE product_id = ?',[product_id],function(err,row2){
       stock = parseInt(row2[0].stock);
      connection.query('SELECT * FROM oderlist WHERE oder_id = ? AND item_id=?',[oder_id,product_id],function(err,row3){
        if(row3.length>0){
          pre_stock = parseInt(row3[0].units);
          bill_stock = parseInt(units)+parseInt(pre_stock)
          new_stock = parseInt(stock) -(parseInt(units)+parseInt(pre_stock));
          console.log(new_stock);
          if(new_stock >= 0){
            connection.query('SELECT * FROM products WHERE product_id = ?',[product_id],function(err,row1){
            const pre_price = row3[0].price;
            const item_name = row1[0].product_name;
            const price = row1[0].price * bill_stock;
            connection.query('UPDATE oderlist SET price = ? ,units = ? WHERE oder_id=? AND item_id=?',[price,bill_stock,oder_id,product_id],function(err,result){
              if(err) throw err;
              res.redirect('/order');
            })
          })}
            else{
            res.redirect('back');
          }
        }else{
      
     
      new_stock = stock - units;
      if(new_stock >=0){
        connection.query('SELECT * FROM products WHERE product_id = ?',[product_id],function(err,row1){
        const item_name = row1[0].product_name;
        const price = row1[0].price * units;
  
        connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price) VALUES (?,?,?,?,?)',[oder_id,product_id,units,item_name,price],function(err){
        if(err) throw err;
        res.redirect('/order');
  })
  });
      }
      else{
        res.redirect('back');
      }
    }
    })
    })
  
  
  
  

  })
  
});

router.get('/deleteorder:id', function(req,res){
  const item_id = req.params.id;
  connection.query('SELECT * FROM recodes ORDER BY oder_id DESC LIMIT 1',function(err,row){
  const oder_id =  (row[0].oder_id + 1);
  connection.query('DELETE FROM oderlist WHERE item_id =? AND oder_id =?',[item_id,oder_id],function(err){
    if(err) throw err;
    res.redirect('/order');
  })
})
})

/*Router.get('/newproduct',function(req, res){
  connection.query('SELECT * FROM products WHERE special_list = 1',function(err,rows){

  })
})*/

router.get('/cansaleOrder', function(req, res,next){
  connection.query('SELECT * FROM recodes ORDER BY oder_id DESC LIMIT 1',function(err,row){
  const oder_id =  (row[0].oder_id + 1);
  connection.query('DELETE FROM oderlist WHERE oder_id = ?',[oder_id],function(err){
    if(err) throw err;
    res.redirect('/order');
  })
})
})

router.post('/updatelist:id', function(req,res){
  connection.query('SELECT * FROM recodes ORDER BY oder_id DESC LIMIT 1',function(err,row){
  const oder_id =  (row[0].oder_id + 1);
  console.log(oder_id);
  const units = req.body.units;
  var product_id = req.params.id;
  connection.query('SELECT * FROM  products WHERE product_id = ?',[product_id],function(err,row2){
  stock = row2[0].stock;
  new_stock = stock - units;
  if(new_stock >=0){
  connection.query('SELECT * FROM products WHERE product_id =?',[product_id],function(err,row1){
    const unit_price = row1[0].price;
    const price = units*unit_price;
    connection.query('UPDATE oderlist SET units=? , price=? WHERE oder_id =? AND item_id =?',[units,price,oder_id,product_id],function(err,result){
    if(err) throw err;
    res.redirect('/order');

  })
  })
}else{
  res.redirect('back');
}
  
})
})
})

router.get('/uploadimage',function(req,res,next){
  res.render('pra/pratice');
})



router.post('/adduser',function(req,res){
upload(req, res, function(err) {
         if (err) {
          consol.log('erro');
            
         }



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
const Lat = req.body.Lat;
const Lon = req.body.Lon;
const logo = '../upload/'+req.files[0].filename;



con.connect(function(err) {
  if (err) throw err;
 bcrypt.hash(password, saltRounds, function(err, hash){
    //console.log("Connected!");
    //var sql = "INSERT INTO user SET ?";
    con.query('INSERT INTO users(pharmacy_name,address,email,tel_number,register_no,register,password,Lat,Lon,logo) VALUES (?,?,?,?,?,?,?,?,?,?)',[pharmacy_name,address,email,tel_number,register_no,register,hash,Lat,Lon,logo], function (err, result) {
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

})

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

router.get('/listcompany', function(req, res, next){
  connection.query('SELECT * FROM company', function(err, rows){
    console.log(rows);
    res.render('admin/Companies/list_company',{layout: 'admin', companies: rows});

  })
  //res.render('admin/Companies/list_company',{layout: 'admin'});
})

router.get('/viewspecial:id', function(req,res,next){
  product_id = req.params.id;
  connection.query('SELECT * FROM products WHERE product_id=?',[product_id], function(err,rows){
    console.log(rows)
    res.render('special',{product:rows});
  })
})

router.get('/viewcompany:id', function(req,res,next){
  company_id = req.params.id;
  console.log(company_id);
  connection.query('SELECT * FROM company WHERE company_id=?',[company_id], function(err,rows){
    connection.query('SELECT * FROM products WHERE company_id = ?',[company_id], function(err,row1){
      res.render('viewcompany',{company:rows,products:row1})
    })
    
  })
})





module.exports = router;

