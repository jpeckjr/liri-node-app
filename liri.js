 //-----Variables----

//  Dontenv
 require("dotenv").config();
 var keys = require("./key.js")
 var request = require('request');
 var fs = require('fs');

 // Spotify
 var Spotify = require('node-spotify-api');
 var spotify = new Spotify(keys.spotify);
 var defaultSong = "The Sign"

 // Twitter
 var Twitter = require('twitter');
 var client = new Twitter(keys.twitter);
 var tweetsArray = [];

 
 // Other

 var inputCommand = process.argv[2]
 var commandParam = process.argv[3]

 var defaultMovie = "Mr. Nobody"


//-------Functions-------

function processCommands(command, commandParam) {

    switch(command) { 

        case 'my-tweets':
        getmyTweets()      
        break;

        case 'spotify-this-song':
        if(commandParam === undefined) {
            commandParam === defaultSong;
        }

        getSong(commandParam)
        break;

        case 'movie-this':
        if(commandParam === undefined) {
            commandParam === defaultMovie;
        }
        getMovie(commandParam)
        break;

        case 'do-what-it-says':
        doWhatitSays()
        break;

    }
};

function getmyTweets() {
 
    var params = {screen_name: 'coder_johnny', count: 20, exclude_replies:true, trim_user:true};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                //console.log(tweets);
                tweetsArray = tweets;

                for(i=0; i<tweetsArray.length; i++){
                    console.log("Created at: " + tweetsArray[i].created_at);
                    console.log("Text: " + tweetsArray[i].text);
                    console.log('--------------------------------------');
                }
            }
            else{
                console.log(error);
            }
});

}

function getSong(song){

	if(song === ""){
		song = "The Sign";
	}

	spotify.search({ type: 'track', query: song}, function(err, data) {
    if (err) {
        console.log('Error occurred: ' + err);
        return;
    }

    var song = data.tracks.items[0];
    console.log("------Artists-----");
    for(i=0; i<song.artists.length; i++){
    	console.log(song.artists[i].name);
    }

    console.log("------Song Name-----");
    console.log(song.name);

	console.log("-------Preview Link-----");
    console.log(song.preview_url);

    console.log("-------Album-----");
    console.log(song.album.name);

	});

}

function getMovie(movieName){

	console.log(movieName);

	request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

  
  	if (!error && response.statusCode === 200) {

	    var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

	    request(queryURL, function(error, response, body) {
	    	var movieObj = JSON.parse(body);

	    	console.log("--------Title-----------");
	    	console.log(movieObj.Title);

	    	console.log("--------Year -----------");
	    	console.log(movieObj.Year);

	   		console.log("--------IMDB Rating-----------");
	   		console.log(movieObj.imdbRating);

            console.log("--------Rotten Tomatoes Rating-----------");
             
            console.log(movieObj.tomatoRating); 
	   		
	   		console.log("--------Languages-----------");
	   		
	   		console.log(movieObj.Language);
	   		
	   		console.log("--------Plot----------------");
	   		console.log(movieObj.Plot);

	   		console.log("--------Actors-----------");
	   	    console.log(movieObj.Actors);
	   		
	    	
	    });


  	} else {
  		console.log(error);
  	}

	});
}

function doWhatitSays(){
	fs.readFile('random.txt', 'utf8', function(err, data){

		if (err){ 
			return console.log(err);
		}

		var dataArr = data.split(',');

		processCommands(dataArr[0], dataArr[1]);
	});
}

processCommands(inputCommand, commandParam);










  