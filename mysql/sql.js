const mysql = require('mysql');

// 链接池：创建多个链接、复用与分发链接
const sql ={
    host:'localhost',
    port:'3306',
    user:'root',
	password:'12345678',
	database:'surfing',
	multipleStatements: true 
  }
var poolextend = function(target, source, flag) {
	for (var key in source) {
		if (source.hasOwnProperty(key)) {
			flag ? (target[key] = source[key]) : (target[key] === void 0 && (target[key] = source[key]));
		}
	}
	return target;
}
var pool = mysql.createPool(poolextend({}, sql));
module.exports=pool;