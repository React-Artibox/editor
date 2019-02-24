// @flow

import Progress from '../constants/progress';

export function createFileUploader(targetURL, done, fieldKey = 'files', method = 'POST') {
  if (!targetURL) throw new Error('Please give targetURL on first arguments for creating file uploader.');

  if (typeof done !== 'function') throw new Error('Please pass a callback function to match result url when uploaded.');

  return (file: File, emitter: EventEmitter) => new Promise((resolve) => {
    emitter.emit(Progress.START);

    const formData = new FormData();

    formData.append(fieldKey, file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', targetURL);

    xhr.upload.onprogress = ({
      loaded,
      total,
    }) => {
      emitter.emit(Progress.PROGRESS, (loaded * 100) / total);
    };

    xhr.onload = () => {
      const response = JSON.parse(xhr.responseText);

      emitter.emit(Progress.FINISH);

      resolve(done(response));
    };

    xhr.send(formData);
  });
}

export function fileToBase64URL(file: File, emitter: EventEmitter) {
  const reader = new FileReader();

  return new Promise((resolve: Function) => {
    reader.onload = () => resolve(reader.result);

    reader.readAsDataURL(file);
  });
}
