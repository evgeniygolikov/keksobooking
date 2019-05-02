import isImageFile from '../utils/is-image-file.js';

export default class AvatarUploader {
  constructor(element) {
    this.element = element;
    this.fileInput = element.querySelector('#avatar');
    this.dropZone = element.querySelector('#avatar + .drop-zone');
    this.previewArea = element.querySelector('.notice__preview img');
    this.initialPreviewPath = this.previewArea.src.replace(this.previewArea.baseURI, '');
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
    this.previewArea.src = dataURI;
  }

  reset() {
    this.previewArea.src = this.initialPreviewPath;
  }
  
  readFile(file) {
    if (isImageFile(file)) {
      const fileReader = new FileReader();
      fileReader.addEventListener('load', this.handleFileReaderLoad.bind(this));
      fileReader.readAsDataURL(file);
    }
  }

  handleFileInputChange(event) {
    this.readFile(event.target.files[0]);
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
    this.readFile(event.dataTransfer.files[0]);
  }
}

