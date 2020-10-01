// import { qs, qsa, $on, $delegate } from './utils';

import '../stylesheets/style.scss';

import Board from './Board';

export default class Game {
    start = () => {
        var board = new Board(7,8);
        board.create();
    }
    // show, store score - extend
    // game timer
    
}

var game = new Game();
game.start();
