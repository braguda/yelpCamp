mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
container: 'map', 
style: 'mapbox://styles/mapbox/streets-v12', 
center: foundCamp.geometry.coordinates, 
zoom: 10, 
});

new mapboxgl.Marker()
.setLngLat(foundCamp.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${foundCamp.title}</h3><p>${foundCamp.location}</p>`
    )
)
.addTo(map);