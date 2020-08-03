// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const io = require('socket.io').listen(server);



// server.listen(3000, function(){
//     console.log("Listening to port: 3000");
//     console.log("http://localhost: 3000");
// })

const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

http.listen(3000, function(){
console.log("Listening to port: 3000");
console.log("http://localhost: 3000");
 })

//app.use(express.static(__dirname + "/public/"));
app.use(express.static(__dirname + "/chat/"));

app.get("/", function(req,res){
    // res.send("<h1>Hello There</h1>");
    res.sendFile("index.html");
 })

 io.on("connection", function(socket){
     console.log("A user is connected!!!")

     socket.on("disconnect", function(){
        console.log("A user left the chat room")
     })

     socket.on("my chat", function(msg){
        console.log(msg);

        io.emit("my chat",msg);
     })
 })

 setInterval(function(){
    io.emit("news",Math.floor(Math.random() * 150))
 }, 2000)
