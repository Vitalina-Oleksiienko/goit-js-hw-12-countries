import './sass/main.scss';
import { error, defaultModules } from '../node_modules/@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/BrightTheme.css';
import debounce from 'lodash/debounce';
import CountriesApiServise from './fetchCountries';
import countryTpl from './templates/country.hbs';
import countriesTpl from './templates/countries.hbs';


const refs = {
    searchInput: document.querySelector('.input-js'),
    output: document.querySelector('.error')
}
const countriesApiServise = new CountriesApiServise();

refs.searchInput.addEventListener('input', debounce(onSearch, 500));

function onSearch(e) {
    e.preventDefault();

    if (e.target.value.trim("") === "") { return };
    refs.output.innerHTML = "";

    countriesApiServise.query = e.target.value;
    countriesApiServise.fetchCountries().then(countries => { countriesMarkup(countries) });
    
}

function countriesMarkup(countries) {
    console.log(countries);
    const countriesLength = countries.length;
    if (countriesLength === 1) {
        refs.output.innerHTML = countryTpl(countries[0]);
        refs.output.classList.toggle('position');
        return
    }

    if (countriesLength > 1 && countriesLength <= 10) {
        refs.output.innerHTML = countriesTpl(countries);
        refs.output.classList.toggle('position');
        return
    }

    if (countriesLength > 10) {
        error(
            {
                delay: 2000,  text: "Too much countries, clarify your request",  maxOpen: 1,
            })
        return
    }
    error(
    {
        delay: 2000,  text: "Not found", maxOpen: 1,
    })
}