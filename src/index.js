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
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
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
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(35).fill(null),
      }],
      stepNumber: 0,  
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    for (let j = 0; j < 5; j++) {
      //console.log('now doing for: '+((i % 7) + 7*j))
      if (!squares[(i % 7) + 7*j]) {
        //console.log(i+ 'fills square :' +(i % 7) + 7*j)
        squares[(i % 7) + 7*j] = this.state.xIsNext ? 'X' : 'O';
        break;
      }
    }
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  let done = null;
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 5; j++) {
      if (squares[i+7*j] === 'X') { // if an X is present check around it
        done = check(squares, i, j, 'X');
        //console.log('checking for i: '+i+' j: '+j + ' Xarray: '+squares)
        if (done) {
          return done;
        }
      } else if (squares[i+7*j] === 'O') { // if an X is present check around it
        done = check(squares, i, j, 'O');
        //console.log('checking for i: '+i+' j: '+j + ' Oarray: '+squares)
        if (done) {
          return done;
        }
      }
    }
  }
  return null;
}

function check(squares, i, j, p) {
  let result;
  if (i < 6) {           // check right side
    if (squares[i+1+7*j] === p) {
      result = recurse(squares, i+1, j, p, 'r', 2)
    }
  }
  if (i < 6 && j < 4) {  // top right
    if (squares[i+1+7*(j+1)] === p) {
      result = recurse(squares, i+1, j+1, p, 'tr', 2)
    }
  }
  if (i > 0 && j < 4) {  // top left
    if (squares[i-1+7*(j+1)] === p) {
      result = recurse(squares, i-1, j+1, p, 'tl', 2)
    }
  }
  if (j < 4) {           // top
    if (squares[i+7*(j+1)] === p) {
      result = recurse(squares, i, j+1, p, 't', 2)
    }
  }
  return result;
}

/**  recurses on a found X or O with prams
 squares: array of squares
 i, j: position in squares to check
 dir: direction to check in
 seq: amount of symbols found so far
 */
function recurse(squares, i, j, p, dir, seq) {
  let result;
  if (seq == 4) { //if 4 in a row we have a winner
    console.log('winner: '+p)
    return p;
  }
  if (dir === 'r') {           // check right side
    if (squares[i+1+7*j] === p) {
      result = recurse(squares, i+1, j, p, 'r', seq+1)
    }
  }
  if (dir === 'tr') {  // top right
    if (squares[i+1+7*(j+1)] === p) {
      result = recurse(squares, i+1, j+1, p, 'tr', seq+1)
    }
  }
  if (dir === 'tl') {           // top left
    if (squares[i-1+7*(j+1)] === p) {
      result = recurse(squares, i-1, j+1, p, 'tl', seq+1)
    }
  }
  if (dir === 't') {           // top
    if (squares[i+7*(j+1)] === p) {
      result = recurse(squares, i, j+1, p, 't', seq+1)
    }
  }
  return result;
}

function calculateWinnerOld(squares) {
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