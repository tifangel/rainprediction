# rainprediction

## How to Run
- run mqtt broker ex. mosquitto --> mosquitto -v -c {{file_mosquitto_config}}.conf
- run esp
- run backend --> node server.js

## Notes
- you must change the URI constant in the app/routes.js file according to the broker's ip address
- go to file app/controller-mongoose.js, change property city in function insertPayload according your city
- you can change link uri database mongodb in file app/db-mongoose.js