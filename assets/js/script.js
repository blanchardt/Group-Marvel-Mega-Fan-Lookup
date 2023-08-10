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

