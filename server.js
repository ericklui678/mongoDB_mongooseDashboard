var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
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

mongoose.model('Mongoose', MongooseSchema);
var Mongoose = mongoose.model('Mongoose');
mongoose.Promise = global.Promise;

app.get('/', function(req, res){
    Mongoose.find(function(err, mongooses){
        if(mongooses){
            res.render('index', {mongooses: mongooses});
        }
        if(err){
            console.log('Could not find any mongooses');
            res.render('index');
        }
    }).sort({'createdAt': -1})
})
app.get('/new', function(req, res){
    res.render('new');
})
app.get('/mongooses/:id', function(req, res){
    Mongoose.find({_id: req.params.id}, function(err, mongooses){
        res.render('info', {mongooses: mongooses[0]});
    })
})
app.get('/mongooses/edit/:id', function(req, res){
    console.log(req.params.id);
    res.render('edit', {id: req.params.id})
})
app.post('/mongooses', function(req, res){
    var mongoose = new Mongoose({
        name: req.body.name,
        location: req.body.location,
        skill: req.body.skill,
        color: req.body.color,
    })
    mongoose.save(function(err){
        if(err){
            console.log("Couldn't insert document");
        }else{
            console.log('ADDED MONGOOSE - SUCCESS');
            res.redirect('/');
        }
    })
})
app.post('/mongooses/:id', function(req, res){
    Mongoose.update({_id: req.params.id}, {$set: {
        name: req.body.name,
        location: req.body.location,
        skill: req.body.skill,
        color: req.body.color
    }}, function(err, data){
            res.redirect('/')
    })
})
app.post('/mongooses/destroy/:id', function(req, res){
    Mongoose.remove({_id: req.params.id}, function(err, data){
        res.redirect('/')
    })
})

app.listen(3000, function(){
    console.log('running on 3000');
})
