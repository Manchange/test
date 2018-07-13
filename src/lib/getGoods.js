var mongo = require('./mongodb.js');
//获取商品
function getgoods(app){
    app.get('/getgoods',(req,res)=>{
			res.append("Access-Control-Allow-Origin", "*");
        mongo.collection('list',function(collection,client){
          collection.find().toArray(function(err, result) {
            if (err) {
              console.log('Error:' + err);
              return;
            }
            res.send(result);
            client.close();
          });
        })
      })
  };
//获取品牌专卖
function getbrand(app){
    app.get('/getbrand',(req,res)=>{
        mongo.collection('brand',function(collection,client){
          collection.find().toArray(function(err, result) {
            if (err) {
              console.log('Error:' + err);
              return;
            }
            res.send(result);
            client.close();
          });
        })
      })
  };
//购物车增删查改
function setcar(app){
    app.get('/setcar',(req,res)=>{
      var type = req.query.type;
      delete req.query.type;
      var id = req.query.id;
        mongo.collection('carlist',function(collection,client){
          if(type=='insert'){
            new Promise((resolve,reject)=>{
              collection.find({id:id}).toArray(function(err, result) {
                if (err) {
                  console.log('Error:' + err);
                  return;
                }
                resolve(result);
              });
            }).then(function(result){
              if(result[0]==null){
                console.log(result[0],'不存在');
                collection.insert(req.query, function(err, result) {
                  if (err) {
                    console.log('Error:' + err);
                    return;
                  }
                  client.close();
                });
              }else{
                console.log(result[0],'重复');
                     
                var setqty = result[0].qty*1+req.query.qty*1;
                collection.update({
                  id:result[0].id
                },{
                  $set:{
                    qty:setqty
                  }
                }, function(err, result) {
                  if (err) {
                    console.log('Error:' + err);
                    return;
                  }
                  client.close();
                })

              }//else
            })
          }//判断类型
          else if(type=='find'){
            collection.find().toArray(function(err, result) {
              if (err) {
                console.log('Error:' + err);
                return;
              }
              res.send(result);
              client.close();
            });
          }//查找判断
          else if(type=='delete'){
            collection.remove({id:id},function(err, result) {
              if (err) {
                console.log('Error:' + err);
                return;
              }
              client.close();
            });
          }//删除判断
        })
      })
  };
//详情页读取信息
function getgoodsitem(app){
  app.get('/getgoodsitem',(req,res)=>{
        var id = req.query.id;
        mongo.collection('goods',function(collection,client){
          collection.find({num:id}).toArray(function(err, result) {
            if (err) {
              console.log('Error:' + err);
              return;
            }
            res.send(result);
            client.close();
          });
        })
      })
};
//列表页商品加载
function getgoodslist(app){
  app.get('/getgoodslist',(req,res)=>{
    var num = req.query.num*20;
    var sort = req.query.sort;
        mongo.collection('goods',function(collection,client){
          collection.find().sort({'id':1}).limit(20).skip(num).toArray(function(err, result) {
            if (err) {
              console.log('Error:' + err);
              return;
            }
            res.send(result);
            client.close();
          });
        })
      })
}
//数量加减
function added(app){
  app.get('/add',(req,res)=>{
        var id = req.query.id;
        var setqty = req.query.qty;
        mongo.collection('carlist',function(collection,client){
                collection.update({
                  id:id
                },{
                  $set:{
                    qty:setqty
                  }
                }, function(err, result) {
                  if (err) {
                    console.log('Error:' + err);
                    return;
                  }
                  console.log(2222);
                  client.close();
                })
        })
      })
}
//注册
function registor(app){
  app.get('/registor',(req,res)=>{
    var username = req.query.phone;
    var password = req.query.password;
    mongo.collection('user',function(collection,client){
      new Promise((resolve,reject)=>{
        collection.find({username:username}).toArray(function(err, result) {
          if (err) {
            console.log('Error:' + err);
            return;
          }
          resolve(result);
          console.log(result[0]);
        });
      }).then((result)=>{
        if(result[0]==null){
        console.log(111)
          if(password!=''){
            collection.insert({username:username,password:password}, function(err, result) {
              if (err) {
                console.log('Error:' + err);
                return;
              }
              res.send('注册成功');
              client.close();
            })
          }
        }else{
        console.log(222)
          res.send('用户已存在');
        }
      })//promise
    })
  })
}
//登录
function login(app){
  app.get('/login',(req,res)=>{
    var username = req.query.username;
    var password = req.query.password;
    mongo.collection('user',function(collection,client){
      new Promise((resolve,reject)=>{
        collection.find({username:username}).toArray(function(err, result) {
          if (err) {
            console.log('Error:' + err);
            return;
          }
          resolve(result);
          console.log(result);
        });
      }).then((result)=>{
        if(result[0]==null){
        console.log(222)
          res.send('请注册账户');
        }else if(result[0].password!=password){
        console.log(111);
        res.send('账户密码有误')
        }else{
          console.log(333);
          res.send('登录成功');
        }
      })//promise
    })
  })
}
module.exports = {
  getgoods,
  getbrand,
  setcar,
  getgoodsitem,
  getgoodslist,
  added,
  registor,
  login
}