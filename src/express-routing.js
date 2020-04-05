const express = require('express');
const expressWs = require('express-ws');
const bodyParser = require('body-parser');

const myEmitter = require('./events-creator.js');
const Game = require('./Game');
const checkWinner = require('./check-winner.js');

const app = express();
expressWs(app);

const port = process.env.PORT || 3000;

const game = new Game();

app.use(express.static('..' + __dirname + '/public'))
// app.set("port", process.env.PORT || 3000);
// app.set("host", process.env.HOST || "localhost");


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile('index.html');
})

app.get('/start', (req, res) => {
  const lastInstanceId = game.getLastInstanceId();
  if (lastInstanceId === null || game.getInstances()[lastInstanceId].player.length === 0  ){
    game.createInstance();
  }
  const gameId = game.getLastInstanceId();
  const player = game.getPlayer(gameId);
  const table = game.getTable(gameId);
  const move = game.getMove(gameId);
  res.json({gameId, player, table, move});
});

app.post('/move', (req, res) => {
  const {instanceId, player, cell} = req.body;
  if (!game.getTable(instanceId)[cell] && player === game.getMove(instanceId)){
    game.setTable(instanceId, player, cell);
    game.increaseCount(instanceId);
    game.changeMove(instanceId);
  }
  const winStatus = checkWinner(game.getTable(instanceId), game.getCount(instanceId));
  if (winStatus) {
    myEmitter.emit('win', {
      gameId: instanceId,
      win: winStatus
    });
  }
  res.json({table: game.getTable(instanceId), move: game.getMove(instanceId)});
  myEmitter.emit('table-update', instanceId);
})

app.ws('/win/:id', (ws, req) =>{
  const reqId = req.params.id;

  myEmitter.on('win', ({gameId, win}) => {
    gameId == reqId && ws.send(win);
  });

  ws.on('close', function(msg) {
    console.log('close win, id:', req.params.id);
  });
})

app.ws('/table/:id', (ws, req) => {
  const reqId = req.params.id;
  myEmitter.on('table-update', (gameId) => {
    if (gameId == reqId){
      const message = JSON.stringify({table: game.getTable(reqId), move: game.getMove(reqId)});
      ws.send(message);
    }
  });

  ws.on('close', function(msg) {
    console.log('close table, id:', req.params.id);
  });
})


app.listen(port, (err) => {
  !err && console.log(`App is listening on port ${port}
Go to the http://localhost:${port} to start the game`);
  console.log(process.env.HOST);
  console.log(__dirname);
})

module.exports = app;
