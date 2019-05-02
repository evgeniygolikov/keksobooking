export default class Pins {
  constructor(element) {
    this.template = document.querySelector('template');
    this.element = element;
    this.elements = [];
    this.element.addEventListener('click', this.handleClick.bind(this));
  }

  render(data) {
    const fragment = document.createDocumentFragment();
    this.removeAll();
    data.forEach(({location, author, offer}, index) => {
      const pin = this.renderPin({
        x: location.x,
        y: location.y,
        src: author.avatar,
        title: offer.title,
        index
      });
      this.elements.push(pin);
      fragment.append(pin);
    });
    this.element.append(fragment);
  }

  renderPin({x, y, src, title, index}) {
    const pin = this.template.content.querySelector('.map__pin').cloneNode(true);
    const image = pin.querySelector('img');
    pin.style.left = `${x - image.getAttribute('width') / 2}px`;
    pin.style.top = `${y - image.getAttribute('height') + 18}px`;
    pin.dataset.pinIndex = index;
    image.src = src;
    image.alt = title;
    return pin;
  }

  removeAll() {
    this.elements.forEach(element => element.remove());
    this.elements = [];
  }

  deselectPin() {
    const activePin = this.element.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  }

  selectPin(pin) {
    pin.classList.add('map__pin--active');
  }

  handleClick(event) {
    const target = event.target.closest('.map__pin');
    if (target && target.hasAttribute('data-pin-index')) {
      this.deselectPin();
      this.selectPin(target);
      this.element.dispatchEvent(new CustomEvent('pin:select', {
        bubbles: true,
        detail: {
          pinIndex: target.dataset.pinIndex
        }
      }));
    }
  }
}