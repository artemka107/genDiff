import genDiff from '../src';
import fs from 'fs';

const fixturesDir = '__tests__/__fixtures__/'

const getResult = () => {
  return fs.readFileSync(`${fixturesDir}results/tree.txt`, 'utf8');
};

const json1 = `${fixturesDir}json/before.json`;
const json2 = `${fixturesDir}json/after.json`;

const yaml1 = `${fixturesDir}yaml/before.yaml`;
const yaml2 = `${fixturesDir}yaml/after.yaml`;

const ini1 = `${fixturesDir}ini/before.ini`;
const ini2 = `${fixturesDir}ini/after.ini`;

describe('compare plane formats', () => {
  test('diff 2 plane json files', () => {
    expect(genDiff(json1, json2)).toBe(getResult())
  });

  test('diff 2 plane yaml files', () => {
    expect(genDiff(yaml1, yaml2)).toBe(getResult())
  });

  test('diff 2 plane ini files', () => {
    expect(genDiff(ini1, ini2)).toBe(getResult())
  });
})

