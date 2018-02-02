import treeRender from './tree';
import planeRender from './plane';

const renderFormats = {
  tree: treeRender,
  plane: planeRender,
};

const getRender = format => renderFormats[format];

export default getRender;
