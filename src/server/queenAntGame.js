const Constants = require('../shared/constants');
const Game = require('./game');

class QueenAnt1V1Game extends Game {
    minPlayer = 2;
    maxPlayer = 2;
    gameOver = false;

    constructor(id) {
        super(id);
    }

    isJoinable() {
        return false;
    }

    shouldBeDeleted() {
        return this.gameOver;
    }

    addPlayer(socket, playerObj) {
        if (!this.isJoinable()) {
            return false;
        }
        super.addPlayer(socket, playerObj);

        return false;
    }
}

module.exports = QueenAnt1V1Game;
