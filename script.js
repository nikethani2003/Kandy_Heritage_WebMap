// ========================================
// CREATE LEAFLET MAP
// ========================================

const map = L.map("map").setView(
    [7.2906, 80.6337],
    14
);


// ========================================
// OPEN STREET MAP BASEMAP
// ========================================

const osm = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            "&copy; OpenStreetMap contributors"
    }
);

osm.addTo(map);


// ========================================
// LOAD GEOTIFF
// ========================================

fetch("GIS3006-Kandy_map.tif")

    .then(response => {

        if (!response.ok) {
            throw new Error("GeoTIFF file could not be loaded");
        }

        return response.arrayBuffer();

    })

    .then(arrayBuffer => {

        return parseGeoraster(arrayBuffer);

    })

    .then(georaster => {

        console.log("GeoTIFF loaded");
        console.log(georaster);


        // Create raster layer
        const rasterLayer = new GeoRasterLayer({

            georaster: georaster,

            opacity: 0.8,

            resolution: 256

        });


        // Add raster to map
        rasterLayer.addTo(map);


        // Zoom to GeoTIFF
        map.fitBounds(
            rasterLayer.getBounds()
        );

    })

    .catch(error => {

        console.error(
            "Error loading GeoTIFF:",
            error
        );

        alert(
            "Could not load the GeoTIFF."
        );

    });


// ========================================
// SCALE BAR
// ========================================

L.control.scale({

    metric: true,

    imperial: false

}).addTo(map);


// ========================================
// NORTH ARROW
// ========================================

const northArrow = L.control({
    position: "topright"
});


northArrow.onAdd = function(map) {

    const div = L.DomUtil.create(
        "div",
        "north-arrow"
    );

    div.innerHTML = `
        <div>N</div>
        <div class="arrow">⬆</div>
    `;

    return div;
};


northArrow.addTo(map);


// ========================================
// LEGEND
// ========================================

const legend = L.control({
    position: "bottomright"
});


legend.onAdd = function(map) {

    const div = L.DomUtil.create(
        "div",
        "legend"
    );


    div.innerHTML = `

        <h4>Kandy Map Legend</h4>

        <div class="legend-item">
            <div
                class="legend-color"
                style="background:#087ea4">
            </div>

            Water
        </div>


        <div class="legend-item">
            <div
                class="legend-color"
                style="background:#228B22">
            </div>

            Vegetation
        </div>


        <div class="legend-item">
            <div
                class="legend-color"
                style="background:#D3D3D3">
            </div>

            Built-up Area
        </div>


        <div class="legend-item">
            <div
                class="legend-color"
                style="background:#F4A460">
            </div>

            Bare Land
        </div>


        <div class="legend-item">
            <div
                class="legend-color"
                style="background:#FF0000">
            </div>

            Roads
        </div>

    `;


    return div;
};


legend.addTo(map);


// ========================================
// CURRENT LOCATION BUTTON
// ========================================

const locationControl = L.control({
    position: "topleft"
});


locationControl.onAdd = function(map) {

    const div = L.DomUtil.create(
        "div",
        "location-button"
    );


    div.innerHTML = "📍";


    div.title = "Show my current location";


    // Prevent map click/zoom when clicking button
    L.DomEvent.disableClickPropagation(div);


    div.onclick = function() {

        if (!navigator.geolocation) {

            alert(
                "Geolocation is not supported by this browser."
            );

            return;
        }


        navigator.geolocation.getCurrentPosition(

            function(position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                console.log(
                    "Latitude:",
                    latitude
                );

                console.log(
                    "Longitude:",
                    longitude
                );


                // Create marker
                const locationMarker =
                    L.marker([
                        latitude,
                        longitude
                    ]).addTo(map);


                // Popup
                locationMarker
                    .bindPopup(
                        "<b>Current Location</b><br>" +
                        "Latitude: " +
                        latitude.toFixed(6) +
                        "<br>" +
                        "Longitude: " +
                        longitude.toFixed(6)
                    )
                    .openPopup();


                // Zoom to location
                map.setView(
                    [
                        latitude,
                        longitude
                    ],
                    16
                );

            },


            function(error) {

                if (error.code === 1) {

                    alert(
                        "Location permission was denied."
                    );

                } else if (error.code === 2) {

                    alert(
                        "Your location could not be determined."
                    );

                } else {

                    alert(
                        "Unable to get your location."
                    );

                }

            },

            {
                enableHighAccuracy: true,

                timeout: 10000,

                maximumAge: 0
            }

        );

    };


    return div;
};


locationControl.addTo(map);