 //-----Variables----

//  Dontenv
 require("dotenv").config();

 // Spotify
 var spotify = new Spotify(keys.spotify);
 var Spotify = require('node-spotify-api');
 var defaultSong = "The Sign"

 // Twitter
 var client = new Twitter(keys.twitter);
 var Twitter = require('twitter');
 var tweetsArray = [];
    var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
 
 // Other
 var request = require('request');
 var fs = require('fs');
 var inputCommand = process.argv[2]
 var commandParam = process.argv[3]
 var keys = require("./key.js")
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
 
    var params = {screen_name: 'JohnnyCoder', count: 20, exclude_replies:true, trim_user:true};
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

	    //console.log(JSON.parse(body));
	    
	    //Get the Movie ID
	    var movieID =  JSON.parse(body).results[0].id;
	    //console.log(movieID);

	    //Create new query using the movie ID
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



//-------------------------MAIN PROCESS-------------------------------------------

processCommands(inputCommand, commandParam);










  