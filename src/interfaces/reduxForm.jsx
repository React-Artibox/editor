// @flow

import React from 'react';
import Editor from '../Editor';
import { toJSON } from '../helpers/json';

function ReduxFormWrapper({
  input: {
    onChange,
    value,
  },
}) {
  if (!value) return null;

  return (
    <Editor
      initialValues={value}
      onChange={data => onChange(toJSON(data))} />
  );
}

export default ReduxFormWrapper;
