class Game {
    canJoinHalfWay = true;
    minPlayer = 1;
    maxPlayer = 200;

    constructor(id) {
        this.id = id;
        this.sockets = {};
        this.numPlayers = 0;
        this.players = {};
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        setInterval(this.update.bind(this), 1000 / 60);
    }

    addPlayer(socket, playerObj) {
        this.numPlayers += 1;
        this.sockets[socket.id] = socket;

        playerObj.curGameId = this.id;
    }
}

module.exports = Game;
