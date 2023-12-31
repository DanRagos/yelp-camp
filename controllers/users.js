const User = require('../models/user');

module.exports.renderRegister = (req, res)=> {
    res.render('users/register')
}

module.exports.register = async(req, res)=>{
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password)
        req.flash('success', 'Welcome to Yelp Camp!');
        req.login(registeredUser, (err)=>{
            if (err) {return next(err) }
            return res.redirect('/campgrounds')
        })
    }catch (e){
        req.flash('error', 'There is an ' + e.message)
        res.redirect('register');
    }

}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
}

module.exports.login =  (req,res)=>{
    req.flash('success', 'Welcome back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    console.log(redirectUrl);
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next)=>{
    if (!req.user) {
        req.flash('error', 'No user is logged in!');
        return res.redirect('/campgrounds');
    }
    req.logout( (err)=> {
        if (err) { return next(err);}
        req.flash('success', 'Logged Out!');
        res.redirect('/login')
    })
}
