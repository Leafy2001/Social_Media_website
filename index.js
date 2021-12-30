const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Development
// const port = 8000;

// Prodution
const port = process.env.PORT || 8000;

const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

const session = require('express-session');
const MongoStore = require('connect-mongo');

const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');

app.use(express.urlencoded());
app.use(cookieParser()); 

app.use(express.static('./assets'));
app.use('/uploads', express.static(__dirname + '/uploads'))

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'codeial',
    secret: 'shashank_parmar',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    },
    store: MongoStore.create({
        // mongoUrl: 'mongodb://localhost/codeial_development',
        mongoUrl: 'mongodb+srv://shashank_1234:dellinspiron@cluster0.qmcyz.mongodb.net/myFirstDatabase?authSource=admin&retryWrites=true&w=majority',
        autoRemove: 'disabled'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMiddleware.setFlash);

// use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
