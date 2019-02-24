// @flow

import React, { useState } from 'react';
import Actions from '../constants/actions';

const styles = {
  wrapper: {
    width: '100%',
    borderLeft: '2px solid transparent',
    padding: '0 12px',
    height: 26,
  },
  focusWrapper: {
    width: '100%',
    borderLeft: '2px solid #FA5F5F',
    padding: '0 12px',
    height: 26,
  },
  mainContent: {
    width: '100%',
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
  const [isFocus, setFocus] = useState(false);

  return (
    <div style={isFocus ? styles.focusWrapper : styles.wrapper}>
      <div style={styles.mainContent}>
        <textarea
          autoFocus
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onKeyDown={({ which }) => {
            switch (which) {
              case 8:
                if (content === '') {
                  dispatch({
                    type: Actions.REMOVE_BLOCK,
                    id,
                  });
                }

              default:
                break;
            }
          }}
          onInput={({ target }) => {
            target.style.height = '26px';

            const newHeight = `${target.scrollHeight}px`;
            target.style.height = newHeight;
            // target.parentNode.style.height = newHeight;
            target.parentNode.parentNode.style.height = newHeight;
          }}
          value={content}
          onChange={({ target: { value }}) => dispatch({
            type: Actions.CHANGE,
            id,
            content: value,
          })}
          className="artibox-input"
          placeholder="在此輸入內容"
          style={styles.input}
          type="text" />
        <div style={styles.display}>
          {content}
        </div>
      </div>
    </div>
  );
}

export default Text;
