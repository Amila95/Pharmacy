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

module.exports = router;
