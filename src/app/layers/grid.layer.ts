import gridGeoJSONlower from "../../assets/layers_json/features_buildings.json";
import gridGeoJSONupper from "../../assets/layers_json/features_buildings_upper.json";

export class GridLayer {
  public static createGridLayer(layerId): any {
    let gridGeoJSON = {}
    let displayName = ""
    if(layerId === "design_lower") {
      gridGeoJSON = gridGeoJSONlower;
      displayName = "Design Area Ground"
    }
    else {
      gridGeoJSON = gridGeoJSONupper;
      displayName = "Design Area Top"
    }
    const gridLayer: any = {
      id: layerId,
      displayName: displayName,
      showInLayerList: true,
      loadFromCityIo: false,
      addOnMapInitialisation: true,
      type: "fill-extrusion",
      paint: {
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-base": ["get", "base"],
        "fill-extrusion-opacity": 1.0,
        "fill-extrusion-vertical-gradient": true,
        "fill-extrusion-color": 
            ["match", ["get", "isSelected"],
              "true", "#00ff00",
              [ "match", ["get", "GroundFloo"],
                "WO", "#FF6E40",
                "GE", "#FF5252",
                "SK", "#40C4FF",
              "white"]
            ]
      },
      source: {
        type: "geojson",
        data: gridGeoJSON
      },
      legend: {
        type: "rect",
        styleField: ["GroundFloo"],
        styleValues: [{
            styleFieldValue: "WO",
            color: "#FF6E40",
            label: "Building: Residential"
          },
          {
            styleFieldValue: "GE",
            color: "#FF5252",
            label: "Building: Commercial"
          },
          {
            styleFieldValue: "SK",
            color: "#40C4FF",
            label: "Building: Special"
          }
        ]
      }
    };
    return gridLayer;
  }
}
