

//     maptilersdk.config.apiKey = mapToken;
//     console.log(mapToken);
//     const map = new maptilersdk.Map({
//       container: 'map', // container id
//       style: maptilersdk.MapStyle.STREETS,
//       center: coordinates, // starting position [lng, lat]
//       zoom: 10 // starting zoom
//     });

// console.log("Marker Coordinates:", coordinates);
// const marker = new maptilersdk.Marker()
//   .setLngLat(coordinates) //Listing.geometry.coordinates
//   .addTo(map);       








maptilersdk.config.apiKey = mapToken;

//console.log("Map Token:", mapToken);
//console.log("Loaded Coordinates:", coordinates);

// Ensure `coordinates` is parsed correctly
const parsedCoordinates = typeof coordinates === "string" ? JSON.parse(coordinates) : coordinates;
const formattedCoordinates = Array.isArray(parsedCoordinates) && parsedCoordinates.length === 2 
  ? parsedCoordinates 
  : [77.209, 28.6139]; // Fallback

const map = new maptilersdk.Map({
  container: 'map',
  style: maptilersdk.MapStyle.STREETS,
  center: formattedCoordinates, 
  zoom: 9
});

map.on('load', function () {
  new maptilersdk.Marker({color: "red"})
    .setLngLat(formattedCoordinates) 
    .setPopup(
      new maptilersdk.Popup({ offset: 25 }).setHTML(
        `<h4>${listing.title}</h4><p>Exact Location provided after booking</p>`
      )
    )

    .addTo(map);
});

















