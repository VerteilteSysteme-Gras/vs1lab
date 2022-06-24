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
class InMemoryGeoTagStore {

    constructor() {
        this.populate();
    }


    #alltags = [];

    /**
     * Add a {@link GeoTag} to the Array
     * @param gT GeoTag to add
     */
    addGeoTag(gT) {
        if(!this.doesNameExist(gT)){
            this.#alltags.push(gT);
        }
        
    }

    /**
     * Returns the Array with all the Objects of type {@link GeoTag}
     * @returns {GeoTag[]}
     */
    get geoTags() {
        return this.#alltags;
    }

    /**
     * search the store for all {@link GeoTag GeoTags} which have a hashtag or name matching the searchterm
     * @param searchterm
     * @returns {@link GeoTag[]} - Array containing all matching GeoTags
     */
    findGeoTagsBySearchTerm(searchterm){
        let ret = [];
        for (let i = 0; i < this.#alltags.length; i++) {
            if (this.#alltags[i].name.includes(searchterm) || this.#alltags[i].hashtag.includes(searchterm)) {
                ret.push(this.#alltags[i]);
            }
        }
        return ret;
    }

    /**
     *Remove the {@link GeoTag param GeoTag} with matching name from the store
     * @param geoTag
     * @returns {@link GeoTag}
     */
    removeGeoTag(geoTag) {
        for (let i = 0; i < this.#alltags.length; i++) {
            if (this.#alltags[i].name === geoTag.name) {
                let removedGeoTag = this.#alltags[i];
                this.#alltags.splice(i, 1);
                return removedGeoTag;
            }
        }
    }

    /**
     * Returns all geotags in the proximity of a location.
     * @param location
     * @returns {*[]}
     */
    getNearbyGeoTags(location) {
        var proximity_radius = 0.1;
        var ret = [];

        //console.log(location.latitude);

        this.#alltags.forEach(function (tag) {
            var difflong = tag.longitude - location.longitude;
            var difflat = tag.latitude - location.latitude;
            var distance = Math.sqrt((difflong * difflong) + (difflat * difflat));
            if (distance <= proximity_radius)
                ret.push(tag);
        });
        return ret;
    }


    searchNearbyGeoTags(searchterm) {
        let ret = [];
        this.#alltags.find((geoTag) => {
            if (geoTag.name.includes(searchterm) || geoTag.hashtag.includes(searchterm)) {
                this.getNearbyGeoTags(geoTag).find((tag) => {
                    if (!ret.includes(tag)) ret.push(tag);
                });
            }
        });

        return ret;
    }

    populate() {
        GeoTagExamples.tagList.forEach((tag) => {
            var newGeoTag = new GeoTag(tag[1], tag[2], tag[0], tag[3]);
            this.addGeoTag(newGeoTag);
        });
    }

    /**
     * Returns a GeoTag identified via its unique id (name lol)
     * @param id
     * @returns 
     */
    searchTagByID(id) {
        let ret = null;
        this.#alltags.find((tag) => {
            if (tag.name === id) {
                ret = tag;
            }
        });
        
        return ret;
    }

    doesNameExist(geotag){
       const tag = this.#alltags.find((tag) => {
            if (tag.name === geotag.name) {
                return true;
            }
        });
        return tag != undefined;
    }

    changeGeoTag(geoTag, id){
        let foundGeoTag = this.searchTagByID(id);
        // "!== undefined" nicht notwendig?
        if(foundGeoTag !== null) {
            this.removeGeoTag(foundGeoTag);
            this.addGeoTag(geoTag);
        }
    }


}

module.exports = InMemoryGeoTagStore
