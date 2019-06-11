// @flow
/* eslint no-param-reassign: 0 */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Actions from '../constants/actions';
import BlockTypes from '../constants/blockTypes';
import Tooltip from '../tools/Tooltip';
import { Dispatch as DispatchContext } from '../constants/context';
import { getSelectedRangeOnPreview } from '../helpers/range.js';

const BASIC_HEIGHT = {
  [BlockTypes.TEXT]: 26,
  [BlockTypes.TITLE]: 36,
  [BlockTypes.SUBTITLE]: 30,
  [BlockTypes.QUOTE]: 26,
};

const FONT_SIZE = {
  [BlockTypes.TEXT]: 16,
  [BlockTypes.TITLE]: 28,
  [BlockTypes.SUBTITLE]: 20,
  [BlockTypes.QUOTE]: 16,
};

const FONT_WEIGHT = {
  [BlockTypes.TEXT]: 400,
  [BlockTypes.TITLE]: 700,
  [BlockTypes.SUBTITLE]: 500,
  [BlockTypes.QUOTE]: 400,
};

const LETTER_SPACING = {
  [BlockTypes.TEXT]: 1,
  [BlockTypes.TITLE]: 4,
  [BlockTypes.SUBTITLE]: 2,
  [BlockTypes.QUOTE]: 6,
};

const COLOR = {
  [BlockTypes.TEXT]: '#000',
  [BlockTypes.TITLE]: '#4a4a4a',
  [BlockTypes.SUBTITLE]: '#212121',
  [BlockTypes.QUOTE]: '#b2b2b2',
};

const styles = {
  wrapper: {
    position: 'relative',
    width: '100%',
    borderLeft: '2px solid transparent',
    padding: '0 12px',
  },
  focusWrapper: {
    position: 'relative',
    width: '100%',
    borderLeft: '2px solid #FA5F5F',
    padding: '0 12px',
  },
  mainContent: {
    width: '100%',
    position: 'relative',
  },
  mainContentQuote: {
    width: 'calc(100% - 12px)',
    position: 'relative',
    margin: '0 0 0 12px',
  },
  quoteAnchor: {
    width: 4,
    height: '100%',
    backgroundColor: '#d2d2d2',
    position: 'absolute',
    top: 0,
    left: 12,
  },
  input: {
    color: 'transparent',
    border: 0,
    width: '100%',
    outline: 'none',
    caretColor: '#4a4a4a',
    resize: 'none',
    padding: 0,
    backgroundColor: 'transparent',
  },
  display: {
    position: 'absolute',
    left: 0,
    top: 0,
    pointerEvents: 'none',
    color: '#000',
    lineHeight: '26px',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    width: '100%',
  },
  tooltipWrapper: {
    position: 'absolute',
    zIndex: 5,
    right: 0,
    top: -7,
  },
};

function Text({
  content,
  id,
  type,
  focus,
  firstLoaded,
}: BlockProps) {
  const dispatch = useContext(DispatchContext);
  const [menu, setMenu] = useState(null);
  const textarea = useRef();
  const display = useRef();
  const onSelect = () => {
    const {
      current: input,
    } = textarea;

    if (input.selectionStart === input.selectionEnd) {
      if (menu) setMenu(null);
      return;
    }

    const previewRange = getSelectedRangeOnPreview(textarea, display);
    const {
      x: parentX,
      y: parentY,
    } = input.getBoundingClientRect();
    const {
      x: selectionX,
      y: selectionY,
      width,
    } = previewRange.getBoundingClientRect();
    const menuWidth = 0;

    setMenu({
      x: (selectionX + ((width - menuWidth) / 2)) - parentX,
      y: selectionY - parentY - 32,
    });
  };

  useEffect(() => {
    const { current } = textarea;

    if (current) {
      current.style.height = `${BASIC_HEIGHT[type]}px`;

      const newHeight = `${current.scrollHeight}px`;
      current.style.height = newHeight;
      current.parentNode.parentNode.style.height = newHeight;
    }
  }, [textarea, type]);

  useEffect(() => {
    const { current } = textarea;

    if (current) {
      current.style.height = `${BASIC_HEIGHT[type]}px`;

      const newHeight = `${current.scrollHeight}px`;
      current.style.height = newHeight;
      current.parentNode.parentNode.style.height = newHeight;
    }
  }, [type]);

  useEffect(() => {
    const { current } = textarea;

    if (current && firstLoaded) {
      current.focus();
    }

    dispatch({
      type: Actions.LOADED,
      id,
    });
  }, [dispatch, firstLoaded, id]);

  return (
    <div
      style={{
        ...(focus ? styles.focusWrapper : styles.wrapper),
        height: BASIC_HEIGHT[type],
        margin: type === BlockTypes.QUOTE ? '12px 0' : 0,
      }}>
      {type === BlockTypes.QUOTE ? <span style={styles.quoteAnchor} /> : null}
      <div style={type === BlockTypes.QUOTE ? styles.mainContentQuote : styles.mainContent}>
        <textarea
          ref={textarea}
          onFocus={() => dispatch({
            type: Actions.FOCUS,
            id,
          })}
          onSelect={() => onSelect()}
          onKeyDown={(e) => {
            const { which, shiftKey } = e;

            switch (which) {
              case 13:
                if (shiftKey) break;

                e.preventDefault();

                dispatch({
                  type: Actions.NEW_LINE,
                  at: id,
                });
                break;

              case 8:
                if (content === '') {
                  dispatch({
                    type: Actions.REMOVE_BLOCK,
                    id,
                  });
                }
                break;
              default:
                break;
            }
          }}
          onInput={({ target }) => {
            target.style.height = `${BASIC_HEIGHT[type]}px`;

            const newHeight = `${target.scrollHeight}px`;
            target.style.height = newHeight;
            target.parentNode.parentNode.style.height = newHeight;
          }}
          value={content}
          onChange={({ target: { value } }) => dispatch({
            type: Actions.CHANGE,
            id,
            content: value,
          })}
          className="artibox-input"
          placeholder="在此輸入內容"
          style={{
            ...styles.input,
            fontSize: FONT_SIZE[type],
            height: BASIC_HEIGHT[type],
            lineHeight: `${BASIC_HEIGHT[type]}px`,
            fontWeight: FONT_WEIGHT[type],
            letterSpacing: LETTER_SPACING[type],
            color: COLOR[type],
          }} />
        <div
          ref={display}
          style={{
            ...styles.display,
            fontSize: FONT_SIZE[type],
            lineHeight: `${BASIC_HEIGHT[type]}px`,
            fontWeight: FONT_WEIGHT[type],
            letterSpacing: LETTER_SPACING[type],
            color: COLOR[type],
          }}>
          {content}
        </div>
        {focus ? (
          <div style={styles.tooltipWrapper}>
            <Tooltip
              type={type}
              hasContent={!!content}
              blockId={id} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Text;
