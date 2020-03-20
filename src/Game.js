class Game {
  constructor() {
    this._instances=[];
  }

  getInstances() {
    return this._instances;
  }

  createInstance() {
    this._instances.push({
      table: [],
      player: ['O', 'X'],
      move: 'X',
      moveCount: 0,
    });
  }

  getLastInstanceId() {
    if (this.getInstances().length === 0) {
      return null;
    }
    return (this.getInstances().length - 1);
  }

  getPlayer(instanceId) {
    if (this.getLastInstanceId() !== null || instanceId <= this.getLastInstanceId()){
      return this._instances[instanceId].player.pop();
    }
    return null;
  }

  setTable(gameId, player, cell ) {
    this._instances[gameId].table[cell] = player;
  }

  getTable(gameId){
    return this.getInstances()[gameId].table;
  }

  increaseCount(gameId) {
    this._instances[gameId].moveCount += 1;
  }

  getCount(gameId) {
    return this.getInstances()[gameId].moveCount;
  }

  changeMove(gameId) {
    this._instances[gameId].move = (this.getInstances()[gameId].move === 'X') ? 'O' : 'X';
  }

  getMove(gameId) {
    return this.getInstances()[gameId].move;
  }

}

module.exports = Game;
