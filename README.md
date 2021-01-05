考研前一周还有这个课程设计作业，还要签到，考研后居然要在3天内写好这个作业，这也太坑了。

## FUNCTION

主要功能模块：
1. 登录模块
2. 上机管理模块
说明：上机登记时，余额不足3元或卡处于挂失状态，则拒绝登记；上机登记时，要记录机器号。
每位同学的一次上机形成一条记录，每30S遍历一次上机记录表，对表中所有正上机字段为TRUE的记录的上机用时增加30S，同时减少上机卡表的余额。
3. 上机卡管理模块
4. 充值挂失模块
5. 查找统计模块：统计某天上机的总时数、每次上机的平均时数和机房的收入；某学生上机的次数、上机总时数、每次上机平均时间；挂失和查询余额。
6. 根据实际情况的需求分析，完善上述未列出的其他功能；建议用报表的形式完成统计功能。
7. 参考的部分数据结构有：
    上机卡（卡号，姓名，专业班级，余额，状态），状态有：正常和挂失。
    上机记录（卡号，上机日期，开始时间，上机用时，正上机，管理号代码）
    上机记录表永久保存，用于事后查询和统计。
## DEMO

![图1](http://pic.davontt.com/picGo/1.png)
![图2](http://pic.davontt.com/picGo/2.png)
![图3](http://pic.davontt.com/picGo/3.png)
![图4](http://pic.davontt.com/picGo/4.png)

## START

* 用的 express.js 开发。
* 事先必须安装node.js，连接数据库。数据库格式在文件mysql/sql.js里配置
* 然后打开终端：使用命令：
    ```npm install```
    ```npm start```
* 在浏览器输入：http://localhost:3000 即可输入登录页面

* 学生登陆界面：http://127.0.0.1:3000/
* 管理员界面：http://127.0.0.1:3000/root


## 数据库类型
### card
```
CREATE TABLE `card` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` char(100) DEFAULT NULL,
  `class` char(100) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `balance` float DEFAULT NULL,
  `password` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
### record
```
CREATE TABLE `record` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `total_time` time DEFAULT NULL,
  `isUsing` tinyint(1) DEFAULT NULL,
  `recordId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

开始时连接好数据库，创建一个database为surfing的数据库，在里面创建两张表（card和record），card里面要有一条数据，用于登陆，记得status为1，否则status为0是挂失状态。

## 小结
回顾之前写的代码，写的很烂，建议自己优化。