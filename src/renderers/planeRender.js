import _ from 'lodash';

const isNotUnchanged = node => node.type !== 'unchanged';

const generateStr = (node, path, fn) => {
  const {
    key,
    type,
    oldValue,
    newValue,
    children,
  } = node;

  const propName = path.concat(key).join('.');

  switch (type) {
    case 'added':
      return `Property '${propName}' was added with ${_.isObject(newValue) ? 'complex value' : `value: '${newValue}'`}`;
    case 'deleted':
      return `Property '${propName}' was removed`;
    case 'changed':
      return `Property '${propName}' was updated. From '${oldValue}' to '${newValue}'`;
    case 'nested':
      return fn(children, path.concat(key));
    default:
      return 'type is not defined';
  }
};

const render = (ast) => {
  const iter = (tree, pathToFile) => {
    const result = tree
      .filter(isNotUnchanged)
      .map(node => generateStr(node, pathToFile, iter))
      .join('\n');
    return result;
  };
  const result = iter(ast, []);
  return `${result}\n`;
};

export default render;
