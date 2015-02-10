var router = require('express').Router();

var models = require('../models');

router.get('/', function (req, res) {
	res.render('index');
});

router.get('/hotels', function (req, res, next) {
	models.Hotel
		.find({})
		.exec(function (err, hotels) {
			if (err) return next(err);
			res.json(hotels);
		});
});

router.get('/restaurants', function (req, res, next) {
	models.Restaurant
		.find({})
		.exec(function (err, restaurants) {
			if (err) return next(err);
			res.json(restaurants);
		});
});

router.get('/thingsToDo', function (req, res, next) {
	models.ThingToDo
		.find({})
		.exec(function (err, thingsToDo) {
			if (err) return next(err);
			res.json(thingsToDo);
		});
});

module.exports = router;