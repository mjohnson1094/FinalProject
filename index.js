const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const {books} = require('./models/books');
const cors = require('cors');
const mongo = require('mongodb').MongoClient;
const assert = require('assert');

const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

//Data
const {video,audio} = require('./models/media');
const {projects} = require('./models/portfolio')

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Handlebars setting
app.set("view engine", "hbs");
app.engine('hbs',exphbs({
    extname: 'hbs',
    defaultLayout: 'index',
    layoutsDir: __dirname + '/views/layouts',
    partialDir: __dirname + '/views/partials',
}));

const port = 8900;
server.listen(port);
console.log(`Listening to server: http://localhost:${port}`);

//Landing Page
app.get('/', (req,res)=>{
    res.render("main", {title:'Welcome to my website', video:video, audio:audio});
})

//About page
app.get('/about', (req,res)=>{
    res.render("about", {title:'About Me'});
})

//Contact page
app.get('/contact', (req,res)=>{
    res.render("contact", {title:'Contact Us'});
})

//Portfolio Page
app.get('/portfolio', (req,res)=>{
    res.render("portfolio", {title:'My portfolio', projects:projects});
})
//Chat Page
app.get('/chat', (req,res)=>{
    res.render("chat", {title:'Chat App'});
})
//AJAX Page
app.get('/ajax', (req,res)=>{
    res.render("ajax", {title:'AJAX'});
})
//CRUD page
app.get('/crud', (req,res)=>{
    res.render("crud", {title:'CRUD'});
})

app.get('*', (req,res)=>{
    res.render("notfound", {title:'Sorry, file not found'});
})

//Chat Program
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

 //AJAX Operations
 //CORS cross-origin resource sharing
app.use(cors())

app.use(bodyParser.urlencoded({extended: false}));



// APIs and rest code

//GET ALL books/records /api/
app.get('/ajax',(req,res)=>{
    setTimeout(()=>{
        res.json(books);
    },2000)
    
})

//GET ONE record /api/:id
app.get('/ajax:id',(req,res)=>{
    let id = req.params.id;
    let record = "No Record Found!"

    //if the record is found, return index position
    //else return -1
    let index = books.findIndex( (book)=> book.id==id)

    if(index != -1){
        record = books[index];
    }
    res.json([record]);
})

//Delete ONE record
app.delete('/ajax/:id',(req,res)=>{
    let id = req.params.id;
    let message = "No Record Found!"

    //if the record is found, return index position
    //else return -1
    let index = books.findIndex( (book)=> book.id==id)

    if(index != -1){
        books.splice(index,1);
        message = "Record has been deleted."
    }
    res.json(record);
})

//Delete ALL Records
app.delete('/ajax/',(req,res)=>{
    books.splice(0);
    res.json('All Records have been deleted!');
});

//POST - Inserting a new record
app.post('/ajax/',(req,res)=>{
    let newBook = req.body;
    books.push(newBook);
    res.json("New Book has been Added.");
})

//PUT - updating an exisiting record: /api/:id
app.put('/ajax/:id',(req,res)=>{
    let message = "No Record was found."

    let newBook = req.body;

    let id = req.params.id;

    let index = books.findIndex( (book)=> book.id==id)
    if(index != -1){
        books[index] = newBook;
        message = "Record has been Updated!!"
    }
    res.json(record);
})

//CRUD Operations
app.get('/api/users', function (req, res) {
    mongo.connect(url, { useNewUrlParser: true }, function (err, database) {
        const db = database.db('test');
        db.collection('users').find()
            .toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                console.log(result.length + ' documents retrieved.');
                //res.json(result); 
                res.render('users', { data: result, layout: false })
                database.close();
            });
    });
});

app.get('/api/users', function (req, res) {
    mongo.connect(url, function (err, db) {
        db.collection('users').find()
            .toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                console.log(result.length + ' documents retrieved.');
                res.json(result);
                db.close();
            });
    });
}); 

app.put('/api/users', function (req, res) {
    mongo.connect(url, function (err, db) {
        db.collection('users').updateOne(
            { "id": 1 },
            req.body,
            function (err, result) {
                if (err) {
                    throw err;
                }
                console.log(result);
                res.json(result);
                db.close();
            }
        );
    });
}); 

app.delete('/api/users', function (req, res) {
    mongo.connect(url, function (err, db) {
        db.collection('users').deleteOne(
            { "first_name": "Peebo" },
            function (err, result) {
                if (err) {
                    throw err;
                }
                console.log(result);
                res.json(result);
                db.close();
            });
    });
}); 


