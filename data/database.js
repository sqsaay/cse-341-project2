const dotenv = require('dotenv');
dotenv.config();
//Remove this lines for deployment
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);
//Until here
const MongoClient = require('mongodb').MongoClient;

let database;
const initDb = (callback) => {
    if(database) {
        console.log('Database is already initialized!');
        return callback(null, database);
    }
    MongoClient.connect(process.env.MONGODB_URL)
        .then((client) => {
            database = client;
            callback(null, database);
        })
        .catch((err) => {
            callback(err);
        });
};

const getDatabase = () => {
    if (!database){
        throw Error('Database not initialized');
    }
    return database;
};

module.exports = {
    initDb,
    getDatabase
}