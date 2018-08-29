let restaurant;var newMap;function postReview(){console.log("hi")}document.addEventListener("DOMContentLoaded",e=>{initMap()}),initMap=(()=>{fetchRestaurantFromURL((e,t)=>{e?console.error(e):(self.newMap=L.map("map",{center:[t.latlng.lat,t.latlng.lng],zoom:16,scrollWheelZoom:!1}),L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}",{mapboxToken:"pk.eyJ1IjoiYXN0ZXJ2IiwiYSI6ImNqaWR4a2sxODBnZnkzcXQ0a3R2aW5yenYifQ.VhIoWtMCcBzA6Y4RFelqTg",maxZoom:18,attribution:'Map data &copy; <a href="https://www.openstreetmap.org/" style="color: #4e342e">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/" style="color: #4e342e">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/" style="color: #4e342e">Mapbox</a>',id:"mapbox.streets"}).addTo(newMap),fillBreadcrumb(),DBHelper.mapMarkerForRestaurant(self.restaurant,self.newMap))})}),fetchRestaurantFromURL=(e=>{if(self.restaurant)return void e(null,self.restaurant);const t=getParameterByName("id");t?DBHelper.fetchRestaurantById(t,(t,n)=>{self.restaurant=n,n?(fillRestaurantHTML(),e(null,n)):console.error(t)}):(error="No restaurant id in URL",e(error,null))}),fillRestaurantHTML=((e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;const t=document.getElementById("restaurant-img");t.className="restaurant-img",t.src=DBHelper.imageUrlForRestaurant(e),t.setAttribute("alt",'A photo of the "'+e.name+'" restaurant'),document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&fillRestaurantHoursHTML(),fillReviewsHTML()}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const a=document.createElement("tr"),r=document.createElement("td");r.innerHTML=n,a.appendChild(r);const o=document.createElement("td");o.innerHTML=e[n],a.appendChild(o),t.appendChild(a)}}),fillReviewsHTML=((e=self.restaurant.reviews)=>{const t=document.getElementById("reviews-container"),n=document.createElement("h3");if(n.innerHTML="Reviews",t.appendChild(n),!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const a=document.getElementById("reviews-list");e.forEach(e=>{a.appendChild(createReviewHTML(e))}),t.appendChild(a)}),createReviewHTML=(e=>{const t=document.createElement("li"),n=document.createElement("p");n.innerHTML=e.name,t.appendChild(n);const a=document.createElement("p");a.innerHTML=e.date,t.appendChild(a);const r=document.createElement("p");r.innerHTML=`Rating: ${e.rating}`,t.appendChild(r);const o=document.createElement("p");return o.id="comments",o.innerHTML=e.comments,t.appendChild(o),t}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),n=document.createElement("a");n.innerHTML=e.name,t.appendChild(n)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null});