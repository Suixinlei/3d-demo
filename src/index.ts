import Game from "./game";
import './index.css';

window.addEventListener('DOMContentLoaded', () => {
    let game = new Game('renderCanvas');

    game.createScene();
    game.doRender();
});
