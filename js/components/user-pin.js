import wasSpaceKeyPressed from '../utils/was-space-key-pressed.js';
import wasEnterKeyPressed from '../utils/was-enter-key-pressed.js';

const NEEDLE_HEIGHT = 22;

export default class UserPin {
  constructor(element, {boundaries}) {
    this.element = element;
    this.boundaries = boundaries;
    this.initialX = this.element.offsetLeft;
    this.initialY = this.element.offsetTop;
    this.bindListeners();
    this.attachListeners();
  }

  bindListeners() {
    this.handleDocumentMouseMove = this.handleDocumentMouseMove.bind(this);
    this.handleDocumentMouseUp = this.handleDocumentMouseUp.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  attachListeners() {
    this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.element.addEventListener('keyup', this.handleKeyUp);
  }

  get x() {
    return Math.floor(this.element.offsetLeft + this.element.clientWidth / 2);
  }

  get y() {
    return Math.floor(this.element.offsetTop + this.element.clientHeight + NEEDLE_HEIGHT);
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y
    };
  }

  move(x, y) {
    if (x > this.boundaries.left && x < this.boundaries.right) {
      this.element.style.left = `${x}px`;
    }
    if (y > this.boundaries.top && y < this.boundaries.bottom) {
      this.element.style.top = `${y}px`;
    }
    this.element.dispatchEvent(new CustomEvent('userPin:move', {
      bubbles: true,
      detail: this.toJSON()
    }));
  }

  release() {
    const event = new CustomEvent('userPin:release', {
      bubbles: true,
      detail: this.toJSON()
    });
    this.element.dispatchEvent(event);
  }

  reset() {
    this.element.style.left = `${this.initialX}px`;
    this.element.style.top = `${this.initialY}px`;
  }

  handleMouseDown(event) {
    event.preventDefault();
    document.addEventListener('mousemove', this.handleDocumentMouseMove);
    document.addEventListener('mouseup', this.handleDocumentMouseUp);
    this.offsetX = this.element.offsetLeft - event.clientX;
    this.offsetY = this.element.offsetTop - event.clientY;
  }

  handleDocumentMouseMove(event) {
    event.preventDefault();
    this.move(this.offsetX + event.clientX, this.offsetY + event.clientY);
    this.move();
  }

  handleDocumentMouseUp(event) {
    event.preventDefault();
    document.removeEventListener('mousemove', this.handleDocumentMouseMove);
    document.removeEventListener('mouseup', this.handleDocumentMouseUp);
    this.release();
  }

  handleKeyUp(event) {
    if (wasSpaceKeyPressed(event) || wasEnterKeyPressed(event)) {
      this.release();
      this.element.removeEventListener('keyup', this.handleKeyUp);
    }
  }
}