#!/usr/bin/env node
import program from 'commander';
import gendiff from '..';

program
  .version('0.1.0')
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format type')
  .action((firstConfig, secondConfig, cmd) => {
    const diff = gendiff(firstConfig, secondConfig, cmd.format);
    console.log(diff);
  });

program.parse(process.argv);
