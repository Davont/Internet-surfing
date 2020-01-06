var card = require('../mysql/cardsql');
var record = require('../mysql/record')
var pool = require('../mysql/sql')
var updateIsUsing = function (req, res) {
    var code = req.query.code;
    pool.getConnection(function (err, connection) {
        connection.query('UPDATE record SET isUsing=0 WHERE id =' + code, function (err, result) {
            connection.release();
        });
    })
    console.log("停止收费")
}

var updateStatus = function (req, res) {
    var id = req.query.id;
    pool.getConnection(function (err, connection) {
        connection.query('UPDATE card SET status=0 WHERE id =' + id, function (err, result) {
            connection.release();
        });
    })
    console.log("停止收费")
}

var queryCard = async function (req, res) {
    var id = req.query.id;
    var code = req.query.code;
    console.log('----')
    console.log("code"+code)

    function connection(id, code) {
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                connection.query('SELECT balance FROM card WHERE id=' + id + ';SELECT status FROM card WHERE id=' + id + ';SELECT isUsing FROM record WHERE code=' + code, function (err, result) {
                    connection.release();
                    resolve({
                        'result': result
                    })
                });
            })

        })
    }
    var result = await connection(id, code);
    return result;
}

var addTime = function (req, res) {
    var id = req.query.id;
    pool.getConnection(function (err, connection) {
        connection.query('UPDATE record SET total_time=date_add(total_time,interval 30 SECOND) WHERE id =' + id, function (err, result) {
            connection.release();
        });
    })
    console.log("加时成功")

}
var decBalance = function (req, res) {
    var id = req.query.id;
    pool.getConnection(function (err, connection) {
        connection.query('UPDATE card SET balance=balance-0.1 WHERE id =' + id, function (err, result) {
            connection.release();
        });
    })
    console.log("扣费成功")
}
var login = function (req, res, next) {
    var pass = req.query['pass'];
    card.login(req, res).then(function (data) {
        var cardInfo = data.result[0];
        console.log(cardInfo)
        if (cardInfo == null||cardInfo == undefined) {
            //send可以直接写jsonif
            //前台接收到的格式也是json
            res.send({
                code: 502,
                msg: "此用户不存在"
            });
        } else if (cardInfo.password != pass) {
            {
                res.send({
                    code: 500,
                    msg: "密码错误"
                });
            }
        }else if(!cardInfo.status){
            res.send({
                code: 550,
                msg: "此卡已挂失"
            });
        }else if(cardInfo.balance<3){
            res.send({
                code: 600,
                msg: "余额不足"
            });
        }else {
            //登陆成功，并开始计时

            var date = new Date();
            var req = {
                query: {
                    id: cardInfo.id,
                    date: date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate(),
                    start_time: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
                    total_time: 0,
                    isUsing: 1,
                    code: 0,
                }
            }
            record.add(req, res).then(function (data) {
                req.query.code = data.result[1][0]['LAST_INSERT_ID()'];
                res.send({
                    code: 2000,
                    msg: "登陆成功",
                    surfingCode: req.query.code
                });
                var change = setInterval(function () {
                    queryCard(req, res).then(function (data) {

                        var status = data.result[1][0].status;
                        var balance = data.result[0][0].balance;
                        var isUsing = data.result[2][0].isUsing;
                        console.log(isUsing)
                        if (status && isUsing == 1 && balance >= 3) {
                            addTime(req, res);
                            decBalance(req, res);
                            balance -= 0.1;
                        } else {
                            console.log('已断开连接')
                            updateIsUsing(req, res);
                            clearInterval(change);
                        }

                    })


                }, 2000);


            })
        }
    });
}
module.exports = login;