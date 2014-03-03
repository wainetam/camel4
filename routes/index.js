
/*
 * GET home page.
 */

$ = require('cheerio');

exports.index = function(req, res){
  res.render('index');
};

exports.submit = function(req, res) {
  var url = req.body.url;
  var domElement = req.body.domElement;

  $ = cheerio.load(body);
  var domContent = $(domElement.text());

  models.Page.create({ "url": url, "currentState.domElement": domElement });

  res.redirect('/');
};
