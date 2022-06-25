// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore.
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore.
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
var store = new GeoTagStore();


// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get("/", (req, res) => {
    res.render("index", {
        taglist: [],
        currentLatitude: null,
        currentLongitude: null,
        mapTaglist: JSON.stringify(store.geoTags)
    });
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags
 * by radius around a given location.
 */

router.post("/tagging", (req, res) => {

    let latitude = req.body.latitude;
    let longitude = req.body.longitude;

    let name = req.body.name;
    let hashtag = req.body.Hashtag;


    let geoTag = new GeoTag(latitude, longitude, name, hashtag);
    let nearbyGeoTags = store.getNearbyGeoTags(geoTag);
    nearbyGeoTags.push(geoTag);
    store.addGeoTag(geoTag);

    res.render("index", {
        taglist: nearbyGeoTags,
        currentLatitude: latitude,
        currentLongitude: longitude,
        mapTaglist: JSON.stringify(store.geoTags),
        hashtag: hashtag
    });
});


/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain
 * the term as a part of their names or hashtags.
 * To this end, "GeoTagStore" provides methods to search geotags
 * by radius and keyword.
 */

router.post("/discovery", (req, res) => {

    let search = req.body.searchterm;
    let nearbyGeoTags = store.searchNearbyGeoTags(search);


    res.render("index", {
        taglist: nearbyGeoTags,
        currentLatitude: req.body.latitude,
        currentLongitude: req.body.longitude,
        mapTaglist: JSON.stringify(store.geoTags),
        hashtag: req.body.hashtag,
    });
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

router.get('/api/geotags', (req, res) => {
    let discoveryQuery = req.query.searchterm;
    let latitudeQuery = req.query.latitude;
    let longitudeQuery = req.query.longitude;
    let offset = req.query.offset;
    let limit = req.query.limit;

    /**
     * location contains latitude and longitude, which is sufficient for a use in geotag-store.getNearbyGeoTags()
     * @type {{latitude: (*|Document.latitude|number), longitude: (*|Document.longitude|number)}}
     */
    let location = {
        latitude: latitudeQuery,
        longitude: longitudeQuery
    }
    let filterArray = [];
    let nearbyGeoTags = store.geoTags;

    if ((discoveryQuery !== undefined && discoveryQuery !== "") && (latitudeQuery !== undefined && latitudeQuery !== "" && longitudeQuery !== undefined && longitudeQuery !== "")) {

        nearbyGeoTags = store.getNearbyGeoTags(location);

        nearbyGeoTags.forEach(function (tag) {
            if (tag.name.includes(discoveryQuery) || tag.hashtag.includes(discoveryQuery)) {
                filterArray.push(tag);
            }
        });
        nearbyGeoTags = filterArray;


    } else if (discoveryQuery !== undefined && discoveryQuery !== "") {

        nearbyGeoTags = store.findGeoTagsBySearchTerm(discoveryQuery);


    } else if (latitudeQuery !== undefined && latitudeQuery !== "" && longitudeQuery !== undefined && longitudeQuery !== "") {

        nearbyGeoTags = store.getNearbyGeoTags(location);


    }
    let filteredTags = nearbyGeoTags;

    if (offset !== undefined && limit !== undefined) {
        console.log("Offset: " + offset + "\n");
        console.log("Limit: " + limit + "\n");
        console.log("NearbyGeoTagslength: "+nearbyGeoTags.length+"\n");
        filteredTags = [];
        for (let i = offset; ((i < (offset + limit)) && (i < nearbyGeoTags.length)); i++) {
            console.log("iiii : " + i + "\n");
            filteredTags.push(nearbyGeoTags[i]);
        }
        console.log("FilteredTags After:" + filteredTags + "\n");

        /*
       filteredTags = nearbyGeoTags.slice(offset, offset + limit);
       console.log("FilteredTags Before:" + filteredTags + "\n");
       if (filteredTags.length > 7) {
           filteredTags.slice(0,7);
       }
       console.log("FilteredTags After:" + filteredTags + "\n");
*/
    }
    let result = {
        filteredTags: filteredTags,
        totalGeoTags: nearbyGeoTags.length
    }

    res.status(200).json(JSON.stringify(result));
});


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */
//TODO: Auf individuelle Namen checken
router.post("/api/geotags", (req, res) => {

    let tag = new GeoTag(req.body.latitude, req.body.longitude, req.body.name, req.body.hashtag);
    store.addGeoTag(tag);
    //console.log("Tags nach Hinzufügen: \n", store.geoTags);
    res.append('URL', "api/geotags/" + req.body.name);
    res.status(200).json(JSON.stringify(store.geoTags));
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get("/api/geotags/:id", (req, res) => {
    //console.log("ROUTE GET /api/geotags/:id");
    let id = req.params.id;
    res.status(200).json(JSON.stringify(store.searchTagByID(id)));
});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response.
 */

router.put("/api/geotags/:id", (req, res) => {
    let tag = new GeoTag(req.body.latitude, req.body.longitude, req.body.name, req.body.hashtag);
    store.changeGeoTag(tag, req.params.id)
    res.status(200).json(JSON.stringify(tag));
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete("/api/geotags/:id", (req, res) => {
    let id = req.params.id;
    let tag = new GeoTag("not important", "not important", id, "not important");
    let deleted = store.removeGeoTag(tag);
    res.status(200).json(JSON.stringify(deleted));
});

/**
 * Route '/api/geotags/page/:int' for HTTP POST requests
 */
router.get('/api/geotags/page/:int', (req, res) => {
    const elementsPerPage = 7;
    let page = req.params.int - 1;
    let geoTags = req.body;
    let index = page * elementsPerPage;
    let result = [];
    for (let i = index; i < geoTags.length; i++) {
        result.push(geoTags[i]);
        if (result.length === elementsPerPage) {
            break;
        }
    }
    res.status(200).json(JSON.stringify(result));
});

module.exports = router;
