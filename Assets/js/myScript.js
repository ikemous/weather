/**
 * myScript.js
 * Author: Adrian Ike Barranco
 * Date: 20200407
 */

//Gobal Variables
let search = "Bujumbura";//Bujumbura Used for the inital card Create
let savedCities = [];//Array to hold all saved cities
let showCities = false;//Used for the button array

//#region Functions

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

    }).fail(removeLI);

}//end init()

/**
 *              loadSavedCities()
 *  Purpose: Appends all cities to the saved cities dropdown
 *  Parameters: None
 *  Returns: None
 */
function loadSavedCities()
{
    $("#citiesList").html("");
    //Grab the saved cities from the local storage
    savedCities = JSON.parse(localStorage.getItem("savedCities"));

    //assign the array to empty if local storage was empty
    if(savedCities === null)
        savedCities = [];

    //Create and append List Items For Each Saved City
    for(let i = 0; i < savedCities.length; i++)
    {
        let $listItem = $("<li>");
        $listItem.text(savedCities[i]);
        $listItem.addClass("list-group-item");
        $listItem.attr("data-search", savedCities[i]);
        $("#citiesList").append($listItem);
    }

}//End loadSavedCities()

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
 *              setForecastCard()
 *  Purpose: create forecast cards with the correct information
 *  Parameters: day - obj with weather information
 *  Returns: None
 */
function setForecastCard(day)
{
    //convert date from XML to string
    let theDate = new Date(day.dt * 1000);
    theDate = moment(theDate).format("MM/DD/YYYY");
    
    //create card div
    let $newCard = $("<div>");
    $newCard.addClass("col-sm forecast card");
    $("#forecastDiv").append($newCard);

    //Create Card Body
    let $newCardBody = $("<div>");
    $newCardBody.addClass("card-body");
    $newCard.append($newCardBody);

    //Create Card Header
    let $headerRow = $("<div>");
    $headerRow.addClass("row");
    $newCardBody.append($headerRow);
    let $cardheader = $("<h4>");
    $cardheader.text(theDate);
    $cardheader.addClass("lead");
    $headerRow.append($cardheader);

    //Create Card Image 
    let dayIcon = "http://openweathermap.org/img/wn/" + day.weather[0].icon + ".png";
    let $iconRow = $("<div>");
    $iconRow.addClass("row");
    $newCardBody.append($iconRow);
    let $icon = $("<img>");
    $icon.addClass("row");
    $icon.attr("src", dayIcon);
    $iconRow.append($icon);

    //Convert Temp from K to F F=(K- 273.15) * 9/5 + 32
    let dayTemp = (day.temp.day- 273.15) * 9/5 + 32;
    dayTemp = dayTemp.toFixed(2);

    //Create Card Paragrph for degrees
    let $tempRow = $("<div>");
    $tempRow.addClass("row");
    $newCardBody.append($tempRow);
    let $tempParagraph = $("<p>");
    $tempParagraph.addClass("card-text");
    $tempParagraph.text("Temp: " + dayTemp + "°F");
    $tempRow.append($tempParagraph);

    //Create Card Paragraph for Humidity
    let $humidityRow = $("<div>");
    $humidityRow.addClass("row");
    $newCardBody.append($humidityRow);
    let $humidityParagraph = $("<p>");
    $humidityParagraph.addClass("card-text");
    $humidityParagraph.text("Humidity: " + day.humidity + "%");
    $humidityRow.append($humidityParagraph);

}//End setForecastCard()

/**
 *              setMainWeatherCard()
 *  Purpose: Update the Main Card With The right Weather Information
 *  Parameters: weather - object holding all information for the weather location
 *  Returns: None
 */
function setMainWeatherCard(weather)
{
    // Set up the text for the main header
    let townName = weather.name;
    let townCountry = weather.sys.country;
    let timeStamp = new Date(weather.dt * 1000);
    timeStamp = moment(timeStamp).format("MM/DD/YYYY");
    let headerTitle = townName + ", " + townCountry + " " + "(" + timeStamp + ")";

    //Set up the Temp in F
    let temp = (weather.main.temp - 273.15) * 9/5 + 32;
    temp = temp.toFixed(2);            

    //Grab the icon for the weather
    let dayIcon = "http://openweathermap.org/img/wn/" + weather.weather[0].icon + ".png";
    
    //Assign Text To Card IDs
    $("#cityHeader").text(headerTitle);
    $("#tempText").text("Temp:  "  + temp + "°F");
    $("#humidityText").text("Humidity: " + weather.main.humidity + "%");
    $("#windSpeedText").text("WindSpeed: " + weather.wind.speed + "meter/sec");
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
    else if(uNum >= 8 && uNum <= 10)// 6 to 7	Orange	"High"
    {
        $("#indexText").attr("class", "uvHigh");
    }
    else// 8 to 10	Red	"Very high"
    {
        $("#indexText").attr("class", "uvExtreme");
    }
}//End setUvBackground()

/**
 *              addCityLI()
 *  Purpose: Appends a new list item to the saved cities dropdown box
 *  Parameters: day - obj with weather information
 *  Returns: None
 */
function addCityLI()
{
    //Grab the text from the input box
    let listText = $("#cityInput").val();
    listText = listText.trim();

    //Reassign the value of search
    search = listText;

    //Check current list of cities for the current value
    for(let i = 0; i < $(".list-group-item").length; i++)
    {
        //If item exists inside the cities
        if($(cityInput).val().toLowerCase() == $(".list-group-item")[i].innerText.toLowerCase())
        {
            //Reload all  cards with input
            init();
            //Get out of function
            return;
        }
    }

    //Create and append new list item
    let $listItem = $("<li>");
    $listItem.text(listText);
    $listItem.addClass("list-group-item");
    $listItem.attr("data-search", listText)
    $("#citiesList").append($listItem);
    $("#cityInput").val("");

    //Update saved Cities array
    savedCities.push(listText);
    //Update Localk Storage
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
    //reload all cards
    init();
}//end addCityLI()

/**
 *              clearList()
 *  Purpose: remove all values from the cities list, clears local stoarage and reloads the saved list
 *  Parameters: None
 *  Returns: None
 */
function clearList()
{
    //Clear List
    savedCities = [];
    localStorage.clear();
    localStorage.setItem("savedCities", JSON.stringify(savedCities));

    //Reload List
    loadSavedCities();   
}//End Clear List


/**
 *              checkForEnter()
 *  Purpose: Checks if the key pressed was Enter
 *  Parameters: event- the properties for the key pressed
 *  Returns: None
 */
function checkForEnter(event)
{
    //if key pressed was enter
    if(event.key === "Enter")
        addCityLI();
}//end Check For Enter


/**
 *              cityClick()
 *  Purpose: to update search variable and reinitiate the cards
 *  Parameters: day - obj with weather information
 *  Returns: None
 */
function cityClick()
{
    //update
    search = $(this).data("search");
    
    showCities = false;
    $(".dropDownContent").css("display", "none");
    //initiate
    init();
}//End cityClick()

/**
 *              removeLI()
 *  Purpose: Appends all cities to the saved cities dropdown
 *  Parameters: None
 *  Returns: None
 */
function removeLI()
{
    //Find The  Item and remove it
    for(let i = 0; i < $(".list-group-item").length; i++)
        if($(".list-group-item")[i].innerText ===  search)
            $(".list-group-item")[i].remove();

    alert(search + " Is an invalid option in the API");

    savedCities.pop();
    localStorage.clear();

    localStorage.setItem("savedCities", JSON.stringify(savedCities));
}//End removeLI()

//#endregion Functions



//#region Event Listeners
$("#citiesList").on("click", "li", cityClick);

$("#preSetCities").on("click", "li", cityClick);

$("#addBtn").click(addCityLI);

$("#cityInput").keypress(checkForEnter);

$("#clearButton").click(clearList);

$("#savedListButton").click(function(){
    if(savedCities.length === 0)
    {
        alert("no previous city search")
    }
    if(showCities === false)
    {
        showCities = true;
        $(".dropDownContent").css("display", "block");
        return;
    }
    showCities = false;
    $(".dropDownContent").css("display", "none");
    
});

window.addEventListener("click", function(event){
    if(!event.target.matches("button"))
    {
        showCities = false;
        $(".dropDownContent").css("display", "none");
    }
});

//#endregion Event Listeners


//Call Functions To Initate page load
loadSavedCities();
init();
