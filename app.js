
/**
 * Module dependencies.
 */

var cheerio = require('cheerio'),
    request = require('request'),
    express = require('express'),
    async = require('async'),
    http = require('http');
    models = require('./models');

    // swig = require('swig');

var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3333);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// var homeUrlObj = { uri: "http://careerosity.com" };
// var baseUrlObj = { uri: "http://careerosity.com/questions" };
var baseUrlObj = { uri: "http://192.168.1.174:3000/wiki/53038d9e4c5bd73d293062e3" };
// var loginUrlObj = { uri: "http://192.168.1.177:3000/login" };
var trackedElement = 'h3';

// helper function for creating a full URL
var addBaseUrl = function(url) {
  return baseUrlObj.uri + url;
  // return baseUrl + url;
};

var Page = function(url, links, title, tracked) {
  this.url = url;
  this.links = links;
  this.title = title;
  this.tracked = { domElement: "", content: ""};
};

var visitedLinks = [];
var urlToPage = {}; // keys are URLs, values are Page objects
var toCrawl = [];

var cookieJar = request.jar();

var request = request.defaults({jar: cookieJar});


// develop input for pageLink search:

// check initial state vs current state

var changeDetect = function(urlObj, body, tag) {
  var url = urlObj.uri;

  $ = cheerio.load(body);

  var currTrackedItem = $("'" + tag + "'").text();
  console.log('currtrackedItem: ', currtrackedItem);

  if(currTrackedItem !== initTrackedItem) {
    console.log('The item changed bitch!');
  }
};

// var firstRun = true;

var getAndCrawlLink = function(urlObj, done) {
  // console.log('FIRSTRUN?', firstRun);

  var url = urlObj.uri;

  console.log("Crawling URL: ", url);

  var linksToCrawl = [];
  var title;
  var pageHtml = request(urlObj, function(err, response, body) {
    // var linksToCrawl = [];
    console.log('In request function...');
    console.log('Capturing cookie: ', cookieJar.getCookieString(response.request.uri));

    if(err && response.statusCode !== 200) {
      console.log('Request error.');
    }

    $ = cheerio.load(body);

    // var pageLinks = $(".qabubble .question"); // get all the links on your page to wiki pages
    var pageLinks = $("a"); // get all the links on your page to wiki pages
    // console.log('pageLinks ', pageLinks);
    title = $('title').text();


    // console.log('TITLE ', title);
    // debugger;

    var matchedLinks = pageLinks.filter(function(index, link) {
      if($(link).attr('href').match(/^\/wiki/)) {
      // if($(link).attr('href').match(/^\/questions/)) {
        return true;
      }
    });

    matchedLinks.map(function(index, link) {
      var href = $(link).attr('href');

      fullUrl = addBaseUrl(href);

      linksToCrawl.push(fullUrl);
      // console.log('Length of linksToCrawl as finding matching links for stated link: ', linksToCrawl.length, href);
      // console.log(index, " ", href);
      console.log('linksToCrawl ', linksToCrawl);
      console.log('Next URL to validate if not visited ', fullUrl);
      console.log('Current visitedLinks ', visitedLinks);

      // if(visitedLinks.indexOf(fullUrl) === -1) {
      //   console.log('In recursive condition...next URL to potentially crawl: ', fullUrl);
      //   workerQueue.push({uri: fullUrl});
      // }
    });


    // var pageObj = new Page(url, linksToCrawl, title, tracked);

    var pageObj, histObj;

    // models.Page.update( {"url": url}, {$set: { "title": title, "tracked": tracked } }, {upsert: true});
    // });

// http:stackoverflow.com/questions/4185105/ways-to-implement-data-versioning-in-mongodb

    models.Page.findOne({ "url": url }, function(err, data) {
      var trackedElement = 'h3';
      var trackedContent = $(trackedElement).text();
      var currentState = { "domElement": trackedElement, "content": trackedContent };

      if(err) {
          console.log(err);
      }

      if(data) { // URL already in database
        // console.log('DATA ', data);
        if(data.currentState.domElement === trackedElement && data.currentState.content !== trackedContent) {
          console.log('THE PRICE CHANGED!');
          models.Page.update( { "url": url} , {$set: {"currentState": currentState}, $push: {"changes" : { "content": trackedContent, "domElement": trackedElement }}}, {upsert: true}, function(err, data) {
            console.log('Added to history! ', data);
          });
        }

        else if(data.currentState.domElement === trackedElement && data.currentState.content === trackedContent) { // no change in page
          console.log('NO CHANGE TO PAGE!');
        }

        else {
          console.log('The DOM element we were tracking changed');
          models.Page.update( { "url": url} , {$push: {"changes" : { "content": trackedContent, "domElement": trackedElement }}}, {upsert: true}, function(err, data) {
            console.log('Added to history! ', data);
          });
        }
      }

        // models.Page.update({ "url": url, "title": title, "currentState": currentState },  {upsert: true}, function(err, data) {
        //   console.log('Record exists! ', url);

        //   // console.log("DATA", data);
        //   var id = data._id; // id of object
        //   console.log("ID", id);

        //   // models.Hist.create({ "url": url} );

        //   models.Hist.update( { "url": url} , {$push: {"changes" : { "content": trackedContent }}}, {upsert: true}, function(err, data) {

        //   // models.Hist.update( { "url": url} , {$set: { "tracked" : tracked}, $push: {"changes" : { "content": trackedContent }}}, {upsert: true}, function(err, data) {
        //   // models.Hist.update( { "url": url} , {$set: { "tracked" : tracked, "changes" : { "content": trackedContent, "date": new Date()} } }, {upsert: true}, function(err, data) {
        //       console.log('Added to history! ', data);
        //   });
        // });
      else { // new URL added to database
        // models.Page.create({ "url": url, "links": linksToCrawl, "title": title, "tracked": tracked }, function(err, data) {
          models.Page.create({ "url": url, "title": title, "currentState": currentState }, function(err, data) {
          console.log('New URL object created in DB! ', data);

          // console.log("DATA", data);
          // var id = data._id; // id of object
          // console.log("ID", id);

          // models.Hist.create({ "url": url} );

          // models.Hist.update( { "url": url} , {$push: {"changes" : { "content": trackedContent }}}, {upsert: true}, function(err, data) {

          // models.Hist.update( { "url": url} , {$set: { "tracked" : tracked}, $push: {"changes" : { "content": trackedContent }}}, {upsert: true}, function(err, data) {
          // models.Hist.update( {"url": url} , {$set: { "tracked" : tracked, "changes" : { "content": trackedContent, "date" : new Date()} } }, {upsert: true}, function(err, data) {
              // console.log('Versioning started ', data);
          // });
        });
      }
    });

    // var pageObj = new Page(url, links);
    urlToPage[url] = pageObj;
    visitedLinks.push(url); // link var in getAndCrawlLink
    // console.log('visitedLinks ', visitedLinks);
    console.log('urlToPage ', urlToPage);
    // console.log('Length of linksToCrawl as done crawling one link: ', linksToCrawl.length, pageObj.url);
    done(); // notify workerQueue that we're done

  });
};


// Crawler Worker
var crawlWorker = function(urlObj, done) {
  getAndCrawlLink(urlObj, done);
};

var concurrency = 2;

var workerQueue = async.queue(crawlWorker, concurrency);

var postBot = function(urlObj, done) {
  request(urlObj, function(err, response, body) {
    console.log('in post function...');
    console.log('Capturing cookie: ', cookieJar.getCookieString(response.request.uri));

  if(err && response.statusCode !== 200) {
      console.log('Request error.');
    } else {
      console.log(body);
    }
    done();
  });
};

var postingQueue = async.queue(function(urlObj, done) {
  postBot(urlObj, done);
}, concurrency);


// addPostUrlObj = { uri: 'http://192.168.1.177:3000/page/new' };

// submitPostUrlObj1 = { uri: 'http://192.168.1.177:3000/page', method: 'POST', form: {title: 'Dummy Title', name: 'Dummy Name', body: 'Dummy'} };
// submitPostUrlObj2 = { uri: 'http://192.168.1.177:3000/page', method: 'POST', form: {title: 'Idiot Title', name: 'Idiot Name', body: 'Idiot'} };
// submitPostUrlObj3 = { uri: 'http://192.168.1.177:3000/page', method: 'POST', form: {title: 'Boring Title', name: 'Boring Name', body: 'Boring'} };
// submitPostUrlObj4 = { uri: 'http://192.168.1.177:3000/page', method: 'POST', form: {title: 'Whatever Title', name: 'Whatever Name', body: 'Whatever'} };
// urlObjArr = [submitPostUrlObj1, submitPostUrlObj2, submitPostUrlObj3, submitPostUrlObj4];

// use async module to guarantee that we crawl before we boot the web server
async.series([
  // function(callback) {
  //   workerQueue.drain = function() {
  //     // don't boot up the express server until we're finished crawling (no events in queue)
  //     callback(null);
  //  };
  // },
  // function(callback) {
  //   // crawl a wiki stack
  //   console.log("Trying to login via POST...");
  //   // workerQueue.push({url: baseUrl});
  //   workerQueue.push({ uri: loginUrlObj.uri, method: 'POST', form: {username: 'waine', password: 'waine'} });
  //   workerQueue.drain = function() {
  //     // don't boot up the express server until we're finished crawling
  //     callback(null);
  //   };
  // },
  function(callback) {
    workerQueue.push(baseUrlObj);
    workerQueue.drain = function() {
      console.log('FIRST CRAWL DONE');
      // don't boot up the express server until we're finished crawling
      callback(null);
    };
  },
  function(callback) {
    setTimeout(function() {
      callback(null);
    }, 1000);
    workerQueue.drain = function() {
      console.log('DELAY COMPLETED');
      // don't boot up the express server until we're finished crawling
      callback(null);
    };
  },
  function(callback) {
    workerQueue.push(baseUrlObj);
    workerQueue.drain = function() {
      console.log('SECOND CRAWL DONE');
      // don't boot up the express server until we're finished crawling
      callback(null);
    };
  },
  function(callback) {
    setTimeout(function() {
      callback(null);
    }, 1000);
    workerQueue.drain = function() {
      console.log('DELAY COMPLETED');
      // don't boot up the express server until we're finished crawling
      callback(null);
    };
  },
  function(callback) {
    workerQueue.push(baseUrlObj);
    workerQueue.drain = function() {
      console.log('THIRD CRAWL DONE');
      // don't boot up the express server until we're finished crawling
      callback(null);
    };
  }
  // ,
  // function(callback) {
  //   // boot the server
  //   http.createServer(app).listen(app.get('port'), function(){
  //     console.log('Express server listening on port ' + app.get('port'));
  //   });
  // }
]);


