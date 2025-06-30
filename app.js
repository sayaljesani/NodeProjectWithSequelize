const path = require('path');

const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database.js').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminroutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
    User.findById('685f8bc872d710da8d14b596')
    .then(user =>{
        req.user = new User(user.name, user.email, user.cart, user._id );
        next();
    })
    .catch(err => console.log(err));
    // next();
});

app.use('/admin', adminroutes);
app.use(shopRoutes);

app.use(errorController.notfoundpage);

mongoConnect(() => {
    app.listen(3000);
});