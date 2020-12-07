const Constants = require('../shared/constants');
const DemoGame = require('./demoGame');
const Player = require('./player');
const { v4 } = require('uuid');

// import { v4 as uuidv4 } from 'uuid';

class Lobby {
    constructor() {
        this.dummyGame = new DemoGame(null);
        this.sockets = {};
        this.numIdlePlayers = 0;
        this.idlePlayers = {};
        this.playingPlayers = {};
        this.joinableGames = {};
        this.unjoinableGames = {};
        this.shouldSendUpdate = false;
    };

    selectFirstGameToJoin() {
        let joinableGameIds = Object.keys(this.joinableGames);
        if (joinableGameIds.length) {
            return joinableGameIds[0];
        }
        return null;
    }

    addNewPlayer(socket, username) {
        this.sockets[socket.id] = socket;
        let playerObj = new Player(username);
        this.idlePlayers[socket.id] = playerObj;

        let gameIdToJoin = this.selectFirstGameToJoin();
        if (gameIdToJoin) {
            let canJoinMore = this.joinableGames[gameIdToJoin].addPlayer(socket, playerObj);
            if (!canJoinMore) {
                this.unjoinableGames[gameIdToJoin] = this.joinableGames[gameIdToJoin];
                delete this.joinableGames[gameIdToJoin];
            }
        } else {
            this.numIdlePlayers += 1;
            // Dangerous! Assumes a small user flow
            if (this.numIdlePlayers >= this.dummyGame.minPlayer) {
                this.createNewGame(Object.keys(this.idlePlayers));
                this.numIdlePlayers = 0;
                Object.assign(this.playingPlayers, this.idlePlayers);
                this.idlePlayers = {};
            }
        }
    }

    findPlayer(socketId) {
        return this.idlePlayers[socketId] ? this.idlePlayers[socketId] : this.playingPlayers[socketId];
    }

    findGame(gameId) {
        return this.joinableGames[gameId] ? this.joinableGames[gameId] : this.unjoinableGames[gameId];
    }

    findGameBySocketId(socketId) {
        let player = this.findPlayer(socketId);
        return player ? this.findGame(player.curGameId) : null;
    }

    removeGameById(id) {
        delete this.joinableGames[id];
        delete this.unjoinableGames[id];
    }

    createNewGame(socketIds) {
        let gameId = v4();
        let game = new DemoGame(gameId);
        socketIds.forEach(socketId => {
            if (this.sockets[socketId]) {
                game.addPlayer(this.sockets[socketId], this.idlePlayers[socketId]);
            }});
        if (game.isJoinable()) {
            this.joinableGames[gameId] = game;
        } else {
            this.unjoinableGames[gameId] = game;
        }
    }
}

module.exports = Lobby;
