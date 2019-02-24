// @flow

import React, { useReducer, useEffect } from 'react';
import uuid from 'uuid/v4';
import './main.css';
import BlockTypes from './constants/blockTypes';
import Actions from './constants/actions';

// Blocks
import Text from './blocks/Text';

const styles = {
  wrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: 12,
    height: '100%',
  },
  blockCreator: {
    flexGrow: 1,
    minHeight: 64,
    width: '100%',
    display: 'block',
    cursor: 'text',
  },
  blockCreatorPlaceholder: {
    color: '#DBDBDB',
    fontWeight: 300,
    letterSpacing: 1,
  },
};

function initializer() {
  return {
    blocks: [],
  };
}

function reducer(state, action) {
  switch (action.type) {
    case Actions.REMOVE_BLOCK: {
      const updateIndex = state.blocks.findIndex(block => action.id === block.id);

      if (~updateIndex) {
        return {
          ...state,
          blocks: [
            ...state.blocks.slice(0, updateIndex),
            ...state.blocks.slice(updateIndex + 1),
          ],
        };
      }

      return state;
    }

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

    case Actions.NEW_LINE:
      return {
        ...state,
        blocks: [
          ...state.blocks,
          {
            id: uuid(),
            type: BlockTypes.TEXT,
            content: '',
          },
        ],
      };

    default:
      return state;
  }
}

function Editor({
  initialValues,
}) {
  const [state, dispatch] = useReducer(reducer, initialValues, initializer);

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
      <div
        role="button"
        onMouseDown={(e) => {
          e.preventDefault();

          if (!state.blocks.length || !!state.blocks[state.blocks.length - 1].content) {
            dispatch({ type: Actions.NEW_LINE });
          } else if (document.activeElement === document.body) {
            const allInputs = document.querySelectorAll('.artibox-input');
            const lastInput = allInputs[allInputs.length - 1];

            if (lastInput) {
              lastInput.focus();
            }
          }
        }}
        style={styles.blockCreator}>
        {state.blocks.length ? null : (
          <span style={styles.blockCreatorPlaceholder}>
            在此處輸入內容
          </span>
        )}
      </div>
    </div>
  );
}

export default Editor;
