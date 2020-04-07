
let search = "Bujumbura";

init();

function init(){

    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + search + "&appid=16da2c71dd8c2c76dfce15f0f75a5dea";
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){

        // // Set up the text for the main header
        // let townName = weather.name;
        // let townCountry = weather.sys.country;
        // let timeStamp = new Date(weather.dt * 1000);
        // timeStamp = moment(timeStamp).format("MM/DD/YYYY");
        // let headerTitle = townName + ", " + townCountry + " " + "(" + timeStamp + ")";

        // //Set up the Temp in F
        // let temp = (weather.main.temp - 273.15) * 9/5 + 32;
        // temp = temp.toFixed(2);            
        
        // //Assign Text To Card IDs
        // $("#cityHeader").text(headerTitle);
        // $("#tempText").text("Temp:  "  + temp + "°F");
        // $("#humidityText").text("Humidity: " + weather.main.humidity);
        // $("#windSpeedText").text("WindSpeed: " + weather.wind.speed);
        setMainWeatherCard(response);

        //Grab The next 5 forecast days
        let lat = response.coord.lat;
        let lon = response.coord.lon;
        getForecast(lat, lon)

    });

}//end init()

function getForecast(lat, lon)
{
    let forecastURL = "https://api.openweathermap.org/data/2.5/onecall?appid=16da2c71dd8c2c76dfce15f0f75a5dea&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: forecastURL,
            method: 'GET'
        }).then(function(forecast){

            $("#forecastDiv").empty();

            let weatherDays = forecast.daily;

            for(let i = 1; i <  6; i++)
            {
                setForecastCard(weatherDays[i]);          
            }

            $("#indexText").text("UV Index: " + forecast.current.uvi);
            let uvNum = Math.floor(forecast.current.uvi);

            setUvBackground(uvNum);
        })
}//end getForecast()

function setMainWeatherCard(weather)
{
    console.log(weather)
    // Set up the text for the main header
    let townName = weather.name;
    let townCountry = weather.sys.country;
    let timeStamp = new Date(weather.dt * 1000);
    timeStamp = moment(timeStamp).format("MM/DD/YYYY");
    let headerTitle = townName + ", " + townCountry + " " + "(" + timeStamp + ")";

    //Set up the Temp in F
    let temp = (weather.main.temp - 273.15) * 9/5 + 32;
    temp = temp.toFixed(2);            
    
    //Assign Text To Card IDs
    $("#cityHeader").text(headerTitle);
    $("#tempText").text("Temp:  "  + temp + "°F");
    $("#humidityText").text("Humidity: " + weather.main.humidity);
    $("#windSpeedText").text("WindSpeed: " + weather.wind.speed);

}

function setUvBackground(uNum)
{
    //UV index	Media graphic color	Risk of harm from unprotected Sun exposure, for the average adult
    // 0 to 2	Green	"Low"
    // 3 to 5	Yellow	"Moderate"
    // 6 to 7	Orange	"High"
    // 8 to 10	Red	"Very high"
    if(uNum >= 0 && uNum <= 2)
    {
        $("#indexText").attr("class", "uvLow");
    }
    else if(uNum >= 3 && uNum <= 5)
    {
        $("#indexText").attr("class", "uvModerate");                        
    }
    else if(uNum >= 6 && uNum <= 7)
    {
        $("#indexText").attr("class", "uvHigh");
    }
    else
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