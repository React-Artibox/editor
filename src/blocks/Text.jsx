// @flow
/* eslint no-param-reassign: 0 */

import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  Fragment,
} from 'react';
import Actions from '../constants/actions';
import BlockTypes from '../constants/blockTypes';
import Tooltip from '../tools/Tooltip';
import SelectionContextMenu from '../components/SelectionContextMenu';
import { Dispatch as DispatchContext } from '../constants/context';

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
  link: {
    color: 'rgb(94, 106, 221)',
    textDecoration: 'underline',
  },
  highlight: {
    color: 'rgb(214, 87, 71)',
  },
};

function addTagToList(tags, marker, content) {
  switch (marker.TYPE) {
    case 'HIGHLIGHT':
      tags.push(
        <span
          style={styles.highlight}
          key={`${marker.FROM}:${marker.TO}`}>
          {content.substring(marker.FROM, marker.TO)}
        </span>
      );
      break;

    case 'LINK':
      tags.push(
        <a
          href={marker.URL}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
          key={`${marker.FROM}:${marker.TO}`}>
          {content.substring(marker.FROM, marker.TO)}
        </a>
      );
      break;

    default:
      tags.push(
        <span
          key={`${marker.FROM}:${marker.TO}`}>
          {content.substring(marker.FROM, marker.TO)}
        </span>
      );
      break;
  }
}

function Text({
  content,
  id,
  type,
  focus,
  firstLoaded,
  meta,
  placeholder,
}: BlockProps & {
  placeholder?: ?string,
}) {
  const dispatch = useContext(DispatchContext);
  const [currentCaret, setCurrentCaret] = useState(0);
  const textarea = useRef();
  const display = useRef();

  const wrappedContent = useMemo(() => {
    const tags = [];
    const markers = (meta.MARKERS || []);

    if (markers.length === 0) return content;

    markers.forEach((marker, index) => {
      if (index === 0) {
        tags.push(
          <span
            key={`0:${marker.FROM}`}>
            {content.substring(0, marker.FROM)}
          </span>
        );

        addTagToList(tags, marker, content);

        if (meta.MARKERS.length === 1) {
          tags.push(
            <span
              key={`${marker.TO}:`}>
              {content.substring(marker.TO)}
            </span>
          );
        }

        return;
      }

      const prevMarker = meta.MARKERS[index - 1];

      if (prevMarker.TO !== marker.FROM) {
        tags.push(
          <span
            key={`${prevMarker.TO}:${marker.FROM}`}>
            {content.substring(prevMarker.TO, marker.FROM)}
          </span>
        );
      }

      addTagToList(tags, marker, content);

      if (index === (meta.MARKERS.length - 1)) {
        tags.push(
          <span
            key={`${marker.TO}:`}>
            {content.substring(marker.TO)}
          </span>
        );
      }
    });

    return (
      <Fragment>
        {tags}
      </Fragment>
    );
  }, [meta, content]);

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

  const wrapperStyles = useMemo(() => ({
    ...(focus ? styles.focusWrapper : styles.wrapper),
    height: BASIC_HEIGHT[type],
    margin: type === BlockTypes.QUOTE ? '12px 0' : 0,
  }), [focus, type]);

  const contentStyles = useMemo(() => (
    type === BlockTypes.QUOTE ? styles.mainContentQuote : styles.mainContent
  ), [type]);

  const onFocus = useCallback(() => dispatch({
    type: Actions.FOCUS,
    id,
  }), [id, dispatch]);

  const onKeyDown = useCallback((e) => {
    const { which, shiftKey, target } = e;

    setCurrentCaret(target.selectionEnd);

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
  }, [content, dispatch, id]);

  const onInput = useCallback(({ target }) => {
    target.style.height = `${BASIC_HEIGHT[type]}px`;

    const newHeight = `${target.scrollHeight}px`;
    target.style.height = newHeight;
    target.parentNode.parentNode.style.height = newHeight;
  }, [type]);

  const onChange = useCallback(({ target }) => {
    const diff = target.selectionStart - currentCaret;

    const MARKERS = (meta.MARKERS || []).reduce((markers, marker) => {
      if (currentCaret > marker.TO && target.selectionStart < marker.FROM) return markers;

      if (currentCaret > marker.TO) {
        if (target.selectionStart < marker.TO) {
          return [
            ...markers,
            {
              ...marker,
              TO: target.selectionStart,
            },
          ];
        }

        return [
          ...markers,
          marker,
        ];
      }

      if (currentCaret <= marker.FROM) {
        return [
          ...markers,
          {
            ...marker,
            FROM: marker.FROM + diff,
            TO: marker.TO + diff,
          },
        ];
      }

      if (currentCaret > marker.FROM && target.selectionStart < marker.FROM) {
        return [
          ...markers,
          {
            ...marker,
            FROM: marker.FROM - (marker.FROM - target.selectionStart),
            TO: marker.TO + diff,
          },
        ];
      }

      return [
        ...markers,
        {
          ...marker,
          TO: marker.TO + diff,
        },
      ];
    }, []);

    dispatch({
      type: Actions.CHANGE_AND_UPDATE_META,
      id,
      content: target.value,
      meta: {
        ...meta,
        MARKERS,
      },
    });

    setCurrentCaret(target.selectionEnd);
  }, [meta, id, dispatch, currentCaret]);

  const onPaste = useCallback(({ target }) => {
    setCurrentCaret(target.selectionEnd);
  }, []);

  const textareaStyles = useMemo(() => {
    const lineHeight = `${BASIC_HEIGHT[type]}px`;

    return {
      ...styles.input,
      fontSize: FONT_SIZE[type],
      height: BASIC_HEIGHT[type],
      lineHeight,
      fontWeight: FONT_WEIGHT[type],
      letterSpacing: LETTER_SPACING[type],
      color: COLOR[type],
    };
  }, [type]);

  const fakeValueStyles = useMemo(() => {
    const lineHeight = `${BASIC_HEIGHT[type]}px`;

    return {
      ...styles.display,
      fontSize: FONT_SIZE[type],
      lineHeight,
      fontWeight: FONT_WEIGHT[type],
      letterSpacing: LETTER_SPACING[type],
      color: COLOR[type],
    };
  }, [type]);

  return (
    <div
      style={wrapperStyles}>
      {type === BlockTypes.QUOTE ? <span style={styles.quoteAnchor} /> : null}
      <div style={contentStyles}>
        <textarea
          ref={textarea}
          onFocus={onFocus}
          value={content}
          onInput={onInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          className="artibox-input"
          placeholder={placeholder}
          style={textareaStyles} />
        <div
          ref={display}
          style={fakeValueStyles}>
          {wrappedContent}
          <SelectionContextMenu
            blockId={id}
            meta={meta}
            display={display}
            textarea={textarea} />
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

Text.TAGS = 'TAGS';

Text.defaultProps = {
  placeholder: '在此輸入內容',
};

export default Text;
