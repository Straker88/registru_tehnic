var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');
var passport = require('passport');
var social = require('./app/passport/passport')(app, passport);

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);
mongoose.set('bufferCommands', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/registruTehnic', {
	bufferMaxEntries: 0,
	useNewUrlParser: true,
});

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function () {
	console.log('Running the server on port ' + port);
});
