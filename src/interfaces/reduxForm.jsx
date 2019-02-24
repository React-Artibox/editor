// @flow

import React from 'react';
import Editor from '../Editor';

function ReduxFormWrapper({
  input: {
    onChange,
    value,
  },
}) {
  return (
    <Editor initialValues={value} onChange={onChange} />
  );
}

export default ReduxFormWrapper;
