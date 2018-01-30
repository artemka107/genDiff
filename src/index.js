import fs from 'fs';
import modulePath from 'path';
import _ from 'lodash';
import yaml from 'js-yaml';

const parsers = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.yml': yaml.safeLoad,
};

const actionNode = [
  {
    check: (value1, value2) => value1 === value2,
    type: 'unchanged',
    render: (key, value1) => `    ${key}: ${value1}`,
  },
  {
    check: (value1, value2) => value1 && !value2,
    type: 'deleted',
    render: (key, value1) => `  - ${key}: ${value1}`,
  },
  {
    check: (value1, value2) => !value1 && value2,
    type: 'added',
    render: (key, value1, value2) => `  + ${key}: ${value2}`,
  },
  {
    check: (value1, value2) => (value1 && value2) && (value1 !== value2),
    type: 'changed',
    render: (key, value1, value2) => `  + ${key}: ${value2}\n  - ${key}: ${value1}`,
  },
];

const getObj = (filePath) => {
  const file = fs.readFileSync(filePath, 'utf8');
  const extName = modulePath.extname(filePath);
  const parse = parsers[extName];
  return parse(file);
};

const genDiff = (path1, path2) => {
  const obj1 = getObj(path1);
  const obj2 = getObj(path2);

  const keys = _.union(_.keys(obj1), _.keys(obj2));

  const result = keys.map((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    const { render } = _.find(actionNode, ({ check }) => check(value1, value2));
    return render(key, value1, value2);
  }).join('\n');

  return `{\n${result}\n}\n`;
};


export default genDiff;
