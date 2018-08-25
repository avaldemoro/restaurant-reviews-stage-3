# Mobile Web Specialist Certification Course
---

## Project Overview: Stage 3
This repository is Stage 3 of a 3 part project that is part of the Udacity Mobile Web Specialist Nanodegree Program. This site was redesigned without the help of a CSS framework.

This series of projects incrementally convert a static webpage to a mobile-ready web application. During **Stage Three**, the  accessible and responsive website created in [Stage One](https://github.com/avaldemoro/restaurant-reviews-stage-1) and connected application created in [Stage Two](https://github.com/avaldemoro/restaurant-reviews-stage-2) will have even more functionality added. The app will have a form to allow users to create their own reviews. If the app is offline, your form will defer updating to the remote database until a connection is established. Finally, the site will be optimize to meet even stricter performance benchmarks than the previous project, and test again using [Lighthouse](https://developers.google.com/web/tools/lighthouse/).

### Instructions to Run

1. Download the server repository [here](https://github.com/udacity/mws-restaurant-stage-3), and follow the directions to get it running.

2. Download this repository and open the root folder in a terminal of your computer.

3. Make sure Python is installed. If not, navigate to Python's [website](https://www.python.org/) to download and install. In a terminal, check the version of Python you have: `python -V`.
    - If Python 2.x, spin up server with `python -m SimpleHTTPServer 8000`
    - If Python 3.x, spin up server with `python3 -m SimpleHTTPServer 8000`
    - If port 8000 is already in use, use another port.

4. With the server running, visit `http://localhost:8000`.

### Leaflet.js and Mapbox
This repository uses leafletjs with Mapbox. You need to replace `<your MAPBOX API KEY HERE>` with a token from [Mapbox](https://www.mapbox.com/). Mapbox is free to use, and does not require any payment information.  Mapbox is free to use, and does not require any payment information.

## Project Requirements
**Add a form to allow users to create their own reviews**: In previous versions of the application, users could only read reviews from the database. You will need to add a form that adds new reviews to the database. The form should include the user’s name, the restaurant id, the user’s rating, and whatever comments they have. Submitting the form should update the server when the user is online.

**Add functionality to defer updates until the user is connected**: If the user is not online, the app should notify the user that they are not connected, and save the users' data to submit automatically when re-connected. In this case, the review should be deferred and sent to the server when connection is re-established (but the review should still be visible locally even before it gets to the server.)

**Meet the new performance requirements**: In addition to adding new features, the performance targets you met in Stage Two have tightened. Using Lighthouse, you’ll need to measure your site performance against the new targets.

Progressive Web App score should be at 90 or better.
Performance score should be at 90 or better.
Accessibility score should be at 90 or better.
