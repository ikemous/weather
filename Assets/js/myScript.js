
/**
 * myScript.js
 * Author: Adrian Ike Barranco
 * Date: 20200407
 */

//Gobal Variables
let search = "Bujumbura";//Bujumbura Used for the inital card Create

init();

/**
 *              init()
 *  Purpose: To Grab Weather from API to update the cards
 *  Parameters: None
 *  Returns: None
 */
function init(){

    //Initialize the URL to Query
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + search + "&appid=16da2c71dd8c2c76dfce15f0f75a5dea";

    //Grab the weather information from the API
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){

        //update Display for main card
        setMainWeatherCard(response);

        //Grab The next 5 forecast days
        let lat = response.coord.lat;
        let lon = response.coord.lon;
        getForecast(lat, lon)

    });

}//end init()

/**
 *              getForecast()
 *  Purpose: To Grab the 7 day forecast from the API and update the Cards
 *  Parameters: lat and lon - used to help initialize query URL to obtain weather information
 *  Returns: None
 */
function getForecast(lat, lon)
{
    //Initialize the Query URL
    let forecastURL = "https://api.openweathermap.org/data/2.5/onecall?appid=16da2c71dd8c2c76dfce15f0f75a5dea&lat=" + lat + "&lon=" + lon;

    //grab the weather info with the url
    $.ajax({
        url: forecastURL,
        method: 'GET'
    }).then(function(forecast){

        //Empty all card divs
        $("#forecastDiv").empty();

        //Grab the forecast days from the API
        let weatherDays = forecast.daily;

        //Update All weather cards
        for(let i = 1; i <  6; i++)
        {
            setForecastCard(weatherDays[i]);          
        }

        //Grab the UV information and set the background
        $("#indexText").text(forecast.current.uvi);
        let uvNum = Math.floor(forecast.current.uvi);
        setUvBackground(uvNum);
    })
}//end getForecast()

/**
 *              setMainWeatherCard()
 *  Purpose: Update the Main Card With The right Weather Information
 *  Parameters: weather - object holding all information for the weather location
 *  Returns: None
 */
function setMainWeatherCard(weather)
{
    console.log(weather);
    // Set up the text for the main header
    let townName = weather.name;
    let townCountry = weather.sys.country;
    let timeStamp = new Date(weather.dt * 1000);
    timeStamp = moment(timeStamp).format("MM/DD/YYYY");
    let headerTitle = townName + ", " + townCountry + " " + "(" + timeStamp + ")";

    //Set up the Temp in F
    let temp = (weather.main.temp - 273.15) * 9/5 + 32;
    temp = temp.toFixed(2);            

    let dayIcon = "http://openweathermap.org/img/wn/" + weather.weather[0].icon + ".png";
    
    //Assign Text To Card IDs
    $("#cityHeader").text(headerTitle);
    $("#tempText").text("Temp:  "  + temp + "°F");
    $("#humidityText").text("Humidity: " + weather.main.humidity);
    $("#windSpeedText").text("WindSpeed: " + weather.wind.speed);
    $("#mainCardIcon").attr("src", dayIcon);

}//End setMainWeatherCard()

/**
 *              setUvBackground()
 *  Purpose: Update The UV background with the Danger Level of the UV index
 *  Parameters: uNum - whole number of current UV index
 *  Returns: None
 */
function setUvBackground(uNum)
{
    //UV index	Media graphic color	Risk of harm from unprotected Sun exposure, for the average adult
    if(uNum >= 0 && uNum <= 2)// 0 to 2	Green	"Low"
    {
        $("#indexText").attr("class", "uvLow");
    }
    else if(uNum >= 3 && uNum <= 5)// 3 to 5	Yellow	"Moderate"
    {
        $("#indexText").attr("class", "uvModerate");                        
    }
    else if(uNum >= 6 && uNum <= 7)// 6 to 7	Orange	"High"
    {
        $("#indexText").attr("class", "uvHigh");
    }
    else// 8 to 10	Red	"Very high"
    {
        $("#indexText").attr("class", "uvVeryHigh");
    }
}//End setUvBackground()

function setForecastCard(day)
{

    let theDate = new Date(day.dt * 1000);
    theDate = moment(theDate).format("MM/DD/YYYY");
    
    //create card div
    let $newCard = $("<div>");
    $newCard.addClass("card col-sm forecast");
    $("#forecastDiv").append($newCard);
    
    let $newCardBody = $("<div>");
    $newCardBody.addClass("card-body");
    $newCard.append($newCardBody);

    let $cardheader = $("<h4>");
    $cardheader.text(theDate);
    $cardheader.addClass("lead");
    $newCardBody.append($cardheader);

    
    let dayIcon = "http://openweathermap.org/img/wn/" + day.weather[0].icon + ".png";

    let $icon = $("<img>");
    $icon.addClass("row");
    $icon.attr("src",dayIcon);
    $newCardBody.append($icon);

    let dayTemp = (day.temp.day- 273.15) * 9/5 + 32;
    dayTemp = dayTemp.toFixed(2);
    
    let $tempParagraph = $("<p>");
    $tempParagraph.addClass("card-text");
    $tempParagraph.text("Temp: " + dayTemp + "°F");
    $newCardBody.append($tempParagraph);

    let $humidityParagraph = $("<p>");
    $humidityParagraph.addClass("card-text");
    $humidityParagraph.text("Humidity: " + day.humidity);
    $newCardBody.append($humidityParagraph);
}//End setForecastCard()

function cityClick()
{
    search = $(this).data("search");
    console.log(search);
    init();
}//End cityClick()

function addCityLI()
{
    let $listItem = $("<li>");

    let listText = $("#cityInput").val();
    listText = listText.trim();

    $listItem.text(listText);
    $listItem.addClass("list-group-item");
    $listItem.attr("data-search", $("#cityInput").val())
    $("#citiesList").append($listItem);
    $("#cityInput").val("");
}//end addCityLI()

function checkForEnter(event)
{
    if(event.key === "Enter")
        addCityLI();
}//end Check For Enter


//Event Listeners
$("#citiesList").on("click", "li", cityClick);

$("#addBtn").click(addCityLI);

$("#cityInput").keypress(checkForEnter);