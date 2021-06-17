const countriesContainer = document.getElementById('countries-container');
const API_URL = 'https://restcountries.eu/rest/v2/all';

getCountries();

async function getCountries() {
	try {
		const resp = await fetch(API_URL);
		const data = await resp.json();
		showCountries(data);
	} catch (error) {
		console.log(error.message);
	}
}

function showCountries(countries) {
	countriesContainer.innerHTML = '';

	countries.forEach((country) => {
		const { name, area, flag, population, currencies, languages } = country;
		const countryEl = document.createElement('div');
		countryEl.innerHTML = `
            <p>Name: ${name}</p>
            <p>Currency: ${setCurrency(currencies)}</p>
            <p>Language: ${setLanguages(languages)}</p>
            <p>Population: ${population} people</p>
            <p>Area: ${area} km<sup>2</sup></p>
            <img src="${flag}" alt="flag ${name}" style="width: 100px; height: 50px"/>
        `;

		countriesContainer.appendChild(countryEl);
	});

	countries.appendChild(countries);
}

function setCurrency(currencies) {
	return currencies.map((curr) => curr.code);
}

function setLanguages(languages) {
	return languages.map((language) => language.name);
}
