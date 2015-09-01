import React from 'react';
import { Map, Range } from 'immutable';

const CELL_WIDTH = 10;
const CELL_HEIGHT = 10;

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
      <span style={this.style()} onClick={this.props.onClick} />
    );
  }
});

const Grid = React.createClass({
  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  },

  style() {
    return {
      width: `${10 * this.props.width}px`,
      height: `${10 * this.props.height}px`
    };
  },

  getInitialState() {
    return {
      grid: new Map()
    };
  },

  getCoordinateByIndex(idx) {
    const width = this.props.width;
    return [idx % width, idx / width];
  },

  getCellClickHandler(idx) {
    return (e) => {
      this.setState({
        grid: this.state.grid.setIn(
          this.getCoordinateByIndex(idx),
          true
        )
      });
    };
  },

  renderRow(n) {
    return (
      <div>
        {Range(0, this.props.width).map((x) => {
          const idx = this.props.height * n + x;
          return (
            <Cell
              key={idx}
              index={idx}
              alive={this.state.grid.getIn(this.getCoordinateByIndex(idx))}
              onClick={this.getCellClickHandler(idx)} />
          );
        })}
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

export default React.createClass({
  render() {
    return (
      <Grid width={50} height={50} />
    );
  }
});
