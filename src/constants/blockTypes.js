// @flow

const BLOCK_TYPES = {
  TEXT: Symbol('Artibox/Block/TEXT'),
  TITLE: Symbol('Artibox/Block/TITLE'),
  SUBTITLE: Symbol('Artibox/Block/SUBTITLE'),
  IMAGE: Symbol('Artibox/Block/IMAGE'),
  YOUTUBE: Symbol('Artibox/Block/YOUTUBE'),
  SLIDESHOW: Symbol('Artibox/Block/SLIDESHOW'),
  INSTAGRAM: Symbol('Artibox/Block/INSTAGRAM'),
  FACEBOOK: Symbol('Artibox/Block/FACEBOOK'),
};

export const BLOCK_NAMES = {
  [BLOCK_TYPES.TEXT]: 'TEXT',
  [BLOCK_TYPES.TITLE]: 'TITLE',
  [BLOCK_TYPES.SUBTITLE]: 'SUBTITLE',
  [BLOCK_TYPES.IMAGE]: 'IMAGE',
  [BLOCK_TYPES.YOUTUBE]: 'YOUTUBE',
  [BLOCK_TYPES.SLIDESHOW]: 'SLIDESHOW',
  [BLOCK_TYPES.INSTAGRAM]: 'INSTAGRAM',
  [BLOCK_TYPES.FACEBOOK]: 'FACEBOOK',
};

export default BLOCK_TYPES;
