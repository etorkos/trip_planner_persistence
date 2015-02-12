var dayRouter = require('express').Router();
var attractionRouter = require('express').Router();
var models = require('../models');
var async = require('async');
// GET /days
dayRouter.get('/', function (req, res, next) {
    // serves up all days as json
    models.Day.find().populate('hotel restaurants thingsToDo').exec(function(error, data){ 
        console.log(data);
        res.json(data);
    })
});
// POST /days
dayRouter.post('/', function (req, res, next) {
    // creates a new day and serves it as json
    models.Day.find(function(err, data){
    	if(err) throw err;
    	 var num = data.length+1;
    	 var newDay = new models.Day({number: num});
    	 newDay.save(function(err, data){
    	 	console.log('got through the post request');
    	 	if (err) throw err;
    	 	//console.log(data);
    	 	res.json(data);
    	 });
    })
    
});
// GET /days/:id
dayRouter.get('/:id', function (req, res, next) {
	var id = req.params.id
    // serves a particular day as json
    models.Day.findOne({number: id}).populate('hotel restaurants thingsToDo').exec(function(error, data){ 
        console.log(data);
    	res.json(data);
    })
});
// DELETE /days/:id
dayRouter.delete('/:id', function (req, res, next) {

	var id = Number(req.params.id); // deletes a particular day
		console.log('got to delete with ', id);
    models.Day.find(function(err, data){ //find # of days
    	var numDays= data.length;
    	console.log('There are '+numDays+ " days");
    	
	    models.Day.findOne({number: id}, function(error, data){
	    	if(error) throw error;
            })
        .remove(function(error, data){
                   if(numDays == id){//if deleting last day, we're done
                        res.send("day "+id+ " removed!"); 
                    }
                    models.Day.find({"number": {$gt: id}}, function(err, days){
                        function decrement (day, callback){
                            console.log("reducing day ", day.number, " to ", day.number-1);
                            day.update({number: day.number-1}, function(err, data){
                                callback(err,data);

                            })
                        }
                        async.map(days, decrement, function(err, result){
                            if(err) throw err;
                            res.send("removed days");
                        })
                        // days.forEach(function(day){
                        //     console.log("reducing day ", day.number, " to ", day.number-1);
                        //     day.number = day.number--;
                        //     day.save().exec()
                        // })
                        // res.send("removed days");
                    })
                    
        })	
	    	
	})
});

//dayRouter.use('/:id', attractionRouter);
// POST /days/:id/hotel
dayRouter.post('/:id/hotel', function (req, res, next) {
    // creates a reference to the hotel
    var id = Number(req.params.id);
    var hotelFrontEnd = req.body;

    models.Day.find({number: id}).update({hotel: hotelFrontEnd._id}, function(err, updateObj){
            if (err) throw err;
            console.log(updateObj);
            res.send('Attached Hotels');           
        })
    
});
// DELETE /days/:id/hotel
dayRouter.delete('/:id/hotel', function (req, res, next) {
    // deletes the reference of the hotel
});
// POST /days/:id/restaurants
dayRouter.post('/:id/restaurants', function (req, res, next) {
    // creates a reference to a restaurant
    var id = Number(req.params.id);
    var restFrontEnd = req.body;

    models.Day.find({number: id}).update({restaurants: restFrontEnd._id}, function(err, updateObj){
            if (err) throw err;
            res.send('Attached restaurants');           
        })
});
// DELETE /days/:dayId/restaurants/:restId
dayRouter.delete('/:id/restaurants/:id', function (req, res, next) {
    // deletes a reference to a restaurant
});
// POST /days/:id/thingsToDo
dayRouter.post('/:id/thingsToDo', function (req, res, next) {
    // creates a reference to a thing to do
    var id = Number(req.params.id);
    var ttdFrontEnd = req.body;

    models.Day.find({number: id}).update({thingsToDo: ttdFrontEnd._id}, function(err, updateObj){
            if (err) throw err;
            res.send('Attached Hotels');           
        })
});
// DELETE /days/:dayId/thingsToDo/:thingId
dayRouter.delete('/:id/thingsToDo/:id', function (req, res, next) {
    // deletes a reference to a thing to do
});



module.exports = dayRouter;