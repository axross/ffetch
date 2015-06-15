var EasyAgent = require('../dist/EasyAgent');

document.addEventListener('DOMContentLoaded', function() {
  var formEl   = document.querySelector('.form');
  var inputEl  = document.querySelector('.input');
  var resultEl = document.querySelector('.result');

  var outputResult = function(repos) {
    var fragment = document.createDocumentFragment();

    var template = document.createElement('li');
    template.appendChild(document.createElement('a'));
    template.appendChild(document.createElement('span'));

    while (resultEl.children.length > 0) {
      resultEl.removeChild(resultEl.firstChild);
    }

    repos.forEach(function(repo) {
      var node   = template.cloneNode(true);
      var aEl    = node.querySelector('a');
      var spanEl = node.querySelector('span');

      aEl.textContent = repo.full_name;
      aEl.setAttribute('href', repo.url);

      spanEl.textContent = '(' + repo.stargazers_count + ')'

      fragment.appendChild(node);
    });

    resultEl.appendChild(fragment);
  };

  formEl.addEventListener('submit', function(e) {
    e.preventDefault();

    var query = inputEl.value.trim();

    EasyAgent.get('https://api.github.com/search/repositories')
      .setQueries({ q: query })
      .fetchJson()
      .then(function(json) {
        outputResult(json.items);
      })
      .catch(function(err) {
        console.error(err);
      });
  });
});
