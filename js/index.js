import CityMap from './components/city-map.js';
import Form from './components/form.js';

const formElement = document.querySelector('.notice__form');
const form = new Form(formElement);

const mapElement = document.querySelector('.map');
const map = new CityMap(mapElement);