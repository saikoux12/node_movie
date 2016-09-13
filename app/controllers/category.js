var Category = require('../models/category');
// exports.update = function(req,res){
//     var id = req.params.id;
//     console.log(id);
//     if(id){
//         Movie.findById(id, function(err,movie){
//             res.render('admin',{
//                 title: '更新页',
//                 movie: movie
//             })
//             console.log(movie);
//         })
//     }
// }

exports.new = function(req,res){
    res.render('category_admin',{
        title: '后台 分类录入页' ,
        category: {
            name: ''
        }
    })
}

exports.save = function(req,res){
    var _category = req.body.category;
    console.log(req.body.category);
    var category = new Category(_category)
    category.save(function(err,category){
        if(err){
            console.log(err);
        }
        res.redirect('/admin/category/list');
    })
    
}

exports.list = function(req,res){
    Category.fetch(function(err,categories){
        if(err){
            console.log(err);
        }
       res.render('category_list',{
            title: '电影分类列表',
             categories: categories
        })
    })
    
}

exports.update = function(req,res){
    var id = req.params.id;
    console.log(id);
    Category.findById(id,function(err, category){
        if(id){
            res.render('category_admin',{
                title: '分类更新页',
                category: category
            })
        }
    })
}