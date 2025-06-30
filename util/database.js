const mogodb = require('mongodb');
const MongoClient = mogodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://sayaljesani:B2LdoDgJyz0dvOct@cluster0.lgkkg4t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(client => {
        console.log('connected!');
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(err)
        throw err;
    });
};

const getDb = () => {
    if(_db){
        return _db;
    }
    throw 'No database found!';
}

exports.getDb = getDb;
exports.mongoConnect = mongoConnect;