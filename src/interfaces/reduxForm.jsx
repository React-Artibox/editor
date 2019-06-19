// @flow

import React from 'react';
import Editor from '../Editor';
import { toJSON } from '../helpers/json';

function ReduxFormWrapper({
  input: {
    onChange,
    value,
  },
  placeholder,
}: {
  input: {
    onChange: Function,
    value: {
      blocks: Array<BlockProps>,
    },
  },
  placeholder?: ?string,
}) {
  if (!value) return null;

  return (
    <Editor
      placeholder={placeholder}
      initialValues={value}
      onChange={data => onChange(toJSON(data))} />
  );
}

ReduxFormWrapper.defaultProps = {
  placeholder: null,
};

export default ReduxFormWrapper;
