import './styles.css';
import debounce from 'lodash.debounce';
import fetchCountries from './js/fetchCountries.js'
import listOfCountries from './template/listofcountris.hbs'
import countryCard from './template/template.hbs'

import "@pnotify/core/dist/PNotify.css" 
import "@pnotify/desktop/dist/PNotifyDesktop" ;
import '@pnotify/core/dist/BrightTheme.css';

import {info,error} from '@pnotify/core';

  const searchForm= document.querySelector('input');
  const countryContainer = document.querySelector('.js-card-container');
  let countryToSearch = '';
  
  function onSearch() {
    countryToSearch = searchForm.value;
  
    if (!countryToSearch) {
      clearMarkup();
      return;
    }
  
    fetchCountries.fetchCountries(countryToSearch)
      .then(checkingNumberOfCountries)
      .catch(onFetchError);
  }

  searchForm.addEventListener(
    'input',
    debounce(() => {
      onSearch();
    }, 500),
  );

  function checkingNumberOfCountries(countries) {
    if (countries.length > 10) {
      clearMarkup();
      tooManyCountries();
    } else if (countries.length <= 10 && countries.length > 1) {
      clearMarkup();
      renderMarkup(listOfCountries, countries);
    } else if (countries.length === 1) {
      clearMarkup();
      renderMarkup(countryCard, countries[0]);
    } else {
      clearMarkup();
      noResult();
    }
  }
  
  function renderMarkup(template, countries) {
    const markup = template(countries);
    countryContainer.insertAdjacentHTML('beforeend', markup);
  }
  
  function clearMarkup() {
    countryContainer.innerHTML = '';
  }
  
  function noResult() {
    info({
      title: ';(',
      text: 'No matches found! Change name',
      delay: 1500,
      closerHover: true,
    });
  }
  
  function tooManyCountries() {
    error({
      title: ';(',
      text: 'Too many matches found. Please, enter a more specific query!',
      delay: 1500,
      closerHover: true,
    });
  }
  
  function onFetchError(error) {
    clearMarkup();
  
    console.log(error);
  }