import fs from 'fs';
import modulePath from 'path';
import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

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

const renderObj = (obj, setTab, indents) => {
  const tab = setTab(indents + 4);
  const bracketsTab = setTab(indents + 2);
  const result = _.keys(obj).map(key => `${tab}  ${key}: ${obj[key]}`).join('\n');
  return `{\n${result}\n${bracketsTab}}`;
};

const processRender = (node, indents) => {
  const {
    type,
    key,
    oldValue,
    newValue,
    children,
  } = node;
  const setTab = spaces => ' '.repeat(spaces);
  const tab = setTab(indents);
  const bracketsTab = setTab(indents + 2);

  switch (type) {
    case 'unchanged':
      return `${tab}  ${key}: ${oldValue}`;
    case 'added':
      return `${tab}+ ${key}: ${_.isObject(newValue) ? renderObj(newValue, setTab, indents) : newValue}`;
    case 'deleted':
      return `${tab}- ${key}: ${_.isObject(oldValue) ? renderObj(oldValue, setTab, indents) : oldValue}`;
    case 'changed':
      return `${tab}+ ${key}: ${newValue}\n${tab}- ${key}: ${oldValue}`;
    case 'nested':
      return `${tab}  ${key}: {\n${children.map(c => processRender(c, indents + 4)).join('\n')}\n${bracketsTab}}`;
    default:
      return 'type is not defined';
  }
};

const parse = (obj1, obj2) => {
  const keys = _.union(_.keys(obj1), _.keys(obj2));
  return keys.map((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    const { process, type } = _.find(actionNode, ({ check }) => check(value1, value2));
    return { key, type, ...process(value1, value2, parse) };
  });
};

const render = (ast, indents) => {
  const result = ast.map(node => processRender(node, indents)).join('\n');
  return `{\n${result}\n}\n`;
};

const getObj = (filePath) => {
  const file = fs.readFileSync(filePath, 'utf8');
  const extName = modulePath.extname(filePath);
  const fileParse = parsers[extName];
  return fileParse(file);
};

const genDiff = (path1, path2) => {
  const obj1 = getObj(path1);
  const obj2 = getObj(path2);

  return render(parse(obj1, obj2), 2);
};


export default genDiff;
