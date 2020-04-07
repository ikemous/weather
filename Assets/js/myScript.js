
let search = "Bujumbura";


init();


function init(){

    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + search + "&appid=16da2c71dd8c2c76dfce15f0f75a5dea";
    
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(weather){

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

        //define coordinates
        let lon = weather.coord.lon;
        let lat = weather.coord.lat;
        
        let forecastURL = "https://api.openweathermap.org/data/2.5/onecall?appid=16da2c71dd8c2c76dfce15f0f75a5dea&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: forecastURL,
            method: 'GET'
        }).then(function(forecast){

            $("#forecastDiv").empty();

            let weatherDays = forecast.daily;

            for(let i = 1; i <  6; i++)
            {
                let theDate = new Date(weatherDays[i].dt * 1000);
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

                
                let dayIcon = "http://openweathermap.org/img/wn/" + weatherDays[i].weather[0].icon + ".png";

                let $icon = $("<img>");
                $icon.addClass("row");
                $icon.attr("src",dayIcon);
                $newCardBody.append($icon);

                let dayTemp = (weatherDays[i].temp.day- 273.15) * 9/5 + 32;
                dayTemp = dayTemp.toFixed(2);
                
                let $tempParagraph = $("<p>");
                $tempParagraph.addClass("card-text");
                $tempParagraph.text("Temp: " + dayTemp + "°F");
                $newCardBody.append($tempParagraph);

                let $humidityParagraph = $("<p>");
                $humidityParagraph.addClass("card-text");
                $humidityParagraph.text("Humidity: " + weatherDays[i].humidity);
                $newCardBody.append($humidityParagraph);
                
            }

            
            $("#indexText").text("UV Index: " + forecast.current.uvi);
            let uvNum = Math.floor(forecast.current.uvi);

            setUvBackground(uvNum);
            // console.log(uvNum);

            // if(uvNum >= 0 && uvNum <= 2)
            // {
            //     $("#indexText").attr("class", "uvLow");
            // }
            // else if(uvNum >= 3 && uvNum <= 5)
            // {
            //     $("#indexText").attr("class", "uvModerate");                        
            // }
            // else if(uvNum >= 6 && uvNum <= 7)
            // {
            //     $("#indexText").attr("class", "uvHigh");
            // }
            // else
            // {
            //     $("#indexText").attr("class", "uvVeryHigh");
            // }

        })

    });

}


function setUvBackground(uNum)
{
    //UV index	Media graphic color	Risk of harm from unprotected Sun exposure, for the average adult
    // 0 to 2	Green	"Low"
    // 3 to 5	Yellow	"Moderate"
    // 6 to 7	Orange	"High"
    // 8 to 10	Red	"Very high"
    console.log(uvNum);
    if(uvNum >= 0 && uvNum <= 2)
    {
        $("#indexText").attr("class", "uvLow");
    }
    else if(uvNum >= 3 && uvNum <= 5)
    {
        $("#indexText").attr("class", "uvModerate");                        
    }
    else if(uvNum >= 6 && uvNum <= 7)
    {
        $("#indexText").attr("class", "uvHigh");
    }
    else
    {
        $("#indexText").attr("class", "uvVeryHigh");
    }
}












$("#citiesList").on("click", "li", function(){
    search = $(this).data("search");
    console.log(search);
    init();
});


$("#addBtn").click(function(){
    let $listItem = $("<li>");
    let listText = $("#cityInput").val();
    listText = listText.trim();
    $listItem.text(listText);
    $listItem.addClass("list-group-item");
    $listItem.attr("data-search", $("#cityInput").val())
    $("#citiesList").append($listItem);
});