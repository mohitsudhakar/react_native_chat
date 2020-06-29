const express = require('express');
const http = require("http");
const { ChatMessage, Op } = require('./model/chat');
// const routes = require('routes');

const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const port = process.env.PORT || 3000;

var users = {}

//todo: APIs
/*
* Get all chats of a user for another user based on user ids
* Save chat of user in db with user_ids, chats, match_ids
* */
async function fetchChat(sender, receiver) {
    return await ChatMessage.findAll({
        'where': {sender, receiver}
    })
}

app.get('/', (req, res) => {
    res.send("Welcome to mohit's chat backend");
})

app.get('/chats', async (req, res) => {
    const sender = req.query.sender
    const receiver = req.query.receiver
    if(!sender || !receiver) {
        res.statusMessage = "Sender and receiver should be given";
        console.log('Error: '+res.statusMessage)
        res.status(401).end();
        return;
    }
    console.log(sender, receiver)
    var c1 = await fetchChat(sender, receiver)
    var c2 = await fetchChat(receiver, sender)

    // merge both sorted chats according to timestamp
    var chats = []
    var i = 0, j = 0;
    while(i < c1.length && j < c2.length) {
        if (c1[i].timestamp < c2[j].timestamp) {
            chats.push(c1[i])
            i++
        }
        else {
            chats.push(c2[j])
            j++
        }
    }
    while (i < c1.length) {
        chats.push(c1[i])
        i++
    }
    while (j < c2.length) {
        chats.push(c2[j])
        j++
    }
    res.json(chats)

})


// Sockets

io.on('connection', socket => {
    // console.log("a user connected");

    socket.on('chat message', async data => {
        console.log(data);

        // todo: save to database
        data.sender = data.sender.toLowerCase()
        data.receiver = data.receiver.toLowerCase()
        const chat = {
            sender: data.sender,
            receiver: data.receiver,
            message: data.message,
            match_id: data.match_id,
            read_status: 0  // todo: default set to 0, will have to be handled
        };
        const savedChat = await ChatMessage.create(chat);

        if (data.receiver in users)
            users[data.receiver].emit('chat message', savedChat);
    });

    // //new user joined
    socket.on('join chat', data => {
        if (socket.nick) {
            delete users[socket.nick];
        }
        socket.nick = data.sender.toLowerCase(); //storing nick of each user in its own socket
        // each user has its own socket
        users[socket.nick] = socket;
        console.log(socket.nick + " connected");
    });

    //on disconnect
    socket.on('disconnect', function(data){
        if(socket.nick){
            socket.leave(this);
            console.log(socket.nick +' disconnected');
            // io.emit('user left', {nick: socket.nick});//send nick who left to client
            delete users[socket.nick];
        }
    });
});

server.listen(port, () => console.log("server running on port:" + port));

