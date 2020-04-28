import gridGeoJSON from "../../assets/layers_json/features_buildings.json";

export class GridLayer {
  public static createGridLayer(layerId): any {
    const gridLayer: any = {
      id: layerId,
      displayName: "grid",
      showInLayerList: true,
      loadFromCityIo: false,
      addOnMapInitialisation: true,
      type: "fill-extrusion",
      paint: {
        "fill-extrusion-color": ["get", "color"],
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-base": 1,
        "fill-extrusion-opacity": 0.8,
        "fill-extrusion-vertical-gradient": true
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
            color: "#ababab",
            label: "Building: Special?"
          },
          {
            styleFieldValue: "office",
            color: "#FF4081",
            label: "Building: Grocery Store"
          },
          {
            styleFieldValue: "educational",
            color: "#40C4FF",
            label: "Building: Primary School"
          },
          {
            styleFieldValue: "culture",
            color: "#7C4DFF",
            label: "Building: Community Center"
          },
          {
            styleFieldValue: "water",
            color: "#9FE1FF",
            label: "Open space: Water"
          },
          {
            styleFieldValue: "athletic_field",
            color: "#a5d6a7",
            label: "Open space: Athletic Field"
          },
          {
            styleFieldValue: "green_space",
            color: "#69F0AE",
            label: "Open space: Green Space"
          },
          {
            styleFieldValue: "promenade",
            color: "#AFF7D3",
            label: "Open space: Plaza"
          },
          {
            styleFieldValue: "street",
            color: "#48A377",
            label: "Promenade"
          },
          {
            styleFieldValue: "street",
            color: "#333333",
            label: "Street"
          }
        ]
      }
    };
    return gridLayer;
  }
}
