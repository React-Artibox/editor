// @flow

import React from 'react';
import { Config as ConfigContext } from './constants/context';
import { fileToBase64URL } from './parsers/image';
import {
  TEXT_BLOCK_FULL,
  IMAGE_BLOCK_BASIC,
  IMAGE_ALIGN,
  YOUTUBE_BLOCK,
  SPLIT_LINE,
  FACEBOOK_BLOCK,
  INSTAGRAM_BLOCK,
} from './constants/features';

type Props = {
  children: any,
  options?: {
    parseImageFile?: Function,
    parseImageURL?: ?Function,
  },
};

const defaultOptions = {
  parseImageFile: fileToBase64URL,
  parseImageURL: null,
  features: (
    TEXT_BLOCK_FULL
    | IMAGE_BLOCK_BASIC
    | IMAGE_ALIGN
    | YOUTUBE_BLOCK
    | SPLIT_LINE
    | FACEBOOK_BLOCK
    | INSTAGRAM_BLOCK
  ),
};

function ArtiboxProvider({
  children,
  options: givenOptions,
}: Props) {
  const options = {
    ...defaultOptions,
    ...givenOptions,
  };

  return (
    <ConfigContext.Provider value={options}>
      {children}
    </ConfigContext.Provider>
  );
}

ArtiboxProvider.defaultProps = {
  options: {},
};

export default ArtiboxProvider;
