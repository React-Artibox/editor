// @flow

const TAG_TYPES = {
  LINK: Symbol('Artibox/Tag/LINK'),
  HIGHLIGHT: Symbol('Artibox/Tag/HIGHLIGHT'),
};

export const TAG_NAMES = {
  [TAG_TYPES.LINK]: 'LINK',
  [TAG_TYPES.HIGHLIGHT]: 'HIGHLIGHT',
};

export default TAG_TYPES;
