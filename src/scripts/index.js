// import { qs, qsa, $on, $delegate } from './utils';

import '../stylesheets/style.scss';

import Board from './Board';

class Game {
    start = () => {
        var board = new Board(4,4);
        board.create();
    }
}

var game = new Game();
game.start();
