

import Game from './index';

class Board {
    constructor(rows, cols){
        this.rows = rows;
        this.columns = cols;
        this.board = document.querySelector('#game-grid');
        this.mineCount = parseInt((this.rows * this.cols) * 0.2); 
        
        // initialization
        this.initEventHandlers();
    }

    initEventHandlers = () => {
        this.board.addEventListener('click',this.checkGameStatus, true);
    }
    checkGameStatus = (e) => {
        // check if clicked on mine
        //1. Clicked on mine - end game
        //2. Clicked on non mine - reveal.
        if(e.target.classList.contains('mine')){
           this.gameHandler(false);
       } else {
           this.reveal(parseInt(e.target.dataset.row), parseInt(e.target.dataset.col));
           //check game condition
           const hiddenTiles = document.querySelectorAll('.unrevealed').length;
           const mines = document.querySelectorAll('.mine').length;
           if(hiddenTiles === mines) {
               this.gameHandler(true);
           }
       }
    }

    uncoverMines = (type) => {
        const mines = document.querySelectorAll('.mine');
        for(let mine of mines) {
            const bombIcon = document.createElement('i');
            bombIcon.classList.remove('icofont-bomb');
            if(type == 'lost') {
                bombIcon.classList.add('icofont-bomb');
                mine.classList.add('flash');
            } else {
                bombIcon.classList.add('icofont-smirk');
            }
            mine.appendChild(bombIcon);
        } 
    }

    gameHandler = (isWin) => {
        // checks if restart game, flag, win
        if(!isWin) {
            console.log('You lost :(');
            this.uncoverMines('lost');
            
            //uncover all mines - put sad faces
        } else {
            console.log('You won!');
            this.uncoverMines('won');
            //uncover all mines -- put happy faces
        }
        // 
    }

    create = () => {
      //create game board and assign mines randomly
      //1. create board
      //2. random mine placement
        for(let i = 0; i<this.rows; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            for(let j  = 0; j<this.columns; j++) {
                const col = document.createElement('div');
                col.classList.add('col');
                col.classList.add('unrevealed');
                col.dataset.col = j;
                col.dataset.row = i;
                // TODO: implement 10% of the mines logic here
                if(Math.random() < 0.12) {
                    col.classList.add('mine');
                }
                row.appendChild(col);
            }
            this.board.appendChild(row);
        }
    }

    reveal = (rpos, cpos) => {
        const visited = {};

        // call this constantly until hit tile with mine around
        const _revealAround = (crow, ccol) => {
            // break conditions
            if(crow >= this.rows || ccol >= this.cols || crow < 0 || ccol < 0) return;
            const currKey = `${crow} ${ccol}`;
            if(visited[currKey]) return;

            // get current cell mine count
            const _allHiddenTiles = document.getElementsByClassName('col unrevealed');
            let currentCell ;
            for(let tile of _allHiddenTiles) {
                if(tile.dataset.row == crow && tile.dataset.col == ccol) {
                    currentCell = tile;
                    break;
                }
            }

            const currentCellMineCount = this.getMinesAround(crow,ccol);
            
            if(currentCell === undefined) {
                return;
            }
            // if the current cell has mine or already revealed
            if(!currentCell.classList.contains('unrevealed') || currentCell.classList.contains('mine')) return;

            currentCell.classList.remove('unrevealed');
            if(currentCellMineCount) {
                currentCell.innerHTML = currentCellMineCount;
                return;
            }

            // else reveal more
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const _nextrow = crow + dr;
                    const _nextcol = ccol + dc;
                    _revealAround(_nextrow, _nextcol)
                }
            }

        }
        _revealAround(rpos, cpos);
    }

    restart = () => {
        // remove click handlers

        this.board.innerHTML = "";
        this.board.removeEventListener('click', this.checkGameStatus, true);
        var game = new Game();
        game.start();
    }

    getMinesAround = (r, c) => {
        let _mineCount = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const _nextrow = r + dr;
            const _nextcol = c + dc;
            if (_nextrow >= this.rows || _nextcol >= this.columns || _nextcol < 0 || _nextrow < 0) continue;

            const _allHiddenTiles = document.getElementsByClassName('col unrevealed');
            let currentCell ;
            for(let tile of _allHiddenTiles) {
                if(tile.dataset.row == _nextrow && tile.dataset.col == _nextcol) {
                    currentCell = tile;
                    break;
                }
            }
            if(currentCell && currentCell.classList.contains('mine')) _mineCount++;
          }      
        }
        return _mineCount;
    }

}

export default Board;