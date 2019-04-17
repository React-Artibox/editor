// @flow

import React, { useContext, useEffect, useRef } from 'react';
import Actions from '../constants/actions';
import BlockTypes from '../constants/blockTypes';
import Tooltip from '../tools/Tooltip';
import { Dispatch as DispatchContext } from '../constants/context';

const styles = {
  wrapper: {
    position: 'relative',
    width: '100%',
    borderLeft: '2px solid transparent',
    padding: '0 12px',
    height: 24,
  },
  focusWrapper: {
    position: 'relative',
    width: '100%',
    borderLeft: '2px solid #FA5F5F',
    padding: '0 12px',
    height: 24,
  },
  mainContent: {
    width: '100%',
    position: 'relative',
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: '#4a4a4a',
    position: 'absolute',
    left: 0,
    top: 11,
  },
  input: {
    color: 'transparent',
    border: 0,
    width: '100%',
    outline: 'none',
    caretColor: 'transparent',
    resize: 'none',
    padding: 0,
    backgroundColor: 'transparent',
    height: 24,
  },
};

function Line({
  content,
  id,
  type,
  focus,
  firstLoaded,
}: BlockProps) {
  const dispatch = useContext(DispatchContext);
  const textarea = useRef();

  useEffect(() => {
    const { current } = textarea;

    if (current && firstLoaded) {
      current.focus();
    }

    dispatch({
      type: Actions.LOADED,
      id,
    });
  }, []);

  return (
    <div style={focus ? styles.focusWrapper : styles.wrapper}>
      <div style={styles.mainContent}>
        <textarea
          ref={textarea}
          onFocus={() => dispatch({
            type: Actions.FOCUS,
            id,
          })}
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
          onInput={(e) => { e.preventDefault(); }}
          value={content}
          onChange={(e) => { e.preventDefault(); }}
          className="artibox-input"
          placeholder=""
          style={styles.input} />
        <div style={styles.line} />
      </div>
    </div>
  );
}

export default Line;
