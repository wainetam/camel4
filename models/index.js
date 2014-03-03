var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/camel4');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));

var Page, Hist;
var Schema = mongoose.Schema;

var pageSchema = new Schema({
  url: String,
  title: String,
  currentState: {
    domElement: String,
    content: String
  },
    created_at: {
      type: Date,
      default: Date.now
  }, changes: [{
      content: String,
      domElement: String,
      updated_at: {
        type: Date,
        default: Date.now
      }
  }]
  // created_date: {
  //   type: Date,
  //   default: Date.now
  // }
  // links: Array
});

pageSchema.virtual('uri').get(function() {
  return this.url;
});

var histSchema = new Schema({
  _pageId: Schema.Types.ObjectId,
  tracked: {
    domElement: String,
    content: String,
  },
  changes: [{
      content: String,
      updated_at: {
        type: Date,
        default: Date.now
      }
  }]
});

Page = mongoose.model('Page', pageSchema);
Hist = mongoose.model('Hist', histSchema);

module.exports = {"Page": Page, "Hist": Hist};
