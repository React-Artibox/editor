// @flow

import React, { useState, useContext } from 'react';
import Icons from '../constants/icons';
import {
  Dispatch as DispatchContext,
  Config as ConfigContext,
} from '../constants/context';
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
};

type Props = {
  blockId: string,
};

function Tooltip({
  blockId,
}: Props) {
  const [isHover, setHover] = useState(false);
  const { parseImageFile } = useContext(ConfigContext);
  const dispatch = useContext(DispatchContext);

  return (
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
              const url = await parseImageFile(files[0]);

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
  );
}

export default Tooltip;
