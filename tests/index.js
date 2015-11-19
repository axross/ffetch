import { Promise } from 'es6-promise';
import glob from 'glob'
import fetch from 'node-fetch'
import path from 'path'

global.Promise = Promise;
global.fetch = fetch;

process.argv.slice(2).forEach(arg => {
  glob(arg, (_, files) => {
    files.forEach(file => {
      require(path.resolve(process.cwd(), file));
    });
  });
});
