// @flow

import React, { useState, useRef, useEffect } from 'react';
import Actions from '../constants/actions';
import Flags from '../constants/flags';

const styles = {
  wrapper: {
    width: '100%',
    height: 26,
    borderLeft: '2px solid transparent',
    position: 'relative',
  },
  input: {
    fontSize: 16,
    color: 'transparent',
    letterSpacing: 1,
    lineHeight: '26px',
    border: 0,
    width: '100%',
    outline: 'none',
    caretColor: '#4a4a4a',
    resize: 'none',
    padding: 0,
    height: 26,
  },
  display: {
    position: 'absolute',
    left: 0,
    top: 0,
    pointerEvents: 'none',
    fontSize: 16,
    color: '#000',
    letterSpacing: 1,
    lineHeight: '26px',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    width: '100%',
  },
};

function Text({
  dispatch,
  content,
  id,
}: BlockProps) {
  const [text, setText] = useState(content);
  const textarea = useRef();

  useEffect(() => {
    if (text === Flags.FRESH_BLOCK) {
      textarea.current.focus();

      setText('');
    }
  });

  return (
    <div style={styles.wrapper}>
      <textarea
        ref={textarea}
        onBlur={() => dispatch({
          type: Actions.CHANGE,
          id,
          content: text,
        })}
        onKeyPress={({ which }) => {
          if (which === 13) {
            dispatch({
              type: Actions.NEW_LINE,
              triggerId: id,
              content: text,
            });
          }
        }}
        onInput={({ target }) => {
          target.style.height = '26px';
          target.style.height = `${target.scrollHeight}px`;
        }}
        value={text === Flags.FRESH_BLOCK ? '' : text}
        onChange={({ target: { value }}) => setText(value)}
        className="artibox-input"
        placeholder="在此輸入內容"
        style={styles.input}
        type="text" />
      <div style={styles.display}>
        {text}
      </div>
    </div>
  );
}

export default Text;
