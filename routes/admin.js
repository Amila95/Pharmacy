var express = require('express');
var router = express.Router();
var passport = require('passport');
var LacalStrategy = require('passport-local').Strategy;
var connection = require('../config/connection');
var bcrypt = require('bcrypt');
var multer = require('multer');
var bodyParser = require('body-parser');
var qr = require('qr-image');
var path = require('path'),
    fs = require('fs');
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

	/*var code = qr.image(new Date().toString(),{type:'png',size:20})
	code.pipe(fs.createWriteStream('public/upload/'+'MyQRCODE.png'));
	/*var code = qr.image(new Date().toString(), { type: 'svg' });
  	res.type('svg');
  	code.pipe(res);*/
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
		connection.query('SELECT * FROM products WHERE company_id=? AND (product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ?)',[company_id,'A%','B%','C%','D%','E%','F%','G%','H%','I%'],function(err,row1){
			connection.query('SELECT * FROM products WHERE company_id=? AND (product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? )',[company_id,'J%','K%','L%','M%','N%','O%','P%','Q%'],function(err,row2){
				connection.query('SELECT * FROM products WHERE company_id=? AND (product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ? OR product_name LIKE ?)',[company_id,'R%','S%','T%','U%','V%','W%','X%','Y%','Z%'],function(err,row3){
					res.render('admin/Companies/company_profile', {layout: 'admin', companies: rows, ae:row1, jq:row2,qz:row3});
				})
				
				
			})
			
		})
	
	
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
router.get('/preview_order:id', function(req,res,next){
	var total = 0;
	var oder_id = req.params.id;
	console.log(oder_id);
	connection.query('SELECT * FROM oderlist WHERE oder_id=?',[oder_id], function(err,rows){
		for (var i = rows.length - 1; i >= 0; i--) {
			total = total + rows[i].price;
		}
		console.log(total);
		res.render('admin/Users/preview_oder', {layout: 'admin', oder:rows, price:total, oder_id:oder_id})
	})
})


router.post('/approval:id',function(req,res,next){
	var total = 0;
	var oder_id = req.params.id;
	var date = req.body.date1;

	//const company_logo = '../upload/'+req.files[0].filename;
	var code = qr.image(new Date().toString(),{type:'png',size:20})
	code.pipe(fs.createWriteStream('public/upload/'+oder_id+'MyQRCODE1.png'));
	var qrim = ('../upload/'+oder_id+'MyQRCODE1.png');
	console.log(qrim);
	
	connection.query('UPDATE recodes SET approval=? WHERE oder_id=? ',[ 1,oder_id], function(err,rows){
		connection.query('SELECT * FROM recodes WHERE oder_id=?',[oder_id], function(err,row1){
			user_id = row1[0].user_id;
			connection.query('SELECT * FROM Users WHERE user_id= ?',[user_id], function(err, row2){
				connection.query('SELECT * FROM oderlist WHERE oder_id=?',[oder_id], function(err,row3){
					for (var i = row3.length - 1; i >= 0; i--) {
							total = total + row3[i].price;
					}
					connection.query('INSERT INTO approval(oder_id,Deliverdate,qrimage) VALUES(?,?,?)',[oder_id,date,qrim], function(err,result){
					if(err) throw err;
					res.render('admin/Users/invoice',{layout:'admin', oder:row1, user:row2, bill:row3, price:total, qrim:qrim});

				})
			})
		})
		

		})
	})
})

router.get('/approval:id',function(req,res,next){
	var total = 0;
	var oder_id = req.params.id;
	var date = req.body.date1;
	connection.query('UPDATE recodes SET approval=? WHERE oder_id=? ',[ 1,oder_id], function(err,rows){
		connection.query('SELECT * FROM recodes WHERE oder_id=?',[oder_id], function(err,row1){
			user_id = row1[0].user_id;
			connection.query('SELECT * FROM Users WHERE user_id= ?',[user_id], function(err, row2){
				connection.query('SELECT * FROM oderlist WHERE oder_id=?',[oder_id], function(err,row3){
					for (var i = row3.length - 1; i >= 0; i--) {
							total = total + row3[i].price;
					}
					connection.query('INSERT INTO approval(oder_id,Deliverdate) VALUES(?,?)',[oder_id,date], function(err,result){
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
		var mon;
		var se2,se1,se3,se4,se5;
		var month1,month2,month3,month4,month5;
		connection.query('SELECT * FROM products WHERE product_id = ?',[product_id], function(err,rows){
		connection.query('SELECT * FROM recodes ORDER BY orderd_time DESC LIMIT 1',function(err,row6){
		const date = String(row6[0].orderd_time);
		
		var arr = date.split(" ").map(function (date) {
  		return String(date);
  		
		});
		console.log(arr)
		switch(arr[1]){
			case "Jan":
			mon = 1;
			break;
			case "Feb":
			mon = 2;
			break;
			case "Mar":
			mon = 3;
			break;
			case "Apr":
			mon = 4;
			break;
			case "May":
			mon = 5;
			break;
			case "Jun":
			mon = 6;
			break;
			case "Jul":
			mon = 7;
			break;
			case "Aug":
			mon = 8;
			break;
			case "Sep":
			mon = 9;
			break;
			case "Oct":
			mon = 10;
			break;
			case "Nov":
			mon = 11;
			break;
			case "Dec":
			mon = 12;
			break;

		}
		premon1 = ((mon)%12);
		
		switch(premon1){
			case 0:
			se1='-12-';
			month1="December";
			break;
			case 1:
			se1='-01-';
			month1="January";
			break;
			case 2:
			se1='-02-';
			month1="Febaruy";
			break;
			case 3:
			month1="March";
			se1='-03-';
			break;
			case 4:
			se1='-04-';
			month1="April";
			break;
			case 5:
			se1='-05-';
			month1="May";
			break;
			case 6:
			se1='-06-';
			month1="June";
			break;
			case 7:
			se1='-07-';
			month1="July";
			break;
			case 8:
			se1='-08-';
			month1="Augest";
			break;
			case 9:
			se1='-09-';
			month1="September";
			break;
			case 10:
			se1='-10-';
			month1="Octomber";
			break;
			default:
			se1='-11-';
			month1="Novmber";
			break;
		}
		premon2=((mon-1)%12);
		switch(premon2){
			case 0:
			se2='-12-';
			month2="December";
			break;
			case 1:
			se2='-01-';
			month2="January";
			break;
			case 2:
			se2='-02-';
			month2="Febaruy";
			break;
			case 3:
			month2="March";
			se2='-03-';
			break;
			case 4:
			se2='-04-';
			month2="April";
			break;
			case 5:
			se2='-05-';
			month2="May";
			break;
			case 6:
			se2='-06-';
			month2="June";
			break;
			case 7:
			se2='-07-';
			month2="July";
			break;
			case 8:
			se2='-08-';
			month2="Augest";
			break;
			case 9:
			se2='-09-';
			month2="September";
			break;
			case 10:
			se2='-10-';
			month2="Octomber";
			break;
			default:
			se2='-11-';
			month2="Novmber";
			break;
		}
		premon3=((mon-2)%12);
		switch(premon3){
			case 0:
			se3='-12-';
			month3="December";
			break;
			case 1:
			se3='-01-';
			month3="January";
			break;
			case 2:
			se3='-02-';
			month3="Febaruy";
			break;
			case 3:
			month3="March";
			se3='-03-';
			break;
			case 4:
			se3='-04-';
			month3="April";
			break;
			case 5:
			se3='-05-';
			month3="May";
			break;
			case 6:
			se3='-06-';
			month3="June";
			break;
			case 7:
			se3='-07-';
			month3="July";
			break;
			case 8:
			se3='-08-';
			month3="Augest";
			break;
			case 9:
			se3='-09-';
			month3="September";
			break;
			case 10:
			se3='-10-';
			month3="Octomber";
			break;
			default:
			se3='-11-';
			month3="Novmber";
			break;
		}
		premon4=((mon-3)%12);
		switch(premon4){
			case 0:
			se4='-12-';
			month4="December";
			break;
			case 1:
			se4='-01-';
			month4="January";
			break;
			case 2:
			se4='-02-';
			month4="Febaruy";
			break;
			case 3:
			month4="March";
			se4='-03-';
			break;
			case 4:
			se4='-04-';
			month4="April";
			break;
			case 5:
			se4='-05-';
			month4="May";
			break;
			case 6:
			se4='-06-';
			month4="June";
			break;
			case 7:
			se4='-07-';
			month4="July";
			break;
			case 8:
			se4='-08-';
			month4="Augest";
			break;
			case 9:
			se4='-09-';
			month4="September";
			break;
			case 10:
			se4='-10-';
			month4="Octomber";
			break;
			default:
			se4='-11-';
			month4="Novmber";
			break;
		}
		premon5=((mon-4)%12);
		switch(premon5){
			case 0:
			se5='-12-';
			month5="December";
			break;
			case 1:
			se5='-01-';
			month5="January";
			break;
			case 2:
			se5='-02-';
			month5="Febaruy";
			break;
			case 3:
			month5="March";
			se5='-03-';
			break;
			case 4:
			se5='-04-';
			month5="April";
			break;
			case 5:
			se5='-05-';
			month5="May";
			break;
			case 6:
			se5='-06-';
			month5="June";
			break;
			case 7:
			se5='-07-';
			month5="July";
			break;
			case 8:
			se5='-08-';
			month5="Augest";
			break;
			case 9:
			se5='-09-';
			month5="September";
			break;
			case 10:
			se5='-10-';
			month5="Octomber";
			break;
			default:
			se5='-11-';
			month5="Novmber";
			break;
		}



	
	/*connection.query('SELECT * FROM recodes WHERE orderd_time LIKE ?',['%'+se+'%'],function(err,row2){
		console.log(row2);*/
	connection.query('SELECT SUM(oderlist.units) AS units,oderlist.item_id,oderlist.item_name,recodes.orderd_time AS time FROM oderlist INNER JOIN recodes on oderlist.oder_id=recodes.oder_id WHERE recodes.orderd_time LIKE ? AND oderlist.item_id = ?',['%'+se1+'%',product_id],function(err,row1){
		connection.query('SELECT SUM(oderlist.units) AS units,oderlist.item_id,oderlist.item_name FROM oderlist INNER JOIN recodes on oderlist.oder_id=recodes.oder_id WHERE recodes.orderd_time LIKE ? AND oderlist.item_id = ?',['%'+se2+'%',product_id],function(err,row2){
			connection.query('SELECT SUM(oderlist.units) AS units,oderlist.item_id,oderlist.item_name FROM oderlist INNER JOIN recodes on oderlist.oder_id=recodes.oder_id WHERE recodes.orderd_time LIKE ? AND oderlist.item_id = ?',['%'+se3+'%',product_id],function(err,row3){
				connection.query('SELECT SUM(oderlist.units) AS units,oderlist.item_id,oderlist.item_name FROM oderlist INNER JOIN recodes on oderlist.oder_id=recodes.oder_id WHERE recodes.orderd_time LIKE ? AND oderlist.item_id = ?',['%'+se4+'%',product_id],function(err,row4){
					connection.query('SELECT SUM(oderlist.units) AS units,oderlist.item_id,oderlist.item_name FROM oderlist INNER JOIN recodes on oderlist.oder_id=recodes.oder_id WHERE recodes.orderd_time LIKE ? AND oderlist.item_id = ?',['%'+se5+'%',product_id],function(err,row5){
						console.log(row1);

				console.log(se1);
				var data ={
					month1 :month1,
					unit1:row1[0].units,
					month2: month2,
					unit2:row2[0].units,
					month3:month3,
					unit3:row3[0].units,
					month4:month4,
					unit4:row4[0].units,
					month5:month5,
					unit5:row5[0].units
				}
				
				res.render('admin/Products/profile_product', {layout:'chart',product:rows,product1:row1,data:data})
					})
				
				
				
				
			})
		})
		

		
	})
	})
	
		//res.render('admin/Products/profile_product', {layout:'admin',product:rows})
})
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

/*router.get('/report',function(req,res){
	connection.query('SELECT * FROM recodes ORDER BY orderd_time DESC LIMIT 1',function(err,rows){
		const date = String(rows[0].orderd_time);
		console.log(date);
		var arr = date.split(" ").map(function (date) {
  		return String(date);
		});
		console.log(arr);
		console.log(arr[1])
		switch(arr[1]){
			case "Jan":
			mon = 1;
			break;
			case "Feb":
			mon = 2;
			break;
			case "Mar":
			mon = 3;
			break;
			case "Apr":
			mon = 4;
			break;
			case "May":
			mon = 5;
			break;
			case "Jun":
			mon = 6;
			break;
			case "Jul":
			mon = 7;
			break;
			case "Aug":
			mon = 8;
			break;
			case "Sep":
			mon = 9;
			break;
			case "Oct":
			mon = 10;
			break;
			case "Nov":
			mon = 11;
			break;
			case "Dec":
			mon = 12;
			break;

		}
		premon1 = ((mon)%12);
		console.log(premon1);
		switch(premon1){
			case 0:
			se1='-12-';
			break;
			case 1:
			se1='-01-';
			break;
			case 2:
			se1='-02-';
			break;
			case 3:
			se1='-03-';
			break;
			case 4:
			se1='-04-';
			break;
			case 5:
			se1='-05-';
			break;
			case 6:
			se1='-06-';
			break;
			case 7:
			se1='-07-';
			break;
			case 8:
			se1='-08-';
			break;
			case 9:
			se1='-09-';
			break;
			case 10:
			se1='-10-';
			break;
			case 11:
			se1='-11-';
			break;
		}
		premon2=((mon-2)%12);
		switch(premon2){
			case 0:
			se='-12-';
			break;
			case 1:
			se='-01-';
			break;
			case 2:
			se='-02-';
			break;
			case 3:
			se='-03-';
			break;
			case 4:
			se='-04-';
			break;
			case 5:
			se='-05-';
			break;
			case 6:
			se='-06-';
			break;
			case 7:
			se='-07-';
			break;
			case 8:
			se='-08-';
			break;
			case 9:
			se='-09-';
			break;
			case 10:
			se='-10-';
			break;
			case 11:
			se='-11-';
			break;
		}
		premon3=((mon-3)%12);
		switch(premon3){
			case 0:
			se='-12-';
			break;
			case 1:
			se='-01-';
			break;
			case 2:
			se='-02-';
			break;
			case 3:
			se='-03-';
			break;
			case 4:
			se='-04-';
			break;
			case 5:
			se='-05-';
			break;
			case 6:
			se='-06-';
			break;
			case 7:
			se='-07-';
			break;
			case 8:
			se='-08-';
			break;
			case 9:
			se='-09-';
			break;
			case 10:
			se='-10-';
			break;
			case 11:
			se='-11-';
			break;
		}
	
	/*connection.query('SELECT * FROM recodes WHERE orderd_time LIKE ?',['%'+se+'%'],function(err,row2){
		console.log(row2);
	connection.query('SELECT SUM(oderlist.units) AS units,oderlist.item_id,oderlist.item_name FROM oderlist INNER JOIN recodes on oderlist.oder_id=recodes.oder_id WHERE recodes.orderd_time LIKE ? AND oderlist.item_id = ?',['%'+se1+'%',4],function(err,row2){
		console.log(row2);
	})
	})

})*/
	


	//connection.query('SELECT SUM(oderlist.units) AS units,oderlist.item_id,oderlist.item_name FROM oderlist INNER JOIN recodes on oderlist.oder_id=recodes.oder_id WHERE recodes.orderd_time ')



//SELECT SUM(oderlist.units),oderlist.item_id,oderlist.item_name FROM oderlist INNER JOIN recodes ON oderlist.oder_id=recodes.oder_id WHERE recodes.orderd_time LIKE  GROUP BY oderlist.oder_id,recodes.oder_id



module.exports = router; 
 