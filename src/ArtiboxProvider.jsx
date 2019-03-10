// @flow

import React, { Fragment } from 'react';
import { Config as ConfigContext } from './constants/context';
import { fileToBase64URL } from './parsers/image';
import BlockTypes from './constants/blockTypes';

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
  availableTypes: [
    BlockTypes.IMAGE,
    BlockTypes.YOUTUBE,
    BlockTypes.SLIDESHOW,
    BlockTypes.INSTAGRAM,
    BlockTypes.FACEBOOK,
  ],
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
