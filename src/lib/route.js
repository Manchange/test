var db=require("./mysql.js");
function getBrand(app){
    app.get("/getBrand",function(req,res){
        var id = req.query.id;
        console.log(id);
        res.append("Access-Control-Allow-Origin","*");
      db.connect("select * from brand where id="+id,function(error,data){
        res.send(data);
      });
    });
};
module.exports= {
    getBrand
}
