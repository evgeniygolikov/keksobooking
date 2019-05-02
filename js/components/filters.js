export default class Filters {
  constructor(element) {
    this.element = element;
    this.typeSelect = element.querySelector('#housing-type');
    this.priceSelect = element.querySelector('#housing-price');
    this.roomCountSelect = element.querySelector('#housing-rooms');
    this.guestCountSelect = element.querySelector('#housing-guests');
    this.featureCheckboxes = element.querySelectorAll('#housing-features input[name="features"]');
    element.addEventListener('change', this.handleChange.bind(this));
  }

  get type() {
    return this.typeSelect.value;
  }

  get price() {
    return this.priceSelect.value;
  }

  get rooms() {
    return this.roomCountSelect.value;
  }

  get guests() {
    return this.guestCountSelect.value;
  }

  get features() {
    return Array.from(this.featureCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);
  }

  toJSON() {
    return {
      type: this.type,
      price: this.price,
      rooms: this.rooms,
      guests: this.guests,
      features: this.features
    };
  }

  change() {
    this.element.dispatchEvent(new CustomEvent('filters:change', {
      bubbles: true,
      detail: this.toJSON()
    }));
  }

  handleChange(event) {
    event.preventDefault();
    this.change();
  }
}

