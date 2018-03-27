var express = require('express');
var router = express.Router();
var passport = require('passport');
var LacalStrategy = require('passport-local').Strategy;
var connection = require('../config/connection');
var bcrypt = require('bcrypt');
var multer = require('multer');
var bodyParser = require('body-parser');

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
 }).any()

router.get('/', function(req, res, next) {
	connection.query('SELECT * FROM recodes WHERE approval = ?',[0],function(err,rows){
		var num = rows.length;
		connection.query('SELECT * FROM  users WHERE approval =?',[0],function(err,row1){
			var num1 = row1.length;
			res.render('admin/basic', {title: 'Express',layout:'admin',notification:num, oder:rows, notification1:num1,user:row1})
		})
		
		
	})
	

});
router.get('/addcompany', function(req, res, next){
	res.render('admin/Companies/add_company',{layout: 'admin'})
});

router.post('/addcompany', function(req, res, next){
	upload(req, res, function(err) {
         if (err) {
         	consol.log('erro');
            
         }

         
	const company_name = req.body.name;
	const company_address = req.body.address;
	const email = req.body.email;
	const contact_number = req.body.phone_number;
	const discription = req.body.discreption;
	const company_logo = '../upload/'+req.files[0].filename;

	console.log(company_name);
	console.log(company_logo);

	connection.query('INSERT INTO company(company_name,  company_email, company_contact_no, company_address, company_logo, company_discription) VALUES (?,?,?,?,?,?)',[company_name,email,contact_number,company_address,company_logo,discription],function(err){
		if(err) throw err;
		res.redirect('back');
	
	})
})
})

router.get('/listcompany', function(req, res, next){
	connection.query('SELECT * FROM company', function(err, rows){
		console.log(rows);
		res.render('admin/Companies/list_company',{layout: 'admin', companies: rows});

	})
	//res.render('admin/Companies/list_company',{layout: 'admin'});
})

router.get('/view_company_profile:id', function(req, res, next){
	var company_id = req.params.id;
	connection.query('SELECT * FROM company WHERE company_id = ?',[company_id], function(err, rows){
	res.render('admin/Companies/company_profile', {layout: 'admin', companies: rows})
	
	})
})

router.get('/update_company_profile:id', function(req, res, next){
	var company_id = req.params.id;
	connection.query('SELECT * FROM company WHERE company_id = ?',[company_id], function(err, rows){
	res.render('admin/Companies/update_company', {layout: 'admin', companies: rows})

})
})

router.post('/updatecompany:id', function(req, res, next){
	var company_id = req.params.id;
	const company_name = req.body.name;
	const company_address = req.body.address;
	const email = req.body.email;
	const contact_number = req.body.phone_number;
	const discription = req.body.discreption;
	connection.query('UPDATE company SET company_name= ?,company_address= ?,company_discription= ?,company_email= ?,company_contact_no= ? WHERE company_id= ? ', [company_name,company_address,discription,email,contact_number,company_id], function(err,results){
		if(err) throw err;

		res.redirect('/listcompany');
	})

})

router.get('/listuser', function(req, res, next){
	connection.query('SELECT * FROM users', function(err, rows){
		res.render('admin/Users/list_users', {layout: 'admin', users: rows})
	})
})

router.get('/view_user_profile:id', function(req, res,next){
	var user_id = req.params.id;
	connection.query('SELECT * FROM users WHERE user_id=?',[user_id], function(err, rows){
		connection.query('SELECT * FROM recodes WHERE user_id=? AND approval=?',[user_id,0], function(err,row1){
			connection.query('SELECT * FROM recodes WHERE user_id=? AND approval=?',[user_id,1], function(err,row2){
				
				res.render('admin/Users/user_profile', {layout: 'admin', user:rows, oders:row1, apoder:row2})
	
		})
		})
	})
})

router.get('/view_order:id', function(req,res,next){
	var total = 0;
	var oder_id = req.params.id;
	console.log(oder_id);
	connection.query('SELECT * FROM oderlist WHERE oder_id=?',[oder_id], function(err,rows){
		for (var i = rows.length - 1; i >= 0; i--) {
			total = total + rows[i].price;
		}
		console.log(total);
		res.render('admin/Users/view_oder', {layout: 'admin', oder:rows, price:total, oder_id:oder_id})
	})
})

router.get('/approval:id',function(req,res,next){
	var total = 0;
	var oder_id = req.params.id;
	connection.query('UPDATE recodes SET approval=? WHERE oder_id=? ',[ 1,oder_id], function(err,rows){
		connection.query('SELECT * FROM recodes WHERE oder_id=?',[oder_id], function(err,row1){
			user_id = row1[0].user_id;
			connection.query('SELECT * FROM Users WHERE user_id= ?',[user_id], function(err, row2){
				connection.query('SELECT * FROM oderlist WHERE oder_id=?',[oder_id], function(err,row3){
					for (var i = row3.length - 1; i >= 0; i--) {
							total = total + row3[i].price;
					}
					connection.query('INSERT INTO approval(oder_id) VALUES(?)',[oder_id], function(err,result){
					if(err) throw err;
					res.render('admin/Users/invoice',{layout:'admin', oder:row1, user:row2, bill:row3, price:total});

				})
			})
		})
		

		})
	})
})


router.get('/add_product',function(req,res,next){
	connection.query('SELECT * FROM company', function(err,rows){
		res.render('admin/Products/add_product',{layout:'admin', company:rows});

	})
})

router.post('/addproduct',function(req,res,next){
	upload(req, res, function(err) {
         if (err) {
         	consol.log('erro');
            
         }
    const product_name = req.body.name;
    const company_id = req.body.company_id;
    const product_details = req.body.product_details;
    const price = req.body.price;
    const model = req.body.model;
    const weight = req.body.weight;
    const unit_stock = req.body.unit_stock;
    const Image = '../upload/'+req.files[0].filename;

    connection.query('INSERT INTO products(product_name,company_id,product_details,price,model,weight,unit_stock,Image,special_list) VALUES(?,?,?,?,?,?,?,?,?)',[product_name,company_id,product_details,price,model,weight,unit_stock,Image,0],function(err){
    	if(err) throw err;
    	res.redirect('back');
    })

})
})

router.get('/listproduct',function(req,res,next){
	connection.query('SELECT * FROM products', function(err,rows){
		res.render('admin/Products/list_product',{layout:'admin', products:rows})
	})
})

router.get('/view_product_profile:id',function(req,res,next){
		var product_id = req.params.id;
		connection.query('SELECT * FROM products WHERE product_id = ?',[product_id], function(err,rows){
		res.render('admin/Products/profile_product', {layout:'admin',product:rows})
	})
})

router.get('/update_product_profile:id',function(req,res,rows){
	var product_id = req.params.id;
	connection.query('SELECT * FROM products WHERE product_id = ?',[product_id], function(err,rows){
		res.render('admin/Products/update_product', {layout:'admin',product:rows})
	})
})

router.post('/updateproduct:id',function(req,res,rows){
	
     
	var product_id = req.params.id;
	const product_name = req.body.name;
    const product_details = req.body.model;
    const price = req.body.price;
    const model = req.body.model;
    const weight = req.body.weight;
    const unit_stock = req.body.unit_stock;

    

    connection.query('UPDATE products SET product_name= ?,product_details= ?,price= ?,model= ?,weight= ?,unit_stock= ? WHERE product_id= ? ', [product_name,product_details,price,model,weight,unit_stock,product_id],function(err,results){
    
    	res.redirect('/admin/listproduct');

    
})
})

router.get('/specialproduct', function(req,res,rows){

	connection.query('SELECT * FROM products', function(err,rows){
		res.render('admin/Products/special_products',{layout:'admin',products:rows})
	})
})

router.get('/special_product:id',function(req,res,rows){
	var product_id = req.params.id;
	connection.query('UPDATE products SET special_list=? WHERE product_id =?',[1,product_id],function(err,row2){
		if(err) throw err;
    	res.redirect('back');
	})
})

router.get('/remove_special_product:id',function(req,res,rows){
	var product_id = req.params.id;
	connection.query('UPDATE products SET special_list=? WHERE product_id =?',[0,product_id],function(err,row2){
		if(err) throw err;
    	res.redirect('back');
	})
})

router.get('/new_product:id',function(req,res,rows){
	var product_id = req.params.id;
	connection.query('UPDATE products SET new_list=? WHERE product_id =?',[1,product_id],function(err,row2){
		if(err) throw err;
    	res.redirect('back');
	})
})

router.get('/remove_new_product:id',function(req,res,rows){
	var product_id = req.params.id;
	connection.query('UPDATE products SET new_list=? WHERE product_id =?',[0,product_id],function(err,row2){
		if(err) throw err;
    	res.redirect('back');
	})



})

router.get('/stock', function(req,res,rows){
	connection.query('SELECT * FROM products',function(err,rows){
		res.render('admin/Products/stock',{layout:'admin', products:rows})
	})
})

router.post('/addstock:id',function(req,res,rows){
	var product_id = req.params.id;
	var add_stock = parseInt(req.body.stock);
	var stock;
	connection.query('SELECT * FROM products WHERE product_id=?',[product_id],function(err,row2){
		var cur_stock = parseInt(row2[0].stock);
		stock = add_stock + cur_stock;
		connection.query('UPDATE products SET stock=? WHERE product_id=?',[stock,product_id],function(err,row2){
			res.redirect('/admin/stock');
		})
	})
	
})

router.post('/changestock:id',function(req,res){
	var product_id = req.params.id;
	var stock = parseInt(req.body.stock);
	
		connection.query('UPDATE products SET stock=? WHERE product_id=?',[stock,product_id],function(err,row2){
			res.redirect('/admin/stock');
		})
	});

router.get('/newuser:id',function(req,res){
	var user_id = req.params.id;
	
	connection.query('SELECT * FROM users WHERE user_id=?',[user_id], function(err,rows){
		res.render('admin/Users/new_users',{layout:'admin', user:rows})
	})
});

router.get('/accept:id',function(req,res){
	var user_id = req.params.id;
	console.log(user_id);
	connection.query('UPDATE users SET approval=? WHERE user_id=?',[1,user_id],function(err,row2){
		res.redirect('listuser');
	})
	
	
})

router.get('/currentstock',function(req,res){
	connection.query('SELECT * FROM products',function(err,rows){
		res.render('admin/Report/current_stock',{layout:'admin',products:rows})
	})
})

router.get('/report',function(req,res){
	res.render('admin/Report/dailynmonthly',{layout:'admin'})
})

router.post('/daliyreport',function(req,res){
	const date = req.body.date;
	console.log(date);
	connection.query('SELECT SUM(oderlist.units) AS units,oderlist.item_id,oderlist.item_name FROM oderlist INNER JOIN recodes ON oderlist.oder_id=recodes.oder_id WHERE recodes.orderd_time LIKE ? GROUP BY oderlist.oder_id ',[date+'%'],function(err,rows){
		console.log(rows);
		res.render('admin/Report/daily',{layout:'admin',recodes:rows})
	})
})

router.post('/monthlyreport',function(req,res){
	const date1 = req.body.date1;
	const date2 = req.body.date2;
	connection.query('SELECT SUM(oderlist.units) AS units,oderlist.item_id,oderlist.item_name FROM oderlist INNER JOIN recodes ON oderlist.oder_id=recodes.oder_id WHERE recodes.orderd_time BETWEEN  ? AND  ? GROUP BY oderlist.oder_id ',[date1,date2],function(err,rows){
		console.log(rows);
		res.render('admin/Report/daily',{layout:'admin',recodes:rows})
	})
})


//SELECT SUM(oderlist.units),oderlist.item_id,oderlist.item_name FROM oderlist INNER JOIN recodes ON oderlist.oder_id=recodes.oder_id WHERE recodes.orderd_time LIKE  GROUP BY oderlist.oder_id,recodes.oder_id



module.exports = router; 
 