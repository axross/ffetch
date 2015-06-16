var EasyAgent = require('../dist/EasyAgent');

document.addEventListener('DOMContentLoaded', function() {
  var baseAgent = EasyAgent
    .get('https://api.github.com/search/repositories')
    .setQueries({ page: 1 });

  var currentAgent;

  var formEl      = document.querySelector('.form');
  var inputEl     = document.querySelector('.input');
  var resultEl    = document.querySelector('.result');
  var fetchMoreEl = document.querySelector('.fetchMore');

  var templateEl = document.createElement('li');
  templateEl.appendChild(document.createElement('a'));
  templateEl.appendChild(document.createElement('span'));

  var refreshResult = function() {
    while (resultEl.children.length > 0) {
      resultEl.removeChild(resultEl.firstChild);
    }
  }

  var appendResults = function(repos) {
    var fragment = document.createDocumentFragment();

    repos.forEach(function(repo) {
      var cloned = templateEl.cloneNode(true);
      var aEl    = cloned.querySelector('a');
      var spanEl = cloned.querySelector('span');

      aEl.textContent = repo.full_name;
      aEl.setAttribute('href', repo.url);

      spanEl.textContent = '(' + repo.stargazers_count + ')'

      fragment.appendChild(cloned);
    });

    resultEl.appendChild(fragment);
  };

  formEl.addEventListener('submit', function(e) {
    e.preventDefault();

    currentAgent = baseAgent.setQueries({ q: inputEl.value.trim() });

    currentAgent
      .fetchJson()
      .then(function(json) {
        refreshResult();
        appendResults(json.items);

        fetchMoreEl.style.display = 'inline-block';
      })
      .catch(function(err) {
        console.error(err);
      });
  });

  fetchMoreEl.addEventListener('click', function() {
    const page = currentAgent.queries.page;

    currentAgent = currentAgent.setQueries({ page: page + 1 });

    currentAgent
      .fetchJson()
      .then(function(json) {
        appendResults(json.items);

        if (json.total_count <= page * 30) {
          fetchMoreEl.style.display = 'none';
        }
      })
      .catch(function(err) {
        console.error(err);
      });
  });
});
