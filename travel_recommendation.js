const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');
const resultsContainer = document.getElementById('results-container');
const searchInput = document.getElementById('searchInput');

const timeZones = {
    "Sydney, Australia": "Australia/Sydney",
    "Melbourne, Australia": "Australia/Melbourne",
    "Tokyo, Japan": "Asia/Tokyo",
    "Kyoto, Japan": "Asia/Tokyo",
    "Rio de Janeiro, Brazil": "America/Sao_Paulo",
    "São Paulo, Brazil": "America/Sao_Paulo",
    "Angkor Wat, Cambodia": "Asia/Phnom_Penh",
    "Taj Mahal, India": "Asia/Kolkata",
    "Bora Bora, French Polynesia": "Pacific/Tahiti",
    "Copacabana Beach, Brazil": "America/Sao_Paulo"
};

function searchRecommendations() {
    const input = searchInput.value.toLowerCase().trim();
    
    resultsContainer.innerHTML = '';

    if (input === '') {
        return;
    }

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            let results = [];

            if (input.includes('beach')) {
                results = data.beaches;
            } 
            else if (input.includes('temple')) {
                results = data.temples;
            } 
            else if (input.includes('country') || input.includes('countries')) {
                data.countries.forEach(country => {
                    results = results.concat(country.cities);
                });
            } 
            else {
                resultsContainer.innerHTML = '<p class="no-results">No recommendations found. Try searching for "beach", "temple", or "country".</p>';
                return;
            }

            if (results.length > 0) {
                results.forEach(item => {
                    let timeHTML = '';
                    const tz = timeZones[item.name];
                    
                    if (tz) {
                        const options = { timeZone: tz, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
                        const localTime = new Date().toLocaleTimeString('en-US', options);
                        timeHTML = `<p class="local-time">🕒 <strong>Local Time:</strong> ${localTime}</p>`;
                    }

                    const card = document.createElement('div');
                    card.classList.add('result-card');
                    
                    card.innerHTML = `
                        <img src="${item.imageUrl}" alt="${item.name}">
                        <div class="card-info">
                            <h3>${item.name}</h3>
                            <p>${item.description}</p>
                            ${timeHTML} <button class="visit-btn">Visit</button>
                        </div>
                    `;
                    resultsContainer.appendChild(card);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultsContainer.innerHTML = '<p>Sorry, there was an error loading the recommendations.</p>';
        });
}

function clearResults() {
    searchInput.value = '';
    resultsContainer.innerHTML = '';
}

btnSearch.addEventListener('click', searchRecommendations);
btnClear.addEventListener('click', clearResults);