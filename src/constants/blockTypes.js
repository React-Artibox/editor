// @flow

const BLOCK_TYPES = {
  LINE: Symbol('Artibox/Block/LINE'),
  TEXT: Symbol('Artibox/Block/TEXT'),
  QUOTE: Symbol('Artibox/Block/QUOTE'),
  TITLE: Symbol('Artibox/Block/TITLE'),
  SUBTITLE: Symbol('Artibox/Block/SUBTITLE'),
  IMAGE: Symbol('Artibox/Block/IMAGE'),
  YOUTUBE: Symbol('Artibox/Block/YOUTUBE'),
  SLIDESHOW: Symbol('Artibox/Block/SLIDESHOW'),
  INSTAGRAM: Symbol('Artibox/Block/INSTAGRAM'),
  FACEBOOK: Symbol('Artibox/Block/FACEBOOK'),
};

export const BLOCK_NAMES = {
  [BLOCK_TYPES.LINE]: 'LINE',
  [BLOCK_TYPES.TEXT]: 'TEXT',
  [BLOCK_TYPES.QUOTE]: 'QUOTE',
  [BLOCK_TYPES.TITLE]: 'TITLE',
  [BLOCK_TYPES.SUBTITLE]: 'SUBTITLE',
  [BLOCK_TYPES.IMAGE]: 'IMAGE',
  [BLOCK_TYPES.YOUTUBE]: 'YOUTUBE',
  [BLOCK_TYPES.SLIDESHOW]: 'SLIDESHOW',
  [BLOCK_TYPES.INSTAGRAM]: 'INSTAGRAM',
  [BLOCK_TYPES.FACEBOOK]: 'FACEBOOK',
};

export default BLOCK_TYPES;
