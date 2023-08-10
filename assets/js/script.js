
var searchTerm = document.getElementById("searchTerm");
var urlWikiSave = JSON.parse(localStorage.getItem("userentry"));
var requestUrl = "https://en.wikipedia.org/w/api.php?action=query&titles=" + urlWikiSave.marvel + "&origin=*&format=json&prop=info&inprop=url";
var searchButton = document.getElementById("searchCharacter");

function searchChar () {
searchButton.addEventListener("click", function (event) {
    event.preventDefault();
        var searchT = {
             marvel: searchTerm.value.trim()
        }
        localStorage.setItem("userentry", JSON.stringify(searchT));
        console.log(urlWikiSave.marvel);
})}
searchChar();

fetch(requestUrl)
.then(function (response) {
    return response.json();
 })
  .then(function (data) {
    console.log(data);
  });

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
var requestUrl = url + "Hulk" + "&ts=" + ts + "&apikey=" + publicKey + "&hash=" + hash;

console.log(requestUrl);

function createImage(targetedResult) {
  //get the image url info from the api.
  var link = targetedResult.thumbnail.path + "." + targetedResult.thumbnail.extension;

  //remove the http from the begining o fthe string and change it to https for secure connection.
  //Went to https://bobbyhadz.com/blog/javascript-remove-first-n-characters-from-string to figure out how to remove 
  //the first 4 characters of a string.  Also credited in the readme file.
  var imageUrl = "https" + link.slice(4);

  return imageUrl;
}

fetch(requestUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);

    var dataResult = data.data.results[0]

    //get the image url.
    var imageUrl = createImage(dataResult);

    //get character name and description and store them in a variable.
    var name = dataResult.name;
    var description = dataResult.description;

    //update the index.html file using jquerry to add the picture, description, and image appropriatly.
    var topImage = $(".card-img-top");

    topImage.attr("src", imageUrl);

    var characterTitleEl = $(".card-title");
    characterTitleEl.text(name);

    var characterCardText = $(".card-text");
    characterCardText.text(description);

  });
