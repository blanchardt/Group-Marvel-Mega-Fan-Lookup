$(function() {
  var favoriteNames = [];
  var favoriteWikiUrls = [];
  var currentSearchResult;
  var requestUrl;

   //store specific elements from the html to the variables.
  var searchForm = $("#searchForm");
  var searchTerm = document.getElementById("searchTerm");
  var faveButton;
  var accordionWiki = $("#accordionWiki");
  var accordionFavorites = $("#accordionFavorites");
  var characterCard = $("#characterCard");

  
  //declare the url, public and private key in variables.
  var url = 'https://gateway.marvel.com:443/v1/public/characters?';
  var publicKey = "e2e4e185f80f3a71cdcff67fb6afc597";
  var privateKey = "504281b22311ba46a13b1314cb218178efc48b84";
  //get the current unix code for the time stamp.
  var ts = dayjs().unix();

  //Went to https://stackoverflow.com/questions/1655769/fastest-md5-implementation-in-javascript to figure out how to
  //use the MD5 function.  Also credited in the readme file.
  var hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
  //replace Hulk with input value from the search box.  Place this in a function later.
  var marvelRequestUrl;

  function createFavoriteList() {
    //reset the html for the accordion.
    accordionFavorites.empty();

    var initialBlazeEl = $("<blaze-accordion>");

    var accordionFavoritePane = $("<blaze-accordion-pane open>");
    accordionFavoritePane.attr("header", "My Favorites ⭐️");
    
    //populate the accordion list.
    for (var i = 0; i < favoriteNames.length; i++) {
      //create the html elements and attributes.
      var accordionBlazeEl = $("<blaze-accordion>");

      var favoriteLink = $("<a>");
      favoriteLink.attr("href", "#");
      favoriteLink.text(favoriteNames[i]);

      //append the elements appropriatly.
      accordionBlazeEl.append(favoriteLink);
      accordionFavoritePane.append(accordionBlazeEl);
    }

    //append the initial html elements to the html.
    initialBlazeEl.append(accordionFavoritePane);

    accordionFavorites.append(initialBlazeEl);
  }

  function favoriteClick (event) {
    event.preventDefault();

    //check if active.
    if(faveButton.hasClass("active"))
    {
      //remove the active class and remove the current search result from the array.
      faveButton.removeClass("active");
      var indexOfCurrentName = favoriteNames.indexOf(currentSearchResult);
      favoriteNames.splice(indexOfCurrentName, 1);
      favoriteWikiUrls.splice(indexOfCurrentName, 1);
    }
    else {
      faveButton.addClass("active");
      favoriteNames.push(currentSearchResult);
      favoriteWikiUrls.push(requestUrl);
    }

    //update the local storage.
    var searchT = {
        marvel: favoriteNames,
        wikiUrl: favoriteWikiUrls
    }
    localStorage.setItem("userentry", JSON.stringify(searchT));

    createFavoriteList();
  }

  //create function to output wiki results to page.
  function getWikiInfo() {
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
      //remove all of the html for he wiki section.
      accordionWiki.empty();
      
      var wikiResult = Object.values(data.query.pages)[0];
      //Error checking, change output if no results found
      if (wikiResult.pageid) {
        //get the full wikipedia url.
        var wikiLink = wikiResult.fullurl;


        //create the html elements for the wiki accordion.
        var initialBlazeEl = $("<blaze-accordion>");

        var accordionWikiPane = $("<blaze-accordion-pane open>");
        accordionWikiPane.attr("header", "Wikipedia Links");

        var accordionBlazeEl = $("<blaze-accordion>");

        var wikiLinkList = $("<a>");
        wikiLinkList.attr("href", wikiLink);
        wikiLinkList.attr("target", "_blank")
        wikiLinkList.text(wikiLink);

        //append the elements appropriatly.
        accordionBlazeEl.append(wikiLinkList);
        accordionWikiPane.append(accordionBlazeEl);

        //append the initial html elements to the html.
        initialBlazeEl.append(accordionWikiPane);

        accordionWiki.append(initialBlazeEl);
        
      } else {
        //create the html elements for the wiki accordion.
        var initialBlazeEl = $("<blaze-accordion>");

        var accordionWikiPane = $("<blaze-accordion-pane open>");
        accordionWikiPane.attr("header", "Wikipedia Links");

        var accordionBlazeEl = $("<blaze-accordion>");
        accordionBlazeEl.text("No Wikis found.");

        //append the elements appropriatly.
        accordionWikiPane.append(accordionBlazeEl);

        //append the initial html elements to the html.
        initialBlazeEl.append(accordionWikiPane);

        accordionWiki.append(initialBlazeEl);
      } 
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
    characterCard.empty();

    //get the image url.
    var imageUrl = createImage(characterInfo);

    //get character name and description and store them in a variable.
    currentSearchResult = characterInfo.name;
    var description = characterInfo.description;
    if(!description) {
      description = "No description available."
    }

    //check if current character is saved as a favorite and create a string of classes based off the result.
    var indexOfCurrentName = favoriteNames.indexOf(currentSearchResult);
    var favoriteClass = "btn fa-regular fa-star";

    if(indexOfCurrentName !== -1) {
      favoriteClass += " active";
    }

    //update the index.html file using jquerry to add the picture, description, and image appropriatly.
    var topImage = $("<img>");
    topImage.attr("src", imageUrl);
    topImage.addClass("card-img-top");
    topImage.attr("alt", "image of " + currentSearchResult);

    var characterTitleEl = $("<div>");
    characterTitleEl.addClass("cardBody");

    var cardHeaderEl = $("<h3>");
    cardHeaderEl.addClass("card-title")
    cardHeaderEl.text(currentSearchResult + "  ");

    var favoriteBtnEl = $("<button>");
    favoriteBtnEl.addClass(favoriteClass);
    favoriteBtnEl.attr("id", "starBtn");

    var characterCardText = $("<p>");
    characterCardText.addClass("card-text");
    characterCardText.text(description);

    //append the new elements to the character card.
    cardHeaderEl.append(favoriteBtnEl);
    characterTitleEl.append(cardHeaderEl);
    characterTitleEl.append(characterCardText);
    characterCard.append(topImage);
    characterCard.append(characterTitleEl);

    //reasign faveButton to the new starBtn and provide an onclick event
    faveButton = $("#starBtn");
    faveButton.on("click", favoriteClick);
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
    requestUrl = "https://en.wikipedia.org/w/api.php?action=query&titles=" + currentSearchResult + "&origin=*&format=json&prop=info&inprop=url";

    //check if spider man was entered then create the appropriate url.
    var spiderMan = false;
    if (currentSearchResult.toLowerCase() == "spider man" || currentSearchResult.toLowerCase() == "spider-man") {
      marvelRequestUrl = url + "nameStartsWith=" + "spider-man" + "&ts=" + ts + "&apikey=" + publicKey + "&hash=" + hash;
      spiderMan = true;
    }
    else {
      marvelRequestUrl = url + "name=" + currentSearchResult + "&ts=" + ts + "&apikey=" + publicKey + "&hash=" + hash;
    }

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
      if (characterFound) {
        //get the first value in the array, unless spider man.
        if(spiderMan) {
          var characterResult = data.data.results[10];
        }
        else {
          var characterResult = data.data.results[0];
        }
        //call function to deal with the marvel api.
        searchResultMarvelUpdate(characterResult);

        //call the function that deals with wikipedia api.
        getWikiInfo();
      }
      else {
        //remove already existing card and wiki sections.
        characterCard.empty();
        accordionWiki.empty();

        //in the card header output no character found.
        var characterTitleEl = $("<div>");
        characterTitleEl.addClass("cardBody");

        var cardHeaderEl = $("<h3>");
        cardHeaderEl.addClass("card-title")
        cardHeaderEl.text("No Character Found");

        //append the new elements to the character card.
        characterTitleEl.append(cardHeaderEl);
        characterCard.append(characterTitleEl);
      }
    });

    searchTerm.value = "";
  }

  function getFavText(event) {
    event.preventDefault();
    currentSearchResult = $(event.target).text();

    //get the index location of the selected name.
    var indexOfCurrentName = favoriteNames.indexOf(currentSearchResult);

    //create the url that the marvel api and wikipedia api will use.
    marvelRequestUrl = url + currentSearchResult + "&ts=" + ts + "&apikey=" + publicKey + "&hash=" + hash;
    requestUrl = favoriteWikiUrls[indexOfCurrentName];

    //fetch the marvel api.
    fetch(marvelRequestUrl)
      .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //check if valid URL.
      if(data.code != 200) {
        //create a function that displays a character not found where the character info should be.
        return;
      }
      var characterFound = determineIfCharacter(data);
      if (characterFound) {
        //get the first value in the array.
        var characterResult = data.data.results[0];
        //call function to deal with the marvel api.
        searchResultMarvelUpdate(characterResult);

        //call the function that deals with wikipedia api.
        getWikiInfo();
      }
      else {
        //in the card header output no character found.
        var characterTitleEl = $("<div>");
        characterTitleEl.addClass("cardBody");

        var cardHeaderEl = $("<h3>");
        cardHeaderEl.addClass("card-title")
        cardHeaderEl.text("No Character Found");

        //append the new elements to the character card.
        characterTitleEl.append(cardHeaderEl);
        characterCard.append(characterTitleEl);
        return;
      }
    });
  }

  //on load of the page, grab the local storage info, create the favorites accordion based off results.
  function initialize() {
    var localStorageFavorites = JSON.parse(localStorage.getItem("userentry"));
    if (localStorageFavorites) {
      //get from local storage.
      favoriteNames = localStorageFavorites.marvel;
      favoriteWikiUrls = localStorageFavorites.wikiUrl;

      //call a function to generate the favorite accordion list.
      createFavoriteList();
    }
  }

  initialize();

  //submit and click events for the form, favorite button, and favorite accordion
  searchForm.on("submit", getSearchText);
  searchForm.on("click", "button", getSearchText);
  //create a on click event for the accordion list.
  accordionFavorites.on("click", "a", getFavText);
});
