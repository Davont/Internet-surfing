var pool= require('./sql')
var json=require('./json')
var sql = {
    insert:'INSERT INTO card(name, class) VALUES(?,?)',
    delete: 'DELETE FROM card WHERE id=?',
    queryById: 'SELECT * FROM card WHERE id=?',
    queryAll: 'SELECT * FROM card',
}
var card={
    add: function(req,res,next){
        pool.getConnection(function(err,connection){
            var param=req.query||req.params;
            connection.query(sql.insert, [param.name, param.class], function (err, result) {
                console.log(err)
                if (result) {
                    result = 'add'
                }
                // 以json形式，把操作结果返回给前台页面
                json(res,result);
                // 释放连接
                connection.release();
            });
        })
    },
    delete: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            var id = +req.query.id;
            connection.query(sql.delete, id, function (err, result) {
                if (result.affectedRows > 0) {
                    result = 'delete';
                } else {
                    result = undefined;
                }
                json(res, result);
                connection.release();
            });
        });
    },
    update:function(req,res,next){
        pool.getConnection(function(err,connection){
            let param = req.body;
            console.log(param)
            let sqlString='';
            let array=[];//更改sql语句，使得语句同时适应修改1个或多个字段
            if (param.id == null) {
                json(res, undefined);
                return;
            }else if(param.name||param.class||param.balance||param.status){
                for(i in param){
                    if(i!=='id'){
                        sqlString+=i+'='+'?'+',';
                        array.push(param[i])
                    }
                }
                sqlString=sqlString.substring(0,sqlString.length-1);
                sqlString='UPDATE card SET '+sqlString+' WHERE id=?';
                array.push(param.id)
            }
            connection.query(sqlString,array,function(err,result){
                if (result.affectedRows > 0) {
                    result = 'update'
                } else {
                    result = undefined;
                }
                json(res, result);
                connection.release();
            })       
        })
    },
    addbalance:function(req,res,next){
        pool.getConnection(function(err,connection){
            let param = req.body;
            let id=param.id
            let balance=param.balance
            console.log(param)
            connection.query('UPDATE card SET balance= balance + '+balance+' where id='+id,function(err,result){
                if (result.affectedRows > 0) {
                    result = 'addbalance'
                } else {
                    result = undefined;
                }
                json(res, result);
                connection.release();
            })       
        })
    },
    queryById: function (req, res, next) {
        var id = +req.query.id;
        console.log(req.query)
        pool.getConnection(function (err, connection) {
            connection.query(sql.queryById, id, function (err, result) {
                if (result != '') {
                    var _result = result;
                    result = {
                        result: 'select',
                        data: _result
                    }
                } else {
                    result = undefined;
                }
                json(res, result);
                connection.release();
            });
        });
    },
    queryAll: function (req, res, next) { 
        pool.getConnection(function (err, connection) {
            connection.query(sql.queryAll, function (err, result) {
                if (result != '') {
                    var _result = result;
                    result = {
                        result: 'selectall',
                        data: _result
                    }
                } else {
                    result = undefined;
                }
                json(res, result);
                connection.release();
            });
        });
    },
    login:async function(req,res,next){
        var id = +req.query.id;
         function connection(sql,id){
            return new Promise(function(resolve,reject){
                pool.getConnection(function(err,connection){
                    if(err){
                        reject(err)
                    }                    
                    connection.query(sql.queryById, id, function (err, result) {
                        connection.release(); 
                        resolve({
                            'result':result
                        })          
                    });            
                   
                })
            })
        }
        var data= await connection(sql,id);
        //console.log(data)
        return data;
        
    }
}
module.exports=card;