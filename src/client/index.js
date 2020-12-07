// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#3-client-entrypoints
import { connect, joinLobby } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { downloadAssets } from './assets';
import { initState } from './state';
import { setLeaderboardHidden } from './leaderboard';

// I'm using a tiny subset of Bootstrap here for convenience - there's some wasted CSS,
// but not much. In general, you should be careful using Bootstrap because it makes it
// easy to unnecessarily bloat your site.
import './css/bootstrap-reboot.css';
import './css/main.css';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');
const waitScreen = document.getElementById('wait-for-game-screen');

Promise.all([
  connect({ prepareGame, onGameOver }),
  downloadAssets(),
]).then(() => {
  playMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    // Play!
    joinLobby(usernameInput.value);
    playMenu.classList.add('hidden');
    waitScreen.classList.remove('hidden');
  };
}).catch(console.error);

function prepareGame() {
  console.log("Game Joined!");
  waitScreen.classList.add('hidden');
  initState();
  startCapturingInput();
  startRendering();
  setLeaderboardHidden(false);
}

function onGameOver() {
  stopCapturingInput();
  stopRendering();
  playMenu.classList.remove('hidden');
  setLeaderboardHidden(true);
}
