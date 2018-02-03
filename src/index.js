import fs from 'fs';
import modulePath from 'path';
import _ from 'lodash';
import getFileParse from './parsers';
import getRender from './renderers';

const actionNode = [
  {
    check: (value1, value2) => _.isObject(value1) && _.isObject(value2),
    type: 'nested',
    process: (value1, value2, fn) => ({ children: fn(value1, value2) }),
  },
  {
    check: (value1, value2) => value1 === value2,
    type: 'unchanged',
    process: (value1, value2) => ({ oldValue: value1, newValue: value2 }),
  },
  {
    check: (value1, value2) => value1 && !value2,
    type: 'deleted',
    process: (value1, value2) => ({ oldValue: value1, newValue: value2 }),
  },
  {
    check: (value1, value2) => !value1 && value2,
    type: 'added',
    process: (value1, value2) => ({ oldValue: value1, newValue: value2 }),
  },
  {
    check: (value1, value2) => (value1 && value2) && (value1 !== value2),
    type: 'changed',
    process: (value1, value2) => ({ oldValue: value1, newValue: value2 }),
  },
];

const parse = (obj1, obj2) => {
  const keys = _.union(_.keys(obj1), _.keys(obj2));
  return keys.map((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    const { process, type } = _.find(actionNode, ({ check }) => check(value1, value2));
    return { key, type, ...process(value1, value2, parse) };
  });
};


const getObj = (filePath) => {
  const file = fs.readFileSync(filePath, 'utf8');
  const extName = modulePath.extname(filePath);
  const fileParse = getFileParse(extName);
  return fileParse(file);
};

const genDiff = (path1, path2, renderFormat) => {
  const obj1 = getObj(path1);
  const obj2 = getObj(path2);
  const render = getRender(renderFormat);

  const ast = parse(obj1, obj2);
  const result = render(ast);
  return result;
};

export default genDiff;
