// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const app = require('../app');
const router = express.Router();


/**
 * The module "geotag" exports a class GeoTagStore.
 * It represents geotags.
 *
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore.
 * It provides an in-memory store for geotag objects.
 *
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
    res.render('index', {taglist: []})
    console.log("SUCCESSSFULL GET");
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

 router.post('/tagging', (req, res) => {
  var latitude = req.body.tagging_latitude;
  var longitude = req.body.tagging_longitude;
  var geotagstore = new GeoTagStore();

  var geoTagObject = new GeoTag(req.body.tagging_name, parseFloat(latitude), parseFloat(longitude), req.body.tagging_hashtag);

  var nearbyGeoTags = geotagstore.getNearbyGeoTags(geoTagObject);
  nearbyGeoTags.push(geoTagObject);
  geotagstore.addGeoTag(geoTagObject);

  res.render('index', { taglist: nearbyGeoTags,
                         userLatitude: latitude,
                          userLongitude: longitude,
                           mapTaglist: JSON.stringify(nearbyGeoTags)  })
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

router.post('/discovery', function (req, res) {
    var search = req.body.searchterm;
    if (search.length > 0) {
        res.render('gta', {
            taglist: GeoTagStore.getNearbyGeoTags(geotag),
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            tags: JSON.stringify(alltags),
        });
    } else {
        res.render('gta', {
            taglist: alltags,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            tags: JSON.stringify(alltags),
        });
    }
});


module.exports = router;
