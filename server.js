var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    port = 3000;
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/mongoose_db');

var MongooseSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'name required'], minlength: 2 },
    location: { type: String, required: [true, 'location required'], minlength: 3 },
    skill: { type: String, required: [true, 'skill required'], minlength: 3 },
    color: { type: String, required: [true, 'color required'], minlength: 3 }
}, { timestamps: true });

var Mongoose = mongoose.model('Mongoose', MongooseSchema);

// Index
app.get('/', function(req, res){
    Mongoose.find(function(err, data){
        if(err) {console.log(err);}
        res.render('index', {mongooses: data})
    }).sort({'createdAt': -1})
})
// Create form
app.get('/new', function(req, res){
    res.render('new');
})
// Show info
app.get('/mongooses/:id', function(req, res){
    Mongoose.find({_id: req.params.id}, function(err, mongooses){
        res.render('info', {mongooses: mongooses[0]});
    })
})
// Edit form
app.get('/mongooses/edit/:id', function(req, res){
    console.log(req.params.id);
    res.render('edit', {id: req.params.id})
})
// Create
app.post('/', function(req, res){
    Mongoose.create(req.body, function(err, data){
        if(err) {console.log(err);}
        console.log(req.body);
        res.redirect('/')
    })
})
// Update
app.post('/mongooses/:id', function(req, res){
    Mongoose.update({_id: req.params.id}, req.body, function(err, data){
        if(err) {console.log(err);}
        res.redirect('/')
    })
})
// Delete
app.post('/mongooses/destroy/:id', function(req, res){
    Mongoose.remove({_id: req.params.id}, function(err, data){
        res.redirect('/')
    })
})

app.listen(port, function(){
    console.log('running on ', port);
})
