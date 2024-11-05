const apiKey = '5ea3dc9ff2ef85ba7f54ff81';
const baseCurrency = 'USD';
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;

let exchangeRates = [];
let currentPage = 1;
const ratesPerPage = 10;

document.getElementById('next').addEventListener('click', () => changePage(1));
document.getElementById('prev').addEventListener('click', () => changePage(-1));

function fetchRates() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success') {
        exchangeRates = Object.entries(data.conversion_rates);
        displayRates();
      } else {
        showError(`Error: ${data['error-type']}`);
      }
    })
    .catch(error => showError('Network error, please try again later.'));
}

function displayRates() {
  const tableBody = document.getElementById('exchange-rates');
  tableBody.innerHTML = '';

  const start = (currentPage - 1) * ratesPerPage;
  const paginatedRates = exchangeRates.slice(start, start + ratesPerPage);

  paginatedRates.forEach(([currency, rate]) => {
    const row = `<tr><td class="border px-4 py-2">${currency}</td><td class="border px-4 py-2">${rate}</td></tr>`;
    tableBody.insertAdjacentHTML('beforeend', row);
  });

  document.getElementById('prev').disabled = currentPage === 1;
  document.getElementById('next').disabled = start + ratesPerPage >= exchangeRates.length;
}

function changePage(direction) {
  currentPage += direction;
  displayRates();
}

function showError(message) {
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;
}

fetchRates();
  