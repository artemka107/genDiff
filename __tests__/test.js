import genDiff from '../src';
import fs from 'fs';

const result = fs.readFileSync('__tests__/__fixtures__/results/plane.txt', 'utf8');
const path1 = '__tests__/__fixtures__/json/before.json';
const path2 = '__tests__/__fixtures__/json/after.json';

test('diff 2 plane json files', () => {
  expect(genDiff(path1, path2)).toBe(result)
});

