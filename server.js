const express        = require('express');
const PORT           = process.env.PORT || 3000;
const index          = require('./routes/index');
const app            = express();
app.use('/',index);

app.listen(PORT , () => {
  console.log('App listening on port: ' + PORT);
});

module.exports = app;
