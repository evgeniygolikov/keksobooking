const IMAGE_TYPE_PATTERN = /image.*/;

export default function isImageFile(file) {
  return file.type.match(IMAGE_TYPE_PATTERN);
}