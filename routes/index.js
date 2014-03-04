
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

  models.Page.create({ "url": url, "initContent": domContent, "domElement": domElement });
  res.send(200, "You got it.");
  // res.redirect('/');
};
