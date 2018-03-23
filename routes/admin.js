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
  res.render('admin/basic', {title: 'Express',layout:'admin'})

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





module.exports = router;
