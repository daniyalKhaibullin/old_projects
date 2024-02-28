let weather = {
	roundUp: function(num) {
		if(num % 1 >= 0.5) {
			return Math.ceil(num);
		}else{
			return Math.floor(num);
		}
	},
	"apiKey": "d383016e259e372a326b543182f20f73",
	fetchWeather: function(city){
		fetch("http://api.openweathermap.org/geo/1.0/direct?q="
		+ city
		+ "&appid="
		+ this.apiKey).then((response) => response.json())
		.then((data) => this.fetchWeatherHelper(data[0].lat, data[0].lon));
	},
	fetchWeatherHelper: function(lat, lon) {
		fetch("https://api.openweathermap.org/data/2.5/weather?lat=" 
		+ lat 
		+"&lon=" + lon + "&units=metric&appid=" + this.apiKey
		).then((response) => response.json())
		.then((data) => this.displayWeather(data)); 
	},
	displayWeather: function(data) {
		const {name} = data;
		const {icon, description} = data.weather[0];
		const {temp, humidity} = data.main;	
		const {speed} = data.wind;
		document.querySelector(".city").innerText = "Weather in " + name; 
		document.querySelector(".icon").src="https://openweathermap.org/img/wn/" + icon +".png";
		document.querySelector(".description").innerText = description;
		document.querySelector(".temp").innerText = this.roundUp(temp) + "°C";
		document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
		document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
		document.querySelector(".weather").classList.remove("loading");
	}, 
	search: function(){
		this.fetchWeather(document.querySelector(".search-bar").value);
	},
	getLocation: function() {
		if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((position) => {
						const { latitude, longitude } = position.coords;
						this.fetchWeatherHelper(latitude, longitude);
				});
		} else {
				console.log("Geolocation is not supported by this browser.");
		}
	}
};
document.querySelector(".search button").addEventListener("click", function(){
	weather.search();
	const imageUrl = "https://source.unsplash.com/1600x900/?" + document.querySelector(".search-bar").value;
	document.body.style.backgroundImage = `url(${imageUrl})`;
});

document.querySelector(".search-bar").addEventListener("keyup", function(event){
	if(event.key == "Enter"){
		weather.search();
		const imageUrl = "https://source.unsplash.com/1600x900/?" + document.querySelector(".search-bar").value;
		document.body.style.backgroundImage = `url(${imageUrl})`;
	}
});

window.addEventListener("load", () => {
	weather.getLocation();
});
