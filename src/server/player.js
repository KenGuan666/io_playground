const Constants = require('../shared/constants')

class Player {

    constructor(username) {
        this.username = username;
        this.curGameId = null;
    }
}

module.exports = Player;
