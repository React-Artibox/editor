// @flow
/* eslint react/no-unknown-property: [0, { ignore: ["allowtransparency"] }] */

import React, {
  useCallback,
  useEffect,
  useContext,
} from 'react';
import qs from 'querystring';
import { Dispatch as DispatchContext } from '../constants/context';
import Actions from '../constants/actions';

const styles = {
  wrapper: {
    width: '100%',
    borderLeft: '2px solid transparent',
    padding: '0 12px',
    margin: '12px 0',
    minHeight: 168,
  },
  focusWrapper: {
    width: '100%',
    borderLeft: '2px solid #FA5F5F',
    padding: '0 12px',
    margin: '12px 0',
    minHeight: 168,
  },
  container: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  input: {
    fontSize: 1,
    color: 'transparent',
    border: 0,
    width: '100%',
    outline: 'none',
    resize: 'none',
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    height: 'calc(100% - 52px)',
    backgroundColor: 'transparent',
    zIndex: 1,
    cursor: 'pointer',
  },
  iframe: {
    border: 0,
    overflow: 'hidden',
  },
  blockquote: {
    background: '#FFF',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)',
    margin: 1,
    maxWidth: 540,
    minWidth: 326,
    padding: 0,
    width: 'calc(100% - 2px)',
  },
};

function Instagram({
  content,
  id,
  focus,
}: BlockProps) {
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (typeof instgrm !== 'undefined') {
      instgrm.Embeds.process();
    }
  }, []);

  return (
    <div style={focus ? styles.focusWrapper : styles.wrapper}>
      <div style={styles.container}>
        <textarea
          onInput={(e) => e.preventDefault()}
          className="artibox-input"
          style={styles.input}
          onKeyDown={({ which }) => {
            switch (which) {
              case 13:
                dispatch({
                  type: Actions.NEW_LINE,
                  at: id,
                });
                break;

              case 8:
                dispatch({
                  type: Actions.REMOVE_BLOCK,
                  id,
                });
                break;

              default:
                break;
            }
          }}
          onFocus={() => dispatch({
            type: Actions.FOCUS,
            id,
          })} />
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={`https://www.instagram.com/${content}`}
          data-instgrm-version="12"
          style={styles.blockquote} />
      </div>
    </div>
  );
}

export default Instagram;
