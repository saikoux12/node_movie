var Movie = require('../models/movie');
var Comment = require('../models/comment');
var _ = require('underscore');

//detail page
exports.detail = function(req,res){
    var id = req.params.id;
    Movie.findById(id, function(err, movie){
        Comment
          .find({movie: id})
          .populate('from','name')
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

exports.save = function(req,res){
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
}
exports.update = function(req,res){
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
}

exports.new = function(req,res){
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