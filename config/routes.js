var Movie = require('../models/movie')
var User = require('../models/user')
var _ = require('underscore');

module.exports = function(app){
    app.use(function(req,res,next){
        var _user = req.session.user;
        if(_user){
            app.locals.user = _user;
        }
        return next();
    })

    app.get('/',function(req,res){
        console.log('req.session.user'); 
        console.log(req.session.user);
        
        Movie.fetch(function(err,movies){
            if(err){
                console.log(err);
            }
        	res.render('index',{
        		title: '首页',
        		movies: movies
        	})
        })
    })
   
    app.get('/movie/:id',function(req,res){
        var id = req.params.id;
        Movie.findById(id, function(err, movie){
        	res.render('detail',{
        		title: movie.title + '详情',
        		movie:  movie
        	})
        })
    })

    app.get('/admin/update/:id',function(req,res){
        var id = req.params.id;
        console.log(id);
        if(id){
            Movie.findById(id, function(err,movie){
                res.render('admin',{
                    title: '更新页',
                    movie: movie
                })
                console.log(movie);
            })
        }
    })

    app.post('/admin/movie/new', function(req,res){
        var id = req.body.movie._id;
        var movieObj = req.body.movie;
        var _movie;
        if(id !== 'undefined'){
            Movie.findById(id, function(err, movie){
                if(err){
                    console.log(err);
                }
                _movie = _.extend(movie,movieObj);
                _movie.save(function(err, movie){
                    if(err){
                        console.log(err);
                    }
                    res.redirect('/movie/' + movie._id);
                })
            })
        }else{
            _movie = new Movie({
                director: movieObj.director,
                title: movieObj.title,
                country: movieObj.country,
                language: movieObj.language,
                year: movieObj.year,
                poster: movieObj.poster,
                summary: movieObj.summary,
                flash: movieObj.flash,
            })
            _movie.save(function(err,movie){
                if(err){
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            })
        }
    })

    app.get('/admin/movie',function(req,res){
    	res.render('admin',{
    		title: '后台',
    		 movie: {
                director: '',
                country: '',
                title: '',
                year: '',
                poster: '',
                language: '',
                flash: '',
                summary: ''
            }
    	})
    })

    app.get('/admin/list',function(req,res){
        Movie.fetch(function(err,movies){
            if(err){
                console.log(err);
            }
           res.render('list',{
                title: '列表',
                 movies: movies
            })
        })
    	
    })

    app.delete('/admin/list', function(req,res){
        var id = req.query.id;
        if(id){
            Movie.remove({_id: id},function(err,movie){
                if(err){
                    console.log(err);
                }else{
                    res.json({success: 1});
                }
            })
        }
    })

    //signup
    app.post('/user/signup', function(req,res){
        var _user = req.body.user;
        User.findOne({name:_user.name}, function(err,user){
            if(err){
                console.log(err);
            }
            if(user){
                res.redirect('/');
            }else{
                var user = new User(_user);
                console.log('user');
                console.log(user);
                user.save(function(err,user){
                    if(err){
                        console.log(err);
                    }
                        console.log(user);
                    res.redirect('/');
                })
            }
        })
    })

    //signin
    app.post('/user/signin', function(req,res){
        var _user = req.body.user;
        var name = _user.name;
        var password = _user.password;
        User.findOne({name: name}, function(err, user){
            if(err){
                console.log(err)
            }
            if(!user){
                return res.redirect('/');
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
                    console.log('password wrong');
                 }
            });
        })
    })

    // logout
    app.get('/logout', function(req,res){
        delete req.session.user;
        delete app.locals.user;
        res.redirect('/');
    })

    //user list
    app.get('/admin/userlist',function(req,res){
        User.fetch(function(err,users){
            if(err){
                console.log(err);
            }
           res.render('userlist',{
                title: '用户列表',
                 users: users
            })
        })
        
    })
    
}
