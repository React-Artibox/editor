// @flow

import React, {
  useEffect,
  useState,
  useRef,
  useContext,
} from 'react';
import {
  isYouTubeURL,
  getYouTubeId,
} from '../helpers/url';
import Actions from '../constants/actions';
import BlockTypes from '../constants/blockTypes';
import { Dispatch as DispatchContext } from '../constants/context';
import Icons from '../constants/icons';

const styles = {
  blockBtn: {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 9px',
    border: 0,
    backgroundColor: 'transparent',
    padding: 0,
    outline: 'none',
    boxShadow: 'none',
    borderRadius: 0,
    cursor: 'pointer',
    position: 'relative',
  },
  anchorWrapper: {
    position: 'relative',
  },
  urlInputBlock: {
    width: 0,
    height: 0,
    overflow: 'hidden',
    backgroundColor: '#fff',
    boxShadow: 'none',
    opacity: 0,
    position: 'absolute',
    top: 40,
    left: 'calc(50% - 120px)',
    border: 0,
    zIndex: 0,
  },
  urlInputBlockShown: {
    width: 420,
    height: 'auto',
    overflow: 'visible',
    border: '1px solid #DBDBDB',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.12)',
    opacity: 1,
    transition: 'opacity 0.2s ease-out',
    position: 'absolute',
    top: 40,
    right: -8,
    zIndex: 10,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: '0 12px 12px 12px',
  },
  urlInputTitle: {
    lineHeight: '32px',
    fontSize: 12,
    color: '#4a4a4a',
    letterSpacing: 1,
    width: '100%',
    padding: '2px 0 0 1px',
    borderBottom: '1px solid #dfdfdf',
    margin: '0 0 12px 0',
  },
  urlInput: {
    border: 0,
    width: '100%',
    fontSize: 15,
    color: '#4a4a4a',
    outline: 'none',
    padding: '0 0.6em',
    resize: 'none',
    borderRadius: 4,
    backgroundColor: '#f3f3f3',
    height: 30,
    lineHeight: '30px',
  },
  urlInputWrapper: {
    position: 'relative',
    width: '100%',
  },
  insertButton: {
    padding: '0 7px 0 8px',
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#1BDCDC',
    borderRadius: 2,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
    position: 'absolute',
    fontWeight: 400,
    right: 4,
    top: 4,
    outline: 'none',
    border: 0,
    lineHeight: '22px',
  },
};

function YoutubeInput({
  blockId,
  isHover,
}: {
  blockId: string,
  isHover: boolean,
}) {
  const dispatch = useContext(DispatchContext);
  const [isYouTubeURLInputShown, setYouTubeURLInputShow] = useState(false);
  const [isVaildYouTubeURL, setIsValidYouTubeURL] = useState(false);
  const [youTubeURL, setYouTubeURL] = useState('');
  const youtubeInput = useRef();

  // Check YouTube URL
  useEffect(() => {
    setIsValidYouTubeURL(isYouTubeURL(youTubeURL));
  }, [youTubeURL]);

  // Reset YouTube URL Input
  useEffect(() => {
    if (isYouTubeURLInputShown) {
      const { current } = youtubeInput;

      if (current) {
        current.focus();
      }
    } else {
      setIsValidYouTubeURL(false);
      setYouTubeURL('');
    }
  }, [isYouTubeURLInputShown]);

  return (
    <div style={styles.anchorWrapper}>
      <button
        onClick={() => setYouTubeURLInputShow(!isYouTubeURLInputShown)}
        className="artibox-tooltip-btn"
        style={styles.blockBtn}
        type="button">
        <Icons.VIDEO fill={isHover ? '#242424' : '#DBDBDB'} />
      </button>
      <div style={isYouTubeURLInputShown ? styles.urlInputBlockShown : styles.urlInputBlock}>
        <h6 style={styles.urlInputTitle}>YouTube URL:</h6>
        <div style={styles.urlInputWrapper}>
          <input
            onKeyPress={({ which }) => {
              if (isVaildYouTubeURL && which === 13) {
                dispatch({
                  type: Actions.CHANGE_TYPE,
                  id: blockId,
                  newType: BlockTypes.YOUTUBE,
                  content: getYouTubeId(youTubeURL),
                });

                setYouTubeURLInputShow(false);
              }
            }}
            ref={youtubeInput}
            onChange={({ target }) => setYouTubeURL(target.value)}
            value={youTubeURL}
            style={styles.urlInput}
            placeholder="https://www.youtube.com/watch?v=xxxxxxx"
            type="text" />
          {isVaildYouTubeURL ? (
            <button
              onClick={() => {
                dispatch({
                  type: Actions.CHANGE_TYPE,
                  id: blockId,
                  newType: BlockTypes.YOUTUBE,
                  content: getYouTubeId(youTubeURL),
                });

                setYouTubeURLInputShow(false);
              }}
              style={styles.insertButton}
              type="button">
              Insert!
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default YoutubeInput;
