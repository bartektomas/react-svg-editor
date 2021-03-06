'use strict';
var React = require('react');
require('styles/ControlPathPoint.less');

var EditorStates = require('stores/EditorStates');
var EditorActions = require('actions/EditorActions');

var ControlPathPoint = React.createClass({

  onMouseDown: function(e) {
    switch(this.props.editState) {
      case EditorStates.SELECT_OBJ:
        EditorActions.switchToEditPolygonEditMode({
            x: e.pageX,
            y: e.pageY
          },
          this.props.objectID,
          this.props.pointID);

        e.preventDefault();
        e.stopPropagation();
      break;

      case EditorStates.ADD_CURVE_TO_POLYGON:
        EditorActions.addCurveToPolygon(this.props.objectID, this.props.pointID);

        e.preventDefault();
        e.stopPropagation();
      break;
    }
  },

  render: function() {
    return <circle className='ControlPathPoint'
          cx={this.props.x}
          cy={this.props.y}
          r={ControlPathPoint.controlPointSize}
          onMouseDown={this.onMouseDown}></circle>;
  }
});

ControlPathPoint.controlPointSize = 5;

module.exports = ControlPathPoint;
