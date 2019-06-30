// @flow

import React, {
  useState,
  useReducer,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import uuid from 'uuid/v4';
import './main.css';
import BlockTypes from './constants/blockTypes';
import Actions from './constants/actions';
import { Dispatch as DispatchContext } from './constants/context';
import { fromJSON } from './helpers/json';

// Blocks
import Text from './blocks/Text';
import Image from './blocks/Image';
import YouTube from './blocks/YouTube';
import Line from './blocks/Line';

const styles = {
  wrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: '12px 52px',
    minHeight: '100%',
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
    padding: '6px 12px 6px 14px',
  },
};

function initializer(autoFocus = false) {
  return (initialValues = { blocks: [] }) => {
    const lastIndex = initialValues.blocks.length - 1;

    return {
      ...initialValues,
      blocks: [
        ...initialValues.blocks.map((block, index) => (index === lastIndex ? {
          ...block,
          focus: autoFocus,
          loaded: false,
        } : {
          ...block,
          focus: false,
          loaded: false,
        })),
      ],
    };
  };
}

function reducer(state, action) {
  switch (action.type) {
    case Actions.LOADED: {
      const updateIndex = state.blocks.findIndex(block => action.id === block.id);

      if (~updateIndex) {
        return {
          ...state,
          blocks: [
            ...state.blocks.slice(0, updateIndex),
            {
              ...state.blocks[updateIndex],
              loaded: true,
            },
            ...state.blocks.slice(updateIndex + 1),
          ],
        };
      }

      return state;
    }

    case Actions.SET_METADATA: {
      const updateIndex = state.blocks.findIndex(block => action.id === block.id);

      if (~updateIndex) {
        return {
          ...state,
          blocks: [
            ...state.blocks.slice(0, updateIndex),
            {
              ...state.blocks[updateIndex],
              meta: {
                ...state.blocks[updateIndex].meta,
                ...action.meta,
              },
            },
            ...state.blocks.slice(updateIndex + 1),
          ],
        };
      }

      return state;
    }

    case Actions.CHANGE_TYPE: {
      const updateIndex = state.blocks.findIndex(block => action.id === block.id);

      if (~updateIndex) {
        return {
          ...state,
          blocks: [
            ...state.blocks.slice(0, updateIndex),
            {
              ...state.blocks[updateIndex],
              type: action.newType,
              content: action.newType === BlockTypes.LINE ? '' : (
                action.content || state.blocks[updateIndex].content
              ),
            },
            ...state.blocks.slice(updateIndex + 1),
          ],
        };
      }

      return state;
    }

    case Actions.FOCUS: {
      const updateIndex = state.blocks.findIndex(block => action.id === block.id);

      if (~updateIndex) {
        return {
          ...state,
          blocks: [
            ...state.blocks.slice(0, updateIndex).map(block => (block.focus ? {
              ...block,
              focus: false,
            } : block)),
            {
              ...state.blocks[updateIndex],
              focus: true,
            },
            ...state.blocks.slice(updateIndex + 1).map(block => (block.focus ? {
              ...block,
              focus: false,
            } : block)),
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

    case Actions.CHANGE_AND_UPDATE_META: {
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
                meta: action.meta ? {
                  ...state.blocks[updateIndex].meta,
                  ...action.meta,
                } : state.blocks[updateIndex].meta,
              },
              ...state.blocks.slice(updateIndex + 1),
            ],
          };
        }

        return {
          ...state,
          blocks: [
            ...state.blocks.slice(0, updateIndex).map(block => (block.focus ? {
              ...block,
              focus: false,
            } : block)),
            {
              ...state.blocks[updateIndex],
              content: action.content,
              focus: true,
            },
            ...state.blocks.slice(updateIndex + 1).map(block => (block.focus ? {
              ...block,
              focus: false,
            } : block)),
          ],
        };
      }

      return state;
    }

    case Actions.NEW_LINE:
      if (action.at) {
        const targetIndex = state.blocks.findIndex(block => block.id === action.at);

        if (~targetIndex) {
          return {
            ...state,
            blocks: [
              ...state.blocks.slice(0, targetIndex + 1).map(block => (block.focus ? {
                ...block,
                focus: false,
              } : block)),
              {
                id: uuid(),
                type: action.newType || BlockTypes.TEXT,
                content: '',
                focus: true,
                meta: {},
                loaded: true,
              },
              ...state.blocks.slice(targetIndex + 1).map(block => (block.focus ? {
                ...block,
                focus: false,
              } : block)),
            ],
          };
        }
      }

      return {
        ...state,
        blocks: [
          ...state.blocks.map(block => (block.focus ? {
            ...block,
            focus: false,
          } : block)),
          {
            id: uuid(),
            type: action.newType || BlockTypes.TEXT,
            content: '',
            focus: true,
            meta: {},
            loaded: true,
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
  autoFocus,
  placeholder,
}: {
  initialValues: {},
  onChange: Function,
  autoFocus?: boolean,
  placeholder?: ?string,
}) {
  if (typeof onChange !== 'function') throw new Error('Please pass onChange function to get data update.');

  const [state, dispatch] = useReducer(reducer, fromJSON(initialValues), initializer(autoFocus));
  const container = useRef();
  const [isYouTubeAPILoaded, setYouTubeAPILoaded] = useState(typeof YT !== 'undefined');
  const [firstLoaded, setFirstLoaded] = useState(false);

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

        if (removedIndex !== 0) {
          inputs[removedIndex - 1].focus();
        }
      }
    }

    // Detect YouTube Block
    if (!isYouTubeAPILoaded && state.blocks.find(block => block.type === BlockTypes.YOUTUBE)) {
      const youTubeAPIScript = document.createElement('script');
      youTubeAPIScript.src = 'https://www.youtube.com/iframe_api';

      document.body.appendChild(youTubeAPIScript);

      window.onYouTubeIframeAPIReady = () => {
        setYouTubeAPILoaded(true);

        youTubeAPIScript.remove();
      };
    }

    onChange(state);

    if (state.blocks.every(block => block.loaded) && !firstLoaded) {
      setFirstLoaded(true);
    }
  }, [state, firstLoaded, isYouTubeAPILoaded]);

  const placeholderZone = useMemo(() => (
    state.blocks.length && !state.blocks[state.blocks.length - 1].content ? null : (
      <span style={styles.blockCreatorPlaceholder}>
        {placeholder}
      </span>
    )
  ), [state.blocks, placeholder]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <div ref={container} style={styles.wrapper}>
        {state.blocks.map((block) => {
          switch (block.type) {
            case BlockTypes.LINE:
              return (
                <Line
                  {...block}
                  firstLoaded={firstLoaded}
                  key={block.id} />
              );

            case BlockTypes.YOUTUBE:
              return isYouTubeAPILoaded ? (
                <YouTube
                  {...block}
                  firstLoaded={firstLoaded}
                  key={block.id} />
              ) : null;

            case BlockTypes.TEXT:
            case BlockTypes.TITLE:
            case BlockTypes.SUBTITLE:
            case BlockTypes.QUOTE:
              return (
                <Text
                  {...block}
                  placeholder={placeholder}
                  firstLoaded={firstLoaded}
                  key={block.id} />
              );

            case BlockTypes.IMAGE:
              return (
                <Image
                  {...block}
                  firstLoaded={firstLoaded}
                  key={block.id} />
              );

            default:
              return null;
          }
        })}
        <div
          tabIndex={-1}
          role="button"
          onMouseDown={(e) => {
            e.preventDefault();

            const lastBlock = state.blocks.length && state.blocks[state.blocks.length - 1];

            if (!lastBlock || (lastBlock
              && (
                lastBlock.type === BlockTypes.LINE ? true : !!lastBlock.content
              ))) {
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
          {placeholderZone}
        </div>
      </div>
    </DispatchContext.Provider>
  );
}

Editor.defaultProps = {
  autoFocus: false,
  placeholder: '在此輸入內容',
};

export default Editor;
