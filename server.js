const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors');

const app = express();
app.use(cors({
  origin: '*'
}));

// parse requests of content-type: application/json
app.use(bodyParser.json());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

require("./app/routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
