// Create Container using DOM
let container = document.createElement("div");
container.className = "container";
container.innerHTML = `
<h1 id="title" class="text-center">Rest Countires Weather using Fetch API</h1><br/><br/>
<div class="row" id="content">
    <div class="text-center">
        
    </div>
</div>
`;


const restCountriesURL = "https://restcountries.com/v3.1/all";


async function getData() {
  try {
    let result = await fetch(restCountriesURL);
    let countriesData = await result.json();
    content.innerHTML = "";

    countriesData.forEach((dataValue) => {
      displayData(dataValue);  
    });
  } catch (error) {
    console.log(error);
  }
}

window.onload = getData();


const displayData = (objData) => {
    let content = document.getElementById("content");

  
    content.innerHTML += `
    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 g-4">
        <div class="card h-100">
            <div class="card-header">${objData.name.common}</div>
            <img class="card-img-top" src="${objData.flags.png}" alt="${objData.name.common}">
            <div class="card-body">
                <div class="card-text">
                    <p>Capital: ${objData.capital == undefined ? "N/A" : objData.capital}</p>
                    <p>Region: ${objData.region}</p>
                    <p>Country Code: ${objData.cioc ? objData.cioc : "N/A"}</p>
                    <p>Lat: ${objData.latlng == undefined ? "N/A" : objData.latlng[0]} Long: ${objData.latlng ==undefined ? "N/A" : objData.latlng[1]} </p>
                    <p>Population: ${objData.population}</p>
                </div>
            </div>
            
            
            <div id="${objData.population}" class="weather">

            </div>

            <div id="${objData.area}" class="text-center">
                <button type="button" onclick="buttonClick(${objData?.latlng?.[0]}, ${objData?.latlng?.[1]}, ${objData.area}, ${objData.population})" class="btn btn-light">Click for Weather</button>
            </div>

        </div>
    </div>
    `;
};



async function buttonClick(lat, long, weatherTextId, btnID) {
    try {

        // Handle condition for undefined values
        if((lat || long) == undefined){
            document.getElementById(btnID).style.display ="none";

            document.getElementById(weatherTextId).innerHTML = `
                <p class="weather"><b>Weather Data Not Available</b></p> 
            `;
        }
        const APIURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon="+ long +"&appid=6f3505160a1685507f3841703b8e968d";
        let weatherAPIResult = await fetch(APIURL);
        let weatherData = await weatherAPIResult.json();
        const iconURL = "http://openweathermap.org/img/w/"+ weatherData.weather[0].icon + ".png";

        document.getElementById(btnID).style.display ="none";

        document.getElementById(weatherTextId).innerHTML = `
        <p class="weather"><b>Weather:</b> ${weatherData.weather[0].main} <b>Temp:</b> ${weatherData.main.temp} <i><img id="wicon" src="${iconURL}" alt="Weather icon"></i> 
        <button type="button" onclick="refreshWeather(${weatherData.coord.lat}, ${weatherData.coord.lon}, ${weatherTextId})" class="btn bg-transparent"><i class="fa fa-refresh" aria-hidden="true"></i></button></p> 
        `;
    } catch(error) {
        console.log(error);
    }
}


async function refreshWeather(refreshLat, refreshLong, weatherTextId) {
    try {
        const refreshURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + refreshLat + "&lon="+ refreshLong +"&appid=6f3505160a1685507f3841703b8e968d";
        let latestWeatherAPIResult = await fetch(refreshURL);
        let latestWeatherData = await latestWeatherAPIResult.json();

        const iconURL = "http://openweathermap.org/img/w/"+ latestWeatherData.weather[0].icon + ".png";
   
        document.getElementById(weatherTextId).innerHTML = `
        <p class="weather"><b>Weather:</b> ${latestWeatherData.weather[0].main} <b>Temp:</b> ${latestWeatherData.main.temp} <i><img id="wicon" src="${iconURL}" alt="Weather icon"></i> 
        <button type="button" onclick="refreshWeather(${latestWeatherData.coord.lat}, ${latestWeatherData.coord.lon}, ${weatherTextId})" class="btn bg-transparent"><i class="fa fa-refresh" aria-hidden="true"></i></button></p> 
    `;
    } catch(error) {
        console.log(error);
    }
}

document.body.appendChild(container);