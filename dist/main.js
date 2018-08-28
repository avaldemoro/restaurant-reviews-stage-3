let restaurants,neighborhoods,cuisines;var newMap,markers=[];document.addEventListener("DOMContentLoaded",e=>{initMap(),fetchNeighborhoods(),fetchCuisines()}),fetchNeighborhoods=(()=>{DBHelper.fetchNeighborhoods((e,t)=>{e?console.error(e):(self.neighborhoods=t,fillNeighborhoodsHTML())})}),fillNeighborhoodsHTML=((e=self.neighborhoods)=>{const t=document.getElementById("neighborhoods-select");e.forEach(e=>{const a=document.createElement("option");a.innerHTML=e,a.value=e,t.append(a)})}),fetchCuisines=(()=>{DBHelper.fetchCuisines((e,t)=>{e?console.error(e):(self.cuisines=t,fillCuisinesHTML())})}),fillCuisinesHTML=((e=self.cuisines)=>{const t=document.getElementById("cuisines-select");e.forEach(e=>{const a=document.createElement("option");a.innerHTML=e,a.value=e,t.append(a)})}),initMap=(()=>{self.newMap=L.map("map",{center:[40.722216,-73.987501],zoom:12,scrollWheelZoom:!1}),L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}",{mapboxToken:"pk.eyJ1IjoiYXN0ZXJ2IiwiYSI6ImNqaWR4a2sxODBnZnkzcXQ0a3R2aW5yenYifQ.VhIoWtMCcBzA6Y4RFelqTg",maxZoom:18,attribution:'Map data &copy; <a href="https://www.openstreetmap.org/" style="color: #4e342e">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/" style="color: #4e342e">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/" style="color: #4e342e">Mapbox</a>',id:"mapbox.streets"}).addTo(newMap),updateRestaurants()}),updateRestaurants=(()=>{const e=document.getElementById("cuisines-select"),t=document.getElementById("neighborhoods-select"),a=e.selectedIndex,n=t.selectedIndex,s=e[a].value,o=t[n].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(s,o,(e,t)=>{e?console.error(e):(resetRestaurants(t),fillRestaurantsHTML())})}),resetRestaurants=(e=>{self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",self.markers.forEach(e=>e.setMap(null)),self.markers=[],self.restaurants=e}),fillRestaurantsHTML=((e=self.restaurants)=>{const t=document.getElementById("restaurants-list");e.forEach(e=>{t.append(createRestaurantHTML(e))}),addMarkersToMap()}),createRestaurantHTML=(e=>{const t=document.createElement("li"),a=document.createElement("img");a.className="restaurant-img",a.src=DBHelper.imageUrlForRestaurant(e);const n=document.createElement("p");n.className="neighborhood-type",n.innerHTML="» "+e.neighborhood;const s=document.createElement("h2");s.innerHTML=e.name,a.setAttribute("alt",'A photo of the "'+e.name+'" restaurant'),t.append(a),t.append(n),t.append(s);const o=document.createElement("p");o.innerHTML=e.address,t.append(o);const r=document.createElement("a");return r.className="more-restaurant-details",r.innerHTML="View Details",r.tabIndex=0,r.setAttribute("aria-label","View Details for "+e.name+" Restaurant"),r.href=DBHelper.urlForRestaurant(e),t.append(r),t}),addMarkersToMap=((e=self.restaurants)=>{e.forEach(e=>{const t=DBHelper.mapMarkerForRestaurant(e,self.newMap);t.on("click",function(){window.location.href=t.options.url})})});