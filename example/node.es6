import fetch     from 'isomorphic-fetch';
import EasyAgent from '../dist/EasyAgent';

EasyAgent.setFetchFunction(fetch);

const query = process.argv[2] || 'easyagent';

EasyAgent.get('https://api.github.com/search/repositories')
  .setQueries({ q: query })
  .fetchJson()
  .then(json => {
    console.log(json);
  })
  .catch(err => {
    console.error(err);
  });
