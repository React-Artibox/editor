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
import Icons from '../constants/icons';
import { Dispatch as DispatchContext } from '../constants/context';
import { getSelectedRangeOnPreview } from '../helpers/range.js';
import LinkModal from '../components/LinkModal.jsx';

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
  textmenu: {
    position: 'absolute',
    zIndex: 10,
    width: 'auto',
    height: 36,
    backgroundColor: '#1B2733',
    borderRadius: 4,
    boxShadow: '0 0 0 1px #000, 0 8px 16px rgba(27, 39, 51, 0.16)',
    padding: 0,
    opacity: 0,
    transform: 'scale(1.01) translate(0, -12px)',
    transition: 'opacity 0.12s ease-out, transform 0.08s ease-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  textmenuShown: {
    opacity: 1,
    pointerEvents: 'auto',
    transform: 'scale(1) translate(0, 0)',
  },
  textmenuBtn: {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 8px',
    border: 0,
    backgroundColor: 'transparent',
    padding: 0,
    outline: 'none',
    boxShadow: 'none',
    borderRadius: 0,
    cursor: 'pointer',
    position: 'relative',
  },
};

function Text({
  content,
  id,
  type,
  focus,
  firstLoaded,
  meta,
}: BlockProps) {
  const dispatch = useContext(DispatchContext);
  const [menu, setMenu] = useState({
    isShown: false,
    x: 0,
    y: 0,
    from: 0,
    to: 0,
  });
  const [isHover, setHover] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const textarea = useRef();
  const display = useRef();
  const textmenu = useRef();
  // textarea onSelect evt
  function onSelect() {
    const {
      current: input,
    } = textarea;

    if (input.selectionStart === input.selectionEnd) {
      if (menu && menu.isShown) {
        setMenu({
          ...menu,
          isShown: false,
        });
      }
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
    const { width: menuWidth } = textmenu.current.getBoundingClientRect();

    setMenu({
      ...menu,
      isShown: true,
      x: (selectionX + ((width - menuWidth) / 2)) - parentX,
      y: selectionY - parentY - 40,
      from: previewRange.startOffset,
      to: previewRange.endOffset,
    });
  }

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
        {(() => {
          if (showLinkInput) {
            return (
              <LinkModal
                {...menu}
                id={id}
                firstLoaded={firstLoaded}
                setShowLinkInput={setShowLinkInput}
                meta={meta} />
            );
          }

          return (
            <div
              ref={textmenu}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              style={{
                ...styles.textmenu,
                ...(menu && menu.isShown ? styles.textmenuShown : {}),
                left: menu ? menu.x : 0,
                top: menu ? menu.y : 0,
              }}>
              <button
                onClick={() => setShowLinkInput(true)}
                className="artibox-tooltip-btn"
                style={styles.textmenuBtn}
                type="button">
                <Icons.LINK fill={(isHover ? '#f5f5f5' : '#c1c7cd')} />
              </button>
            </div>
          );
        })()}
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

Text.TAGS = 'tags';

export default Text;
