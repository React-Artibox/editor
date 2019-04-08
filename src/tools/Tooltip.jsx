// @flow
/* eslint no-nested-ternary: 0 */

import React, { Fragment, useRef, useState, useContext, useEffect } from 'react';
import { EventEmitter } from 'events';
import Icons from '../constants/icons';
import {
  Dispatch as DispatchContext,
  Config as ConfigContext,
} from '../constants/context';
import Progress from '../constants/progress';
import Actions from '../constants/actions';
import BlockTypes from '../constants/blockTypes';
import {
  isYouTubeURL,
  getYouTubeId,
} from '../helpers/url';

const styles = {
  wrapper: {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0 7px',
    borderRadius: 4,
    border: '1px solid #DBDBDB',
    backgroundColor: '#fff',
  },
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
  imagePicker: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    zIndex: 10,
    opacity: 0,
    cursor: 'pointer',
  },
  progressWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    flexDirection: 'column',
    position: 'fixed',
    zIndex: 999999,
    width: '100%',
    height: '100%',
    left: 0,
    opacity: 0,
    pointerEvents: 'none',
    top: '-100vh',
    transition: 'opacity 0.2s ease-out',
  },
  progressWrapperShown: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    flexDirection: 'column',
    position: 'fixed',
    zIndex: 999999,
    width: '100%',
    height: '100%',
    left: 0,
    opacity: 1,
    pointerEvents: 'auto',
    top: 0,
    transition: 'opacity 0.2s ease-out',
  },
  progressBar: {
    width: 200,
    borderRadius: 8,
    height: 16,
    border: '1px solid #e2e2e2',
    backgroundColor: '#fff',
    position: 'relative',
    display: 'block',
  },
  progressText: {
    fontSize: 13,
    color: '#1CC1D0',
    letterSpacing: 2,
    padding: '0 0 0 2px',
    fontWeight: 300,
    margin: '8px 0 0 0',
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
    margin: 0,
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
    backgroundColor: 'transparent',
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
  spliter: {
    width: 1,
    height: 16,
    backgroundColor: '#dbdbdb',
    margin: '0 8px',
  },
};

type Props = {
  blockId: string,
  hasContent: boolean,
  type: Symbol,
};

function Tooltip({
  blockId,
  hasContent,
  type,
}: Props) {
  const [isHover, setHover] = useState(false);
  const [progress, setProgress] = useState(null);
  const [isYouTubeURLInputShown, setYouTubeURLInputShow] = useState(false);
  const [youTubeURL, setYouTubeURL] = useState('');
  const [isVaildYouTubeURL, setIsValidYouTubeURL] = useState(false);
  const youtubeInput = useRef();

  const {
    parseImageFile,
    availableTypes,
  } = useContext(ConfigContext);
  const dispatch = useContext(DispatchContext);

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
    <Fragment>
      <div style={progress === null ? styles.progressWrapper : styles.progressWrapperShown}>
        <div style={styles.progressBar}>
          <span
            style={{
              width: `calc(${progress}% - 4px)`,
              height: 10,
              borderRadius: 5,
              position: 'absolute',
              left: 2,
              top: 2,
              display: 'block',
              backgroundColor: '#1CC1D0',
              transition: 'width 0.1s ease-out',
            }} />
        </div>
        <p style={styles.progressText}>
          {Math.round(progress * 100) / 100}%
        </p>
      </div>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={styles.wrapper}>
        <button
          onClick={() => type === BlockTypes.TITLE ? (
            dispatch({
              type: Actions.CHANGE_TYPE,
              id: blockId,
              newType: BlockTypes.TEXT,
            })
          ) : (
            dispatch({
              type: Actions.CHANGE_TYPE,
              id: blockId,
              newType: BlockTypes.TITLE,
            })
          )}
          className="artibox-tooltip-btn"
          style={styles.blockBtn}
          type="button">
          <Icons.TITLE fill={type === BlockTypes.TITLE ? '#1BDCDC' : (isHover ? '#242424' : '#DBDBDB')} />
        </button>
        {~availableTypes.indexOf(BlockTypes.SUBTITLE) ? (
          <button
            onClick={() => type === BlockTypes.SUBTITLE ? (
              dispatch({
                type: Actions.CHANGE_TYPE,
                id: blockId,
                newType: BlockTypes.TEXT,
              })
            ) : (
              dispatch({
                type: Actions.CHANGE_TYPE,
                id: blockId,
                newType: BlockTypes.SUBTITLE,
              })
            )}
            className="artibox-tooltip-btn"
            style={styles.blockBtn}
            type="button">
            <Icons.SUBTITLE fill={type === BlockTypes.SUBTITLE ? '#1BDCDC' : (isHover ? '#242424' : '#DBDBDB')} />
          </button>
        ) : null}
        {~availableTypes.indexOf(BlockTypes.QUOTE) ? (
          <button
            onClick={() => type === BlockTypes.QUOTE ? (
              dispatch({
                type: Actions.CHANGE_TYPE,
                id: blockId,
                newType: BlockTypes.TEXT,
              })
            ) : (
              dispatch({
                type: Actions.CHANGE_TYPE,
                id: blockId,
                newType: BlockTypes.QUOTE,
              })
            )}
            className="artibox-tooltip-btn"
            style={styles.blockBtn}
            type="button">
            <Icons.QUOTE fill={type === BlockTypes.QUOTE ? '#1BDCDC' : (isHover ? '#242424' : '#DBDBDB')} />
          </button>
        ) : null}
        {!hasContent ? (
          <Fragment>
            <span style={styles.spliter} />
            {~availableTypes.indexOf(BlockTypes.IMAGE) ? (
              <button
                className="artibox-tooltip-btn"
                style={styles.blockBtn}
                type="button">
                <Icons.PHOTO fill={isHover ? '#242424' : '#DBDBDB'} />
                <input
                  onChange={async ({ target: { files }}) => {
                    if (files && files.length) {
                      const emitter = new EventEmitter();

                      emitter.on(Progress.START, () => setProgress(0));
                      emitter.on(Progress.PROGRESS, progress => setProgress(progress));
                      emitter.on(Progress.END, () => setProgress(null));

                      const url = await parseImageFile(files[0], emitter);

                      dispatch({
                        type: Actions.CHANGE_TYPE,
                        id: blockId,
                        newType: BlockTypes.IMAGE,
                        content: url,
                      });
                    }
                  }}
                  style={styles.imagePicker}
                  type="file"
                  accept="image/*" />
              </button>
            ) : null}
            {~availableTypes.indexOf(BlockTypes.SLIDESHOW) ? (
              <button
                className="artibox-tooltip-btn"
                style={styles.blockBtn}
                type="button">
                <Icons.SLIDER fill={isHover ? '#242424' : '#DBDBDB'} />
              </button>
            ) : null}
            {~availableTypes.indexOf(BlockTypes.YOUTUBE) ? (
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
            ) : null}
            {~availableTypes.indexOf(BlockTypes.INSTAGRAM) ? (
              <button
                className="artibox-tooltip-btn"
                style={styles.blockBtn}
                type="button">
                <Icons.INSTAGRAM fill={isHover ? '#242424' : '#DBDBDB'} />
              </button>
            ) : null}
            {~availableTypes.indexOf(BlockTypes.FACEBOOK) ? (
              <button
                className="artibox-tooltip-btn"
                style={styles.blockBtn}
                type="button">
                <Icons.FACEBOOK fill={isHover ? '#242424' : '#DBDBDB'} />
              </button>
            ) : null}
          </Fragment>
        ) : null}
      </div>
    </Fragment>
  );
}

export default Tooltip;
