var pool= require('./sql')
var json=require('./json')
var sql = {
    insert:'INSERT INTO record(recordId,date,start_time,total_time,isUsing) VALUES(?,?,?,?,?)',
    delete: 'DELETE FROM record WHERE recordId=?',
    queryById: 'SELECT * FROM record WHERE code=?',
    queryAll: 'SELECT * FROM record',
}
var record={
    add: async function(req,res,next){
        var param=req.query||req.params;
        console.log(param)
        function connection(sql,param){
            return new Promise(function(resolve,reject){
                pool.getConnection(function(err,connection){
                    if(err){
                        reject(err)
                    }
                    connection.query(sql.insert+';SELECT LAST_INSERT_ID()', [param.id,param.date, param.start_time,param.total_time,param.isUsing], function (err, result) {
                        connection.release(); 
                        console.log(err)
                        resolve({
                            'result':result,
                        })          
                    });            
                })
            })
        }
        var result=await connection(sql,param);
        return result;
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
    update:async function(req,res,next){
        let param = req.query;
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
                sqlString='UPDATE record SET '+sqlString+' WHERE recordId=?';
                array.push(param.id)
        }
        function connection(sqlString,array){
            return new Promise(function(resolve,reject){
                pool.getConnection(function(err,connection){
                    if(err){
                        reject(err)
                    }
                    connection.query(sqlString,array,function(err,result){
                        connection.release();
                        console.log(err)
                        resolve({
                            'result':result
                        })   
                    })       
                })
            })
        }
        var result=await connection(sqlString,array);
        return result;
       
    },
    queryById:async function (req, res, next) {
        var code = +req.body.code;
        function connection(sql,code){
            return new Promise(function(resolve,reject){
                pool.getConnection(function(err,connection){
                    if(err){
                        reject(err)
                    }
                    connection.query(sql.queryById,code,function(err,result){
                        connection.release();
                        console.log(err)
                        resolve({
                            'result':result
                        })   
                    })       
                })
            })
        }
        
        var result=await connection(sql,code);
        json(res, result);
        return result;
        
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
    }
}
module.exports=record;