import fetch     from 'isomorphic-fetch';
import request from '../dist/EasyAgent';

EasyAgent.setFetchFunction(fetch);

const query = process.argv[2] || 'easyagent';

request.get('https://api.github.com/search/repositories')
  .setQueries({ q: query })
  .fetchJson()
  .then(json => {
    console.log(json);
  })
  .catch(err => {
    console.error(err);
  });
