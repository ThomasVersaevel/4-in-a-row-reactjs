import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(35).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';;
    this.setState({ 
      squares: squares, 
      xIsNext: !this.state.xIsNext, 
      winner: null,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    calculateWinnerSmart(this.state.squares);
    let status;
    if (this.state.winner) {
      status = 'Winner: ' + this.state.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(28)}
          {this.renderSquare(29)}
          {this.renderSquare(30)}
          {this.renderSquare(31)}
          {this.renderSquare(32)}
          {this.renderSquare(33)}
          {this.renderSquare(34)}
        </div>
        <div className="board-row">
          {this.renderSquare(21)}
          {this.renderSquare(22)}
          {this.renderSquare(23)}
          {this.renderSquare(24)}
          {this.renderSquare(25)}
          {this.renderSquare(26)}
          {this.renderSquare(27)}
        </div>
        <div className="board-row">
          {this.renderSquare(14)}
          {this.renderSquare(15)}
          {this.renderSquare(16)}
          {this.renderSquare(17)}
          {this.renderSquare(18)}
          {this.renderSquare(19)}
          {this.renderSquare(20)}
        </div>
        <div className="board-row">
          {this.renderSquare(7)}
          {this.renderSquare(8)}
          {this.renderSquare(9)}
          {this.renderSquare(10)}
          {this.renderSquare(11)}
          {this.renderSquare(12)}
          {this.renderSquare(13)}
        </div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinnerSmart(squares) {
  console.log('calc winner');
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 5; j++) {
      if (squares[i+7*j] === 'X') { // if an X is present check around it
        check(squares, i, j, 'X');
      } else if (squares[i+7*j] === 'O') { // if an X is present check around it
        check(squares, i, j, 'O');
      }
    }
  }
}

function check(squares, i, j, p) {
  if (i < 6) {           // check right side
    if (squares[i+1+7*j] === p) {
      recurse(squares, i+1, j, p, 'r', 2)
    }
  }
  if (i < 6 && j < 4) {  // top right
    if (squares[i+1+7*(j+1)] === p) {
      recurse(squares, i+1, j+1, p, 'tr', 2)
    }
  }
  if (i > 0 && j < 4) {           // top left
    if (squares[i-1+7*(j+1)] === p) {
      recurse(squares, i-1, j+1, p, 'tl', 2)
    }
  }
  if (j < 4) {           // top
    if (squares[i+7*(j+1)] === p) {
      recurse(squares, i, j+1, p, 't', 2)
    }
  }
}

/**  recurses on a found X or O with prams
 squares: array of squares
 i, j: position in squares to check
 dir: direction to check in
 seq: amount of symbols found so far
 */
function recurse(squares, i, j, p, dir, seq) {
  if (seq == 4) { //if 4 in a row
    winnerFound(p, dir);
  }
  if (dir === 'r') {           // check right side
    if (squares[i+1+7*j] === p) {
      recurse(squares, i+1, j, p, 'r', seq+1)
    }
  }
  if (dir === 'tr') {  // top right
    if (squares[i+1+7*(j+1)] === p) {
      recurse(squares, i+1, j+1, p, 'tr', seq+1)
    }
  }
  if (dir === 'tl') {           // top left
    if (squares[i-1+7*(j+1)] === p) {
      recurse(squares, i-1, j+1, p, 'tl', seq+1)
    }
  }
  if (dir === 't') {           // top
    if (squares[i+7*(j+1)] === p) {
      recurse(squares, i, j+1, p, 't', seq+1)
    }
  }
  return null;
}

function winnerFound(p, dir) {
  //set winner to p
  Board.setState({winner: p});
  console.log('winner found: '+p);
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}