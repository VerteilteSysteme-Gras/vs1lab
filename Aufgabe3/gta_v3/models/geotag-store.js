// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

const GeoTagExamples = require("./geotag-examples");
const GeoTag = require("./geotag");
/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.       
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    constructor() {
        this.populate();
    }

    
    #alltags = [];

    addGeoTag(gT){
        this.#alltags.push(gT);
    }

    get geoTags(){
        return this.#alltags;
    }

    removeGeoTag(gT){
        this.#alltags.forEach(function(tag){
            if (tag.name === gT.name)
                this.#alltags.splice(alltags.indexOf(tag), 1);
        });
    }

    getNearbyGeoTags(location){
        var proximity_radius = 0.15;
        var ret = [];

        this.#alltags.forEach(function(tag){
            var difflong = tag.longitude - location.longitude;
            var difflat = tag.latitude - location.latitude;
            var distance = Math.sqrt((difflong*difflong) + (difflat*difflat));
            if (distance <= proximity_radius)
                ret.push(tag);
        });
        return ret;
    }

    searchNearbyGeoTags(location){

        var ret = [];

        var proximate_l = this.getNearbyGeoTags(location);
        proximate_l.forEach(function(tag){
            if (tag.name === location.name || tag.hashtag === location.hashtag){
                ret.push(tag);
            }
        });
        return ret;
    }

    populate() {
        GeoTagExamples.tagList.forEach((tag) => {
            this.addGeoTag(new GeoTag(tag[1], tag[2], tag[0], tag[3]));
        });
              };

}

module.exports = InMemoryGeoTagStore
