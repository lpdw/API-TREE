const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const cors = require('cors')
const index = require('./routes/index');
const inputs = require('./routes/inputs');
const db = require('./db');
const mqtt = require('mqtt');

let client;
const deviceRoot = 'demo/device/';
const app = express();
app.io = require('socket.io')();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('socketio', app.io);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/inputs', inputs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req);
  console.log(res);
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (req.accepts('text/html')) {
    return res.render('error');
  }
  res.send(res.locals.message);
});
;

client = mqtt.connect('http://localhost');

client.on('connect', function() {
  // On souscrit au device arduino (données de test)

  client.subscribe(deviceRoot+"arduino");
  // A la réception d'un objet, on l'enregistre en base de données
  // Pour tester l'envoie de message : lancer la commande  (il faut avoir installer mqtt en -general)
  // mqtt_pub -h "localhost" -t "demo/device/arduino" -m '{"date": "2017-06-08T08:30:19.911Z","inputs": [{"label": "Arduino","value": 0},{"label": "Sentiment","value": 1}]}'
  client.on('message', function (topic, message) {
    let input =JSON.parse((message.toString()));
    // On insert l'input reçut par l'arduino
    db.get().collection('inputs').insertOne(input)
    .then(insert => {
      // On récupère l'objet enregistré
      db.get().collection('inputs').findOne({_id:insert.insertedId})
      .then(input => {
        // On envoie le socket pour actualiser l'arbre
        app.io.emit("new_inputs",input);
      });
        console.log({"insertedCount":insert.insertedCount,"insertedId":insert.insertedId});
    })
    .catch(err => {
      console.log(err);
    });
    // client.end();
  });
});

module.exports = app;
