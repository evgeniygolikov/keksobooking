import wasEscapeKeyPressed from '../utils/was-escape-key-pressed.js';

var typesLocale = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом'
};

export default class Popup {
  constructor(element) {
    this.element = element;
    this.template = document.querySelector('template');
    this.isOpen = false;
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  open(data) {
    this.render(data);
    document.querySelector('.popup__close').addEventListener('click', this.close.bind(this));
    document.addEventListener('keydown', this.handleKeyDown);
    this.isOpen = true;
  }

  close() {
    this.element.querySelector('.popup').classList.add('hidden');
    this.element.dispatchEvent(new CustomEvent('popup:close', {
      bubbles: true
    }));
    document.removeEventListener('keydown', this.handleKeyDown);
    this.isOpen = false;
  }

  render({offer, author}) {
    const popup = this.template.content.querySelector('.popup').cloneNode(true);
    const popupFeatures = popup.querySelector('.popup__features');
    const popupPhotos = popup.querySelector('.popup__photos');
    popup.querySelector('.popup__title').textContent = offer.title;
    popup.querySelector('.popup__address').textContent = offer.address;
    popup.querySelector('.popup__price').textContent = `${offer.price}₽/ночь`;
    popup.querySelector('.popup__type').textContent = typesLocale[offer.type];
    popup.querySelector('.popup__capacity').textContent = `${offer.rooms} комнаты для ${offer.guests} гостей`;
    popup.querySelector('.popup__time').textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;
    popup.querySelector('.popup__description').textContent = offer.description;
    popup.querySelector('.popup__avatar').src = author.avatar;
    popupFeatures.innerHTML = '';
    popupFeatures.append(createElementList(offer.features, this.renderFeature.bind(this)));
    popupPhotos.innerHTML = '';
    popupPhotos.append(createElementList(offer.photos, this.renderPhoto.bind(this)));
   
    const currentPopup = this.element.querySelector('.popup');
    if (currentPopup) {
      currentPopup.replaceWith(popup);
    } else {
      const node = this.element.querySelector('.map__filters-container');
      node.before(popup);
    }
  }

  renderFeature(feature) {
    const element = document.createElement('li');
    element.className = `feature feature--${feature}`;
    return element;
  }

  renderPhoto(photo) {
    const element = document.createElement('li');
    const image = document.createElement('img');
    element.append(image);
    image.src = photo;
    return element;
  }

  handleKeyDown(event) {
    if (wasEscapeKeyPressed(event)) {
      this.close();
    }
  }
}

function createElementList(data, renderer) {
  const fragment = document.createDocumentFragment();
  data.forEach((element, index) => {
    fragment.append(renderer(element, index));
  });
  return fragment;
}