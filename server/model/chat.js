
const username = 'b2a642da8220e5'
const password = '65d76285'
const host = 'us-cdbr-east-02.cleardb.com';
const database = 'heroku_c53f2d4f5a147b1'

const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(database, username, password, {
    dialect: 'mysql',
    host: host,
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
