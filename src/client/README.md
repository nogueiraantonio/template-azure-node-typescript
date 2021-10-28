# docs-downloader-widget

Widget that allows the user to download files from multiple documents. Requested by customer Daikin.

## deployment

Installation of static files under a web server. The files are:

index.html - entry point and main UI definition
scripts/main.js  - core program logic
scripts/utils.js - access to 3DSpace functions

## main dependencies

Bootstrap - [https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css]
VueJS - [https://unpkg.com/vue@2.6.14/dist/vue.min]

Note: If the users don't have access to the above internet URLs then all the dependencies should be copied locally.

## logic

The central data object is the `documents` array of the VueJS application. When data from a different widget is dragged into the widget the documents array is updated with the new or updated information. The HTML table is dynamically updated through the inner workings of the Vue framework engine. When the user selects the download button the logic goes through each document in the array, gets a download ticket for it, creates a temporary hyperlink anchor and calls the click function. The process is repeated for the remaining documents.
