var Restaurant;

$(document).ready(function () {

	$.get('/restaurants', function (restaurantData) {
		Restaurant.prototype = generateAttraction({
			icon: '/images/restaurant.png',
			$listGroup: $('#my-restaurants .list-group'),
			$all: $('#all-restaurants'),
			all: restaurantData,
			constructor: Restaurant
		});

		// remove a restaurant from the current day
		Restaurant.prototype.delete = function () {
			var index = currentDay.restaurants.indexOf(this),
				removed = currentDay.restaurants.splice(index, 1)[0];
			removed
				.eraseMarker()
				.eraseItineraryItem();
		};
	});

	// construct a new restaurant for the current day
	Restaurant = function (data) {
		var self = this;
		eachKeyValue(data, function (key, val) {
			self[key] = val;
		});
		this.buildMarker()
			.drawMarker()
			.buildItineraryItem()
			.drawItineraryItem();
		currentDay.restaurants.push(this);
	}

});