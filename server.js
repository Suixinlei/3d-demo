var express = require('express');
var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static('resource'));
app.get('/', function (req, res) {
  var data = {
    "Fruits": [
      "apple",
      "orange"    ]
  };
  res.json(data);
});
const port = 9090;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
