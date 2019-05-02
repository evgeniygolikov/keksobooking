import toNumber from '../utils/to-number.js';
import save from '../utils/save.js';
import AvatarUploader from './avatar-uploader.js';
import PhotoUploader from './photo-uploader.js';

const validationErrorMessages = {
  title: {
    tooShort: 'Заголовок объявления должен состоять минимум из 30-ти символов',
    tooLong: 'Заголовок объявления не должен превышать 100 символов',
    valueMissing: 'Обязательное поле'
  },
  price: {
    rangeUnderflow: 'Цена за ночь не может быть менее 1000 рублей',
    rangeOverflow: 'Цена за ночь не может быть более 1000000 рублей',
    valueMissing: 'Обязательное поле'    
  }
};

const typeToMinPrice = {
  flat: 1000,
  bungalo: 0,
  house: 5000,
  palace: 10000
};

const roomCountToAvailableCapacity = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};

function setValidity(element, violationName) {
  element.setCustomValidity(validationErrorMessages[element.name][violationName]);
}

function unsetValidity(element) {
  element.setCustomValidity('');
}

function getErrorMessageFor(element) {
  for (let state in element.validity) {
    if (element.validity[state]) {
      return validationErrorMessages[element.name][state];
    }
  }
}

export default class Form {
  constructor(element) {
    this.element = element;
    this.allFields = element.querySelectorAll('input, textarea, select, button');
    this.titleField = element.querySelector('#title');
    this.addressField = element.querySelector('#address');
    this.priceField = element.querySelector('#price');
    this.typeSelect = element.querySelector('#type');
    this.timeinSelect = element.querySelector('#timein');
    this.timeoutSelect = element.querySelector('#timeout');
    this.roomCountSelect = element.querySelector('#room-count');
    this.capacitySelect = element.querySelector('#capacity');
    this.avatarUploader = new AvatarUploader(element);
    this.photoUploader = new PhotoUploader(element);
    this.disable();
    this.element.addEventListener('submit', this.handleSubmit.bind(this));
    this.element.addEventListener('reset', this.handleReset.bind(this));
    this.titleField.addEventListener('invalid', this.handleInvalid.bind(this));
    this.titleField.addEventListener('input', this.handleTitleFieldInput.bind(this));
    this.priceField.addEventListener('invalid', this.handleInvalid.bind(this));
    this.priceField.addEventListener('input', this.handlePriceFieldInput.bind(this));
    this.typeSelect.addEventListener('change', this.handleTypeSelectChange.bind(this));
    this.timeinSelect.addEventListener('change', this.handleTimeSelectChange.bind(this));
    this.timeoutSelect.addEventListener('change', this.handleTimeSelectChange.bind(this));
    this.roomCountSelect.addEventListener('change', this.handleRoomCountSelectChange.bind(this));
    document.addEventListener('userPin:move', event => this.updateAddress(event.detail));
    document.addEventListener('userPin:release', event => {
      this.enable();
      this.updateAddress(event.detail);
    }, {once: true});
  }

  enable() {
    this.element.classList.remove('notice__form--disabled');
    this.allFields.forEach(field => field.disabled = false);
  }

  disable() {
    this.element.classList.add('notice__form--disabled');
    this.allFields.forEach(field => field.disabled = true);
  }

  reset() {
    this.element.reset();
    this.avatarUploader.reset();
    this.photoUploader.reset();
  }

  submit() {
    this.reset();
    alert('Объявление было опубликовано успешно!');
    this.element.dispatchEvent(new CustomEvent('form:submit', {bubbles: true}));
    this.disable();
    document.addEventListener('userPin:release', event => {
      this.enable();
      this.updateAddress(event.detail);
    }, {once: true});
  }

  updateAddress({x, y}) {
    this.addressField.value = `${Math.floor(x)}, ${Math.floor(y)}`;
  }

  handleSubmit(event) {
    event.preventDefault();
    save(new FormData(this.element), data => {
      this.submit();
    }, error => {
      alert(error);
    });
  }

  handleReset() {
    this.reset();
  }

  handleInvalid(event) {
    event.target.setCustomValidity(getErrorMessageFor(event.target));
  }

  handleTitleFieldInput(event) {
    if (event.target.value.length < event.target.minLength) {
      setValidity(event.target, 'tooShort');
    } else if (event.target.value.length > event.target.maxLength) {
      setValidity(event.target, 'tooLong');
    } else {
      unsetValidity(event.target);
    }
  }

  handlePriceFieldInput(event) {
    if (toNumber(event.target.value) < event.target.min) {
      setValidity(event.target, 'rangeUnderflow');
    } else if (toNumber(event.target.value) > event.target.max) {
      setValidity(event.target, 'rangeOverflow');
    } else {
      unsetValidity(event.target);
    }
  }

  handleTypeSelectChange(event) {
    const minPrice = typeToMinPrice[event.target.value];
    this.priceField.placeholder = minPrice;
    this.priceField.min = minPrice;
  }
  
  handleTimeSelectChange(event) {
    const select = event.target.name === 'timein' ? this.timeoutSelect : this.timeinSelect;
    select.value = event.target.value;
  }
  
  handleRoomCountSelectChange(event) {
    const availableCapacities = roomCountToAvailableCapacity[event.target.value];
    let selectedFirstAvailableOption = false;
    Array.from(this.capacitySelect.options).forEach(option => {
      if (!availableCapacities.includes(option.value)) {
        option.disabled = true;
      } else {
        if (!selectedFirstAvailableOption) {
          option.selected = selectedFirstAvailableOption = true;
        }
        option.disabled = false;
      }
    });
  }
}