import load from '../utils/load.js';
import UserPin from './user-pin.js';
import Filters from './filters.js';
import Pins from './pins.js';
import Popup from './popup.js';

const MAX_PIN_COUNT = 5;

function trimArray(array, length = MAX_PIN_COUNT) {
  return array.slice(0, length);
}

function compareType(offerType, filterType) {
  return filterType === 'any' || filterType === offerType;
}

function compareCount(offerType, filterType) {
  return filterType === 'any' || filterType === offerType.toString();
}

const PriceRange = {
  LOW: 10000,
  HIGH: 50000
};

function getPriceRange(price) {
  if (price < PriceRange.LOW) {
    return 'low';
  }
  if (price >= PriceRange.HIGH) {
    return 'high';
  }
  return 'middle';
}

function comparePrice(offerPrice, filterPrice) {
  return filterPrice === 'any' || filterPrice === getPriceRange(offerPrice);
}

function compareFeatures(offerFeatures, filterFeatures) {
  return filterFeatures.every(feature => offerFeatures.includes(feature));
}

function filterData(data, filter) {
  return data.filter(({offer}) =>
    compareType(offer.type, filter.type) &&
    compareCount(offer.rooms, filter.rooms) &&
    compareCount(offer.guests, filter.guests) &&
    comparePrice(offer.price, filter.price) &&
    compareFeatures(offer.features, filter.features)
  );
}

export default class CityMap {
  constructor(element) {
    this.element = element;
    this.overlay = element.querySelector('.map__pinsoverlay');
    this.userPin = new UserPin(element.querySelector('.map__pin--main'), {
      boundaries: {
        left: 0,
        top: 120,
        right: this.overlay.clientWidth,
        bottom: this.overlay.clientHeight
      }
    });
    this.filters = new Filters(element.querySelector('.map__filters'));
    this.pins = new Pins(element.querySelector('.map__pins'));
    this.popup = new Popup(this.element);
    this.element.addEventListener('userPin:release', this.show.bind(this), {once: true});
    this.element.addEventListener('filters:change', this.handleFilterChange.bind(this));
    this.element.addEventListener('pin:select', this.handlePinSelect.bind(this));
    this.element.addEventListener('popup:close', this.handlePopupClose.bind(this));
    document.addEventListener('form:submit', () => {
      this.hide();
    });
  }

  render(data) {
    this.pins.render(trimArray(data));
  }

  show() {
    this.element.classList.remove('map--faded');
    load(data => {
      this.initialData = data;
      this.render(data);
    }, error => {
      alert(error);
      console.error(error);
    });
  }

  hide() {
    this.pins.removeAll();
    this.element.classList.add('map--faded');
    this.userPin.reset();
    this.element.addEventListener('userPin:release', this.show.bind(this), {once: true});
  }

  handleFilterChange(event) {
    this.filteredData = filterData(this.initialData, event.detail);
    this.render(this.filteredData);
    if (this.popup.isOpen) {
      this.popup.close();
    }
  }

  handlePinSelect(event) {
    if (this.filteredData) {
      this.popup.open(this.filteredData[event.detail.pinIndex])
    } else {
      this.popup.open(this.initialData[event.detail.pinIndex])
    }
  }

  handlePopupClose() {
    this.pins.deselectPin();
  }
}