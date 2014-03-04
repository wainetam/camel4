
/*
 * GET home page.
 */

var Q = require('q');
var request = require('request');
var models = require('../models');
var cheerio = require('cheerio');

var httpGet = function(url) {
  console.log('in HTTP GET');
  var deferred = Q.defer();
  console.log("httpGet url: ", url);
  // request(url, deferred.resolve);
  request(url, function(error, response, body) {
    if(error) {
      console.log('ERROR before promise rejection', error);
      deferred.reject(error);
    }
  // //   console.log("args inside request: ", arguments);
  // //   console.log("err inside request: ", error);
  // //   console.log("response inside request: ", response);
    deferred.resolve(response);
  });
  console.log('promise', deferred.promise);
  return deferred.promise;
};

var validUrl = function(url) {
  console.log('url in validURL', url);
  var deferred = Q.defer();
  httpGet(url)
    .then(function(response) {
    // console.log('ARGUMENTS: ', arguments);
      console.log('response: ', response);
      // console.log('body: ', response.body);
      // console.log('in validURL func');
      // var validTest = (!error && response.statusCode == 200);
      // console.log('validTest result ', validTest);
      if(response.statusCode == 200) {
        console.log('validTest!');
        // console.log('BODY', response.body);
        deferred.resolve(response);
      } else {
        console.log('IN ELSE'); // NEVER HERE
        deferred.reject(error);
      }
    })
    .fail(function(error) {
      console.log('ERROR in validURL', error);
    });
    // if(validTest) {
    //   models.Page.create({ "url": url, "initContent": domContent, "domElement": domElement });
    //   res.send(200, "You got it.");
    // } else {
    //   console.log('invalid URL!');
    //   res.json( {urlError: 'Invalid URL. Please try again!' });
    // }
  // });
  return deferred.promise; // should this be here??
};

exports.index = function(req, res){
  res.render('index');
};

exports.submit = function(req, res) {
  console.log('in submit route');
  // console.log('req.body ', req.body);
  var url = req.body.url;
  var domElement = req.body.domElement;

  console.log('URL before running in validUrl Func', url);

  validUrl(url)
    .then(function(response) {
      $ = cheerio.load(response.body);
      // console.log('BODY in submit', response.body);
      // var url = req.body.url;
      // var domElement = req.body.domElement;
      var domContent = $(domElement).text();
      // var domContent = "placeholder";
      models.Page.create({ "url": url, "initContent": domContent, "domElement": domElement });
      res.send(200, "You got it.");
    })
    .fail(function(error) {
      console.log('error: ', error);
      console.log('invalid URL!');
      res.json( {urlError: 'Invalid URL. Please try again!' });
    });
};

exports.partials = function(req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};









