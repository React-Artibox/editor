// @flow

const YOUTUBE_RE = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/;

export function getYouTubeId(url = '') {
  const result = url.match(YOUTUBE_RE);

  return result ? result[5] : undefined;
}

export function isYouTubeURL(url = '') {
  return YOUTUBE_RE.test(url);
}

// Credit from: http://urlregex.com/
export default (url = '') => {
  return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(url);
}
