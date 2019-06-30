// @flow

export const TEXT_BLOCK_BASIC = 1;
export const TEXT_LINK = 2;
export const TEXT_HIGHLIGHT = 4;
export const TEXT_TITLE = 8;
export const TEXT_SUBTITLE = 8;
export const TEXT_QUOTE = 16;
export const TEXT_BLOCK_FULL = (
  TEXT_BLOCK_BASIC | TEXT_LINK | TEXT_HIGHLIGHT | TEXT_TITLE | TEXT_SUBTITLE | TEXT_QUOTE);

export const SPLIT_LINE = 32;

export const IMAGE_BLOCK_BASIC = 64;
export const IMAGE_CAPTION = 128;
export const IMAGE_LINK = 256;
export const IMAGE_ALIGN = 512;
export const IMAGE_BLOCK_FULL = IMAGE_BLOCK_BASIC | IMAGE_CAPTION | IMAGE_LINK | IMAGE_ALIGN;

export const YOUTUBE_BLOCK = 1024;

// Preserve
export const VIMEO_BLOCK = 2048;
export const SLIDESHOW_BLOCK = 4096;
export const FACEBOOK_BLOCK = 8192;
export const INSTAGRAM_BLOCK = 16384;
