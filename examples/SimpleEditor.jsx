// @flow
/* eslint import/no-extraneous-dependencies: 0 */

import React, { useState } from 'react';
import { hot } from 'react-hot-loader';
import {
  ArtiboxProvider,
  Editor,
  createFileUploader,
  BlockTypes,
  toJSON,
  fromJSON,
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
  const [shown, setShown] = useState(true);
  const [data, setData] = useState({
    blocks: [{
      type: 'IMAGE',
      content: 'd3c23e501f4e31f21e2a8345a87c60c6.png',
      meta: {
        ALIGN: 'CENTER',
        DESCRIPTION: 'Hello 你好嗎',
      },
    }, {
      type: 'TEXT',
      content: 'Hahah',
    }, {
      type: 'YOUTUBE',
      content: 'nDTUg4R4dxk',
    }],
  });

  return (
    <ArtiboxProvider
      options={{
        availableTypes: [
          BlockTypes.SUBTITLE,
          BlockTypes.QUOTE,
          BlockTypes.IMAGE,
          BlockTypes.YOUTUBE,
          BlockTypes.LINE,
        ],
        parseImageFile: createFileUploader('http://sample.rytass.com/uploader/files', files => files[0]),
        parseImageURL: file => `http://sample.rytass.com/uploads/${file}`,
      }}>
      <div style={styles.wrapper}>
        <button
          onClick={() => setShown(!shown)}
          type="button">
          Toggle
        </button>
        {shown ? (
          <Editor
            initialValues={{
              blocks: [],
            }}
            onChange={(state) => {
              console.log('HELLO', state, toJSON(state));

              setData(toJSON(state));
            }} />
        ) : null}
      </div>
    </ArtiboxProvider>
  );
}

export default hot(module)(SimpleEditor);
