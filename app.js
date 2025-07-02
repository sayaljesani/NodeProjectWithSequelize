const path = require('path');

const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database.js').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminroutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
    User.findById('68627420af183d2c67f42b4b')
    .then(user =>{
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminroutes);
app.use(shopRoutes);

app.use(errorController.notfoundpage);

mongoose.connect('mongodb+srv://sayaljesani:B2LdoDgJyz0dvOct@cluster0.lgkkg4t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(result => {
    User.findOne().then(user =>{
        if(!user){
            const user = new User({
                name: 'max',
                email: 'max@test.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    });
    
    app.listen(3000);
}).catch(err=> console.log(err));