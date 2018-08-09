const express = require('express');
const app = express();

app.set('port', 8080);
app.get('/', (req, res) => {

});

app.listen(app.get('port'), function() {
  console.log("Server started.");
});
