const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('chat', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost',
});
const Op = Sequelize.Op
class ChatMessage extends Model {}

ChatMessage.init({
    // Model attributes are defined here
    sender: { type: DataTypes.STRING, allowNull: false },
    receiver: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    match_id: { type: DataTypes.STRING, allowNull: false },
    timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    read_status: { type: DataTypes.STRING, allowNull: false }
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'ChatMessage', // We need to choose the model name
    tableName: 'chat_message',
    timestamps: true,
    createdAt: 'timestamp',
    updatedAt: false
});

// the defined model is the class itself
console.log(ChatMessage === sequelize.models.ChatMessage); // true

module.exports = { ChatMessage, Op }

//
// const mysql = require('mysql');
//
// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "chat"
// });
//
// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
// });
//
// function runQuery(sql) {
//     con.query(sql, function (err, result) {
//         return result;
//     })
// }
//
// module.exports = {runQuery}