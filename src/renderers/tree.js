import _ from 'lodash';

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


const render = (ast) => {
  const result = ast.map(node => processRender(node, 2)).join('\n');
  return `{\n${result}\n}\n`;
};

export default render;
