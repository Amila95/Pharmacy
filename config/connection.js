var mysql = require('mysql');
var db;
var setting = {
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'pharmacy'
};
function connectionDatabase(){
	if(!db){
		db = mysql.createConnection(setting);
		db.connect(function (err){
			if(!err){
				console.log("Databse connceted");
			}else{
				console.log("Error connection");
			}
		})
	}
	return db;
}

module.export = connectionDatabase();