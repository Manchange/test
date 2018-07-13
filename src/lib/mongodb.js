var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://10.3.134.69:27017';
function collection(list,callback){
    MongoClient.connect(DB_CONN_STR,function(err,client){
        console.log('123');             
        const db = client.db('nezoy');
        let collection = db.collection(list);
        callback(collection,client);
       // client.close();
    });
}

module.exports = {
    collection
}