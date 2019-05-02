const URL = 'https://js.dump.academy/keksobooking/data';

export default function load(onLoad, onError) {
  const request = new XMLHttpRequest;
  request.responseType = 'json';
  request.timeout = 10000;
  request.onload = () => {
    if (request.status === 200) {
      onLoad(request.response);
    } else {
      onError(`Статус ответа: ${request.status} ${request.statusText}`);
    }
  };
  request.onerror = () => {
    onError('Произошла ошибка соединения');
  };
  request.ontimeout = () => {
    onError(`Запрос не успел выполниться за ${request.timeout}мс`);
  };
  request.open('GET', URL);
  request.send();
}