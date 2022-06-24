// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");
const elementsPerPage = 7;


//const GeoTagStore = require('../../models/geotag-store');

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {

    /**
     * @param helper {LocationHelper}
     */
    function callback(helper) {
        var longD = document.getElementById("hidden_longitude_id");
        var latD = document.getElementById("hidden_latitude_id");
        latD.setAttribute("value", helper.latitude);
        longD.setAttribute("value", helper.longitude);
        var longT = document.getElementById("longitude_id");
        var latT = document.getElementById("latitude_id");
        latT.setAttribute("value", helper.latitude);
        longT.setAttribute("value", helper.longitude);
        var manager = new MapManager("1fuMAYDadogIhChVgO3HQp5oc01EVfDb");

        var map = document.getElementById("mapView");

        let taglist_json = map.getAttribute("data-tags");
        let taglist_obj = JSON.parse(taglist_json);

        //console.log("TEST!!!!");
        //console.log(taglist_obj);

        map.setAttribute("src", manager.getMapUrl(helper.latitude, helper.longitude, taglist_obj, 12));
    }

    var long = document.getElementById("longitude_id");
    var lat = document.getElementById("latitude_id");
    const latV = lat.getAttribute("value");
    const longV = long.getAttribute("value");
    if ((longV === "") || (latV === "")) {
        LocationHelper.findLocation(callback);
    } else {
        var manager = new MapManager("1fuMAYDadogIhChVgO3HQp5oc01EVfDb");
        var map = document.getElementById("mapView");
        let taglist_json = map.getAttribute("data-tags");
        let taglist_obj = JSON.parse(taglist_json);
        map.setAttribute("src", manager.getMapUrl(latV, longV, taglist_obj, 12));
    }

}


async function updateMap(geotags) {
    return new Promise((resolve, reject) => {
        console.log("DRIN");
        console.log(geotags);
        var manager = new MapManager("1fuMAYDadogIhChVgO3HQp5oc01EVfDb");
        let lat = parseFloat(document.getElementById("latitude_id").getAttribute("value"));
        let long = parseFloat(document.getElementById("longitude_id").getAttribute("value"));
        let mapUrl = manager.getMapUrl(lat, long, JSON.parse(geotags));
        document.getElementById("mapView").setAttribute("src", mapUrl);

        resolve(geotags);
    })
}
/*
function updateList(tags) {
    let taglist = JSON.parse(tags);
    if (taglist !== undefined) {
        let list = document.getElementById("discoveryResults");
        list.innerHTML = "";
        taglist.forEach(function (tag) {
            let element = document.createElement("li");
            element.innerHTML = tag.name + "(" + tag.latitude + "," + tag.longitude + ")" + tag.hashtag;
            list.appendChild(element);
        })
    }
    return tags;
}
*/
function preparePagination(tags) {
    let pages = Math.ceil(tags.length / elementsPerPage);
    document.getElementById("nextPage").disabled = false;
    document.getElementById("prevPage").disabled = true;
    document.getElementById("currentPage").innerHTML = "1";
    document.getElementById("maxPage").innerHTML = pages.toString();
    return tags;
}


//fetch Pagination
async function updatePagination(searchterm = undefined, page) {
    let offset = (page * elementsPerPage) - elementsPerPage;
    let response = await fetch("http://localhost:3000/api/geotags?&offset=" + offset + "&searchterm=" + searchterm +
        "&limit=" + elementsPerPage + "&latitude=" + document.getElementById("hidden_latitude_id") + "&longitude=" + document.getElementById("hidden_longitude_id"), {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    });
    let taglist = JSON.parse(response);
    if (taglist !== undefined) {
        let list = document.getElementById("discoveryResults");
        list.innerHTML = "";
        taglist.forEach(function (tag) {
            let element = document.createElement("li");
            element.innerHTML = tag.name + "(" + tag.latitude + "," + tag.longitude + ")" + tag.hashtag;
            list.appendChild(element);
        })
    }
    return tags;
}

//fetch Tagging

async function postAdd(geotag) {

    console.log(geotag);
    let response = await fetch("http://localhost:3000/api/geotags", {          //Post mit HTTP
        method: "POST", headers: {"Content-Type": "application/json"},                      //MimeType
        body: JSON.stringify(geotag),
    });
    return await response.json();
}


//fetch for Discovery-Filter

async function getTagList(searchTerm = "") {
    let response = await fetch("http://localhost:3000/api/geotags?" + "&searchterm=" + searchTerm);         //Get mit HTTP Query Parameter
    return await response.json();
}


// EventListener Tagging-Form

document.getElementById("tag-form").addEventListener("submit", function (evt) {
    evt.preventDefault();                                                                   //standardabsenden der formulare verhindert

    let geotag = {
        name: document.getElementById("name_id").value,
        latitude: document.getElementById("latitude_id").value,
        longitude: document.getElementById("longitude_id").value,
        hashtag: document.getElementById("hashtag_id").value
    }

    postAdd(geotag).then(updateMap).then(updateList);
    document.getElementById("name_id").value = "";
    document.getElementById("hashtag_id").value = "";
    document.getElementById("search_id").value = "";
}, true);

// EventListener Discovery-Form

document.getElementById("discoveryFilterForm").addEventListener("submit", function (evt) {
    evt.preventDefault();                                                                   //standardabsenden der formulare verhindert

    let searchTerm = document.getElementById("search_id").value;
    getTagList(searchTerm).then(updateMap).then(updateList)
        .catch(error => alert("Search term does not exist"));
});


document.getElementById("prevPage").addEventListener("click", function (evt) {
    evt.preventDefault();

    let prevPage = parseInt(document.getElementById("currentPage").innerHTML) - 1;

    updatePagination(document.getElementById("search_id"),prevPage);

    document.getElementById("currentPage").innerHTML = prevPage.toString();


});

document.getElementById("nextPage").addEventListener("click", function (evt) {
    evt.preventDefault();

    let nextPage = parseInt(document.getElementById("currentPage").innerHTML) + 1;
    document.getElementById("currentPage").innerHTML = currentPage.toString();

//TODO sinnvoll? -> promise ignorieren
    updatePagination(document.getElementById("search_id"),currentPage-1);});


//UpdateLocation eingefügt, damit es nach jedem Laden der Seite aufgerufen wird
// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    //alert("Please change the script 'geotagging.js'");
    updateLocation();
    getTagList().then(updateMap).then(updateList).then(preparePagination).then(updatePagination);
}, true);