// @flow
/* eslint import/no-extraneous-dependencies: 0 */

import React from 'react';
import { hot } from 'react-hot-loader';
import {
  ArtiboxProvider,
  Editor,
  createFileUploader,
} from '../src/index';

const styles = {
  wrapper: {
    width: '100%',
    margin: '32px auto',
    padding: 0,
    maxWidth: 720,
    height: '80vh',
  },
};

function SimpleEditor() {
  return (
    <ArtiboxProvider
      options={{
        parseImageFile: createFileUploader('http://sample.rytass.com/uploader/files', files => files[0]),
        parseImageURL: file => `http://sample.rytass.com/uploads/${file}`,
      }}>
      <div style={styles.wrapper}>
        <Editor />
      </div>
    </ArtiboxProvider>
  );
}

export default hot(module)(SimpleEditor);
