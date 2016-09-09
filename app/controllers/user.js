 var User = require('../models/user')
 //signup

exports.showSignup = function(req,res){
   res.render('signup',{
        title: '注册页面'
    })
}

exports.showSignin = function(req,res){
   res.render('signin',{
        title: '登录页面'
    })
}

exports.signup = function(req,res){
    var _user = req.body.user;
    User.findOne({name:_user.name}, function(err,user){
        if(err){
            console.log(err);
        }
        if(user){
            res.redirect('/signin');
        }else{
            var user = new User(_user);
            // console.log('user');
            // console.log(user);
            user.save(function(err,user){
                if(err){
                    console.log(err);
                }
                    console.log(user);
                res.redirect('/');
            })
        }
    })
}
    //signin
exports.signin =  function(req,res){
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    User.findOne({name: name}, function(err, user){
        if(err){
            console.log(err)
        }
        if(!user){
            return res.redirect('/signup');
        }
        user.comparePassword(password,function(err,isMatch){
            if(err){
                console.log(err);
            }
            if(isMatch){
                 console.log('password right');
                 req.session.user = user;

                 return res.redirect('/');
             }else{
                 return res.redirect('/signup');
                console.log('password wrong');
             }
        });
    })
}

// logout
exports.logout =  function(req,res){
    delete req.session.user;
    // delete app.locals.user;
    res.redirect('/');
}

//user list
exports.list = function(req,res){
    User.fetch(function(err,users){
        if(err){
            console.log(err);
        }
       res.render('userlist',{
            title: '用户列表',
             users: users
        })
    })
    
}

exports.signinRequired = function(req,res,next){
    var user = req.session.user;
    if(!user){
        return res.redirect('/signin');
    }
    next();
}

exports.adminRequired = function(req,res,next){
    var user = req.session.user;
    if(user.role <= 10){
        return res.redirect('/signin');
    }
    next();
}


