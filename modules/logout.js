var card = require('../mysql/cardsql');
var record = require('../mysql/record')
var pool = require('../mysql/sql')



var updateIsUsing = function (req, res) {
    var code = req.query.code;
    console.log('22222222222222');
    console.log(code);
    pool.getConnection(function (err, connection) {
        connection.query('UPDATE record SET isUsing=0 WHERE code =' + code, function (err, result) {
            connection.release();
        });
    })
    console.log("停止收费")
}
var logout=function(req,res,next){
    console.log(123456);
    
    updateIsUsing(req,res);
    console.log('登出成功！')
    res.send({
        code: 2000,
        msg: "登出成功"
    });
}
module.exports=logout
