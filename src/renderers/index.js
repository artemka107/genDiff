import treeRender from './treeRender';
import planeRender from './planeRender';
import jsonRender from './jsonRender';

const renderFormats = {
  tree: treeRender,
  plane: planeRender,
  json: jsonRender,
};

const getRender = format => renderFormats[format];

export default getRender;
