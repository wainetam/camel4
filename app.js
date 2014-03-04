
/**
 * Module dependencies.
 */

var cheerio = require('cheerio'),
    request = require('request'),
    express = require('express'),
    async = require('async'),
    http = require('http'),
    Q = require('q'),
    models = require('./models');

// Nodemailer

var nodemailer = require("nodemailer");

var swig = require('swig'); // added to access Swig

var routes = require('./routes');
var user = require('./routes/user');
var path = require('path');

var app = express();
app.engine('html', swig.renderFile);

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
app.post('/submit', routes.submit);

app.get('/users', user.list);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Nodemailer

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "jollytracker@gmail.com",
        pass: "jollytracker14"
    }
});

var mailOptions = {
    from: "Jolly Tracker ✔ <jollytracker@gmail.com>", // sender address
    to: "wainetam@gmail.com", // list of receivers
    subject: "Tracked Content has Changed! ✔", // Subject line
    text: "Hello world ✔", // plaintext body
    html: "<b>Hello world ✔</b>" // html body
};

var sendMail = function() {
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }
    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
  });
};

// end Nodemailer

// pull URLs from DB to crawl
var dbPagesToCrawl;

var compileToCrawl = function(cb) { // return pages from DB
  console.log("in compileToCrawl func");

  models.Page.find({}, function(err, pages) { // pages is an array

    if(err) {
      console.log(err);
    }
    console.log("dbPagesToCrawl pages ", pages);
    dbPagesToCrawl = pages;

    cb(null);
  });
  // console.log("dbPagesToCrawl before callback in compile func ", dbPagesToCrawl);
};

// var homeUrlObj = { uri: "http://careerosity.com" };
// var baseUrlObj = { uri: "http://careerosity.com/questions" };
var baseUrlObj = { url: "http://192.168.1.174:3000/wiki/53038d9e4c5bd73d293062e3", domElement: "h3" };
// var loginUrlObj = { uri: "http://192.168.1.177:3000/login" };
var trackedElement = 'h3';

// helper function for creating a full URL
var addBaseUrl = function(url) {
  return baseUrlObj.url + url;
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

var cookieJar = request.jar();
var request = request.defaults({jar: cookieJar});

// develop input for pageLink search:

// check initial state vs current state

// var changeDetect = function(urlObj, body, tag) {
//   var url = urlObj.url;

//   $ = cheerio.load(body);

//   var currTrackedItem = $("'" + tag + "'").text();
//   console.log('currtrackedItem: ', currtrackedItem);

//   if(currTrackedItem !== initTrackedItem) {
//     console.log('The item changed bitch!');
//   }
// };

// var firstRun = true;

var getAndCrawlLink = function(urlObj, done) {
  // console.log('FIRSTRUN?', firstRun);
  // debugger;
  var url = urlObj.url;
  var domElement = urlObj.domElement;

  // console.log("Crawling URL: ", url);
  // if(url === 'http://192.168.1.174:3000/wiki/53038d9e4c5bd73d293062e3') {
  //   console.log("YES");
  // } else {
  //   console.log("NO!");
  // }

  var linksToCrawl = [];
  var title;
  var pageHtml = request(urlObj, function(err, response, body) { // request takes an object w parameters: method, uri
    // var linksToCrawl = [];
    console.log('urlObj as input to request func: ', urlObj);
    console.log('In request function...');
    // console.log('response before Capturing cookie ', response);
    // console.log('body before Capturing cookie ', body);

    // KILLED COOKIEJAR
    // console.log("URL OBJ" + urlObj);
    //   console.log("ERR: " + err);
    if(err && response.statusCode !== 200) {
      console.log('Request error.');
    }
    console.log('Capturing cookie: ', cookieJar.getCookieString(response.request.uri));
    // END COOKIEJAR

    $ = cheerio.load(body);

    // var pageLinks = $("a"); // get all the links on your page to wiki pages
    // title = $('title').text();

    // var matchedLinks = pageLinks.filter(function(index, link) {
    //   if($(link).attr('href').match(/^\/wiki/)) {
    //   // if($(link).attr('href').match(/^\/questions/)) {
    //     return true;
    //   }
    // });

    // matchedLinks.map(function(index, link) {
    //   var href = $(link).attr('href');

    //   fullUrl = addBaseUrl(href);

    //   linksToCrawl.push(fullUrl);
    //   console.log('linksToCrawl ', linksToCrawl);
    //   console.log('Next URL to validate if not visited ', fullUrl);
    //   console.log('Current visitedLinks ', visitedLinks);
    // });


    // var pageObj = new Page(url, linksToCrawl, title, tracked);

    var pageObj, histObj;

    // models.Page.update( {"url": url}, {$set: { "title": title, "tracked": tracked } }, {upsert: true});
    // });

// http:stackoverflow.com/questions/4185105/ways-to-implement-data-versioning-in-mongodb

    // models.Page.findOne({ "url": url }, function(err, data) {
    models.Page.findOne({ "url": url, "domElement": domElement }, function(err, data) {
      // var trackedElement = 'h3';
      // var trackedElement = data.currentState.domElement;
      // var trackedContent = $(trackedElement).text();
      var currentContent = $(domElement).text();
      // var currentState = { "domElement": trackedElement, "content": trackedContent };

      if(err) {
          console.log(err);
      }

      if(data) { // URL already in database
        // console.log('DATA ', data);
        // if(data.currentState.domElement === trackedElement && data.currentState.content !== trackedContent) {
        if(data.currentContent !== currentContent) {
          console.log('CONTENT CHANGED at: ', url);
          // sendMail(); //send email to user
          // models.Page.update( { "url": url} , {$set: {"currentState": currentState}, $push: {"changes" : { "content": trackedContent, "domElement": trackedElement }}}, {upsert: true}, function(err, data) {
          models.Page.update( { "url": url, "domElement": domElement} , {$set: {"currentContent": currentContent}, $push: {"changes" : { "content": currentContent }}}, {upsert: true}, function(err, data) {
            console.log('Added to history! ', data);
          });
        }

        // else if(data.currentState.domElement === trackedElement && data.currentState.content === trackedContent) { // no change in page
        else { // no change in page
          console.log('NO CHANGE TO: ', url);
        }

        // else {
        //   console.log('The DOM element we were tracking changed');
        //   models.Page.update( { "url": url} , {$push: {"changes" : { "content": trackedContent, "domElement": trackedElement }}}, {upsert: true}, function(err, data) {
        //     console.log('Added to history! ', data);
        //   });
        // }
      } else { // new URL added to database
        // models.Page.create({ "url": url, "links": linksToCrawl, "title": title, "tracked": tracked }, function(err, data) {
          // {$push: {"changes" : { "content": currentContent }}}
          var initContent = currentContent;
          models.Page.create( { "url": url, "domElement": domElement, "title": title, "currentContent": currentContent, "initContent": initContent }, function(err, data) {
          console.log('New URL object created in DB! ', data);
        });
      }
      done();
    });

    // var pageObj = new Page(url, links);
    urlToPage[url] = pageObj;
    visitedLinks.push(url); // link var in getAndCrawlLink
    // console.log('visitedLinks ', visitedLinks);
    // console.log('urlToPage ', urlToPage);
    // console.log('Length of linksToCrawl as done crawling one link: ', linksToCrawl.length, pageObj.url);
    // done(); // notify workerQueue that we're done

  });
};

// Crawler Worker
var crawlWorker = function(urlObj, done) {
  getAndCrawlLink(urlObj, done);
};

var concurrency = 2;

var workerQueue = async.queue(crawlWorker, concurrency);

// var postBot = function(urlObj, done) {
//   request(urlObj, function(err, response, body) {
//     console.log('in post function...');
//     console.log('Capturing cookie: ', cookieJar.getCookieString(response.request.url));

//   if(err && response.statusCode !== 200) {
//       console.log('Request error.');
//     } else {
//       console.log(body);
//     }
//     done();
//   });
// };

// var postingQueue = async.queue(function(urlObj, done) {
//   postBot(urlObj, done);
// }, concurrency);


// addPostUrlObj = { uri: 'http://192.168.1.177:3000/page/new' };

// submitPostUrlObj1 = { uri: 'http://192.168.1.177:3000/page', method: 'POST', form: {title: 'Dummy Title', name: 'Dummy Name', body: 'Dummy'} };
// submitPostUrlObj2 = { uri: 'http://192.168.1.177:3000/page', method: 'POST', form: {title: 'Idiot Title', name: 'Idiot Name', body: 'Idiot'} };
// submitPostUrlObj3 = { uri: 'http://192.168.1.177:3000/page', method: 'POST', form: {title: 'Boring Title', name: 'Boring Name', body: 'Boring'} };
// submitPostUrlObj4 = { uri: 'http://192.168.1.177:3000/page', method: 'POST', form: {title: 'Whatever Title', name: 'Whatever Name', body: 'Whatever'} };
// urlObjArr = [submitPostUrlObj1, submitPostUrlObj2, submitPostUrlObj3, submitPostUrlObj4];

// use async module to guarantee that we crawl before we boot the web server


var queuePush = function(pageObj, cb) {
  var pageObjJSON = pageObj.toJSON(); // Request no like mongoose document; need to convert to JSON
  workerQueue.push(pageObjJSON);
  console.log('pageObj pushed to workerQueue ', pageObjJSON);
  cb(null);
};

// var fillQueue = function() {
//   compileToCrawl(function() {
//     async.each(dbPagesToCrawl, queuePush, function(err) {
//       if(err) {
//         console.log(err);
//       }
//       console.log('all workers pushed!');
//       // push each url into Queue
//     });
//   });
// };

var appStart = function() {
  async.series([
    function(callback) {
      workerQueue.push(baseUrlObj);
        workerQueue.drain = function() {
          callback(null);
        };
    },
    function(callback) {
      compileToCrawl(callback);
      // console.log('dbPages to Crawl in Async Series ', dbPagesToCrawl);
      workerQueue.drain = function() {
        // console.log('FIRST CRAWL DONE');
        // don't boot up the express server until we're finished crawling
        callback(null);
      };
    },
    function(callback) {
      setTimeout(function() {
        console.log('DELAY COMPLETED');
        callback(null);
      }, 2000);
    },
    function(callback) {
      console.log("dbPagesToCrawl before Push to WQ: ", dbPagesToCrawl);
      async.each(dbPagesToCrawl, queuePush, function(err) {
        if(err) {
          console.log(err);
        }
        console.log('all workers pushed!');
        // push each url into Queue
        callback(null);
      });
    // },
    // function(callback) {
    //   workerQueue.drain = function() {
    //     setTimeout(function() {
    //       console.log('all items have been processed');
    //       console.log('*****************************');
    //       appStart();
    //     }, 10000);
    //   };
    }
  ]);
};

appStart();
