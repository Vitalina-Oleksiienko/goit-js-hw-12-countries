import './sass/main.scss';

import fetchCountries from '../src/fetchCountries.js';
import countryMarkup from './templates/country-template.hbs';
import countriesMarkup from './templates/countries-template.hbs';
import { success, error, defaults } from '@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/confirm/dist/PNotifyConfirm.css';

defaults.delay = 2500;

const debounse = require('lodash.debounce');
const refs = {
    inputEl: document.querySelector('.input'),
    listEl: document.querySelector('.error'),
};

refs.inputEl.addEventListener('input', debounse(onInput, 500));

function onInput(e) {
    if (e.target.value.trim('') === '') {
        refs.listEl.textContent = '';
        return;
    }

    refs.listEl.textContent = '';
    fetchCountries(e.target.value.trim(''))
        .then(response =>
            response.ok ? response.json() : Promise.reject(response),
        )
        .then(countries => {
            const countriesLength = countries.length;
            if (countriesLength === 1) {
                refs.listEl.innerHTML = countryMarkup(countries[0]);
                success({ text: `Here's what you were looking for` });
                return;
            }
            if (countriesLength > 1 && countriesLength <= 10) {
                refs.listEl.innerHTML = countriesMarkup(countries);
                success({ text: `Something went wrong` });
                return;
            }
            error({
                text: 'We found many countries, specify your request',
            });
        })
        .catch(err => {
            if (err.status === 404) {
                error({
                    text: `Error ${err.status}. There is no such country.`,
                });
            } else {
                error({
                    text: `Check your internet, we can't work like this :(`,
                });
            }
        });
        
}