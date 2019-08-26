// @flow
/* eslint no-nested-ternary: 0 */

import React, {
  useState,
  useContext,
  useMemo,
} from 'react';
import { EventEmitter } from 'events';
import Icons from '../constants/icons';
import {
  Dispatch as DispatchContext,
  Config as ConfigContext,
} from '../constants/context';
import Progress from '../constants/progress';
import Actions from '../constants/actions';
import BlockTypes from '../constants/blockTypes';
import YoutubeInput from './YoutubeInput';
import FacebookInput from './FacebookInput';
import {
  IMAGE_BLOCK_BASIC,
  TEXT_TITLE,
  TEXT_SUBTITLE,
  TEXT_QUOTE,
  SPLIT_LINE,
  YOUTUBE_BLOCK,
  SLIDESHOW_BLOCK,
  FACEBOOK_BLOCK,
  INSTAGRAM_BLOCK,
} from '../constants/features';

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
  const dispatch = useContext(DispatchContext);

  const {
    parseImageFile,
    features,
  } = useContext(ConfigContext);

  const availableButtons = useMemo(() => (
    <>
      {features & TEXT_TITLE ? (
        <button
          onClick={() => (type === BlockTypes.TITLE ? (
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
          ))}
          className="artibox-tooltip-btn"
          style={styles.blockBtn}
          type="button">
          <Icons.TITLE fill={type === BlockTypes.TITLE ? '#1BDCDC' : (isHover ? '#242424' : '#DBDBDB')} />
        </button>
      ) : null}
      {features & TEXT_SUBTITLE ? (
        <button
          onClick={() => (type === BlockTypes.SUBTITLE ? (
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
          ))}
          className="artibox-tooltip-btn"
          style={styles.blockBtn}
          type="button">
          <Icons.SUBTITLE fill={type === BlockTypes.SUBTITLE ? '#1BDCDC' : (isHover ? '#242424' : '#DBDBDB')} />
        </button>
      ) : null}
      {features & TEXT_QUOTE ? (
        <button
          onClick={() => (type === BlockTypes.QUOTE ? (
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
          ))}
          className="artibox-tooltip-btn"
          style={styles.blockBtn}
          type="button">
          <Icons.QUOTE fill={type === BlockTypes.QUOTE ? '#1BDCDC' : (isHover ? '#242424' : '#DBDBDB')} />
        </button>
      ) : null}
      {features & (TEXT_SUBTITLE | TEXT_TITLE | TEXT_QUOTE) ? (
        <span style={styles.spliter} />
      ) : null}
      {features & SPLIT_LINE ? (
        <button
          onClick={() => (hasContent ? (
            dispatch({
              type: Actions.NEW_LINE,
              at: blockId,
              newType: BlockTypes.LINE,
            })
          ) : (
            dispatch({
              type: Actions.CHANGE_TYPE,
              id: blockId,
              newType: BlockTypes.LINE,
            })
          ))}
          className="artibox-tooltip-btn"
          style={styles.blockBtn}
          type="button">
          <Icons.LINE fill={type === BlockTypes.LINE ? '#1BDCDC' : (isHover ? '#242424' : '#DBDBDB')} />
        </button>
      ) : null}
      {features & IMAGE_BLOCK_BASIC ? (
        <button
          className="artibox-tooltip-btn"
          style={styles.blockBtn}
          type="button">
          <Icons.PHOTO fill={isHover ? '#242424' : '#DBDBDB'} />
          <input
            onChange={async ({ target: { files } }) => {
              if (files && files.length) {
                const emitter = new EventEmitter();

                emitter.on(Progress.START, () => setProgress(0));
                emitter.on(Progress.PROGRESS, (p) => setProgress(p));
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
      {features & SLIDESHOW_BLOCK ? (
        <button
          className="artibox-tooltip-btn"
          style={styles.blockBtn}
          type="button">
          <Icons.SLIDER fill={isHover ? '#242424' : '#DBDBDB'} />
        </button>
      ) : null}
      {features & YOUTUBE_BLOCK ? (
        <YoutubeInput
          isHover={isHover}
          blockId={blockId} />
      ) : null}
      {features & INSTAGRAM_BLOCK ? (
        <button
          className="artibox-tooltip-btn"
          style={styles.blockBtn}
          type="button">
          <Icons.INSTAGRAM fill={isHover ? '#242424' : '#DBDBDB'} />
        </button>
      ) : null}
      {features & FACEBOOK_BLOCK ? (
        <FacebookInput
          isHover={isHover}
          blockId={blockId} />
      ) : null}
    </>
  ), [
    hasContent,
    features,
    dispatch,
    blockId,
    isHover,
    parseImageFile,
    type,
  ]);

  const progressStyles = useMemo(() => {
    const width = `calc(${progress}% - 4px)`;

    return {
      height: 10,
      width,
      borderRadius: 5,
      position: 'absolute',
      left: 2,
      top: 2,
      display: 'block',
      backgroundColor: '#1CC1D0',
      transition: 'width 0.1s ease-out',
    };
  }, [progress]);

  return (
    <>
      <div style={progress === null ? styles.progressWrapper : styles.progressWrapperShown}>
        <div style={styles.progressBar}>
          <span style={progressStyles} />
        </div>
        <p style={styles.progressText}>
          {Math.round(progress * 100) / 100}
          %
        </p>
      </div>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={styles.wrapper}>
        {availableButtons}
      </div>
    </>
  );
}

export default Tooltip;
