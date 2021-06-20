const countriesTableBodyEl = document.getElementById('table-body');
const countriesTable = document.getElementById('countries-container');
const tableHeaders = document.querySelectorAll('th');

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
	countriesTableBodyEl.innerHTML = '';

	countries.forEach((country) => {
		const { name, area, flag, population, currencies, languages } = country;
		const countryEl = document.createElement('tr');
		countryEl.classList.add('country');

		countryEl.innerHTML = `
            <td data-label="Name" scope="row">${name}</td>
            <td data-label="Currency">${setCurrency(currencies)}</td>
            <td data-label="Language">${setLanguages(languages)}</td>
            <td data-label="Population">${Number(population)}</td>
            <td data-label="Area">${Number(area)}</td>
            <td data-label="Flag">
             <img src="${flag}" alt="flag ${name}" style="width: 100px; height: 50px"/>
            </td>
           
        `;

		countriesTableBodyEl.appendChild(countryEl);
	});
}

function setCurrency(currencies) {
	return currencies
		.filter((curr) => curr.code !== '(none)' && curr.code !== null)
		.map((curr) => curr.code)
		.join(' ');
}

function setLanguages(languages) {
	return languages.map((language) => language.name).join(', ');
}

const getCellValue = (tr, idx) => {
	const val =
		tr.children[idx].innerText.trim().toLowerCase() ||
		tr.children[idx].textContent.trim().toLowerCase();

	if (!val || val === '-' || val.toLowerCase() === 'new') {
		return null;
	}

	return val;
};

const compareValues = (idx, asc) => {
	asc = asc ? 1 : -1;

	return function (a, b) {
		a = getCellValue(a, idx);
		b = getCellValue(b, idx);

		if (b === null) {
			return asc;
		}

		if (a === null) {
			return -asc;
		}

		if (isFinite(Number(a)) && isFinite(Number(b))) {
			return asc * (parseInt(a, 10) - parseInt(b, 10));
		}

		return asc * a.toString().localeCompare(b);
	};
};

tableHeaders.forEach((th) => {
	th.addEventListener('click', () => {
		[...countriesTable.querySelectorAll('.country')]
			.sort(
				compareValues(
					[...th.parentNode.children].indexOf(th),
					(this.asc = !this.asc)
				)
			)
			.forEach((tr) => countriesTable.appendChild(tr));
	});
});
