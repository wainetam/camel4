var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/camel4');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));

var Page, Hist;
var Schema = mongoose.Schema;

var pageSchema = new Schema({
  url: String,
  domElement: String,
  title: String,
  currentContent: String,
  initContent: String,

  created_at: {
    type: Date,
    default: Date.now
  },
  changes: [{
    content: String,
    // domElement: String,
    updated_at: {
      type: Date,
      default: Date.now
    }
  }]
});

pageSchema.virtual('last_changed_at').get(function() {
  try {
    console.log('THIS.CHANGES', this.changes);
    return this.changes[this.changes.length-1].updated_at;
  } catch(err) {
    console.log(err);
    return "Unchanged";
  }
});

pageSchema.set('toJSON', { getters: true }); // don't convert to JSON when render (so can recog virtual setters)
pageSchema.set('toObject', { getters: true });

// pageSchema.virtual('uri').get(function() {
//   return this.url;
// });

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
