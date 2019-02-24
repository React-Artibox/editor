// @flow

import React, { useReducer, useEffect } from 'react';
import uuid from 'uuid/v4';
import './main.css';
import BlockTypes from './constants/blockTypes';
import Actions from './constants/actions';
import Flags from './constants/flags';

// Blocks
import Text from './blocks/Text';

const styles = {
  wrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: '0 12px',
  },
};

function initializer() {
  return {
    blocks: [{
      id: uuid(),
      type: BlockTypes.TEXT,
      content: Flags.FRESH_BLOCK,
    }],
  };
}

function reducer(state, action) {
  console.log('reduce', state, action);

  switch (action.type) {
    case Actions.CHANGE: {
      const updateIndex = state.blocks.findIndex(block => action.id === block.id);

      if (~updateIndex) {
        return {
          ...state,
          blocks: [
            ...state.blocks.slice(0, updateIndex),
            {
              ...state.blocks[updateIndex],
              content: action.content,
            },
            ...state.blocks.slice(updateIndex + 1),
          ],
        };
      }

      return state;
    }

    case Actions.NEW_LINE: {
      const updateIndex = state.blocks.findIndex(block => action.triggerId === block.id);

      if (~updateIndex) {
        return {
          ...state,
          blocks: [
            ...state.blocks.slice(0, updateIndex),
            {
              ...state.blocks[updateIndex],
              content: action.content,
            },
            {
              id: uuid(),
              type: BlockTypes.TEXT,
              content: Flags.FRESH_BLOCK,
            },
            ...state.blocks.slice(updateIndex + 1),
          ],
        };
      }

      return {
        ...state,
        blocks: [
          ...state.blocks,
          {
            id: uuid(),
            type: BlockTypes.TEXT,
            content: Flags.FRESH_BLOCK,
          },
        ],
      };
    }

    default:
      return state;
  }
}

function Editor({
  initialValues,
}) {
  const [state, dispatch] = useReducer(reducer, initialValues, initializer);

  console.log({
    state,
    dispatch,
  });

  return (
    <div style={styles.wrapper}>
      {state.blocks.map((block) => {
        switch (block.type) {
          case BlockTypes.TEXT:
            return (
              <Text
                {...block}
                dispatch={dispatch}
                key={block.id} />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

export default Editor;
