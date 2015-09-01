import React from 'react';
import { Map, Range, is } from 'immutable';

const CELL_WIDTH = 10;
const CELL_HEIGHT = 10;
const getCoordinateByIndex = (idx, width) => {
  return [idx % width, Math.floor(idx / width)];
};
const mod = (n, m) => {
  return ((n % m) + m) % m;
}

const Cell = React.createClass({
  style() {
    return {
      display: 'inline-block',
      width: `${CELL_WIDTH}px`,
      height: `${CELL_HEIGHT}px`,
      backgroundColor: this.props.alive ? 'white' : 'black'
    };
  },

  shouldComponentUpdate(nextProps) {
    return this.props.alive !== nextProps.alive;
  },

  render() {
    return (
      <span style={this.style()} onClick={this.props.onClick.bind()} />
    );
  }
});

const Grid = React.createClass({
  propTypes: {
    grid: React.PropTypes.instanceOf(Map).isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  },

  shouldComponentUpdate(nextProps) {
    return !is(this.props.grid, nextProps.grid);
  },

  style() {
    return {
      width: `${10 * this.props.width}px`,
      height: `${10 * this.props.height}px`
    };
  },

  getCellClickHandler(idx) {
    return (e) => {
      this.props.onCellClick(idx);
    };
  },

  renderRow(n) {
    return (
      <div key={n}>
        {Range(0, this.props.width).map((x) => {
          const idx = this.props.height * n + x;
          return (
            <Cell
              key={idx}
              index={idx}
              alive={this.props.grid.getIn(getCoordinateByIndex(idx, this.props.width))}
              onClick={this.getCellClickHandler(idx)} />
          );
        }, this)}
      </div>
    );
  },

  renderCells() {
    return Range(0, this.props.height).map((y) => {
      return this.renderRow(y);
    }, this);
  },

  render() {
    return (
      <div style={this.style()}>
        {this.renderCells()}
      </div>
    );
  }
});

const Game = React.createClass({
  getInitialState() {
    return {
      grid: new Map()
    };
  },

  componentWillUnmount() {
    clearInterval(this.gameInterval);
  },

  startGame() {
    this.gameInterval = setInterval(() => {
      this.setState({
        grid: this.calculateNextState(),
        gameStarted: true
      });
    }, 100)
  },

  stopGame() {
    clearInterval(this.gameInterval);
  },

  calculateNextState() {
    return Range(0, this.props.width * this.props.height).reduce((nextState, idx) => {
      const coords = getCoordinateByIndex(idx, this.props.width);
      const isAlive = this.state.grid.getIn(coords);
      const liveNeighhbors = this.getLiveNeighborForCell(coords);

      if (isAlive) {
        if (liveNeighhbors < 2 || liveNeighhbors > 3) {
          return nextState.setIn(coords, false);
        } else {
          return nextState;
        }
      }

      if (liveNeighhbors === 3) {
        return nextState.setIn(coords, true);
      }

      return nextState;
    }, this.state.grid);
  },

  getLiveNeighborForCell(coords) {
    const grid = this.state.grid;
    const {width, height} = this.props;
    const [x, y] = coords;
    const neighbors = [
      [mod(x - 1, width), mod(y - 1, height)],
      [x, mod(y - 1, height)],
      [mod(x + 1, width), mod(y - 1, height)],
      [mod(x - 1, width), y],
      [mod(x + 1, width), y],
      [mod(x - 1, width), mod(y + 1, height)],
      [x, mod(y + 1, height)],
      [mod(x + 1, width), mod(y + 1, height)]
    ]
    return neighbors.map((neighbor) => {
      return this.state.grid.getIn(neighbor);
    }).filter((alive) => {
      return alive;
    }).length;
  },

  handleCellClick(idx) {
    this.setState({
      grid: this.state.grid.setIn(
        getCoordinateByIndex(idx, this.props.width),
        true
      )
    });
  },

  render() {
    return (
      <div>
        <Grid
          grid={this.state.grid}
          onCellClick={this.handleCellClick}
          {...this.props} />
        <button onClick={this.startGame}>Start</button>
        <button onClick={this.stopGame}>Stop</button>
      </div>
    );
  }
});

export default React.createClass({
  render() {
    return (
      <Game width={50} height={50} />
    );
  }
});
