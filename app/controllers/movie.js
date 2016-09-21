var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

//detail page
exports.detail = function(req,res){
    var id = req.params.id;
    Movie.findById(id, function(err, movie){
        Comment
          .find({movie: id})
          .populate('from','name')
          .populate('reply.from reply.to','name')
          .exec(function(err,comments){
             console.log(comments);
        	res.render('detail',{
        		title: movie.title + '详情',
        		movie:  movie,
                comments: comments
        	})
          })
    })   
}

exports.savePoster = function(req,res,next){
    var posterData = req.files.uploadPoster;
    var filePath = posterData.path;
    var originalFilename = posterData.originalFilename;
    if(originalFilename){
        fs.readFile(filePath,function(err,data){
            var timestamp = Date.now();
            var type = posterData.type.split('/')[1];
            var poster = timestamp + '.' + type;
            var newPath = path.join(__dirname,'../../','/public/upload/' + poster);
            fs.writeFile(newPath, data, function(err){
                req.poster = poster;
                next();
            });
        });
    }else{
        next();
    }
}

exports.save = function(req,res){
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if(req.poster){
        movieObj.poster = req.poster;
    }
    console.log('id')
    console.log(id)
    if(id){
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
                // Category.findById(movieObj.category,function(err,category){
                //     if(err){
                //         console.log(err);
                //     }
                //     category.movies.push(movie._id);
                //     category.save(function(err,category){
                //         if(err){  
                //             console.log(err);
                //         }
                //     })
                // })
            })
        })
    }else{
        _movie = new Movie(movieObj)

        var categoryId = movieObj.category;
        var categoryName = movieObj.categoryName;

        _movie.save(function(err,movie){
            if(err){
                console.log(err);
            }
            if(categoryId){
                Category.findById(categoryId,function(err,category){
                    if(err){
                        console.log(err);
                    }
                    category.movies.push(movie._id);
                    category.save(function(err,category){
                        if(err){
                            console.log(err);
                        }
                        res.redirect('/movie/' + movie._id);
                    })
                })
            }else if(categoryName){
                var category = new Category({
                    name: categoryName,
                    movies: [movie._id]
                });
                category.save(function(err,category){
                    if(err){
                        console.log(err);
                    }
                    movie.category = category._id;
                    movie.save(function(err,movie){
                        res.redirect('/movie/' + movie._id);
                    })
                })
            }
        })
    }
}

exports.update = function(req,res){
    var id = req.params.id;
    console.log(id);
    Category.fetch(function(err, categories){
        if(id){
            Movie.findById(id, function(err,movie){
                res.render('admin',{
                    title: '更新页',
                    movie: movie,
                    categories: categories
                })
                console.log(movie);
            })
        }
    })
}

exports.new = function(req,res){
    Category.fetch(function(err, categories){
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
            },
            categories: categories
    	})

    })
}

exports.list = function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err);
        }
       res.render('list',{
            title: '列表',
             movies: movies
        })
    })
	
}

exports.del = function(req,res){
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
}