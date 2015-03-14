/*
Final Project : Website Designing
Author : Shalini Krishnamoorthi
File Name : javascript.js
Version 1 : 03/05/2015
*/

jQuery(document).ready(function($){
    console.log("my javascript");
	var pagePathName = window.location.href;
	var currentPage = pagePathName.substring(pagePathName.lastIndexOf("/") + 1);
	console.log(currentPage);
 
 	/* 1. & 5. Header and Footer with IP Adress additions - START */
	$('header').text("Welcome to Bouganvilla");
	
	function getIPAddress() {
		$.ajax({
			url: "http://httpbin.org/get",
			dataType: 'json'
		}).done(function(response){
			//console.log("done"+response.origin);
			$('footer').text(" \u00A9 2015 Bouganvila. All Rights Reserved. IP: "+response.origin);
		}).fail(function(response){
			//console.log(response);
			console.log("Error getting IP Address");
			$('footer').text(" \u00A9 2015 Bouganvila. All Rights Reserved.");
		});
	}
	getIPAddress();
	/* 1. Header and Footer additions - END */

	if(currentPage === "reservations.html")
	{
		$("#bookingDetails").hide();	
		/* 6. Datepicker JQuery UI widget and validation - START */
		$.datepicker.setDefaults({
			dateFormat: 'd M yy', 
			firstDay: 1, 
			minDate: 0,
			maxDate: "+1y", 
			numberOfMonths:2, 
	      	changeMonth: true, 
	      	changeYear: true, 
	      	showOtherMonths: true,
	      	dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	      });
		
		$( "#checkIn" ).datepicker({
			onSelect: function() {
				$("#checkOut").datepicker("option", {minDate: $(this).datepicker('getDate')});
			}
		});
		$( "#checkOut" ).datepicker({
			onSelect: function() {
				$("#checkIn").datepicker("option",{maxDate: $(this).datepicker('getDate')});
			}
		});
		/* 6. Datepicker JQuery UI widget and validation- END */

		
		/* 4. Form validation using Parsley.js*/
		$("#booking").parsley();

		/* 4. Ajax POST */
		/* post the booking details*/
		$("#booking").submit(
			function(event){
				event.preventDefault();
				console.log("Form is valid");
				
				var my_form = $("#booking").serialize();
				//console.log(my_form);
				//var json_data = JSON.stringify(my_form); // convert JS obj ot JSON
				
				postDetails(my_form);
		});

		function postDetails(my_form) {
			console.log("inside post details function");
			$.ajax({
				type: "POST",
				url: "http://httpbin.org/post",
				data: my_form
			}).done(function(response){
				console.log("Posted successfully");
				//console.log(response);
				display_data(response.form);
				
			}).fail(function(response){
				console.log(response);
				console.log("Error");
			});
		}

		$("#newButton").click(function(evt){
			$("#bookingForm").show();
			$("#bookingDetails").hide(); 
		});


		function display_data(data){
			//console.log(data);
			$("#bookingDetails").show(); 
			$("#bookingForm").hide();
			
			console.log(data.checkIn);
			$("#checkinValue").text(data.checkIn);
			$("#checkoutValue").text(data.checkOut);
			
			$("#adultValue").text(data.adult);
			$("#childrenValue").text(data.children);
			$("#roomsValue").text(data.rooms);
			$("#nightValue").text(data.night);
			
			$("#first-nameValue").text(data.first_name);
			$("#last-nameValue").text(data.last_name);
			$("#emailValue").text(data.email);
			$("#phoneValue").text(data.telephone);
			if(data.checkList instanceof Array){
				$("#vehicleValue").text("yes");
				$("#foodValue").text("yes");			
			}
			else{
				if(data.checkList === "vehicle"){
					$("#vehicleValue").text("yes");
					$("#foodValue").text("no");
				}
				else if(data.checkList === "food"){
					$("#vehicleValue").text("no");
					$("#foodValue").text("yes");
				}
				else{
					console.log("Nothing was chosen");
					$("#vehicleValue").text("no");
					$("#foodValue").text("no");
				}

			}
			$("#commentsValue").text(data.comments);
		}
	}  // "reservations.html"

	if(currentPage === "gallery.html"){


		/* 6. Flickr Api */
		//http://api.flickr.com/services/feeds/photos_public.gne?tags=ooty&format=json&jsoncallback
		//https://www.flickr.com/search/?q=ooty

		function createImagesHTML(images){
			
			var imagesString = '<div class="pictures">' +
									'<div class="title">' + images.title + '</div>' +
								'</div>';

			var imageEl = $(imagesString);
			imageEl.css({
				backgroundImage: 'url(' + images.media.m+ ')' ,
				width: "330px" ,
				height: "300px"
			});
			return imageEl;
		}


		function render(imagesArray){
			//console.log("inside render function");
			//console.log(imagesArray);
			var results = $(".images");
			results.empty();

			$.each(imagesArray , function(i, image) { 
	  			results.append(createImagesHTML(image));
			});
		}


		function display_images(){
			//console.log("Inside display_images");
			var flickrUrl = encodeURI("http://api.flickr.com/services/feeds/photos_public.gne?tags=dodabetta&format=json&jsoncallback");
			//var flickrUrl = encodeURI("https://www.flickr.com/search/?q=ooty");

			//console.log(flickrUrl);
		
			$.ajax({
				url: flickrUrl,
				dataType: 'jsonp',
			});
			
			jsonFlickrFeed = function(d){
	    		//console.log(d.items);
	    		render(d.items);
			}

		}
		
		display_images();		
	} // gallery.html

	if(currentPage === "index.html"){
		
		/* 7. Local storage Api */
		if (typeof localStorage !== "undefined") {
	  		localStorage.setItem("my_fname", "Shalini");
	  		localStorage.setItem("my_lname", "Krishnamoorthi");
	  		localStorage.setItem("my_course", "Adv Website Design & Mgmt-ICT-4510-1");
		} 
		else {
			console.log("localStorage not available");
		}
				
		$("#designer").click(function(){
			//console.log("clicked");
			$("#designer").hide();
			
			$("#author").append("<div>"+
									"<span>"+ localStorage.getItem("my_fname")+" "+localStorage.getItem("my_lname")+"</span>"+
									 "<p>"+ localStorage.getItem("my_course")+ "</p>"+ 
								"</div>");


			$("#author").show();
		});
	} // index.html

	if(currentPage === "contactus.html"){
		/*Adding google map in contactUs page*/
		function initialize() {
			var mapCanvas = document.getElementById("map");
			var mapOptions = {
				//11.398749, 76.694902
				//11.398523, 76.694945
				
				center: new google.maps.LatLng(11.398523, 76.694945),
				zoom: 17,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			
			var map = new google.maps.Map(mapCanvas, mapOptions)

			var position = new google.maps.LatLng(11.398523, 76.694945);
			var marker = new google.maps.Marker({
	        	position: position,
	        	map: map,
	        	title:"This is the place."
	    	});
	    	marker.setMap(map);
		}
		google.maps.event.addDomListener(window, 'load', initialize);
	}// contactus.html

});