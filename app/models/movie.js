var mongoose = require('mongoose');
var MoiveSchema = require('../schemas/movie');
var Movie = mongoose.model('Movie',MoiveSchema);

module.exports = Movie;