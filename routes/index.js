var express = require('express');
var router = express.Router();
var passport = require('passport');
var LacalStrategy = require('passport-local').Strategy;
var connection = require('../config/connection');
var bcrypt = require('bcryptjs');
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
    destination: function (req, file, callback) {
        callback(null, 'public/upload/');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: Storage
}).any();

router.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong!");
        }
        console.log(req.files);
        console.log(req.files[0].path);

        res.render('pra/pratice', { file: 'upload/' + req.files[0].filename });
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

router.get('/', function (req, res, next) {
    console.log(req.user);
    console.log(req.isAuthenticated());
    connection.query('SELECT * FROM products WHERE special_list = 1', function (err, rows) {
        connection.query('SELECT * FROM company', function (err, row1) {
            connection.query('SELECT* FROM products WHERE new_list=1', function (err, row2) {
                res.render('home', { title: 'Express', special: rows, companies: row1, new: row2 });

            })

        })

        //user = req.isAuthenticated();


    });
})
router.get('/index', function (req, res, next) {
    console.log(req.user);
    console.log(req.isAuthenticated());
    connection.query('SELECT * FROM products WHERE special_list = 1', function (err, rows) {
        connection.query('SELECT * FROM company', function (err, row1) {
            connection.query('SELECT* FROM products WHERE new_list=1', function (err, row2) {
                res.render('index', { title: 'Express', special: rows, companies: row1, new: row2 });

            })

        })

        //user = req.isAuthenticated();


    });
})

router.get('/register', function (req, res, next) {
    console.log(req.isAuthenticated());

    res.render('contact', { title: 'Express', title1: 'Registration' });
});
router.get('/login', function (req, res, next) {
    res.render('login', { title: 'Express', title1: 'Registration' ,layout:'profile' });
});

router.get('/order', function (req, res, next) {
    var total = 0;
    connection.query('SELECT * FROM company', function (err, rows) {
        connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row1) {
            const oder_id = (row1[0].order_id + 1);
            console.log(oder_id);
            connection.query('SELECT products.product_id, products.product_name, products.brand, products.price, oderlist.units, oderlist.price, stock.ex_date, stock.batch_No FROM products, oderlist, stock WHERE stock.batch_No = oderlist.batch_id AND products.product_id = oderlist.item_id AND oderlist.oder_id = ?', [oder_id], function (err, row) {
                for (var i = row.length - 1; i >= 0; i--) {
                    total = total + row[i].price;
                }
                console.log(total)
                res.render('order', { companys: rows, items: row, price: total });
            })
        })

        //console.log(rows);
        //res.render('order', {companys:rows, });

    })
});

router.get('/submitOrder', function (req, res, next) {
    const user_id = req.user.user_id;
    console.log(user_id);
    connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1 ', function (err, row) {
        const oder_id = (row[0].order_id + 1);
        connection.query('INSERT INTO payment(order_id,user_id,approval,order_date) VALUES(?,?,?,CURDATE())', [oder_id, user_id, 0], function (err) {
            connection.query('SELECT * FROM oderlist WHERE oder_id=?', [oder_id], function (err, row1) {
                console.log(row1);
                for (var i = row1.length - 1; i >= 0; i--) {
                    (function (product_id, units) {
                        product_id = row1[i].item_id
                        console.log(product_id)
                        units = parseInt(row1[i].units)
                        connection.query('SELECT * FROM products WHERE product_id=?', [product_id], function (err, row2) {
                            console.log(product_id);
                            cur_stock = parseInt(row2[0].stock);
                            stock = cur_stock - units;
                            /*console.log(cur_stock);
                            console.log(stock);
                            console.log(units);
                            console.log(product_id);*/
                            connection.query('UPDATE products set stock=? WHERE product_id=?', [stock, product_id], function (err) {
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

router.get('/updateorder:id1', function (req, res, next) {
    var product_id = req.params.id1;
    connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row2) {
        stock = parseInt(row2[0].stock);
        connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row) {
            const oder_id = (row[0].order_id + 1);
            console.log(oder_id);
            connection.query('SELECT * FROM oderlist WHERE item_id = ? AND oder_id = ?', [product_id, oder_id], function (err, row1) {
                oder = parseInt(row1[0].units);
                remaining = stock - oder;
                console.log(row1);
                res.render('updateorder', { product: row2, oder: row1, remaining: remaining });

            })
            //res.render('updateorder',{product:row2 , oder:row});
        })
    })
})

router.get('/ordercompany:id', function (req, res) {
    var company_id = req.params.id;
    console.log(company_id);
    connection.query('SELECT * FROM products WHERE company_id = ? AND stock> 0', [company_id], function (err, row1) {
        connection.query('SELECT * FROM company WHERE company_id = ?', [company_id], function (err, row2) {
            connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row4) {
                if (row4.length > 0) {
                    const oder_id = (row4[0].order_id + 1);
                    connection.query('SELECT products.product_id,products.product_name,oderlist.units, oderlist.batch_id , products.brand FROM products INNER JOIN oderlist ON products.product_id = oderlist.item_id WHERE products.company_id = ? AND oderlist.oder_id=?', [company_id, oder_id], function (err, row3) {
                        res.render('orderitemscompanies', { products: row1, company: row2, list: row3 });
                    })
                } else {
                    res.render('orderitemscompanies', { products: row1, company: row2 });
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

router.get('/products:id', function (req, res) {
    var product_id = req.params.id;
    connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row) {
        const oder_id = (row[0].order_id + 1);
        connection.query('SELECT * FROM oderlist WHERE oder_id=? AND item_id=?', [oder_id, product_id], function (err, row1) {
            if (row1.length > 0) {
                cur_oder = parseInt(row1[0].units);
                connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row2) {
                    stock = parseInt(row2[0].stock);
                    remaining = stock - cur_oder;
                    res.render('orderitem', { product: row2, remaining: remaining })
                })

            }
            else {
                connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row2) {
                    remaining = row2[0].stock;
                    if (err) throw err;
                    res.render('orderitem', { product: row2, remaining: remaining });
                });

            }
        })
    })





});



router.post('/oderlist:id', function (req, res) {
    connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row) {
        const oder_id = (row[0].order_id + 1);
        console.log(oder_id);
        const units = req.body.units;
        if (units) {
            var product_id = req.params.id;
            connection.query('SELECT * FROM  products WHERE product_id = ?', [product_id], function (err, row2) {

                var stock = parseInt(row2[0].stock);
                connection.query('SELECT * FROM oderlist WHERE oder_id = ? AND item_id=?', [oder_id, product_id], function (err, row3) {
                    if (row3.length > 0) {
                        var pre_stock = parseInt(row3[0].units);
                        var bill_stock = parseInt(units) + parseInt(pre_stock)
                        var new_stock = parseInt(stock) - (parseInt(units) + parseInt(pre_stock));
                        console.log(new_stock);
                        if (new_stock >= 0) {
                            connection.query('SELECT * FROM stock WHERE product_id = ? AND available = 1', [product_id], function (err, row5) {
                                if (row5.length === 1) {

                                    var st = (parseInt(row5[0].qty) - parseInt(units))
                                    if (st >= 0) {
                                        var exdate = row5[0].ex_date;
                                        connection.query('UPDATE stock SET qty = ? WHERE product_id = ? AND ex_date = ?', [st, product_id, exdate], function (err, row6) {
                                            connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                
                                                const pre_price = row3[0].price;
                                                const item_name = row1[0].product_name;
                                                const price = row1[0].price * bill_stock;
                                                connection.query('UPDATE oderlist SET price = ? ,units = ? WHERE oder_id=? AND item_id=?', [price, bill_stock, oder_id, product_id], function (err, result) {
                                                    if (err) throw err;

                                                    res.redirect('back');
                                                })
                                            });

                                        })
                                    } else {
                                        res.redirect('back');
                                    }

                                    
                                }


                                else if (row5.length > 1) {
                                    var low_date = row5[0].ex_date;
                                    for (var i = 1; i < row5.length; i++) {
                                        if (row5[i].ex_date < low_date) {
                                            low_date = row5[i].ex_date;
                                        }
                                    }
                                    connection.query('SELECT * FROM stock WHERE ex_date = ? AND product_id = ? ', [low_date, product_id], function (err, row6) {
                                        var ex_qty = row6[0].qty;
                                        var batch_id4 = row6[0].batch_No;
                                        if (units === ex_qty) {
                                            connection.query('UPDATE stock SET available = 0 WHERE ex_date = ? AND product_id = ?', [low_date, product_id], function (err) {
                                                if (err) throw err;
                                                connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                    const pre_price = row3[0].price;
                                                    const item_name = row1[0].product_name;
                                                    const price = row1[0].price * bill_stock;
                                                    connection.query('SELECT * FROM oderlist WHERE batch_id = ? ', [batch_id4], function (err, roww) {
                                                        if (roww.lenght) {
                                                            batch_stock = roww[0].units;
                                                            to_batch_stock = batch_stock + units;
                                                            price4 = row1[0].price * to_batch_stock;
                                                            connection.query('UPDATE oderlist SET price = ? ,units = ? WHERE oder_id=? AND item_id=?', [price4, to_batch_stock, oder_id, product_id], function (err, result) {
                                                                if (err) throw err;

                                                                res.redirect('back');
                                                            })

                                                        } else {
                                                            price5 = row1[0].price * units;
                                                            connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,batch_id) VALUES(?,?,?,?,?,?)', [oder_id, product_id, units, item_name, price5, batch_id4], function (err, row30) {
                                                                if (err) throw err;

                                                                res.redirect('back');
                                                            })
                                                        }
                                                    })

                                                })
                                            });
                                        }
                                    
                                        
                                        else if (units > ex_qty) {
                                            var fu_qty = units - ex_qty;
                                            connection.query('UPDATE stock SET available = 0 WHERE ex_date = ? AND product_id = ?', [low_date, product_id], function (err, row7) {
                                                connection.query('SELECT * FROM stock WHERE product_id=? AND available = 1', [product_id], function (err, row8) {
                                                    var low_date2 = row8[0].ex_date;
                                                    for (var i = 1; i < row8.length; i++) {
                                                        if (row8[i].ex_date < low_date2) {
                                                            low_date2 = row8[i].ex_date;
                                                        }
                                                    }
                                                    connection.query('SELECT * FROM stock WHERE product_id = ? AND ex_date = ? AND available = 1', [product_id, low_date2], function (err, row9) {
                                                        var nqty = row9[0].qty;
                                                        var batch_id = row9[0].batch_No;
                                                        var now_stock = nqty - fu_qty;
                                                        connection.query('Update stock set qty = ? WHERE product_id = ? AND ex_date = ?', [now_stock, product_id, low_date2], function (err, row) {
                                                            connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                                const pre_price = row3[0].price;
                                                                const item_name = row1[0].product_name;
                                                                const price1 = row1[0].price * (ex_qty + pre_stock);
                                                                const price2 = row1[0].price * fu_qty;
                                                                connection.query('UPDATE oderlist SET price = ? ,units = ? WHERE oder_id=? AND item_id=?', [price1, (ex_qty + pre_stock), oder_id, product_id], function (err, result) {
                                                                    connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,batch_id) VALUES (?,?,?,?,?,?)', [oder_id, product_id, fu_qty, item_name, price2, batch_id])
                                                                    if (err) throw err;

                                                                    res.redirect('back');
                                                                })
                                                            });
                                                        })

                                                    })
                                                })
                                            })
                                        }
                                        else {
                                            var ext_qty = ex_qty - units;
                                            connection.query('UPDATE stock SET qty = ? WHERE product_id = ? AND ex_date = ?', [ext_qty, product_id, low_date], function (err, row) {
                                                connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                    const pre_price = row3[0].price;
                                                    const item_name = row1[0].product_name;
                                                    const price = row1[0].price * bill_stock;
                                                    connection.query('UPDATE oderlist SET price = ? ,units = ? WHERE oder_id=? AND item_id=?', [price, bill_stock, oder_id, product_id], function (err, result) {
                                                        if (err) throw err;

                                                        res.redirect('back');
                                                    })
                                                });
                                            })
                                        }


                                    })
                                } else {
                                    console.log("stock empty");
                                }
                            })
                        }
                        else {
                            console.log("stock empty");
                        }
                    }




                    else {


                        new_stock = stock - units;
                        if (new_stock >= 0) {
                            connection.query('SELECT * FROM stock WHERE product_id = ? AND available = 1', [product_id], function (err, row15) {
                                
                                if (row15.length === 0) {
                                    /*connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                        const item_name = row1[0].product_name;
                                        const price = row1[0].price * units;


                                        connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                            const item_name = row1[0].product_name;
                                            const price = row1[0].price * units;

                                            connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price) VALUES (?,?,?,?,?)', [oder_id, product_id, units, item_name, price], function (err) {
                                                if (err) throw err;
                                                res.redirect('back');
                                            })
                                        });

                                    });*/
                                }
                                else if (row15.length === 1) {
                                    var qty1 = row15[0].qty;
                                    var batch_id = row15[0].batch_No;
                                    var ex_date = row15[0].ex_date;
                                    console.log(batch_id);
                                   var extra_qty = qty1 - units;
                                    if (extra_qty > 0) {
                                        connection.query('UPDATE stock SET qty = ? WHERE product_id = ? AND ex_date = ?', [extra_qty, product_id, ex_date], function (err, row16) {
                                            connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                const item_name = row1[0].product_name;
                                                const price = row1[0].price * units;



                                                connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,batch_id) VALUES (?,?,?,?,?,?)', [oder_id, product_id, units, item_name, price, batch_id], function (err) {
                                                    if (err) throw err;
                                                    res.redirect('back');
                                                })
                                            });

                                        });


                                    }
                                    else if (extra_qty === 0) {
                                        connection.query('UPDATE stock SET available = 0, qty =0  WHERE product_id = ? ', [product_id], function (err) {
                                            connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                const item_name = row1[0].product_name;
                                                const price = row1[0].price * units;

                                                connection.query('SELECT * FROM products WHERE product_id = ? AND ex_date = ?', [product_id, ex_date], function (err, row1) {
                                                    const item_name = row1[0].product_name;
                                                    const price = row1[0].price * units;

                                                    connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,batch_id) VALUES (?,?,?,?,?,?)', [oder_id, product_id, units, item_name, price, batch_id], function (err) {
                                                        if (err) throw err;
                                                        res.redirect('back');
                                                    })
                                                });
                                            });

                                        })
                                    }
                                    else {
                                        /*connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                            const item_name = row1[0].product_name;
                                            const price = row1[0].price * units;

                                            

                                                connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,bat) VALUES (?,?,?,?,?)', [oder_id, product_id, units, item_name, price], function (err) {
                                                    if (err) throw err;
                                                    res.redirect('back');
                                                })
                                            });*/
                                    } 
                                    
                                }
                                else {
                                    
                                    var low_date5 = row15[0].ex_date;
                                    console.log(low_date5);
                                    for (var i = 0; i < row15.length; i++) {
                                        if (row15[i].ex_date < low_date5) {
                                            low_date5 = row15[i].ex_date;

                                        }
                                    }
                                    console.log(low_date5);
                                    console.log(product_id);
                                    connection.query('SELECT * FROM stock WHERE product_id = ? AND ex_date = ? AND available = 1', [product_id, low_date5], function (err, row20) {
                                        console.log("bhnb");
                                        console.log(row20);
                                        var batch_id = row20[0].batch_No;
                                        var th_stock = row20[0].qty;
                                        var no_stock = th_stock - units;
                                        if (no_stock === 0) {
                                            connection.query('UPDATE stock SET available = 0 , qty = 0 WHERE product_id = ? AND ex_date = ?', [product_id, low_date5], function (err) {
                                                connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                    const item_name = row1[0].product_name;
                                                    const price = row1[0].price * units;

                                                    connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,batch_id) VALUES (?,?,?,?,?,?)', [oder_id, product_id, units, item_name, price, batch_id], function (err) {
                                                        if (err) throw err;
                                                        res.redirect('back');
                                                    })
                                                });

                                            })
                                        }
                                        else if (no_stock > 0) {
                                            connection.query('UPDATE stock set qty = ? WHERE product_id = ? AND ex_date = ?', [no_stock, product_id, low_date5], function (err) {

                                                connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                    const item_name = row1[0].product_name;
                                                    const price = row1[0].price * units;

                                                    connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,batch_id) VALUES (?,?,?,?,?,?)', [oder_id, product_id, units, item_name, price, batch_id], function (err) {
                                                        if (err) throw err;
                                                        res.redirect('back');
                                                    })
                                                });

                                            })


                                        }
                                        else {
                                            connection.query('UPDATE stock SET available = 0 , qty = 0 WHERE product_id = ? AND ex_date = ?', [product_id, low_date5], function (err) {
                                                var pres_stock = units - th_stock ;
                                                connection.query('SELECT * FROM stock WHERE product_id = ? AND available = 1', [product_id], function (err, row16) {
                                                    var batch_id2 =row16[0].batch_No;
                                                    if (row16.length === 1) {
                                                        if (row16[0].qty > pres_stock) {
                                                            var rem_stock = row16[0].qty - pres_stock;
                                                            var ex_date = row16[0].ex_date;
                                                            connection.query('UPDATE stock SET qty = ? WHERE product_id = ? AND ex_date = ?', [rem_stock, product_id,ex_date], function (err) {

                                                                connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                                    const item_name = row1[0].product_name;
                                                                    const price1 = row1[0].price * th_stock;
                                                                    const price2 = row1[0].price * pres_stock
                                                                    connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,batch_id) VALUES (?,?,?,?,?,?)', [oder_id, product_id, th_stock, item_name, price1, batch_id], function (err) {
                                                                        connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,batch_id) VALUES (?,?,?,?,?,?)', [oder_id, product_id, pres_stock, item_name, price2, batch_id2], function (err) {
                                                                            if (err) throw err;
                                                                            res.redirect('back');
                                                                        })
                                                                    })
                                                                });
                                                            })
                                                        }
                                                        else {
                                                            console.log("empty");
                                                        }

                                                    } else if (row16.length > 1) {
                                                        var low_date6 = row16[0].ex_date;
                                                        for (var i = 1; i < row16.length; i++) {
                                                            if (row16[i].ex_date < low_date6) {
                                                                low_date6 = row16[i].ex_date;
                                                            }
                                                        }
                                                        connection.query('SELECT * FROM stock WHERE product_id = ? AND ex_date = ? AND available = 1', [product_id, low_date6], function (err, row17) {
                                                            nowl_stock = row17[0].qty - pres_stock;
                                                            var batch_id3 = row17[0].batch_No;
                                                            connection.query('Update stock SET qty = ? WHERE product_id = ? AND ex_date = ?', [nowl_stock, product_id, low_date6], function (err) {
                                                                connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                                    const item_name = row1[0].product_name;
                                                                    const price = row1[0].price * units;

                                                                    connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,batch_id) VALUES (?,?,?,?,?,?)', [oder_id, product_id, units, item_name, price, batch_id3], function (err) {
                                                                        if (err) throw err;
                                                                        res.redirect('back');
                                                                    })
                                                                });
                                                            })
                                                        })
                                                    }
                                                    else {

                                                    }

                                                })

                                            })

                                        }

                                    })
                                }

                            })
                        }
                        else {
                            res.redirect('back');
                        }


                        /* connection.query('SELECT * FROM products WHERE product_id = ?',[product_id],function(err,row1){
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
                 })*/

                    }


                })
            })
        } else {
            var product_id = req.params.id;
            res.redirect('back');

        }
      
    })
})

router.post('/orderitem:id', function (req, res) {
    connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row) {
        const oder_id = (row[0].order_id + 1);
        console.log(oder_id);
        const units = req.body.units;
        if (units) {
            var product_id = req.params.id;

            connection.query('SELECT * FROM  products WHERE product_id = ?', [product_id], function (err, row2) {
                console.log('hundr');
                var stock = parseInt(row2[0].stock);
                connection.query('SELECT * FROM oderlist WHERE oder_id = ? AND item_id=?', [oder_id, product_id], function (err, row3) {
                    if (row3.length > 0) {
                        var pre_stock = parseInt(row3[0].units);
                        var bill_stock = parseInt(units) + parseInt(pre_stock)
                        var new_stock = parseInt(stock) - (parseInt(units) + parseInt(pre_stock));
                        console.log(new_stock);
                        if (new_stock >= 0) {
                            connection.query('SELECT * FROM stock WHERE product_id = ?', [product_id], function (err, row5) {
                                if (row5.length === 1) {

                                    var st = (parseInt(row5[0].qty) - parseInt(units))


                                    var exdate = row5[0].ex_date;
                                    connection.query('UPDATE stock SET qty = ? WHERE product_id = ? AND ex_date = ?', [st, product_id, exdate], function (err, row6) {
                                        connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                            const pre_price = row3[0].price;
                                            const item_name = row1[0].product_name;
                                            const price = row1[0].price * bill_stock;
                                            connection.query('UPDATE oderlist SET price = ? ,units = ? WHERE oder_id=? AND item_id=?', [price, bill_stock, oder_id, product_id], function (err, result) {
                                                if (err) throw err;

                                                connection.query('SELECT * FROM  products WHERE product_id = ?', [product_id], function (err, row30) {
                                                    var company_id = row30[0].company_id;
                                                    connection.query('SELECT * FROM products WHERE company_id = ? AND stock> 0', [company_id], function (err, row21) {
                                                        connection.query('SELECT * FROM company WHERE company_id = ?', [company_id], function (err, row22) {
                                                            connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row24) {
                                                                if (row24.length > 0) {
                                                                    const oder_id = (row24[0].order_id + 1);
                                                                    connection.query('SELECT products.product_id,products.product_name,oderlist.units FROM products INNER JOIN oderlist ON products.product_id = oderlist.item_id WHERE products.company_id = ? AND oderlist.oder_id=?', [company_id, oder_id], function (err, row23) {
                                                                        res.render('orderitemscompanies', {
                                                                            products: row21,
                                                                            company: row22,
                                                                            list: row23
                                                                        });
                                                                    })
                                                                } else {
                                                                    res.render('orderitemscompanies', {
                                                                        products: row21,
                                                                        company: row22
                                                                    });
                                                                }


                                                            });
                                                            /*console.log(row1);
    
                                                            console.log(row2);
                                                            res.render('orderitemscompanies', {products:row1 , company:row2});*/
                                                        });

                                                    });

                                                })
                                            })
                                        });

                                    })
                                }


                                else if (row5.length > 1) {
                                    var low_date = row5[0].ex_date;
                                    for (var i = 1; i < row5.length; i++) {
                                        if (row5[i].ex_date < low_date) {
                                            low_date = row5[i].ex_date;
                                        }
                                    }
                                    connection.query('SELECT * FROM stock WHERE ex_date = ? AND product_id = ?', [low_date, product_id], function (err, row6) {
                                        var ex_qty = row6[0].qty;
                                        if (units === ex_qty) {
                                            connection.query('DELETE FROM stock WHERE ex_date = ? AND product_id = ?', [low_date, product_id], function (err) {
                                                if (err) throw err;
                                                connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                    const pre_price = row3[0].price;
                                                    const item_name = row1[0].product_name;
                                                    const price = row1[0].price * bill_stock;
                                                    connection.query('UPDATE oderlist SET price = ? ,units = ? WHERE oder_id=? AND item_id=?', [price, bill_stock, oder_id, product_id], function (err, result) {
                                                        if (err) throw err;

                                                        connection.query('SELECT * FROM  products WHERE product_id = ?', [product_id], function (err, row30) {
                                                            var company_id = row30[0].company_id;
                                                            connection.query('SELECT * FROM products WHERE company_id = ? AND stock> 0', [company_id], function (err, row21) {
                                                                connection.query('SELECT * FROM company WHERE company_id = ?', [company_id], function (err, row22) {
                                                                    connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row24) {
                                                                        if (row24.length > 0) {
                                                                            const oder_id = (row24[0].order_id + 1);
                                                                            connection.query('SELECT products.product_id,products.product_name,oderlist.units FROM products INNER JOIN oderlist ON products.product_id = oderlist.item_id WHERE products.company_id = ? AND oderlist.oder_id=?', [company_id, oder_id], function (err, row23) {
                                                                                res.render('orderitemscompanies', {
                                                                                    products: row21,
                                                                                    company: row22,
                                                                                    list: row23
                                                                                });
                                                                            })
                                                                        } else {
                                                                            res.render('orderitemscompanies', {
                                                                                products: row21,
                                                                                company: row22
                                                                            });
                                                                        }


                                                                    });
                                                                    /*console.log(row1);
    
                                                                    console.log(row2);
                                                                    res.render('orderitemscompanies', {products:row1 , company:row2});*/
                                                                });

                                                            });

                                                        })
                                                    })
                                                });
                                            })
                                        }
                                        else if (units > ex_qty) {
                                            var fu_qty = units - ex_qty;
                                            connection.query('DELETE FROM stock WHERE ex_date = ? AND product_id = ?', [low_date, product_id], function (err, row7) {
                                                connection.query('SELECT * FROM stock WHERE product_id=?', [product_id], function (err, row8) {
                                                    var low_date2 = row8[0].ex_date;
                                                    for (var i = 1; i < row8.length; i++) {
                                                        if (row8[i].ex_date < low_date2) {
                                                            low_date2 = row8[i].ex_date;
                                                        }
                                                    }
                                                    connection.query('SELECT * FROM stock WHERE product_id=? AND ex_date=?', [product_id, low_date2], function (err, row9) {
                                                        var nqty = row9[0].qty;
                                                        var now_stock = nqty - fu_qty;
                                                        var batch_id2 = row9[0].batch_No;
                                                        connection.query('Update stock set qty = ? WHERE product_id = ? AND ex_date = ?', [now_stock, product_id, low_date2], function (err, row) {
                                                            connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                                const pre_price = row3[0].price;
                                                                const item_name = row1[0].product_name;
                                                                const price1 = row1[0].price * ex_qty;
                                                                const price2 = row2[0].price * fu_qty;
                                                                connection.query('UPDATE oderlist SET price = ? ,units = ? WHERE oder_id=? AND item_id=?', [price, bill_stock, oder_id, product_id], function (err, result) {
                                                                    connection.query('INSERT INTO oderlist (oder_id,item_id,units,batch_id) VALUES (?,?,?,?) '[order_id, product_id, fu_qty, batch_id2], function (err, result2) {
                                                                        if (err) throw err;
                                                                        connection.query('SELECT * FROM  products WHERE product_id = ?', [product_id], function (err, row30) {
                                                                            var company_id = row30[0].company_id;
                                                                            connection.query('SELECT * FROM products WHERE company_id = ? AND stock> 0', [company_id], function (err, row21) {
                                                                                connection.query('SELECT * FROM company WHERE company_id = ?', [company_id], function (err, row22) {
                                                                                    connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row24) {
                                                                                        if (row24.length > 0) {
                                                                                            const oder_id = (row24[0].order_id + 1);
                                                                                            connection.query('SELECT products.product_id,products.product_name,oderlist.units FROM products INNER JOIN oderlist ON products.product_id = oderlist.item_id WHERE products.company_id = ? AND oderlist.oder_id=?', [company_id, oder_id], function (err, row23) {
                                                                                                res.render('orderitemscompanies', {
                                                                                                    products: row21,
                                                                                                    company: row22,
                                                                                                    list: row23
                                                                                                });
                                                                                            })
                                                                                        } else {
                                                                                            res.render('orderitemscompanies', {
                                                                                                products: row21,
                                                                                                company: row22
                                                                                            });
                                                                                        }


                                                                                    });
                                                                                    /*console.log(row1);
        
                                                                                    console.log(row2);
                                                                                    res.render('orderitemscompanies', {products:row1 , company:row2});*/
                                                                                });

                                                                            });

                                                                        })
                                                                    })
                                                                    

                                                                   
                                                                })
                                                            });
                                                        })

                                                    })
                                                })
                                            })
                                        }
                                        else {
                                            var ext_qty = ex_qty - units;
                                            connection.query('UPDATE stock SET qty = ? WHERE product_id = ? AND ex_date = ?', [ext_qty, product_id, low_date], function (err, row) {
                                                connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                    const pre_price = row3[0].price;
                                                    const item_name = row1[0].product_name;
                                                    const price = row1[0].price * bill_stock;
                                                    connection.query('UPDATE oderlist SET price = ? ,units = ? WHERE oder_id=? AND item_id=?', [price, bill_stock, oder_id, product_id], function (err, result) {
                                                        if (err) throw err;

                                                        connection.query('SELECT * FROM  products WHERE product_id = ?', [product_id], function (err, row30) {
                                                            var company_id = row30[0].company_id;
                                                            connection.query('SELECT * FROM products WHERE company_id = ? AND stock> 0', [company_id], function (err, row21) {
                                                                connection.query('SELECT * FROM company WHERE company_id = ?', [company_id], function (err, row22) {
                                                                    connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row24) {
                                                                        if (row24.length > 0) {
                                                                            const oder_id = (row24[0].order_id + 1);
                                                                            connection.query('SELECT products.product_id,products.product_name,oderlist.units FROM products INNER JOIN oderlist ON products.product_id = oderlist.item_id WHERE products.company_id = ? AND oderlist.oder_id=?', [company_id, oder_id], function (err, row23) {
                                                                                res.render('orderitemscompanies', {
                                                                                    products: row21,
                                                                                    company: row22,
                                                                                    list: row23
                                                                                });
                                                                            })
                                                                        } else {
                                                                            res.render('orderitemscompanies', {
                                                                                products: row21,
                                                                                company: row22
                                                                            });
                                                                        }


                                                                    });
                                                                    /*console.log(row1);
    
                                                                    console.log(row2);
                                                                    res.render('orderitemscompanies', {products:row1 , company:row2});*/
                                                                });

                                                            });

                                                        })
                                                    })
                                                });
                                            })
                                        }


                                    })
                                } else {
                                }
                            })
                        } else {
                            console.log("jtgi");
                        }
                    } else {


                        new_stock = stock - units;
                        if (new_stock >= 0) {
                            connection.query('SELECT * FROM stock WHERE product_id = ?', [product_id], function (err, row15) {
                                if (row15.length === 0) {
                                    console.log('Empty');
                                   /* connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                        const item_name = row1[0].product_name;
                                        const price = row1[0].price * units;


                                        connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                            const item_name = row1[0].product_name;
                                            const price = row1[0].price * units;

                                            connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price) VALUES (?,?,?,?,?)', [oder_id, product_id, units, item_name, price], function (err) {
                                                if (err) throw err;
                                                connection.query('SELECT * FROM  products WHERE product_id = ?', [product_id], function (err, row30) {
                                                    var company_id = row30[0].company_id;
                                                    connection.query('SELECT * FROM products WHERE company_id = ? AND stock> 0', [company_id], function (err, row21) {
                                                        connection.query('SELECT * FROM company WHERE company_id = ?', [company_id], function (err, row22) {
                                                            connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row24) {
                                                                if (row24.length > 0) {
                                                                    const oder_id = (row24[0].order_id + 1);
                                                                    connection.query('SELECT products.product_id,products.product_name,oderlist.units FROM products INNER JOIN oderlist ON products.product_id = oderlist.item_id WHERE products.company_id = ? AND oderlist.oder_id=?', [company_id, oder_id], function (err, row23) {
                                                                        res.render('orderitemscompanies', {
                                                                            products: row21,
                                                                            company: row22,
                                                                            list: row23
                                                                        });
                                                                    })
                                                                } else {
                                                                    res.render('orderitemscompanies', {
                                                                        products: row21,
                                                                        company: row22
                                                                    });
                                                                }


                                                            });
                                                            /*console.log(row1);
    
                                                            console.log(row2);
                                                            res.render('orderitemscompanies', {products:row1 , company:row2});*/
                                                       /* });

                                                    });

                                                })
                                            })
                                        });

                                    });*/
                                } else if (row15.length === 1) {
                                    var batch_id = row15[0].batch_No;
                                    var qty1 = row15[0].qty;
                                    var extra_qty = qty1 - units;
                                    if (extra_qty > 0) {
                                        connection.query('UPDATE stock SET qty = ? WHERE product_id = ? ', [extra_qty, product_id], function (err, row16) {
                                            connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                const item_name = row1[0].product_name;
                                                const price = row1[0].price * units;

                                                connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                    const item_name = row1[0].product_name;
                                                    const price = row1[0].price * units;

                                                    connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,batch_id) VALUES (?,?,?,?,?,?)', [oder_id, product_id, units, item_name, price,batch_id], function (err) {
                                                        if (err) throw err;
                                                        connection.query('SELECT * FROM  products WHERE product_id = ?', [product_id], function (err, row30) {
                                                            var company_id = row30[0].company_id;
                                                            connection.query('SELECT * FROM products WHERE company_id = ? AND stock> 0', [company_id], function (err, row21) {
                                                                connection.query('SELECT * FROM company WHERE company_id = ?', [company_id], function (err, row22) {
                                                                    connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row24) {
                                                                        if (row24.length > 0) {
                                                                            const oder_id = (row24[0].order_id + 1);
                                                                            connection.query('SELECT products.product_id,products.product_name,oderlist.units FROM products INNER JOIN oderlist ON products.product_id = oderlist.item_id WHERE products.company_id = ? AND oderlist.oder_id=?', [company_id, oder_id], function (err, row23) {
                                                                                res.render('orderitemscompanies', {
                                                                                    products: row21,
                                                                                    company: row22,
                                                                                    list: row23
                                                                                });
                                                                            })
                                                                        } else {
                                                                            res.render('orderitemscompanies', {
                                                                                products: row21,
                                                                                company: row22
                                                                            });
                                                                        }


                                                                    });
                                                                    /*console.log(row1);
    
                                                                    console.log(row2);
                                                                    res.render('orderitemscompanies', {products:row1 , company:row2});*/
                                                                });

                                                            });

                                                        })
                                                    })
                                                });
                                            })
                                        });


                                    }
                                    else if (extra_qty === 0) {
                                        connection.query('DELETE stock WHERE product_id = ?', [product_id], function (err) {
                                            connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                const item_name = row1[0].product_name;
                                                const price = row1[0].price * units;

                                                connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                    const item_name = row1[0].product_name;
                                                    const price = row1[0].price * units;

                                                    connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,batch_id) VALUES (?,?,?,?,?,?)', [oder_id, product_id, units, item_name, price, batch_id], function (err) {
                                                        if (err) throw err;
                                                        connection.query('SELECT * FROM  products WHERE product_id = ?', [product_id], function (err, row30) {
                                                            var company_id = row30[0].company_id;
                                                            connection.query('SELECT * FROM products WHERE company_id = ? AND stock> 0', [company_id], function (err, row21) {
                                                                connection.query('SELECT * FROM company WHERE company_id = ?', [company_id], function (err, row22) {
                                                                    connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row24) {
                                                                        if (row24.length > 0) {
                                                                            const oder_id = (row24[0].order_id + 1);
                                                                            connection.query('SELECT products.product_id,products.product_name,oderlist.units FROM products INNER JOIN oderlist ON products.product_id = oderlist.item_id WHERE products.company_id = ? AND oderlist.oder_id=?', [company_id, oder_id], function (err, row23) {
                                                                                res.render('orderitemscompanies', {
                                                                                    products: row21,
                                                                                    company: row22,
                                                                                    list: row23
                                                                                });
                                                                            })
                                                                        } else {
                                                                            res.render('orderitemscompanies', {
                                                                                products: row21,
                                                                                company: row22
                                                                            });
                                                                        }


                                                                    });
                                                                    /*console.log(row1);
    
                                                                    console.log(row2);
                                                                    res.render('orderitemscompanies', {products:row1 , company:row2});*/
                                                                });

                                                            });

                                                        })
                                                    })
                                                });
                                            });

                                        })
                                    }
                                    else {
                                        /*connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                            const item_name = row1[0].product_name;
                                            const price = row1[0].price * units;

                                            connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                const item_name = row1[0].product_name;
                                                const price = row1[0].price * units;

                                                connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price) VALUES (?,?,?,?,?)', [oder_id, product_id, units, item_name, price], function (err) {
                                                    if (err) throw err;
                                                    connection.query('SELECT * FROM  products WHERE product_id = ?', [product_id], function (err, row30) {
                                                        var company_id = row30[0].company_id;
                                                        connection.query('SELECT * FROM products WHERE company_id = ? AND stock> 0', [company_id], function (err, row21) {
                                                            connection.query('SELECT * FROM company WHERE company_id = ?', [company_id], function (err, row22) {
                                                                connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row24) {
                                                                    if (row24.length > 0) {
                                                                        const oder_id = (row24[0].order_id + 1);
                                                                        connection.query('SELECT products.product_id,products.product_name,oderlist.units FROM products INNER JOIN oderlist ON products.product_id = oderlist.item_id WHERE products.company_id = ? AND oderlist.oder_id=?', [company_id, oder_id], function (err, row23) {
                                                                            res.render('orderitemscompanies', {
                                                                                products: row21,
                                                                                company: row22,
                                                                                list: row23
                                                                            });
                                                                        })
                                                                    } else {
                                                                        res.render('orderitemscompanies', {
                                                                            products: row21,
                                                                            company: row22
                                                                        });
                                                                    }


                                                                });
                                                                /*console.log(row1);
    
                                                                console.log(row2);
                                                                res.render('orderitemscompanies', {products:row1 , company:row2});*/
                                                            /*});

                                                        });

                                                    })
                                                });
                                            });
                                        })*/
                                    }
                                }
                                else {
                                    var low_date5 = row15[0].ex_date;
                                    console.log(low_date5);
                                    for (var i = 0; i < row15.length; i++) {
                                        if (row15[i].ex_date < low_date5) {
                                            low_date5 = row15[i].ex_date;

                                        }
                                    }
                                    console.log(low_date5);
                                    console.log(product_id);
                                    connection.query('SELECT * FROM stock WHERE product_id = ? AND ex_date = ?', [product_id, low_date5], function (err, row20) {
                                        console.log("bhnb");
                                        console.log(row20);
                                        var th_stock = row20[0].qty;
                                        var no_stock = th_stock - units;
                                        var batch_id = row20[0].batch_No;
                                        if (no_stock === 0) {
                                            connection.query('DELETE FROM stock WHERE product_id = ? AND ex_date = ?', [product_id, low_date5], function (err) {
                                                connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                    const item_name = row1[0].product_name;
                                                    const price = row1[0].price * units;

                                                    connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,batch_No) VALUES (?,?,?,?,?,?)', [oder_id, product_id, units, item_name, price, batch_id], function (err) {
                                                        if (err) throw err;
                                                        connection.query('SELECT * FROM  products WHERE product_id = ?', [product_id], function (err, row30) {
                                                            var company_id = row30[0].company_id;
                                                            connection.query('SELECT * FROM products WHERE company_id = ? AND stock> 0', [company_id], function (err, row21) {
                                                                connection.query('SELECT * FROM company WHERE company_id = ?', [company_id], function (err, row22) {
                                                                    connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row24) {
                                                                        if (row24.length > 0) {
                                                                            const oder_id = (row24[0].order_id + 1);
                                                                            connection.query('SELECT products.product_id,products.product_name,oderlist.units FROM products INNER JOIN oderlist ON products.product_id = oderlist.item_id WHERE products.company_id = ? AND oderlist.oder_id=?', [company_id, oder_id], function (err, row23) {
                                                                                res.render('orderitemscompanies', {
                                                                                    products: row21,
                                                                                    company: row22,
                                                                                    list: row23
                                                                                });
                                                                            })
                                                                        } else {
                                                                            res.render('orderitemscompanies', {
                                                                                products: row21,
                                                                                company: row22
                                                                            });
                                                                        }


                                                                    });
                                                                    /*console.log(row1);
    
                                                                    console.log(row2);
                                                                    res.render('orderitemscompanies', {products:row1 , company:row2});*/
                                                                });

                                                            });

                                                        })
                                                    })
                                                });

                                            })
                                        }
                                        else if (no_stock > 0) {
                                            connection.query('UPDATE stock set qty = ? WHERE product_id = ? AND ex_date = ?', [no_stock, product_id, low_date5], function (err) {

                                                connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                    const item_name = row1[0].product_name;
                                                    const price = row1[0].price * units;

                                                    connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,batch_No) VALUES (?,?,?,?,?,?)', [oder_id, product_id, units, item_name, price, batch_No], function (err) {
                                                        if (err) throw err;
                                                        connection.query('SELECT * FROM  products WHERE product_id = ?', [product_id], function (err, row30) {
                                                            var company_id = row30[0].company_id;
                                                            connection.query('SELECT * FROM products WHERE company_id = ? AND stock> 0', [company_id], function (err, row21) {
                                                                connection.query('SELECT * FROM company WHERE company_id = ?', [company_id], function (err, row22) {
                                                                    connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row24) {
                                                                        if (row24.length > 0) {
                                                                            const oder_id = (row24[0].order_id + 1);
                                                                            connection.query('SELECT products.product_id,products.product_name,oderlist.units FROM products INNER JOIN oderlist ON products.product_id = oderlist.item_id WHERE products.company_id = ? AND oderlist.oder_id=?', [company_id, oder_id], function (err, row23) {
                                                                                res.render('orderitemscompanies', {
                                                                                    products: row21,
                                                                                    company: row22,
                                                                                    list: row23
                                                                                });
                                                                            })
                                                                        } else {
                                                                            res.render('orderitemscompanies', {
                                                                                products: row21,
                                                                                company: row22
                                                                            });
                                                                        }


                                                                    });
                                                                    /*console.log(row1);
    
                                                                    console.log(row2);
                                                                    res.render('orderitemscompanies', {products:row1 , company:row2});*/
                                                                });

                                                            });

                                                        })
                                                    })
                                                });

                                            })


                                        }
                                        else {
                                            connection.query('Delete stock WHERE product_id = ? AND ex_date = ?', [product_id, low_date5], function (err) {
                                                var pres_stock = units - th_stock ;
                                                connection.query('SELECT * FROM stock WHERE product_id = ?', [product_id], function (err, row16) {
                                                    
                                                    if (row16.length === 1) {
                                                        batch_id2 = row16[0].batch_No;
                                                        if (row16[0].qty > pres_stock) {
                                                            var rem_stock = pres_stock - row16[0].qty;
                                                            connection.query('UPDATE stock SET qty = ? WHERE product_id = ?', [rem_stock, product_id], function (err) {
                                                                connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                                    const item_name = row1[0].product_name;
                                                                    const price1 = row1[0].price * th_stock;
                                                                    const price2 = row1[0].price * pres_stock;
                                                                    connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,batch) VALUES (?,?,?,?,?,?)', [oder_id, product_id, th_stock, item_name, price1, batch_id], function (err) {
                                                                        connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,batch) VALUES (?,?,?,?,?,?)', [oder_id, product_id, pres_stock, item_name, price2, batch_id2], function (err) {


                                                                            if (err) throw err;
                                                                            connection.query('SELECT * FROM  products WHERE product_id = ?', [product_id], function (err, row30) {
                                                                                var company_id = row30[0].company_id;
                                                                                connection.query('SELECT * FROM products WHERE company_id = ? AND stock> 0', [company_id], function (err, row21) {
                                                                                    connection.query('SELECT * FROM company WHERE company_id = ?', [company_id], function (err, row22) {
                                                                                        connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row24) {
                                                                                            if (row24.length > 0) {
                                                                                                const oder_id = (row24[0].order_id + 1);
                                                                                                connection.query('SELECT products.product_id,products.product_name,oderlist.units FROM products INNER JOIN oderlist ON products.product_id = oderlist.item_id WHERE products.company_id = ? AND oderlist.oder_id=?', [company_id, oder_id], function (err, row23) {
                                                                                                    res.render('orderitemscompanies', {
                                                                                                        products: row21,
                                                                                                        company: row22,
                                                                                                        list: row23
                                                                                                    });
                                                                                                })
                                                                                            } else {
                                                                                                res.render('orderitemscompanies', {
                                                                                                    products: row21,
                                                                                                    company: row22
                                                                                                });
                                                                                            }


                                                                                        });
                                                                                        /*console.log(row1);
        
                                                                                        console.log(row2);
                                                                                        res.render('orderitemscompanies', {products:row1 , company:row2});*/
                                                                                    });

                                                                                });

                                                                            })
                                                                        })
                                                                    });
                                                                })
                                                            })
                                                        }

                                                    } else if (row16.length > 1) {
                                                        var low_date6 = row16[0].ex_date;
                                                        for (var i = 1; i < row16.length; i++) {
                                                            if (row16[i].ex_date < low_date6) {
                                                                low_date6 = row16[i].ex_date;
                                                            }
                                                        }
                                                        connection.query('SELECT * FROM stock WHERE product_id = ? AND ex_date = ?', [product_id, low_date6], function (err, row17) {
                                                            batch_id4 = row17[0].batch_No;
                                                            nowl_stock = row17[0].qty - pres_stock;
                                                            connection.query('Update stock SET qty = ? WHERE product_id = ? AND ex_date = ?', [nowl_stock, product_id, low_date6], function (err) {
                                                                connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                                                                    const item_name = row1[0].product_name;
                                                                    const price1 = row1[0].price * th_stock;
                                                                    const price2 = row1[0].price * pres_stock;
                                                                    connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,batch_id) VALUES (?,?,?,?,?,?)', [oder_id, product_id, th_stock, item_name, price1, batch_id], function (err) {
                                                                        connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price,batch_id) VALUES (?,?,?,?,?,?)', [oder_id, product_id, th_stock, item_name, price1, batch_id], function (err) {
                                                                            connection.query('SELECT * FROM  products WHERE product_id = ?', [product_id], function (err, row30) {
                                                                                var company_id = row30[0].company_id;
                                                                                connection.query('SELECT * FROM products WHERE company_id = ? AND stock> 0', [company_id], function (err, row21) {
                                                                                    connection.query('SELECT * FROM company WHERE company_id = ?', [company_id], function (err, row22) {
                                                                                        connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row24) {
                                                                                            if (row24.length > 0) {
                                                                                                const oder_id = (row24[0].order_id + 1);
                                                                                                connection.query('SELECT products.product_id,products.product_name,oderlist.units FROM products INNER JOIN oderlist ON products.product_id = oderlist.item_id WHERE products.company_id = ? AND oderlist.oder_id=?', [company_id, oder_id], function (err, row23) {
                                                                                                    res.render('orderitemscompanies', {
                                                                                                        products: row21,
                                                                                                        company: row22,
                                                                                                        list: row23
                                                                                                    });
                                                                                                })
                                                                                            } else {
                                                                                                res.render('orderitemscompanies', {
                                                                                                    products: row21,
                                                                                                    company: row22
                                                                                                });
                                                                                            }


                                                                                        });
                                                                                        /*console.log(row1);
        
                                                                                        console.log(row2);
                                                                                        res.render('orderitemscompanies', {products:row1 , company:row2});*/
                                                                                    });

                                                                                });

                                                                            })
                                                                        })
                                                
                                                                    })
                                                                });
                                                            })
                                                        })
                                                    }

                                                })

                                            })

                                        }

                                    })
                                }


                            })


                            /*connection.query('SELECT * FROM products WHERE product_id = ?',[product_id],function(err,row1){
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
                        }*/

                        } else {
                            console.log("stoke empty");
                        }


                    }


                })
            })
        }
        else {
             res.redirect('back');
        }
       
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

});*/

router.post('/abcdef:id', function (req, res) {
    connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row) {
        const oder_id = (row[0].order_id + 1);
        console.log(oder_id);
        const units = req.body.units;
        var product_id = req.params.id;
        connection.query('SELECT * FROM  products WHERE product_id = ?', [product_id], function (err, row2) {

            var stock = parseInt(row2[0].stock);

            connection.query('SELECT * FROM oderlist WHERE oder_id = ? AND item_id=?', [oder_id, product_id], function (err, row3) {
                if (row3.length > 0) {
                    var pre_stock = parseInt(row3[0].units);
                    var bill_stock = parseInt(units) + parseInt(pre_stock)
                    var new_stock = parseInt(stock) - (parseInt(units) + parseInt(pre_stock));
                    console.log(new_stock);
                    if (new_stock >= 0) {
                        connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                            const pre_price = row3[0].price;
                            const item_name = row1[0].product_name;
                            const price = row1[0].price * bill_stock;
                            connection.query('UPDATE oderlist SET price = ? ,units = ? WHERE oder_id=? AND item_id=?', [price, bill_stock, oder_id, product_id], function (err, result) {
                                if (err) throw err;
                                res.redirect('back');
                            })
                        })
                    }
                    else {
                        res.redirect('back');
                    }
                } else {


                    new_stock = stock - units;
                    if (new_stock >= 0) {
                        connection.query('SELECT * FROM products WHERE product_id = ?', [product_id], function (err, row1) {
                            const item_name = row1[0].product_name;
                            const price = row1[0].price * units;

                            connection.query('INSERT INTO oderlist(oder_id,item_id,units,item_name,price) VALUES (?,?,?,?,?)', [oder_id, product_id, units, item_name, price], function (err) {
                                if (err) throw err;
                                res.redirect('/order');
                            })
                        });
                    }
                    else {
                        res.redirect('back');
                    }
                }
            })
        })





    })

});


router.get('/deleteorder:id', function (req, res) {
    const item_id = req.params.id;
    connection.query('SELECT * FROM payment ORDER BY oder_id DESC LIMIT 1', function (err, row) {
        const oder_id = (row[0].order_id + 1);
        connection.query('DELETE FROM oderlist WHERE item_id =? AND oder_id =?', [item_id, oder_id], function (err) {
            if (err) throw err;
            res.redirect('/order');
        })
    })
})

/*Router.get('/newproduct',function(req, res){
  connection.query('SELECT * FROM products WHERE special_list = 1',function(err,rows){

  })
})*/

router.get('/cansaleOrder', function (req, res, next) {
    connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row) {
        const oder_id = (row[0].order_id + 1);
        connection.query('DELETE FROM oderlist WHERE oder_id = ?', [oder_id], function (err) {
            if (err) throw err;
            res.redirect('/order');
        })
    })
})

router.post('/updatelist:id', function (req, res) {
    connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row) {
        const oder_id = (row[0].order_id + 1);
        console.log(oder_id);
        const units = req.body.units;
        var product_id = req.params.id;
        connection.query('SELECT * FROM  products WHERE product_id = ?', [product_id], function (err, row2) {
            stock = row2[0].stock;
            new_stock = stock - units;
            if (new_stock >= 0) {
                connection.query('SELECT * FROM products WHERE product_id =?', [product_id], function (err, row1) {
                    const unit_price = row1[0].price;
                    const price = units * unit_price;
                    connection.query('UPDATE oderlist SET units=? , price=? WHERE oder_id =? AND item_id =?', [units, price, oder_id, product_id], function (err, result) {
                        if (err) throw err;
                        res.redirect('/order');

                    })
                })
            } else {
                res.redirect('back');
            }

        })
    })
})

router.get('/uploadimage', function (req, res, next) {
    res.render('pra/pratice');
})

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


router.post('/adduser', function (req, res) {
    upload(req, res, function (err) {
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
        const register_no = req.body.register_no;
        const password = req.body.password;
        const repassword = req.body.repassword;
        const Lat = req.body.Lat;
        const logo = '../upload/' + req.files[0].filename
        const Lon = req.body.Lon;
        var err_pharmacy = null;
        var err_address = null;
        var err_email = null;
        var err_tel = null;
        var err_reg = null;
        var err_password = null;
        var err_re = null;
        var err_log = null;
        ;
        if (pharmacy_name) {
            err_pharmacy = null;
        } else {
            console.log("fhur");
            err_pharmacy = "Pharmacy Name is Require";
        }
        if (address) {
            err_address = null;
        } else {
            err_address = "Pharmacy Address is Require";
        }
        if (register_no) {
            err_reg = null;
        } else {
            err_reg = "Registion Number is Require";
        }
        if (password) {
            err_password = null;
        } else {
            err_password = "Password is Require";
        }
        if (repassword) {
            err_re = null;
        } else {
            err_re = "Reenter Password is Require";
        }
        if (validateEmail(email)) {
            err_email = null;
        }
        else {
            err_email = "Worng email"
        }
        if (tel_number.length === 10) {
            err_tel = null;
        }
        else {
            err_tel = "Worng Tel Number"
        }








        if (err_address == null && err_email == null && err_password == null && err_log == null && err_password == null && err_pharmacy == null && err_re == null && err_reg == null && err_tel == null) {
            con.connect(function (err) {
                if (err) throw err;
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    //console.log("Connected!");
                    //var sql = "INSERT INTO user SET ?";
                    con.query('INSERT INTO users(pharmacy_name,address,email,tel_number,register_no,password,Lat,Lon,logo) VALUES (?,?,?,?,?,?,?,?,?)', [pharmacy_name, address, email, tel_number, register_no, hash, Lat, Lon, logo], function (err, result) {
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
        else {
            //res.redirect('/');
            
            res.render('contact', { title: 'Express', title1: 'Registration', err_pharmacy: err_pharmacy, err_address: err_address, err_reg: err_reg, err_password: err_password, err_re: err_re, pharmacy_name: pharmacy_name, address: address, email: email, tel_number: tel_number, register_no: register_no, err_email: err_email, err_tel: err_tel, logo: logo, falier:true });
            
        }


    });

})

/*router.post('/login', passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/login',
    //failureFlash:true
}),
    function (req, res) {
        res.redirect('/');
    }
);*/
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    //failureFlash:true
}),
    
    function (req, res) {
        console.log(req.user.user_id);
        if (req.user.user_id === 8) {
            //console.log("hmm");
            res.redirect('/admin');
        }
        else{
           // console.log("ok");
           res.redirect('/index');
        }
    }
)
router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/login')
    }
    res.redirect('/login')

}

passport.serializeUser(function (user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function (user_id, done) {

    done(null, user_id);

});

router.get('/listcompany', function (req, res, next) {
    connection.query('SELECT * FROM company', function (err, rows) {
        console.log(rows);
        res.render('admin/Companies/list_company', { layout: 'admin', companies: rows });

    })
    //res.render('admin/Companies/list_company',{layout: 'admin'});
})

router.get('/viewspecial:id', function (req, res, next) {
    product_id = req.params.id;
    connection.query('SELECT * FROM products WHERE product_id=?', [product_id], function (err, rows) {
        console.log(rows)
        res.render('special', { product: rows });
    })
})

router.get('/viewcompany:id', function (req, res, next) {
    company_id = req.params.id;
    console.log(company_id);
    connection.query('SELECT * FROM company WHERE company_id=?', [company_id], function (err, rows) {
        connection.query('SELECT * FROM products WHERE company_id = ?', [company_id], function (err, row1) {
            res.render('viewcompany', { company: rows, products: row1 })
        })

    })
})

router.post('/searchcompany', function (req, res, next) {
    company_name = req.body.srch;
    connection.query('SELECT * FROM company WHERE company_name LIKE ?', ['%' + company_name + '%'], function (err, row) {
        if (row.length = 1) {
            console.log(row);
            var company_id = row[0].company_id;
            connection.query('SELECT * FROM company WHERE company_id=?', [company_id], function (err, rows) {
                connection.query('SELECT * FROM products WHERE company_id = ?', [company_id], function (err, row1) {
                    res.render('orderproduct', { company: rows, products: row1 })
                })

            })

        }
        else {
            res.redirect('/');
        }
    })
})

router.get('/search', function (req, res) {
    connection.query('SELECT * FROM product WHERE product_name LIKE = ? ', ["%" + req.query.key + "%"], function (err, rows) {
        if (err) throw err;
        var data = [];
        for (i = 0; i < rows.length; i++) {
            data.push(rows[i].product_name);
        }
        res.end(JSON.stringify(data));
    })
})
router.get('/myaccount', function (req, res) {
    const user_id = req.user.user_id;
    connection.query('SELECT * FROM users WHERE user_id=?', [user_id], function (err, rows) {
        connection.query('SELECT * FROM payment WHERE user_id=? AND approval=?', [user_id, 0], function (err, row1) {
            connection.query('SELECT * FROM payment WHERE user_id=? AND approval=?', [user_id, 1], function (err, row2) {
                connection.query('SELECT * FROM discuss WHERE user_id = ? ', [user_id], function (err, row3) {
                    res.render('account', { layout: 'profile', user: rows, oders: row1, apoder: row2 , discuss:row3})
                })

                

            })
        })
    })



})

router.get('/view_order:id', function (req, res, next) {
    var total = 0;
    var oder_id = req.params.id;
    console.log(oder_id);
    connection.query('SELECT products.product_name, products.brand, products.price AS unit_price, oderlist.units, oderlist.price, stock.ex_date, stock.batch_No FROM products, oderlist, stock WHERE stock.batch_No = oderlist.batch_id AND products.product_id = oderlist.item_id AND oderlist.oder_id = ?', [oder_id], function (err, rows) {
        connection.query('SELECT * FROM payment WHERE order_id = ?', [oder_id], function (err, row) {
            for (var i = rows.length - 1; i >= 0; i--) {
                total = total + rows[i].price;
            }
            discount = row[0].discount;
            discount_value = (discount * total)/100;
            amount = total - discount_value;

            console.log(total);
            res.render('vieworder', { layout: 'profile', oder: rows, price: total, oder_id: oder_id, discount: discount, discount_value: discount_value, amount: amount })
        })
    })

        })
        

router.post('/upload_invoice:id', function (req, res, next) {
    const order_id = req.params.id;
    upload(req, res, function (err) {
        if (err) {
            consol.log('erro');

        }
        const invoice = '../upload/' + req.files[0].filename;

        connection.query('UPDATE payment SET invoice = ? WHERE order_id = ?', [invoice, order_id], function (err, row) {
            connection.query('SELECT * FROM payment WHERE order_id = ?', [order_id], function (err, row3) {
                var user_id = row3[0].user_id;

                connection.query('SELECT * FROM users WHERE user_id=?', [user_id], function (err, rows) {
                    connection.query('SELECT * FROM payment WHERE user_id=? AND approval=?', [user_id, 0], function (err, row1) {
                        connection.query('SELECT * FROM payment WHERE user_id=? AND approval=?', [user_id, 1], function (err, row2) {

                            res.render('admin/Users/user_profile', {
                                layout: 'admin',
                                user: rows,
                                oders: row1,
                                apoder: row2
                            })

                        })
                    })
                })
            })
        })
    })
})

router.get('/date', function (req, res, next) {
    connection.query('SELECT * FROM stock WHERE product_id = ?', [10], function (err, rows) {
        console.log(rows[0].ex_date);
        var low_date5 = rows[0].ex_date;

        console.log(low_date5);
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].ex_date < low_date5) {
                low_date5 = rows[i].ex_date;
            }
        }
        connection.query('SELECT * FROM stock WHERE product_id = ? AND ex_date = ?', [10, low_date5], function (err, row) {
            console.log(row);
        })

    })

})

router.get('/update_order:id', function (req, res, next) {
    var oder_id = req.params.id;
    var total = 0;
    connection.query('SELECT * FROM company', function (err, rows) {
        connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row1) {
            //const oder_id = (row1[0].order_id + 1);
            //console.log(oder_id);
            connection.query('SELECT products.product_id, products.product_name, products.brand, products.price, oderlist.units, oderlist.price, stock.ex_date, stock.batch_No FROM products, oderlist, stock WHERE stock.batch_No = oderlist.batch_id AND products.product_id = oderlist.item_id AND oderlist.oder_id = ? ', [oder_id], function (err, row) {
                for (var i = row.length - 1; i >= 0; i--) {
                    total = total + row[i].price;
                }
                console.log(total)
                res.render('order', { companys: rows, items: row, price: total });
            })
        })

        //console.log(rows);
        //res.render('order', {companys:rows, });

    })
})

router.get('/sameorder:id', function (req, res, next) {
    var oder_id = req.params.id;
    var total = 0;
    connection.query('SELECT * FROM company', function (err, rows) {
        connection.query('SELECT * FROM payment ORDER BY order_id DESC LIMIT 1', function (err, row1) {
            //const oder_id = (row1[0].order_id + 1);
            //console.log(oder_id);
            connection.query('SELECT products.product_id, products.product_name, products.brand, products.price, oderlist.units, oderlist.price, stock.ex_date, stock.batch_No FROM products, oderlist, stock WHERE stock.batch_No = oderlist.batch_id AND products.product_id = oderlist.item_id AND oderlist.oder_id = ? ', [oder_id], function (err, row) {
                for (var i = row.length - 1; i >= 0; i--) {
                    total = total + row[i].price;
                }
                console.log(total)
                res.render('order', { companys: rows, items: row, price: total });
            })
        })

        //console.log(rows);
        //res.render('order', {companys:rows, });

    })

})

router.get('/back', function (req, res, next) {
    res.redirect('/myaccount');
})

router.get('/updatedetails:id', function (req, res, next) {
    var user_id = req.params.id;
    connection.query('SELECT * FROM users WHERE user_id = ?', [user_id], function (err, rows) {
        res.render('updatedetalis', {user : rows})
    })
})

router.post('/updateusers:id', function (req, res, next) {
    const user_id = req.params.id;
    const user_name = req.body.name;
    const address = req.body.address;
    const email = req.body.email;
    const tel_number = req.body.tel_number;
    console.log(user_name);
    console.log(user_id);
    console.log(address);
    connection.query('UPDATE  users SET pharmacy_name = ? , address = ?, email = ?, tel_number = ? WHERE user_id = ?', [user_name, address, email, tel_number, user_id], function (err, rows) {
        if (err) throw err;
        res.redirect('/myaccount');
    })
})

router.get('/complain', function (req, res, next) {
    //console.log('kr');
    res.render('complain');
})

router.post('/discussion', function (req, res, next) {
    const user_id = req.user.user_id;
    const type = req.body.gender;
    const subject = req.body.subject;
    const details = req.body.userMsg;
    
    connection.query('Insert INTO discuss(user_id,type,subject,details,sent_date) VALUES(?,?,?,?,CURDATE())', [user_id, type, subject, details], function (err, rows) {
        res.redirect('back');
    } )
})

router.get('/notification', function (req, res, next) {
    user_id = req.user.user_id;
    console.log(user_id);
    connection.query('SELECT * FROM payment WHERE approval = 1 AND seen = 0 AND user_id = ?', [user_id], function (err, rows) {
        connection.query('SELECT * FROM discuss WHERE reply IS NOT null AND reply_seen = 0 AND user_id = ? ', [user_id], function (err, row1) {
            console.log(row1);
            res.render('notification', { layout: 'profile', noti: rows, dis:row1});
        })
        
    })
   
})

router.get('/viewreply:id', function (req, res, next) {
    const dis_id = req.params.id;
    connection.query('SELECT * FROM discuss WHERE dis_id = ?', [dis_id], function (err, rows) {
        connection.query('UPDATE discuss SET reply_seen = 0 WHERE dis_id =?', [dis_id], function (err, row) {
            res.render('reply', { reply: rows });
        })
       
    })
   
})

router.get('/appvieworder:id', function (req, res, next) {
    var total = 0;
    var oder_id = req.params.id;
    console.log(oder_id);
    connection.query('SELECT products.product_name, products.brand, products.price AS unit_price, oderlist.units, oderlist.price, stock.ex_date, stock.batch_No FROM products, oderlist, stock WHERE stock.batch_No = oderlist.batch_id AND products.product_id = oderlist.item_id AND oderlist.oder_id = ?', [oder_id], function (err, rows) {
        connection.query('UPDATE payment SET seen = 1 WHERE order_id = ?', [oder_id], function (err, roww) {
            connection.query('SELECT * FROM payment WHERE order_id = ?', [oder_id], function (err, row) {
                for (var i = rows.length - 1; i >= 0; i--) {
                    total = total + rows[i].price;
                }
                discount = row[0].discount;
                discount_value = (discount * total) / 100;
                amount = total - discount_value;

                console.log(total);
                res.render('appvieworder', { layout: 'profile', oder: rows, price: total, oder_id: oder_id, discount: discount, discount_value: discount_value, amount: amount, details: row })
            })
        })
       
    })
})

module.exports = router;
//SELECT products.product_name, products.brand, products.price, oderlist.units, oderlist.price, stock.ex_date, stock.batch_No FROM products, oderlist, stock WHERE stock.batch_No = oderlist.batch_id AND products.product_id = oderlist.item_id AND oderlist.oder_id = 101