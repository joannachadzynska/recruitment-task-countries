const countriesTableBodyEl = document.getElementById('table-body');
const countriesTable = document.getElementById('countries-container');
const tableHeaders = document.querySelectorAll('th');
const searchInput = document.getElementById('search');
const min_max_inputs = document.querySelectorAll('input[type="range"]');

const minMaxPopulation = JSON.parse(localStorage.getItem('minMaxPopulation'));

min_max_inputs.forEach((input) => {
	document.querySelector(`.min_population`).textContent =
		minMaxPopulation['min_population'];
	document.querySelector(`.max_population`).textContent =
		minMaxPopulation['max_population'];
	input.addEventListener(
		'input',
		(e) => {
			const { value, name } = e.target;
			document.querySelector(`.${name}`).textContent = value;
			const range_width = getComputedStyle(e.target).getPropertyValue('width');
			const output_width = getComputedStyle(
				document.querySelector(`.${name}`)
			).getPropertyValue('width');
			const num_width_range = +range_width.substring(0, range_width.length - 2);
			const num_width_output = +output_width.substring(
				0,
				output_width.length - 2
			);

			console.log(num_width_range, num_width_output);
			const obj = {
				min_population:
					name === 'min_population'
						? +value
						: minMaxPopulation['min_population'],
				max_population:
					name === 'max_population'
						? +value
						: minMaxPopulation['max_population'],
			};

			localStorage.setItem('minMaxPopulation', JSON.stringify(obj));
		},
		false
	);
});

const API_URL = 'https://restcountries.eu/rest/v2/all';

let searchTerm = '';
let countries;

const getCountries = async () => {
	try {
		const resp = await fetch(API_URL);
		countries = await resp.json();
	} catch (error) {
		console.log(error.message);
	}
};

const showCountries = async () => {
	countriesTableBodyEl.innerHTML = '';

	await getCountries();

	countries
		.filter(
			(country) =>
				country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(country.area !== null &&
					country.area.toString().includes(searchTerm)) ||
				(country.population !== null &&
					country.population.toString().includes(searchTerm)) ||
				country.languages.some((lang) =>
					lang.name.toLowerCase().includes(searchTerm.toLowerCase())
				) ||
				country.currencies.some(
					(curr) =>
						curr.code !== null &&
						curr.code.toLowerCase().includes(searchTerm.toLowerCase())
				)
		)
		.forEach((country) => {
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
};

showCountries();

function setCurrency(currencies) {
	return currencies
		.filter((curr) => curr.code !== '(none)' && curr.code !== null)
		.map((curr) => curr.code)
		.join(' ');
}

function setLanguages(languages) {
	return languages.map((language) => language.name).join(', ');
}

function numberWithCommas(x) {
	return x !== null && x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Filtering data

searchInput.addEventListener('input', (e) => {
	searchTerm = e.target.value;
	showCountries();
});

// Sorting data

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

		console.log(Number(a));

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
