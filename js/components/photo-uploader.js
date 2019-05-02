import isImageFile from '../utils/is-image-file.js';

export default class PhotoUploader {
  constructor(element) {
    this.element = element;
    this.fileInput = element.querySelector('#images');
    this.dropZone = element.querySelector('#images + .drop-zone');
    this.previewArea = element.querySelector('.form__photo-container');
    this.attachListeners();
  }

  attachListeners() {
    this.fileInput.addEventListener('change', this.handleFileInputChange.bind(this));
    this.dropZone.addEventListener('dragenter', this.handleDropZoneDragEnter.bind(this));
    this.dropZone.addEventListener('dragleave', this.handleDropZoneDragLeave.bind(this));
    this.dropZone.addEventListener('drop', this.handleDropZoneDrop.bind(this));
    document.addEventListener('dragover', this.handleDocumentDragOver.bind(this));
  }

  render(dataURI) {
    const image = document.createElement('img');
    image.className = 'photo-preview';
    image.src = dataURI;
    this.previewArea.append(image);
  }

  reset() {
    this.previewArea.querySelectorAll('.photo-preview').forEach(node => node.remove());
  }

  readFiles(files) {
    Array.from(files).forEach(file => {
      if (isImageFile(file)) {
        const fileReader = new FileReader();
        fileReader.addEventListener('load', this.handleFileReaderLoad.bind(this));
        fileReader.readAsDataURL(file);
      }
    });
  }

  handleFileInputChange(event) {
    this.readFiles(event.target.files);
  }

  handleFileReaderLoad(event) {
    this.render(event.target.result);
  }

  handleDocumentDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  handleDropZoneDragEnter(event) {
    event.stopPropagation();
    event.preventDefault();
    event.target.classList.add('drop-zone--dragenter');
  }

  handleDropZoneDragLeave(event) {
    event.stopPropagation();
    event.preventDefault();
    event.target.classList.remove('drop-zone--dragenter');
  }

  handleDropZoneDrop(event) {
    event.stopPropagation();
    event.preventDefault();
    event.target.classList.remove('drop-zone--dragenter');
    this.readFiles(event.dataTransfer.files);
  }
}