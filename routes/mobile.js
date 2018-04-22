var express = require('express');
var router = express.Router();
var connection = require('../config/connection');



router.get('/',function(req,res,next){
    res.json([
        {
            id: 1,
            message:"Hello Ionic"
        },
        {
            id: 2,
            message:"This is another message"
        }])
});
router.get('/fornt',function(req,res,next) {
    connection.query('SELECT * FROM company', function (err, rows) {
        console.log(rows);
        res.json([
            {
                id: rows[0].company_id,
                name: rows[0].campany_name
            }
        ])
    })
})

router.get('/home',function (req,res,next) {
    connection.query('SELECT payment.order_id, users.user_id, users.pharmacy_name, users.logo FROM users INNER JOIN payment ON payment.user_id= users.user_id WHERE payment.deliver_date= CURDATE()',function (err,rows)
     {
      res.json(rows)
    })

})

//SELECT payment.order_id, users.user_id, users.pharmacy_name, users.logo FROM users INNER JOIN payment ON payment.user_id= users.user_id WHERE payment.deliver_date = 2014-04-14


module.exports = router;