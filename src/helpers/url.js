// @flow

const YOUTUBE_RE = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/;

export function getYouTubeId(url = '') {
  const result = url.match(YOUTUBE_RE);

  return result ? result[5] : undefined;
}

export function isYouTubeURL(url = '') {
  return YOUTUBE_RE.test(url);
}

const INSTARAM_EMBED_RE = /<blockquote.*class="instagram-media".*www.instagram.com\/embed\.js/;

export function getInstagramURL(url = '') {
  const template = document.createElement('template');
  template.innerHTML = url;

  const blockquote = template.content.firstChild;

  if (blockquote && blockquote.nodeName === 'BLOCKQUOTE') {
    const [{ href }] = blockquote.firstChild?.children;

    return href.replace(/^https:\/\/www\.instagram\.com\//, '').replace(/\/$/, '');
  }

  return undefined;
}

export function isInstagramURL(url = '') {
  return INSTARAM_EMBED_RE.test(url);
}

const FACEBOOK_IFRAME_RE = /^(?:<iframe\s).*src="https:\/\/((?:www|m)\.)?(?:facebook\.com|fb\.com)\/plugins\/(video|post)\.php\?([^"]*href=[^"]*)"[^>]*>/;

function getFacebookTypeFromPathname(pathname = '') {
  switch (pathname) {
    case '/plugins/post.php':
      return 'post';

    case '/plugins/video.php':
      return 'video';

    default:
      return 'unknown';
  }
}

export function getFacebookURLInfo(url = '') {
  const template = document.createElement('template');
  template.innerHTML = url;

  const iframe = template.content.firstChild;

  if (iframe && iframe.nodeName === 'IFRAME') {
    const parsedURL = new URL(iframe.src);

    if (!iframe.src || !parsedURL) return undefined;

    const resourceURL = new URL(parsedURL.searchParams.get('href'));

    if (!resourceURL) return undefined;

    return {
      width: Number(iframe.width),
      height: Number(iframe.height),
      content: resourceURL.pathname,
      type: getFacebookTypeFromPathname(parsedURL.pathname),
    };
  }

  return undefined;
}

export function isFacebookURL(url = '') {
  return FACEBOOK_IFRAME_RE.test(url);
}

// Credit from: http://urlregex.com/
export default (url = '') => /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/.test(url);
