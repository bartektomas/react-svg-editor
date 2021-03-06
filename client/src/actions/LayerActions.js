'use strict';

var Reflux = require('reflux');

var LayerActions = Reflux.createActions([
  'changeLayerVisibility',
  'selectLayer',
  'preSelectLayer',
  'unPreSelectLayer',
  'moveUpSelectedLayer',
  'moveDownSelectedLayer',
  'deleteSelectedLayer',
  'addNewLayer',
  'createMaskFromSelectedLayer',
  'applyMaskToLayer',
  'removeMaskFromSelectedLayer'
]);
module.exports = LayerActions;
