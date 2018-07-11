# OpenBanking

[View Demo](https://project-o-x.firebaseapp.com/)

> ** Caveat: The OpenBanking API doesn't allows Cross Domanin Requests ([see cors](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)); so had to use a some-what unstable web proxy. Still should work 95% of the time. 

> Solution: 
> Use our own "middleware server" that makes the call on our behalf, probably will extend this by saving the results in our own database (for data that doesn't change too often; like ATM location) and have some sort of back-end job (cron job) that will populate our database.

> For the scope of this demo, there wasn't enought time to implement. On the local development server there is a file that handles the proxy through the Angular CLI `proxy.conf.json`.


## Pre-Requisites 

Angular CLI

## Install / Development server

Clone project and run `npm i` to install all dependencies.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/` on any browser of your choice.

### Dependencies

1. __lodash__ ([lodash](https://lodash.com/docs/4.17.10)) - Allows for more readable code, and offers a shorthand for some trivial calculations / operations

2. __@agm/core__ ([Angular Goolge Maps](https://angular-maps.com/)) - Prebuilt components and directives for common Goolge Maps elements.

### General Comments

There are two tabs / pages. Nearby (follows the requirements for the test), Map View (for bonus points! Includes Natwest as a second bank). These pages were built as if they were standalone, primarily so you would see how I would code what was asked of in the requirements; otherwise I would have coded it slightly differently (e.g. used a shared service between the two for the location and would have made some common components).

Additionaly, there are a number of things that could have been done if this was to be an actual feature, just to name one; Having a fall-back if someone doesn't allow the geolocation permission. Would show error message and / or use their IP address to get a rough location.

> There are some further commments in the code that highlights certain decisions and suggestions.

__Map View__: The map view shows the nearest 30 ATMs (from Barclays & Natwest) around you (initial start position). 
