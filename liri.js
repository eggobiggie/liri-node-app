//Require Packages and Files:
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var request = require("request");

//Twitter Keys from keys.js
var client = new Twitter ({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});

//Function to run twitter API
function twitterFunction() {

    var twitterUser = "Snarf_Algar";

    client.get('statuses/user_timeline', {screen_name: twitterUser, count: 20}, function(error, tweets, response) {
        if (error) {
        console.log(error);
        } else {
            for (i = 0; i < tweets.length; i++) {
                console.log("Tweet: " + tweets[i].text);
                console.log("Time of Tweet: " + tweets[i].created_at);
            }
        }
    });
}

//Spotify Keys
var spotify = new Spotify ({
    id: keys.spotifyKeys.client_id,
    secret: keys.spotifyKeys.client_secret
});

//Function to run Spotify API
function spotifyFunction(songName) {
    if (songName === "") {
        aceOfBase();
    } else {
        // var songName = process.argv[3];
        spotify.search({ type: 'track', query: songName }, function(err, data) {
            if (err) {
            return console.log('Error occurred: ' + err);
            } else {
                console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
                console.log("Album Name: " + data.tracks.items[0].album.name);
                console.log("Song Title: " + data.tracks.items[0].name);
                console.log("Song on Spotify: " + data.tracks.items[0].uri);
            }
        });
    }
}

//Function for default spotify song
function aceOfBase() {
    spotify.search({ type: 'track', query: 'The Sign' }, function(err, data) {
        if (err) {
        return console.log('Error occurred: ' + err);
        } else {
            console.log("Artist Name: " + data.tracks.items[5].artists[0].name);
            console.log("Album Name: " + data.tracks.items[5].album.name);
            console.log("Song Title: " + data.tracks.items[5].name);
            console.log("Song on Spotify: " + data.tracks.items[5].uri);
        }
    });
}

//OMDB Request Function
function omdbFunction(movieName) {
    if (movieName === "") {
        defaultMovie();
    } else {
    var movieName = process.argv[3];
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
        request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("Movie: " + JSON.parse(body).Title);
                console.log("Actors: " + JSON.parse(body).Actors);
                console.log("Release Year: " + JSON.parse(body).Year);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);

            }
        });
    }
}

//Function for default movie
function defaultMovie() {
    var movieName = "Attack The Block";
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Movie: " + JSON.parse(body).Title);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);

        }
    });
}

//Set Variable for Commands
var command = process.argv[2];
var argText;

//Determines whether to pull from text file or run regular commands. 
function getInput() {
    if (process.argv[2] === "do-what-it-says") {
        var fs = require("fs");
        var contents = fs.readFileSync("random.txt", "utf8");
        var output = contents.split(",");
        command = output[0];
        argText = output[1];
    } else {
        command = process.argv[2];
        if (process.argv[3]) {
            argText = process.argv[3];
            
        } else {
            argText = "";
        }
    }
}

//Function for running different commands
function runCommands() {
    if (command === "my-tweets") {
        twitterFunction();
    } else if (command === "spotify-this-song") {
        spotifyFunction(argText);
    } else if (command === "movie-this") {
        omdbFunction(argText);
    } else {
        console.log("Invalid function name. Please use my-tweets, spotify-this-song, movie-this, or do-what-it-says");
    }
}

getInput();
runCommands();
