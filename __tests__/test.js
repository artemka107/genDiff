import genDiff from '../src';
import fs from 'fs';

const result = fs.readFileSync('__tests__/__fixtures__/results/plane.txt', 'utf8');
const json1 = '__tests__/__fixtures__/json/before.json';
const json2 = '__tests__/__fixtures__/json/after.json';

const yaml1 = '__tests__/__fixtures__/yaml/before.yaml';
const yaml2 = '__tests__/__fixtures__/yaml/after.yaml';

const ini1 = '__tests__/__fixtures__/ini/before.ini';
const ini2 = '__tests__/__fixtures__/ini/after.ini';

describe('compare plane formats', () => {
  test('diff 2 plane json files', () => {
    expect(genDiff(json1, json2)).toBe(result)
  });

  test('diff 2 plane yaml files', () => {
    expect(genDiff(yaml1, yaml2)).toBe(result)
  });

  // test('diff 2 plane ini files', () => {
  //   expect(genDiff(ini1, ini2)).toBe(result)
  // });
})

