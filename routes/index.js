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
            connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1',function(err,row4){
                if(row4.length>0){
                    const oder_id = (row4[0].order_id+1);
                    connection.query('SELECT products.product_id,products.product_name,oderlist.units FROM products INNER JOIN oderlist ON products.product_id = oderlist.item_id WHERE products.company_id = ? AND oderlist.oder_id=?',[company_id,oder_id],function (err,row3) {
                        res.render('orderitemscompanies', {products:row1 , company:row2, list:row3});
                    })
                }else{
                    res.render('orderitemscompanies', {products:row1 , company:row2});
                }


            });
            /*console.log(row1);

            console.log(row2);
            res.render('orderitemscompanies', {products:row1 , company:row2});*/
        });

    });



});

/*router.get('/ordercompany:id',function(req, res ){
  var company_id = req.params.id;
  console.log(company_id);
  connection.query('SELECT * FROM products WHERE company_id = ? AND stock> 0',[company_id],function(err,row1){
      connection.query('SELECT * FROM company WHERE company_id = ?',[company_id],function(err,row2){
    console.log(row1);

    console.log(row2);
    res.render('orderitemscompanies', {products:row1 , company:row2});
  });

  });
  
  

});
*/

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

router.get('/abc:id',function (req,res) {
    var product_id = req.params.id;
    connection.query('SELECT * FROM stock WHERE product_id = ?',[product_id],function (err,row1) {
        var low_date = row1[0].ex_date;
        for(var i=1;i<row1.length;i++){
            if(row1[i].ex_date<low_date){
                low_date = row1[i].ex_date;
            }
        }
        connection.query('SELECT * FROM stock WHERE ex_date = ? AND product_id = ?',[low_date,product_id],function (err,row6){
            console.log(row6);
        })
    })
})

/*router.post('/oderlist:id', function(req,res){
    connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1',function(err,row){
        const oder_id =  (row[0].order_id + 1);
        console.log(oder_id);
        const units = req.body.units;
        var product_id = req.params.id;
        connection.query('SELECT * FROM  products WHERE product_id = ?',[product_id],function(err,row2){
            var stock = parseInt(row2[0].stock);
            connection.query('SELECT * FROM oderlist WHERE oder_id = ? AND item_id=?',[oder_id,product_id],function(err,row3){
                if(row3.length>0){
                    var pre_stock = parseInt(row3[0].units);
                    var bill_stock = parseInt(units)+parseInt(pre_stock)
                    var new_stock = parseInt(stock) -(parseInt(units)+parseInt(pre_stock));
                    console.log(new_stock);
                    if(new_stock >= 0){
                        connection.query('SELECT * FROM stock WHERE product_id = ?',[product_id], function (err,row5) {
                            if(row5.length===1){
                                console.log('NUND');
                                var st = (parseInt(row5[0].qty)-parseInt(units))
                                console.log(st);

                                var exdate = row5[0].ex_date;
                                connection.query('UPDATE stock SET qty = ? WHERE product_id = ? AND ex_date = ?',[st,product_id,exdate],function(err,row6)
                                {
                                    connection.query('SELECT * FROM products WHERE product_id = ?',[product_id],function(err,row1){
                                        const pre_price = row3[0].price;
                                        const item_name = row1[0].product_name;
                                        const price = row1[0].price * bill_stock;
                                        connection.query('UPDATE oderlist SET price = ? ,units = ? WHERE oder_id=? AND item_id=?',[price,bill_stock,oder_id,product_id],function(err,result){
                                            if(err) throw err;
                                            res.redirect('/order');
                                        })
                                    })
                                })
                            }
                            else if(row5.length>0){
                                var low_date = row5[0].ex_date;
                                for(var i=1;i<row5.length;i++){
                                    if(row5[i].ex_date<low_date){
                                        low_date = row5[i].ex_date;
                                    }
                                }
                                connection.query('SELECT * FROM stock WHERE ex_date = ? AND product_id = ?',[low_date,product_id],function (err,row6){
                                    var ex_qty=row6[0].qty;
                                    if(units===ex_qty){
                                        connection.query('DELETE FROM stock WHERE ex_date = ? AND product_id = ?',[low_date,product_id],function(err){
                                            if(err) throw err;
                                            res.redirect('/order');
                                        })
                                    }
                                    else if(units>ex_qty){
                                        var fu_qty = units-ex_qty;
                                        connection.query('DELETE FROM stock WHERE ex_date = ? AND product_id = ?',[low_date,product_id],function(err,row7){
                                            connection.query('SELECT * FROM stock WHERE product_id=?',[product_id],function(err,row8){
                                                var low_date2 = row8[0].ex_date;
                                                for(var i=1;i<row8.length;i++){
                                                    if(row8[i].ex_date<low_date2){
                                                        low_date2 = row8[i].ex_date;
                                                    }
                                                }
                                                connection.query('SELECT * FROM stock WHERE product_id=? AND ex_date=?',[product_id,low_date2],function (err,row9) {
                                                    var nqty=row9[0].qty;
                                                    var now_stock = nqty-fu_qty;
                                                    connection.query('Update stock set qty = ? WHERE product_id = ? AND ex_date = ?',[now_stock,product_id,low_date2],function (err,row) {
                                                        res.redirect('/order');
                                                    })

                                                })
                                            })
                                        })
                                    }
                                    else{
                                        var ext_qty=ex_qty-units;
                                        connection.query('UPDATE stock SET qty = ? WHERE product_id = ? AND ex_date = ?',[ext_qty,product_id,low_date],function(err,row){
                                            res.redirect('/order');
                                        })
                                    }
                                })
                                console.log(low_date);
                                //connection.query('SELECT * FROM stock WHERE product_id=? AND ex_date IN (SELECT max(ex_date) FROM stock)',[product_id])
                            }else{
                                res.redirect('/order');
                            }

                        })
                    }
                    else{
                        res.redirect('back');
                    }
                }else{


                    new_stock = stock - units;
                    if(new_stock >=0) {
                        connection.query('SELECT * FROM stock WHERE product_id = ?', [product_id], function (err, row15) {
                            if (row15.length === 0) {
                                connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                    const item_name = row1[0].product_name;
                                    const price = row1[0].price * units;

                                    connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price) VALUES (?,?,?,?,?)', [oder_id, product_id, units, item_name, price], function (err) {
                                        if (err) throw err;
                                        res.redirect('/order');
                                    })
                                });
                            } else if(row15.length===1){
                                var qty1 = row15[0].qty;
                                var extra_qty = qty1-units;
                                if(extra_qty>0){
                                    connection.query('UPDATE stock SET qty = ? WHERE product_id = ? ',[extra_qty,product_id],function (err,row16) {
                                        connection.query('SELECT * FROM products WHERE product_id = ?',[product_id],function(err,row1){
                                            const item_name = row1[0].product_name;
                                            const price = row1[0].price * units;

                                            connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price) VALUES (?,?,?,?,?)',[oder_id,product_id,units,item_name,price],function(err){
                                                if(err) throw err;
                                                res.redirect('/order');
                                            })
                                        });
                                    })

                                }
                                else if(extra_qty ===0){
                                    connection.query('DELETE stock WHERE product_id = ?',[product_id],function (err) {
                                        connection.query('SELECT * FROM products WHERE product_id = ?',[product_id],function(err,row1){
                                            const item_name = row1[0].product_name;
                                            const price = row1[0].price * units;

                                            connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price) VALUES (?,?,?,?,?)',[oder_id,product_id,units,item_name,price],function(err){
                                                if(err) throw err;
                                                res.redirect('/order');
                                            })
                                        });

                                    })
                                }
                                else{
                                    connection.query('SELECT * FROM products WHERE product_id = ?',[product_id],function(err,row1){
                                        const item_name = row1[0].product_name;
                                        const price = row1[0].price * units;

                                        connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price) VALUES (?,?,?,?,?)',[oder_id,product_id,units,item_name,price],function(err){
                                            if(err) throw err;
                                            res.redirect('/order');
                                        })
                                    });
                                }
                            }
                            else{
                                var low_date5 = row15[0].ex_date;
                                for(var i=1;i<row15.length;i++){
                                    if(row15[i].ex_date<low_date){
                                        low_date5 = row15[i].ex_date;
                                    }
                                }
                                connection.query('SELECT * FROM stock WHERE project_id = ?, ex_date = ?',[product_id,low_date5],function(err,row15){
                                    var th_stock=row15[0].qty;
                                    var no_stock= units-th_stock;
                                    if(no_stock===0){
                                        connection.query('DELETE FROM stock WHERE product_id = ? AND ex_date = ?',[product_id,low_date5],function (err) {
                                        connection.query('SELECT * FROM products WHERE product_id = ?',[product_id],function(err,row1){
                                            const item_name = row1[0].product_name;
                                            const price = row1[0].price * units;

                                            connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price) VALUES (?,?,?,?,?)',[oder_id,product_id,units,item_name,price],function(err){
                                                if(err) throw err;
                                                res.redirect('/order');
                                            })
                                        });

                                    })
                                    }
                                    else if(no_stock>0){
                                        connection.query('UPDATE stock set qty = ? WHERE product_id = ? AND ex_date = ?',[no_stock,product_id,low_date5],function (err) {

                                                connection.query('SELECT * FROM products WHERE product_id = ?',[product_id],function(err,row1){
                                                    const item_name = row1[0].product_name;
                                                    const price = row1[0].price * units;

                                                    connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price) VALUES (?,?,?,?,?)',[oder_id,product_id,units,item_name,price],function(err){
                                                        if(err) throw err;
                                                        res.redirect('/order');
                                                    })
                                                });

                                            })


                                    }
                                    else{
                                        connection.query('Delete stock WHERE product_id = ? AND ex_date = ?',[product_id,low_date5],function (err) {
                                            var pres_stock = th_stock-units;
                                            connection.query('SELECT * FROM stock WHERE product_id = ?',[product_id],function(err,row16){

                                                if(row16.length===0){
                                                    if(row16[0].qty>pres_stock){

                                                    }
                                                }
                                            })

                                        })

                                    }

                                })
                            }

                        })
                    }



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

*/
router.post('/oderlist:id', function(req,res){
  connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1',function(err,row){
    const oder_id =  (row[0].order_id + 1);
    console.log(oder_id);
    const units = req.body.units;
    var product_id = req.params.id;
    connection.query('SELECT * FROM  products WHERE product_id = ?',[product_id],function(err,row2){
       var stock = parseInt(row2[0].stock);
      connection.query('SELECT * FROM oderlist WHERE oder_id = ? AND item_id=?',[oder_id,product_id],function(err,row3){
        if(row3.length>0){
          var pre_stock = parseInt(row3[0].units);
          var bill_stock = parseInt(units)+parseInt(pre_stock)
          var new_stock = parseInt(stock) -(parseInt(units)+parseInt(pre_stock));
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

router.post('/abcdef:id', function(req,res){
    connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1',function(err,row){
        const oder_id =  (row[0].order_id + 1);
        console.log(oder_id);
        const units = req.body.units;
        var product_id = req.params.id;
        connection.query('SELECT * FROM  products WHERE product_id = ?',[product_id],function(err,row2){

            var stock = parseInt(row2[0].stock);

            connection.query('SELECT * FROM oderlist WHERE oder_id = ? AND item_id=?',[oder_id,product_id],function(err,row3){
                if(row3.length>0){
                    var pre_stock = parseInt(row3[0].units);
                    var bill_stock = parseInt(units)+parseInt(pre_stock)
                    var new_stock = parseInt(stock) -(parseInt(units)+parseInt(pre_stock));
                    console.log(new_stock);
                    if(new_stock >= 0){
                        connection.query('SELECT * FROM products WHERE product_id = ?',[product_id],function(err,row1){
                            const pre_price = row3[0].price;
                            const item_name = row1[0].product_name;
                            const price = row1[0].price * bill_stock;
                            connection.query('UPDATE oderlist SET price = ? ,units = ? WHERE oder_id=? AND item_id=?',[price,bill_stock,oder_id,product_id],function(err,result){
                                if(err) throw err;
                                res.redirect('back');
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
const repassword = req.body.repassword;
const Lat = req.body.Lat;
const Lon = req.body.Lon;
const logo = '../upload/'+req.files[0].filename;


if(password == repassword) {
    con.connect(function (err) {
        if (err) throw err;
        bcrypt.hash(password, saltRounds, function (err, hash) {
            //console.log("Connected!");
            //var sql = "INSERT INTO user SET ?";
            con.query('INSERT INTO users(pharmacy_name,address,email,tel_number,register_no,register,password,Lat,Lon,logo) VALUES (?,?,?,?,?,?,?,?,?,?)', [pharmacy_name, address, email, tel_number, register_no, register, hash, Lat, Lon, logo], function (err, result) {
                if (err) throw err;
                //console.log("1 record inserted");
                con.query('SELECT LAST_INSERT_ID() as user_id', function (err, results, fields) {
                    if (err) throw err;
                    const user_id = results[0];
                    //console.log(results[0]);
                    req.login(user_id, function (err) {
                            res.redirect('/');
                        }
                    )

                });
                //res.redirect('/');

            });
            // res.render('contact', {title1:'Registration Complete'});
        });
    });
}
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

router.post('/searchcompany', function(req,res,next){
    company_name = req.body.srch;
    connection.query('SELECT * FROM company WHERE company_name LIKE ?',['%'+company_name+'%'],function(err,row){
        if(row.length = 1){
            console.log(row);
            var company_id = row[0].company_id;
            connection.query('SELECT * FROM company WHERE company_id=?',[company_id], function(err,rows){
                connection.query('SELECT * FROM products WHERE company_id = ?',[company_id], function(err,row1){
                    res.render('orderproduct',{company:rows,products:row1})
                })

            })

        }
        else{
            res.redirect('/');
        }
    })
})

router.get('/search',function (req,res) {
    connection.query('SELECT * FROM product WHERE product_name LIKE = ? ',["%"+req.query.key+"%"],function (err,rows) {
        if (err) throw err;
        var data=[];
        for(i=0;i<rows.length;i++)
        {
            data.push(rows[i].product_name);
        }
        res.end(JSON.stringify(data));
    })
})
router.get('/myaccount',function (req,res) {
    const user_id = req.user.user_id;
    console.log(user_id);
    connection.query('SELECT * FROM users WHERE user_id = ?',[user_id],function (err,rows) {
        res.render('account',{layout:'profile',user:rows});
    })

})




module.exports = router;

