const dashboardContainer = document.getElementById('dashboard-container');
const API_URL = 'https://restcountries.eu/rest/v2/all';

getCountries();

async function getCountries() {
	try {
		const resp = await fetch(API_URL);
		const data = await resp.json();
		showSummary(data);
	} catch (error) {
		console.log(error.message);
	}
}

function showSummary(countries) {
	const dashboardEl = document.createElement('div');
	const total = countries.length;

	const avgPopulation =
		countries && countries.reduce((a, b) => a + b.population, 0);
	const avgArea = countries && countries.reduce((a, b) => a + b.area, 0);
	const avgNeighbours =
		countries && countries.reduce((a, b) => a + b.borders.length, 0);

	countries.forEach((country) => {});

	const top5Lang = getTop5Languages(countries);
	const top5Curr = getTop5Currencies(countries);

	console.log(top5Lang);

	dashboardEl.innerHTML = `
    <p>Total number of countries: ${total}</p>
    <p>Top 5 most common languages: 
        <ul>
            ${top5Lang
							.map((lang) => `<li style="margin-left: 1rem">${lang}</li>`)
							.join('')}
        </ul>
    </p>
    <p>Top 5 most common currencies: 
        <ul>
            ${top5Curr
							.map((curr) => `<li style="margin-left: 1rem">${curr}</li>`)
							.join('')}
        </ul>
    </p>
    <p>Average population: ${(avgPopulation / total).toFixed()}</p>
    <p>Average area: ${(avgArea / total).toFixed(2)} km<sup>2</sup></p>
    <p>Average number of neighbours: ${avgNeighbours / total}</p>
    `;
	dashboardContainer.appendChild(dashboardEl);
}

function getTop5Languages(countries) {
	let languages = [];

	countries.forEach((country) => {
		const names = country.languages.map((lang) => lang.name);
		languages = [...languages, ...names];
	});

	const result = languages.reduce(
		(acc, curr) => ((acc[curr] = (acc[curr] || 0) + 1), acc),
		{}
	);

	const top5languages = Object.entries(result)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5);

	return top5languages.map((lang) => lang[0]);
}
function getTop5Currencies(countries) {
	let currencies = [];

	countries.forEach((country) => {
		const names = country.currencies.map((curr) => curr.name);
		currencies = [...currencies, ...names];
	});

	const result = currencies.reduce(
		(acc, curr) => ((acc[curr] = (acc[curr] || 0) + 1), acc),
		{}
	);

	const top5currencies = Object.entries(result)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5);

	return top5currencies.map((curr) => curr[0]);
}
