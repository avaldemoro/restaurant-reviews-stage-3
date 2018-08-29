class DBHelper{static get DATABASE_URL(){return"http://localhost:1337/restaurants"}static createIDBStore(e){var t=(window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB||window.shimIndexedDB).open("Restaurant-Database",1);t.onupgradeneeded=function(){t.result.createObjectStore("Restaurant",{keyPath:"id"}).createIndex("by-id","id")},t.onerror=function(e){console.error("Something went wrong with IndexDB: "+e.target.errorCode)},t.onsuccess=function(){var n=t.result,a=n.transaction("Restaurant","readwrite"),s=a.objectStore("Restaurant");s.index("by-id");e.forEach(function(e){s.put(e)}),a.oncomplete=function(){n.close()}}}static getCachedData(e){var t=(window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB||window.shimIndexedDB).open("Restaurant-Database",1);t.onsuccess=function(){var n=t.result,a=n.transaction("Restaurant","readwrite"),s=a.objectStore("Restaurant").getAll();s.onsuccess=function(){e(null,s.result)},a.oncomplete=function(){n.close()}}}static fetchRestaurants(e){if(navigator.onLine){let t=new XMLHttpRequest;t.open("GET",DBHelper.DATABASE_URL),t.onload=(()=>{if(200===t.status){const n=JSON.parse(t.responseText);DBHelper.createIDBStore(n),e(null,n)}else{const n=`Request failed. Returned status of ${t.status}`;e(n,null)}}),t.send()}else console.log("Browser is offline, using the cached data."),DBHelper.getCachedData((t,n)=>{n.length>0&&e(null,n)})}static fetchRestaurantById(e,t){DBHelper.fetchRestaurants((n,a)=>{if(n)t(n,null);else{const n=a.find(t=>t.id==e);n?t(null,n):t("Restaurant does not exist",null)}})}static fetchRestaurantByCuisine(e,t){DBHelper.fetchRestaurants((n,a)=>{if(n)t(n,null);else{const n=a.filter(t=>t.cuisine_type==e);t(null,n)}})}static fetchRestaurantByNeighborhood(e,t){DBHelper.fetchRestaurants((n,a)=>{if(n)t(n,null);else{const n=a.filter(t=>t.neighborhood==e);t(null,n)}})}static fetchRestaurantByCuisineAndNeighborhood(e,t,n){DBHelper.fetchRestaurants((a,s)=>{if(a)n(a,null);else{let a=s;"all"!=e&&(a=a.filter(t=>t.cuisine_type==e)),"all"!=t&&(a=a.filter(e=>e.neighborhood==t)),n(null,a)}})}static fetchNeighborhoods(e){DBHelper.fetchRestaurants((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].neighborhood),a=t.filter((e,n)=>t.indexOf(e)==n);e(null,a)}})}static fetchCuisines(e){DBHelper.fetchRestaurants((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].cuisine_type),a=t.filter((e,n)=>t.indexOf(e)==n);e(null,a)}})}static urlForRestaurant(e){return`./restaurant.html?id=${e.id}`}static imageUrlForRestaurant(e){return`/img/${e.photograph}.jpg`}static mapMarkerForRestaurant(e,t){const n=new L.marker([e.latlng.lat,e.latlng.lng],{title:e.name,alt:e.name,url:DBHelper.urlForRestaurant(e)});return n.addTo(newMap),n}}