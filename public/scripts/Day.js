var Day;

$(document).ready(function () {

	console.log('into the document.ready.')
	$.ajax({type:'GET', url:"/days", data: null}).then(function(data){
		data.forEach(function(date){
			console.log(date.number, "is being created");
			var newDay = new Day(date.number);
			newDay.number = date.number;
			newDay.hotel = date.hotel;
			newDay.restaurants = date.restaurants;
			newDay.thingsToDo = date.thingsToDo;
			days.push(newDay);
			if(date.number === 1){
				currentDay = newDay;
				currentDay.$button.addClass('current-day');
			}
		});
		if(data.length == 0){
			currentDay = new Day(1);
			days.push(currentDay);
			currentDay.$button.addClass('current-day');
			addDay();
		}
	});


	

	Day = function (num) {
		this.hotel = null;
		this.restaurants = [];
		this.thingsToDo = [];
		this.number = num;
		//days.push(this);

		this.buildButton()
			.drawButton();
	}

	Day.prototype.buildButton = function () {
		this.$button = $('<button class="btn btn-circle day-btn"></button>').text(this.number);
		var self = this;
		this.$button.on('click', function () {
			self.switchTo();
		});
		return this;
	};

	Day.prototype.drawButton = function () {
		var $parent = $('.day-buttons');
		this.$button.appendTo($parent);
		return this;
	};

	Day.prototype.eraseButton = function () {
		this.$button.detach();
		return this;
	};

	Day.prototype.switchTo = function () {
		function eraseOne (attraction) {
			attraction.eraseMarker().eraseItineraryItem();
		}
		console.log(currentDay);
		if (currentDay.hotel) eraseOne(currentDay.hotel);
		currentDay.restaurants.forEach(eraseOne);
		currentDay.thingsToDo.forEach(eraseOne);

		function drawOne (attraction) {
			attraction.drawMarker().drawItineraryItem();
		}
		var domain = this;
		console.log(this);
		$.ajax({type: "GET", url:'/days/'+this.number, data: null}).then(function(data){
			
			domain.hotel = data.hotel;
			domain.restaurants = data.restaurants;
			domain.thingsToDo = data.thingsToDo;

			if (domain.hotel) drawOne(data.hotel);
			domain.restaurants.forEach(drawOne);
			domain.thingsToDo.forEach(drawOne);

			currentDay.$button.removeClass('current-day');
			currentDay.$button = domain.$button;
			currentDay.$button.addClass('current-day');
			$('#day-title > span').text('Day ' + data.number);
			currentDay = domain;

		})

	};

	function deleteCurrentDay () {
		if (days.length > 1) {
			
			var index = days.indexOf(currentDay),
				previousDay = days.splice(index, 1)[0],
				newCurrent = days[index] || days[index - 1];
			console.log("deleting day from the front end");
			days.forEach(function (day, idx) {
				day.number = idx + 1;
				day.$button.text(day.number);
			});
			
			newCurrent.switchTo();
			previousDay.eraseButton();
		}
	};

	function addDay (){
			$.ajax({type:"POST", url:'/days', data: null }).done(function(data, err){
			var newDay = new Day(data.number);
			days.push(newDay);
			});
		}

	$('#add-day').on('click', function () {	
		addDay();
	});

	$('#day-title > .remove').on('click', function(){
		console.log('got to remove');
		$.ajax({type:"DELETE", url:'/days/'+currentDay.number, data: null}).done(function(){
				console.log("all done");
				deleteCurrentDay();
		});
	});
});