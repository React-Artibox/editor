// @flow

import React, { useReducer, useEffect, useRef } from 'react';
import uuid from 'uuid/v4';
import './main.css';
import BlockTypes from './constants/blockTypes';
import Actions from './constants/actions';
import { Dispatch as DispatchContext } from './constants/context';

// Blocks
import Text from './blocks/Text';
import Image from './blocks/Image';

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

function initializer(initialValues = { blocks: [] }) {
  const lastIndex = initialValues.blocks.length - 1;

  return {
    ...initialValues,
    blocks: [
      ...initialValues.blocks.map((block, index) => index === lastIndex ? {
        ...block,
        focus: true,
      } : {
        ...block,
        focus: false,
      }),
    ],
  };
}

function reducer(state, action) {
  switch (action.type) {
    case Actions.CHANGE_TYPE:
      const updateIndex = state.blocks.findIndex(block => action.id === block.id);

      if (~updateIndex) {
        return {
          ...state,
          blocks: [
            ...state.blocks.slice(0, updateIndex),
            {
              ...state.blocks[updateIndex],
              type: action.newType,
              content: action.content,
            },
            ...state.blocks.slice(updateIndex + 1),
          ],
        };
      }

      return state;

    case Actions.FOCUS: {
      const updateIndex = state.blocks.findIndex(block => action.id === block.id);

      if (~updateIndex) {
        return {
          ...state,
          blocks: [
            ...state.blocks.slice(0, updateIndex).map(block => block.focus ? {
              ...block,
              focus: false,
            } : block),
            {
              ...state.blocks[updateIndex],
              focus: true,
            },
            ...state.blocks.slice(updateIndex + 1).map(block => block.focus ? {
              ...block,
              focus: false,
            } : block),
          ],
        };
      }

      return state;
    }

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
        const targetBlock = state.blocks[updateIndex];

        if (targetBlock.focus) {
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

        return {
          ...state,
          blocks: [
            ...state.blocks.slice(0, updateIndex).map(block => block.focus ? {
              ...block,
              focus: false,
            } : block),
            {
              ...state.blocks[updateIndex],
              content: action.content,
              focus: true,
            },
            ...state.blocks.slice(updateIndex + 1).map(block => block.focus ? {
              ...block,
              focus: false,
            } : block),
          ],
        };
      }

      return state;
    }

    case Actions.NEW_LINE:
      return {
        ...state,
        blocks: [
          ...state.blocks.map(block => block.focus ? {
            ...block,
            focus: false,
          } : block),
          {
            id: uuid(),
            type: BlockTypes.TEXT,
            content: '',
            focus: true,
          },
        ],
      };

    default:
      return state;
  }
}

function usePreviousState(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

function Editor({
  initialValues,
  onChange,
}) {
  if (typeof onChange !== 'function') throw new Error('Please pass onChange function to get data update.');

  const [state, dispatch] = useReducer(reducer, initialValues, initializer);
  const container = useRef();

  const prevState = usePreviousState(state);

  useEffect(() => {
    // Focus on block removed
    if (prevState && prevState.blocks.length > state.blocks.length) {
      const newBlockIds = state.blocks.map(block => block.id);
      const oldBlockIds = prevState.blocks.map(block => block.id);
      const removedId = oldBlockIds.find(oid => !~newBlockIds.indexOf(oid));
      const removedIndex = oldBlockIds.indexOf(removedId);

      if (~removedIndex) {
        const { current } = container;

        const inputs = current.querySelectorAll('.artibox-input');

        if (removedIndex === 0) {
          inputs[0].focus();
        } else {
          inputs[removedIndex - 1].focus();
        }
      }
    }

    onChange(state);
  }, [state]);

  // console.log('->', state);

  return (
    <DispatchContext.Provider value={dispatch}>
      <div ref={container} style={styles.wrapper}>
        {state.blocks.map((block) => {
          switch (block.type) {
            case BlockTypes.TEXT:
              return (
                <Text
                  {...block}
                  key={block.id} />
              );

            case BlockTypes.IMAGE:
              return (
                <Image
                  {...block}
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
    </DispatchContext.Provider>
  );
}

export default Editor;
