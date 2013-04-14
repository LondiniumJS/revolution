'use strict';

var express = require("express");
var async = require("async");
var redis = require("redis");
var http = require('http');
var engine = require('ejs-locals');
var mongoose = require('mongoose');
var _ = require('underscore');
var Extend = require('./model').Extend();
var TwitterLookup = require('./model').TwitterLookup();
var Topic = require('./model').Topic();

var data = {
  extended: require('./json/extended'),
  graph: require('./json/graph'),
  topics: require('./json/topics'),
  twitter_lookup: require('./json/twitter_lookup')
};

var app = module.exports = express();

app.locals({_layoutFile: true});

app.configure(function () {
  app.set("views", __dirname + "/views");
  app.set("view engine", "ejs");
  app.engine('ejs', engine);
  app.engine("html", engine);
  app.use(express.bodyParser());
  app.use(express.cookieParser("alskjald0q9udqokwdmqldiqud0woqijdklq09"));
  app.use(express.session());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + "/static"));
  app.use(app.router);
});

app.get('/', function(req, res) {
 /* Extend.find({}).select('peerindex_id twitter peerindex authority audience activity').sort('-peerindex').exec(function(err, docs){
    var new_docs = [];
    var i = 0;
	var new_docs2 = [];
	
    async.eachSeries(
      docs,
      function (doc, callback) {
		  //var new_doc;
        TwitterLookup.findOne({id: doc.twitter.id}).select("description followers_count statuses_count name screen_name url").exec( function(err, obj) {
          var new_doc = _.extend(doc.toObject(), obj.toObject());
          new_docs.push(new_doc);
		  
		  
		  
	      Topic.findOne({peerindex_id: doc.peerindex_id}).select("benchmark_topics").exec( function(err, obj) {
			  //console.log(doc, obj);
			  //console.log(obj.benchmark_topics);
  
			  if (obj == null) obj = { benchmark_topics: [ ] };
			  else obj = obj.toObject();
	          var new_doc2 = _.extend(new_doc, obj);
			  //if (obj != null) {var new_doc2 = _.extend(doc.toObject(), obj.toObject());}
  
			  //console.log(new_doc2.benchmark_topics[1].name);
    
			  new_docs2.push(new_doc2);
	          callback(err, obj);
	          console.log(++i);
	        });
		  
		  
		  
		  
		  
		  
          //callback(err, obj);
          //console.log(++i);
        });	
		
      
		
	
		
      },
      function (err, result) {
        console.log(new_docs2);
        res.locals.users = JSON.stringify(new_docs2);*/
        res.render('index');
     /* }
    );


  });*/
});

function pick (params, condition) {
  return function (a) {
    var b = _.pick(a, params);
    return condition ? b : a;
  }
}

app.get('/api/top300', function(req, res) {
  Extend.find({}).sort('peerindex').exec(function(err, docs){
    console.log(docs);
    res.json(docs);
  });
});

app.get('/api/extended', function(req, res) {
  var params = _.keys(req.query);
  data.extended = _.map(data.extended, pick(params, params.length > 0));
  res.json(data.extended);
});

app.get('/api/graph', function(req, res) {
  res.json(data.graph);
});

app.get('/api/topics', function(req, res) {
  res.json(data.topics);
});

app.get('/api/twitter_lookup', function(req, res) {
  var params = _.keys(req.query);
  data.twitter_lookup = _.map(data.twitter_lookup, pick(params, params.length > 0));
  res.json(data.twitter_lookup);
});

app.get('*', function(req, res){
  res.redirect("/");
});

var port = process.env.PORT || 1200;
var server = http.createServer(app).listen(port, function () {
	console.log("Verses server escucha sobre ", server.address().port, app.settings.env);
});