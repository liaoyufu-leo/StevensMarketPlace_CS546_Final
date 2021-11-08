const { MongoClient } = require("mongodb");
const settings = require("./settings");

const client = new MongoClient(settings.mongoConfig.serverUrl);

module.exports = {
     getDB: async  () =>{
        await client.connect();
        database = client.db(settings.mongoConfig.database);
        return database;
    },

    closeDB: async  () =>{
        await client.close();
    }
}