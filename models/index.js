var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/camel4');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));

var Page;
var Schema = mongoose.Schema;

var pageSchema = new Schema({
  url: String,
  title: String,
  tracked: {
    element: String,
    content: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  links: Array

});

Page = mongoose.model('Page', pageSchema);

module.exports = {"Page": Page};
