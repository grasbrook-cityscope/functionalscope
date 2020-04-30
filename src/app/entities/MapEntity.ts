export class MapEntity {
    type = 0;

    bld_numLevels = 1;
    bld_useGround = 0;
    bld_useUpper = 0;

    public static fillFeaturesByEntity(features, gridCell: MapEntity) {
        /**  used when setting new properties in editmenu */

        const map = ["WO","GE","SK","SK","SK","SK"]

        for ( const feature of features ) {
            console.log("fillfeature", feature, gridCell);

            for (let gridCellKey of Object.keys(gridCell)) {
                if (gridCellKey === 'bld_numLevels') {
                    if ( "UF_Use" in feature.properties ) {
                        // ground floor feature
                        feature.properties['height'] = MapEntity.bld_lvl_to_height(gridCell[gridCellKey]);
                    }
                } else if (gridCellKey.startsWith("bld_use")) { // todo: this will be done twice
                    if ( "GF_Use" in feature.properties ) {
                        // ground floor feature
                        feature.properties.Use = map[gridCell.bld_useGround];
                    } else {
                        // upper floor feature
                        feature.properties.Use = map[gridCell.bld_useUpper];
                    }
                } else {
                    feature.properties[gridCellKey] = gridCell[gridCellKey];
                }
            }
            if (feature.properties["type"] !== 0) {
                feature.properties["height"] = 0;
            }
        }
    }

    // building level to feature height conversions

    static bld_lvl_to_height(levels) {
        return 4 + (levels - 1) * 2.6;
    }

    static bld_height_to_lvls(height) {
        return Math.floor((height - 4) / 2.6) + 1;
    }

    // parsing helpers

    static int_of_enum(objn, value) {
        let it = 0;
        for (var k in objn) {
            if(k == value) {
                return it
            }
            it+=1
        }
        return null;
    }

    static string_of_enum(enumn, value) {
        for (let k in enumn) {
            if (enumn[k] == value) {
                return k;
            }
        }
        return null;
    }

    static string_of_obj(objn, value) {
        let it = 0;
        for (let k in objn) {
            if(it == value) {
                return k
            }
            it+=1
        }
        return null;
    }

}
