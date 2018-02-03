import fs from 'fs';
import genDiff from '../src';

const fixturesDir = '__tests__/__fixtures__/';

const getResult = type => fs.readFileSync(`${fixturesDir}results/${type}.txt`, 'utf8');

const json1 = `${fixturesDir}json/before.json`;
const json2 = `${fixturesDir}json/after.json`;

const yaml1 = `${fixturesDir}yaml/before.yaml`;
const yaml2 = `${fixturesDir}yaml/after.yaml`;

const ini1 = `${fixturesDir}ini/before.ini`;
const ini2 = `${fixturesDir}ini/after.ini`;

const tree = 'tree';
const plane = 'plane';
const json = 'json';

describe('compare files with tree formats', () => {
  test('diff 2 json files', () => {
    expect(genDiff(json1, json2, tree)).toBe(getResult(tree));
  });

  test('diff 2 yaml files', () => {
    expect(genDiff(yaml1, yaml2, tree)).toBe(getResult(tree));
  });

  test('diff 2 ini files', () => {
    expect(genDiff(ini1, ini2, tree)).toBe(getResult(tree));
  });
});

describe('compare files with plane formats', () => {
  test('diff 2 json files', () => {
    expect(genDiff(json1, json2, plane)).toBe(getResult(plane));
  });

  test('diff 2 yaml files', () => {
    expect(genDiff(yaml1, yaml2, plane)).toBe(getResult(plane));
  });

  test('diff 2 ini files', () => {
    expect(genDiff(ini1, ini2, plane)).toBe(getResult(plane));
  });
});

describe('compare files with json formats', () => {
  test('diff 2 json files', () => {
    expect(genDiff(json1, json2, json)).toBe(getResult(json).trim());
  });

  test('diff 2 yaml files', () => {
    expect(genDiff(yaml1, yaml2, json)).toBe(getResult(json).trim());
  });

  test('diff 2 ini files', () => {
    expect(genDiff(ini1, ini2, json)).toBe(getResult(json).trim());
  });
});
