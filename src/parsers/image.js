// @flow

export function fileToBase64URL(file: File, emitter: EventEmitter) {
  const reader = new FileReader();

  return new Promise((resolve: Function) => {
    reader.onload = () => resolve(reader.result);

    reader.readAsDataURL(file);
  });
}
