// @flow

import React, { Fragment, useState, useContext } from 'react';
import { EventEmitter } from 'events';
import Icons from '../constants/icons';
import {
  Dispatch as DispatchContext,
  Config as ConfigContext,
} from '../constants/context';
import Progress from '../constants/progress';
import Actions from '../constants/actions';
import BlockTypes from '../constants/blockTypes';

const styles = {
  wrapper: {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0 7px',
    borderRadius: 4,
    border: '1px solid #DBDBDB',
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
};

type Props = {
  blockId: string,
};

function Tooltip({
  blockId,
}: Props) {
  const [isHover, setHover] = useState(false);
  const [progress, setProgress] = useState(null);
  const { parseImageFile } = useContext(ConfigContext);
  const dispatch = useContext(DispatchContext);

  console.log('progress', progress);

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
        <button
          className="artibox-tooltip-btn"
          style={styles.blockBtn}
          type="button">
          <Icons.SLIDER fill={isHover ? '#242424' : '#DBDBDB'} />
        </button>
        <button
          className="artibox-tooltip-btn"
          style={styles.blockBtn}
          type="button">
          <Icons.VIDEO fill={isHover ? '#242424' : '#DBDBDB'} />
        </button>
        <button
          className="artibox-tooltip-btn"
          style={styles.blockBtn}
          type="button">
          <Icons.INSTAGRAM fill={isHover ? '#242424' : '#DBDBDB'} />
        </button>
        <button
          className="artibox-tooltip-btn"
          style={styles.blockBtn}
          type="button">
          <Icons.FACEBOOK fill={isHover ? '#242424' : '#DBDBDB'} />
        </button>
      </div>
    </Fragment>
  );
}

export default Tooltip;
