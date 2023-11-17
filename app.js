const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')



mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sessionConfig = {
    secret: 'thisIsSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly : true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7  
    }
}

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use (session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
   res.locals.currentUser = req.user 
   res.locals.success =  req.flash('success');
   res.locals.error = req.flash('error');

   next();
});

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/fakeUser', async (req, res)=> {
    const user = new User ({email:'dandanragos@gmail.com', username: 'dandanragos'});
    const newUser = await User.register(user, 'dandan123');
    res.send(newUser);

})
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);





app.all('*', (req, res, next)=> {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next)=> {
    const {StatusCode = 500, message= 'Something went worng'} = err;
    if (!err.message) err.message = 'Something went wrong'
    res.status(StatusCode).render('error',{err} )
    
});
app.listen(3000, () => {
    console.log('Serving on port 3000')
})