let restaurant;
var newMap;

/**
* Initialize map as soon as the page is loaded.
*/
document.addEventListener('DOMContentLoaded', (event) => {
    initMap();
    DBHelper.loadFromIDB('pending-reviews', 'pending-reviews')
        .then(data => {
            // If there are no pending reviews, then return
            if (data.length == 0) {
                return;
            }

            // Otherwise, add pending reviews as globals
            if (!self.pendingReviews) {
                self.pendingReviews = [];
            }

            data.forEach(rev => {
                self.pendingReviews.push(rev);
            });

            // Once connection is restored, push any and all pending reviews
            if (navigator.connection.downlink != 0) {
                console.log(data);
                // remove the temporary ID key in order to prevent conflicts with the API DB
                data.forEach(rev => {
                    console.log('Normlalized data:');
                    delete rev.id;
                    console.log(rev);
                    // push new pending reviews data to API
                    DBHelper.postToAPI(rev).then(function () {
                        // Delete any pending reviews in IDB
                        DBHelper.deleteInIDB('pending-reviews', 'pending-reviews');
                    });
                });
            }

            return data;
        })
        .catch(err => {
            console.log(`ERROR DB: ${err.status}`);
        });
});

/* Initialize leaflet map */
initMap = () => {
    fetchRestaurantFromURL((error, restaurant) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.newMap = L.map('map', {
                center: [restaurant.latlng.lat, restaurant.latlng.lng],
                zoom: 16,
                scrollWheelZoom: false
            });
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
                mapboxToken: 'pk.eyJ1IjoiYXN0ZXJ2IiwiYSI6ImNqaWR4a2sxODBnZnkzcXQ0a3R2aW5yenYifQ.VhIoWtMCcBzA6Y4RFelqTg',
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/" style="color: #4e342e">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/" style="color: #4e342e">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/" style="color: #4e342e">Mapbox</a>',
                id: 'mapbox.streets'
            }).addTo(newMap);
            fillBreadcrumb();
            DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);

            document.getElementById('review-submit')
                    .addEventListener('click', submitReview);


        }
    });
}

/* Get current restaurant from page URL. */
fetchRestaurantFromURL = (callback) => {
    if (self.restaurant) { // restaurant already fetched!
        callback(null, self.restaurant)
        return;
    }
    const id = getParameterByName('id');
    if (!id) { // no id found in URL
        error = 'No restaurant id in URL'
        callback(error, null);
    } else {
        DBHelper.fetchRestaurantById(id, (error, restaurant) => {
            self.restaurant = restaurant;
            if (!restaurant) {
                console.error(error);
                return;
            }
            fillRestaurantHTML();
            callback(null, restaurant)
        });
    }
}

/* Create restaurant HTML and add it to the webpage*/
fillRestaurantHTML = (restaurant = self.restaurant) => {
    const name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;

    const address = document.getElementById('restaurant-address');
    address.innerHTML = restaurant.address;

    const image = document.getElementById('restaurant-img');
    image.className = 'restaurant-img'
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.setAttribute("alt", "A photo of the \"" + restaurant.name + "\" restaurant");

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML =  restaurant.cuisine_type;

    favoriteRestaurantHTML();

    // fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML();
    }
    // get reviews by id and fill reviews
    getReviewsById();

}

/* Get reviews by id */
getReviewsById = callback => {
    if (self.reviews) {
        callback(null, self.reviews);
        return;
    }

    const id = getParameterByName('id');
    if (!id) {
        callback('Could not get parameter by ID', null);
    } else {
        DBHelper.fetchReviewsById(id, (error, reviews) => {
            self.reviews = reviews;
            if (!reviews) {
                console.error(error);
                return;
            }
            fillReviewsHTML();
        });
    }
}

/* Create restaurant operating hours HTML table and add it to the webpage. */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
    const hours = document.getElementById('restaurant-hours');
    for (let key in operatingHours) {
        const row = document.createElement('tr');

        const day = document.createElement('td');
        day.innerHTML = key;
        row.appendChild(day);

        const time = document.createElement('td');
        time.innerHTML = operatingHours[key];
        row.appendChild(time);

        hours.appendChild(row);
    }
}

/* Favorite restaurant */
favoriteRestaurantHTML = (restaurant = self.restaurant) => {
    const favoriteButton = document.getElementById('favorite-button');

    if (restaurant.is_favorite == null || restaurant.is_favorite == undefined) {
        restaurant.is_favorite = false;
    }


    favoriteButton.dataset.liked = restaurant.is_favorite;
console.log(favoriteButton.dataset.liked);
    if (favoriteButton.dataset.liked == 'false') {
        favoriteButton.style.color = '#656666';
    } else {
        favoriteButton.style.color = '#fbab7e';
    }

    favoriteButton.addEventListener('click', e => {
        // Update the UI
        if (e.target.dataset.liked == 'false') {
            e.target.dataset.liked = true;
            e.target.style.color = '#fbab7e';

            e.target.parentNode.parentNode.classList.add('liked');
        } else {
            e.target.dataset.liked = false;
            e.target.style.color = '#656666';

            e.target.parentNode.parentNode.classList.remove('liked');
        }

        restaurant.is_favorite = e.target.dataset.liked;

        // Update the API and IDB
        DBHelper.favoriteRestaurant(restaurant);
    });


}

/* Create all reviews HTML and add them to the webpage. */
fillReviewsHTML = (reviews = self.reviews) => {
    const container = document.getElementById('reviews-container');
    const title = document.createElement('h3');
    title.innerHTML = 'Reviews';
    container.appendChild(title);

    if (!reviews) {
        const noReviews = document.createElement('p');
        noReviews.innerHTML = 'No reviews yet!';
        container.appendChild(noReviews);
        return;
    }

    // Pending Reviews
    if (self.pendingReviews) {
        reviews.push(...self.pendingReviews);
    }

    const ul = document.getElementById('reviews-list');
    reviews.forEach(review => {
        ul.appendChild(createReviewHTML(review));
    });
    container.appendChild(ul);
}


/* Create review HTML and add it to the webpage. */
createReviewHTML = (review) => {
    const li = document.createElement('li');
    li.id = "review-list-item";

    const date = document.createElement('p');
    date.id = "review-list-date";
    const dateString = new Date(review.createdAt);
    date.innerHTML = ">> " + dateString.toDateString();
    li.appendChild(date);

    const name = document.createElement('p');
    name.id = "reviewer-list-name";
    name.innerHTML = review.name;
    li.appendChild(name);

    const rating = document.createElement('p');
    rating.id = "review-list-rating";
    rating.innerHTML = `<b>Rating: </b>${review.rating} / 5`;
    li.appendChild(rating);

    const comments = document.createElement('p');
    comments.id = "review-list-comments"
    comments.id = "comments";
    comments.innerHTML = review.comments;
    li.appendChild(comments);

    return li;
}

/* Add restaurant name to the breadcrumb navigation menu */
fillBreadcrumb = (restaurant=self.restaurant) => {
    const breadcrumb = document.getElementById('breadcrumb');
    const a = document.createElement('a');
    a.innerHTML = restaurant.name;
    breadcrumb.appendChild(a);
}

/* Get a parameter by name from page URL. */
getParameterByName = (name, url) => {
    if (!url)
    url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

submitReview = e => {
    e.preventDefault();
    let nameElement = document.getElementById('review-name');
    let reviewElement = document.getElementById('review-comment');
    let ratingElement = document.getElementById('review-rating');
    let rating = ratingElement.options[ratingElement.selectedIndex].value;

    let name = nameElement.value;
    let comments = reviewElement.value;

    let newReview = {
        restaurant_id: self.restaurant.id,
        name,
        rating,
        comments,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    DBHelper.postToAPI(newReview).then(function () {
        nameElement.value = '';
        reviewElement.value = '';

        const newReviewHTML = createReviewHTML(newReview);
        const ul = document.getElementById('reviews-container');
        ul.appendChild(newReviewHTML);
    });
}
