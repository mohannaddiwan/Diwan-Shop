const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnect = (callback) => {
        // MongoClient.connect("mongodb://localhost/store") for Mongodb Compass

    MongoClient.connect("mongodb+srv://mohannaddiwan:mongodb@nodeblog.6k24q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    .then(client => {
        console.log("connected");
        _db = client.db();
        callback(client);
    }).catch(err => {
        console.log(err);
        throw err
    })
}

const getdb = () =>{
    if(_db){
        return _db;
    }else{
        throw "No Database";
    }
}

exports.mongoConnect = mongoConnect;
exports.getdb = getdb;









