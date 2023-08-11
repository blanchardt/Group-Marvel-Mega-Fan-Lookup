$(function() {
  //declare the url, public and private key in variables.
  var url = 'https://gateway.marvel.com:443/v1/public/characters?name=';
  var publicKey = "e2e4e185f80f3a71cdcff67fb6afc597";
  var privateKey = "504281b22311ba46a13b1314cb218178efc48b84";
  //get the current unix code for the time stamp.
  var ts = dayjs().unix();

  //store specific elements from the html to the variables.
  var searchBar = $("#searchTerm");
  var searchButtonEl = $("#searchCharacter");

  //Went to https://stackoverflow.com/questions/1655769/fastest-md5-implementation-in-javascript to figure out how to
  //use the MD5 function.  Also credited in the readme file.
  var hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
  //replace Hulk with input value from the search box.  Place this in a function later.
  var marvelRequestUrl;



  function createImage(targetedResult) {
    //get the image url info from the api.
    var link = targetedResult.thumbnail.path + "." + targetedResult.thumbnail.extension;

    //remove the http from the begining o fthe string and change it to https for secure connection.
    //Went to https://bobbyhadz.com/blog/javascript-remove-first-n-characters-from-string to figure out how to remove 
    //the first 4 characters of a string.  Also credited in the readme file.
    var imageUrl = "https" + link.slice(4);

    return imageUrl;
  }

  function determineIfCharacter(data) {
    if (data.data.results.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  function searchResultMarvelUpdate (characterInfo) {
    //get the image url.
    var imageUrl = createImage(characterInfo);

    //get character name and description and store them in a variable.
    var name = characterInfo.name;
    var description = characterInfo.description;

    //create a function to check if this hero has been saved to local storage.

    //update the index.html file using jquerry to add the picture, description, and image appropriatly.
    var topImage = $(".card-img-top");

    topImage.attr("src", imageUrl);

    var characterTitleEl = $(".card-title");
    characterTitleEl.text(name);

    var characterCardText = $(".card-text");
    characterCardText.text(description);
  }

  //get search text then call the functions to handle the marvel and wikipedia apis.
  function getSearchText(event) {
    event.preventDefault();
    //get the value of the search bar and check if it is null.
    var searchResult = searchBar.val();
    if (!searchResult) {
      return;
    
    }
    //create the url that the marvel api will use.
    marvelRequestUrl = url + searchResult + "&ts=" + ts + "&apikey=" + publicKey + "&hash=" + hash;
    
    //fetch the marvel api.
    fetch(marvelRequestUrl)
      .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      //check if valid URL.
      if(data.code != 200) {
        //create a function that displays a character not found where the character info should be.
        return;
      }
      var characterFound = determineIfCharacter(data);
      console.log(characterFound);
      if (characterFound) {
        //get the first value in the array.
        var characterResult = data.data.results[0];
        //call function to deal with the marvel api.
        searchResultMarvelUpdate(characterResult);
      }
      else {
        //create a function that displays a character not found where the character info should be.
        return;
      }

      //create a function that deals with wikipedia api.

    });

  }

  searchButtonEl.on("click", getSearchText);
  //create an on click event for the favorite button.
});