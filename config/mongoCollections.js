const connection = require("./mongoConnection");

let con = undefined;
let col = undefined;

module.exports={
    getCollection: async  (name) => {
        con = await connection.getDB();
        col = await con.collection(name);
        return col;
    },

    closeCollection: async ()=>{
        await connection.closeDB();
    }
}