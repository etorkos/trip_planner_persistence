var ThingToDo;

$(document).ready(function () {

	$.get('/thingsToDo', function (data) {
		ThingToDo.prototype = generateAttraction({
			icon: '/images/star-3.png',
			$listGroup: $('#my-things-to-do .list-group'),
			$all: $('#all-things-to-do'),
			all: data,
			constructor: ThingToDo
		});

		// remove a thing to do from the current day
		ThingToDo.prototype.delete = function () {
			var index = currentDay.thingsToDo.indexOf(this),
				removed = currentDay.thingsToDo.splice(index, 1)[0];
			removed
				.eraseMarker()
				.eraseItineraryItem();
		};
	});

	// construct a new thing to do for the current day
	ThingToDo = function (data) {
		var self = this;
		eachKeyValue(data, function (key, val) {
			self[key] = val;
		});
		this.buildMarker()
			.drawMarker()
			.buildItineraryItem()
			.drawItineraryItem();
		currentDay.thingsToDo.push(this);
	}

});