// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

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

    proximity_radius = 0.1;
    #alltags = [];

    addGeoTag(gT){
        this.alltags.push(gT);
    }

    removeGeoTag(gT){
        this.alltags.forEach(function(tag){
            if (tag.name === gT.name)
                alltags.splice(alltags.indexOf(tag), 1);
        });
    }

    getNearbyGeoTags(location){

        var ret = [];

        this.alltags.forEach(function(tag){
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

        var proximate_l = getNearbyGeoTags(location);
        proximate_l.forEach(function(tag){
            if (tag.name === location.name || tag.hashtag === location.hashtag){
                ret.push(tag);
            }
        });
        return ret;
    }

}

module.exports = InMemoryGeoTagStore
