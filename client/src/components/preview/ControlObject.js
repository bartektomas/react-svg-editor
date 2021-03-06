'use strict';
var React = require('react');

var ControlPoint = require('./ControlPoint');
var RotationControl = require('./RotationControl');
var h = require('./svg-helpers');
var ObjectActions = require('actions/ObjectActions');
var EditorActions = require('actions/EditorActions');
var EditorStates = require('stores/EditorStates');
var ControlPath = require('./ControlPath');

var ControlObject = React.createClass({
  handleMouseDown: function(e) {
    switch(this.props.editState) {
      case EditorStates.SELECT_OBJ:
        EditorActions.startSelectedObjectMove({
          x: e.pageX,
          y: e.pageY
        });

        e.preventDefault();
        e.stopPropagation();
      break;
    }
  },

  handleResizeStart: function(e) {
    e.stopPropagation();
    this.props.handleDrag(true, this.handleResizeMove, this.handleResizeEnd, this.refs.container);
  },
  handleResizeMove: function(e) {
    var svgObject = this.props.svgObject;
    var pos = svgObject.get('position');

    var z0 = Math.sqrt(Math.pow(pos.get('width') / 2, 2) + Math.pow(pos.get('height') / 2, 2));
    var z1 = Math.sqrt(Math.pow(e.svgObjectX, 2) + Math.pow(e.svgObjectY, 2));

    ObjectActions.scaleObject(this.props.layerID, this.props.objectID, {
      scale: (pos.get('scale') || 1) * z1 / z0
    });
  },
  handleResizeEnd: function() {
    this.props.handleDrag(false);
  },
  render: function() {
    if(!this.props.svgObject) {
      return <g></g>;
    }

    var editPolygon = false;
    switch(this.props.editState) {
      case EditorStates.ADD_POLYGON_FIRST_TWO_POINTS_ADDED:
      case EditorStates.ADD_POLYGON_NEXT_POINT_ADDED:
        editPolygon = true;
      break;
    }

    var svgObject = this.props.svgObject;
    var pos = svgObject.get('position');

    var width = pos.get('width');
    var height = pos.get('height');

    var controlPath;

    var controlPointLocations = [[-width / 2, -height / 2], [width / 2, -height / 2], [-width / 2, height / 2], [width / 2, height / 2]];
    switch(svgObject.get('type')) {
      case 'polygon':
        if (editPolygon) {
          // no needed special points in edit mode
          controlPointLocations = [];
        }

        controlPath = <ControlPath objectID={this.props.objectID} polygon={svgObject.get('polygon')} editState={this.props.editState} />;
      break;
    }

    var haloRect;
    if (!editPolygon) {
      haloRect = <rect className='halo' x={-width / 2} y={-height / 2} width={width} height={height}></rect>;
    }

    var rotationControl;
    if (!editPolygon) {
      rotationControl = <RotationControl
              svgObject={svgObject}
              layerID={this.props.layerID}
              objectID={this.props.objectID}
              handleDrag={this.props.handleDrag} />;
    }

    var self = this;
    var controlPoints = controlPointLocations.map(function(location, i){
      return <ControlPoint x={location[0]} y={location[1]} onMouseDown={self.handleResizeStart} key={i} />;
    });

    return <g ref='container'
              transform={h.transformFor(pos)}
              onMouseDown={self.handleMouseDown}>
            {haloRect}

            {controlPoints}

            {controlPath}

            {rotationControl}
          </g>;
  }
});

module.exports = ControlObject;
