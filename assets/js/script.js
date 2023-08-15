$(function() {
  

  //Went to https://stackoverflow.com/questions/1655769/fastest-md5-implementation-in-javascript to figure out how to
  //use the MD5 function.  Also credited in the readme file.
  var hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
  var marvelRequestUrl;

  
  var favoriteNames = [];
  var favoriteWikiUrls = [];
  var currentSearchResult;
  var requestUrl;

   //store specific elements from the html to the variables.
  var searchForm = $("#searchForm");
  var searchTerm = document.getElementById("searchTerm");
  var searchButton = document.getElementById("searchCharacter");
  var faveButton = $("#starBtn");
  var accordionPane = $("#accordionWikiResults");

  
  //declare the url, public and private key in variables.
  var url = 'https://gateway.marvel.com:443/v1/public/characters?name=';
  var publicKey = "e2e4e185f80f3a71cdcff67fb6afc597";
  var privateKey = "504281b22311ba46a13b1314cb218178efc48b84";
  //get the current unix code for the time stamp.
  var ts = dayjs().unix();

  //Went to https://stackoverflow.com/questions/1655769/fastest-md5-implementation-in-javascript to figure out how to
  //use the MD5 function.  Also credited in the readme file.
  var hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
  //replace Hulk with input value from the search box.  Place this in a function later.
  var marvelRequestUrl;

  function searchChar (event) {
    console.log("test");
    favoriteNames.push("currentSearchResult");
    favoriteWikiUrls.push("test")
    event.preventDefault();
    var searchT = {
        marvel: favoriteNames,
        wikiUrl: favoriteWikiUrls
    }
    localStorage.setItem("userentry", JSON.stringify(searchT));
  }

  //create function to output wiki results to page.
  function getWikiInfo() {
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
      
      var wikiResult = Object.values(data.query.pages)[0];
      //Error checking, change output if no results found
      if (wikiResult) {
        //get the full wikipedia url.
        var wikiLink = wikiResult.fullurl;
        
        //create the accordion to store the url.
        var accordionPaneCreation = $("<blaze-accordion-pane open>");
        accordionPaneCreation.attr('header', "Wikipedia Links:");
        accordionPaneCreation.text(wikiLink);

        //append the accordion.
        accordionPane.append(accordionPaneCreation);
        
      } else {
          //text content
      } 
    })
    .then(function (response) {
        return response.json();
    })
      .then(function (data) {
        console.log(data);
    });
  }



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
    currentSearchResult = searchTerm.value.trim();
    if (!currentSearchResult) {
      return;
    }
    //create the url that the marvel api and wikipedia api will use.
    marvelRequestUrl = url + currentSearchResult + "&ts=" + ts + "&apikey=" + publicKey + "&hash=" + hash;
    requestUrl = "https://en.wikipedia.org/w/api.php?action=query&titles=" + currentSearchResult + "&origin=*&format=json&prop=info&inprop=url";

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

      //call the function that deals with wikipedia api.
      getWikiInfo();

      var searchT = {
        marvel: searchTerm.value.trim()
      }

      favorites.push(searchT);
      localStorage.setItem("userentry", JSON.stringify(searchT));
      console.log(favorites.marvel);
    });

    searchTerm.value = "";
  }

  function initialize() {
    var localStorageFavorites = JSON.parse(localStorage.getItem("userentry"));
    if (localStorageFavorites) {
      favoriteNames = localStorageFavorites.marvel;
      favoriteWikiUrls = localStorageFavorites.wikiUrl;
      console.log(favoriteNames + ", " + favoriteWikiUrls)
    }
  }

  initialize();

  searchForm.on("submit", getSearchText);
  //create an on click event for the favorite button.
  faveButton.on("click", searchChar);
});
