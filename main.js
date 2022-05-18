let form = document.querySelector('.search-form');

form.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
  // prevent page from reloading when form is submitted
  event.preventDefault();
  // get the value from the input field
  let inputValue = document.querySelector('.search-input').value;
  // remove whitespaces in the search query
  let searchQuery = inputValue.trim();

  let searchResults = document.querySelector('.results');
  searchResults.innerHTML = "";

  let spinner = document.querySelector('.spinner');
  spinner.classList.remove('hidden');

  try {
    let results = await searchWikipedia(searchQuery);
    console.log(results);
    displayResults(results);
  } catch (error) {
    console.log(error);
    alert('Failed to search in Wikipedia');
  } finally {
    spinner.classList.add('hidden');
  }
}

async function searchWikipedia(searchQuery) {
  let endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
  let response = await fetch(endpoint);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  let json = await response.json();
  return json;
}

function displayResults(results) {
  let searchResults = document.querySelector('.results');

  results.query.search.forEach(result => {
    let url = `https://en.wikipedia.org/?curid=${result.pageid}`;

      // Append the search result to the DOM
      searchResults.insertAdjacentHTML(
        'beforeend',
        `<div class="result-item">
          <h3 class="result-title">
            <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
          </h3>
          <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
          <p class="result-snippet">${result.snippet}</p>
        </div>`
     );
  });
}
