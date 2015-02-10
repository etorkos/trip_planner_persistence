var generateAttraction;

$(document).ready(function () {
	generateAttraction = function (config) {
		config.$all.find('.add').on('click', function () {
			var attraction = config.$all.find(':selected').data();
			new config.constructor(attraction);
		});
		config.all.forEach(function (attraction) {
			var $option = $('<option></option>').text(attraction.name).data(attraction);
			config.$all.find('select').append($option);
		});
		return {
			// erase an attraction's marker
			eraseMarker: function () {
				this.marker.setMap(null);
				narrowBounds(this.marker);
				return this;
			},

			// build but do not render an attraction's marker
			buildMarker: function () {
				var location = this.place[0].location;
				this.marker = new google.maps.Marker({
					position: new google.maps.LatLng(location[0], location[1]),
					icon: config.icon
				});
				return this;
			},

			// draw an attraction's marker on the screen
			drawMarker: function () {
				this.marker.setMap(map);
				extendBounds(this.marker);
				return this;
			},

			// erase an attraction's itinierary item view
			eraseItineraryItem: function () {
				this.$itineraryItem.detach();
				return this;
			},

			// build but do not render an attraction's itinierary item view
			buildItineraryItem: function () {
				var $title = $('<span class="title"></span>').text(this.name),
					$button = $('<button class="btn btn-xs btn-danger remove btn-circle">x</button>');
				var $item = $('<div class="itinerary-item"></div>')
					.append($title)
					.append($button);
				this.$itineraryItem = $item;
				var self = this;
				$button.on('click', function () {
					self.delete();
				});
				return this;
			},
			
			// draw an attraction's itinerary view on the screen
			drawItineraryItem: function () {
				config.$listGroup.append(this.$itineraryItem);
				return this;
			}
		};
	}
});