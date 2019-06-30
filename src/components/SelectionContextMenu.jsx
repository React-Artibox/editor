// @flow
/* eslint no-constant-condition: 0 */

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
  useContext,
  Fragment,
} from 'react';
import Icons from '../constants/icons';
import Actions from '../constants/actions';
import { Dispatch as DispatchContext } from '../constants/context';
import LinkModal from './LinkModal';
import Tooltip from '../tools/Tooltip';

type Props = {
  display: {
    current: ?Node,
  },
  textarea: {
    current: ?Node,
  },
  meta: {
    MARKERS: Array<TextHighlightMarkerType | TextLinkMarkerType>,
  },
  blockId: string,
  type: string,
  hasContent: boolean,
  focus: boolean,
};

function isSameMark(markA, markB) {
  if (markA.TYPE !== markB.TYPE) return false;

  switch (markA.TYPE) {
    case 'HIGHLIGHT':
      return true;

    case 'LINK':
      return markA.URL === markB.URL;

    default:
      return false;
  }
}

const styles = {
  menu: {
    position: 'absolute',
    backgroundColor: '#fff',
    height: 40,
    border: '1px solid #dbdbdb',
    borderRadius: 4,
    padding: '0 7px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    zIndex: 10,
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
  tooltipWrapper: {
    position: 'absolute',
    zIndex: 10,
    right: 0,
    top: -42,
    pointerEvents: 'auto',
  },
};

export function getSelectionRange(input, view) {
  const selectedRangeOnView = document.createRange();
  selectedRangeOnView.setStart(view, 0);
  selectedRangeOnView.collapse(true);

  const nodeQueue = [view];
  let startCursorFound = false;
  let checkCursor = 0;

  while (true) {
    const node = nodeQueue.pop();

    if (!node) break;

    switch (node.nodeType) {
      case Node.TEXT_NODE: {
        const nextCursor = checkCursor + node.length;

        if (!startCursorFound
          && input.selectionStart >= checkCursor
          && input.selectionStart <= nextCursor) {
          selectedRangeOnView.setStart(node, input.selectionStart - checkCursor);

          startCursorFound = true;
        }

        if (startCursorFound
          && input.selectionEnd >= checkCursor
          && input.selectionEnd <= nextCursor) {
          selectedRangeOnView.setEnd(node, input.selectionEnd - checkCursor);
        }

        checkCursor = nextCursor;
        break;
      }

      case Node.ELEMENT_NODE:
        Array.from(node.childNodes).reverse()
          .forEach((child) => { nodeQueue.push(child); });
        break;

      default:
        break;
    }
  }

  return selectedRangeOnView;
}

function SelectionContextMenu({
  meta,
  focus,
  type,
  hasContent,
  blockId,
  textarea: {
    current: input,
  },
  display: {
    current: view,
  },
}: Props) {
  const [linkModalShown, setLinkModalShown] = useState(false);
  const contextMenu = useRef();
  const dispatch = useContext(DispatchContext);
  const [hoveredIcon, setHoverIcon] = useState(null);
  const [cursorStart, setCursorStart] = useState(
    input ? input.selectionStart : null
  );
  const [cursorEnd, setCursorEnd] = useState(
    input ? input.selectionEnd : null
  );
  const [shown, setShown] = useState(false);
  const [{ x: menuPosX, y: menuPosY }, setMenuPosition] = useState({ x: 0, y: 0 });
  const [{ x: modalPosX, y: modalPosY }, setModalPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof input === 'undefined') return () => {};

    function onDocumentSelectionChangeHandler() {
      if (shown && !document.getSelection().focusNode.contains(input)) {
        setShown(false);
      }

      if (input.selectionStart === input.selectionEnd) {
        setCursorStart(input.selectionStart);
        setCursorEnd(input.selectionEnd);
      }
    }

    document.addEventListener('selectionchange', onDocumentSelectionChangeHandler, false);

    return () => document.addEventListener('selectionchange', onDocumentSelectionChangeHandler, false);
  }, [input, cursorStart, cursorEnd, shown]);

  useEffect(() => {
    if (typeof input === 'undefined') return () => {};

    function onSelectHandler() {
      setCursorStart(input.selectionStart);
      setCursorEnd(input.selectionEnd);
    }

    input.addEventListener('select', onSelectHandler, false);

    return () => {
      input.removeEventListener('select', onSelectHandler, false);
    };
  }, [input]);

  useEffect(() => {
    setLinkModalShown(false);

    if (cursorStart === null || cursorEnd === null || cursorStart === cursorEnd) {
      setShown(false);
    } else {
      setShown(true);
    }
  }, [cursorStart, cursorEnd]);

  useEffect(() => {
    if (!input || !view) return;

    if (shown) {
      const selectedRangeOnView = getSelectionRange(input, view);

      const viewBBox = view.getBoundingClientRect();

      const {
        width,
        x,
        y,
      } = selectedRangeOnView.getBoundingClientRect();

      const menuBBox = contextMenu.current.getBoundingClientRect();

      setMenuPosition({
        x: x + ((width - menuBBox.width) / 2) - viewBBox.x,
        y: y - 44 - viewBBox.y,
      });
    }
  }, [shown, input, view, cursorStart, cursorEnd]);

  const menuStyles = useMemo(() => ({
    ...styles.menu,
    top: menuPosY,
    left: menuPosX,
    opacity: shown ? 1 : 0,
    pointerEvents: shown ? 'auto' : 'none',
    width: shown ? 'auto' : 0,
  }), [menuPosX, menuPosY, shown]);

  const highlightIcon = useMemo(() => (
    <Icons.HIGHLIGHT fill={hoveredIcon === 'HIGHLIGHT' ? '#4a4a4a' : '#dbdbdb'} />
  ), [hoveredIcon]);

  const linkIcon = useMemo(() => (
    <Icons.LINK fill={hoveredIcon === 'LINK' ? '#4a4a4a' : '#dbdbdb'} />
  ), [hoveredIcon]);

  const eraseIcon = useMemo(() => (
    <Icons.ERASE fill={hoveredIcon === 'ERASE' ? '#4a4a4a' : '#dbdbdb'} />
  ), [hoveredIcon]);

  const onMouseEnterHighlight = useCallback(() => setHoverIcon('HIGHLIGHT'), []);
  const onMouseEnterLink = useCallback(() => setHoverIcon('LINK'), []);
  const onMouseEnterErase = useCallback(() => setHoverIcon('ERASE'), []);
  const onMouseLeaveIcon = useCallback(() => setHoverIcon(null), []);

  const addToMarkers = useCallback((payload) => {
    const markerSet = Array.from(Array(cursorEnd - cursorStart))
      .reduce((map, n, index) => {
        if (payload) {
          map.set(index + cursorStart, payload);
        } else {
          map.delete(index + cursorStart);
        }

        return map;
      }, (meta.MARKERS || []).reduce((map, marker) => {
        Array.from(Array(marker.TO - marker.FROM)).forEach((n, index) => {
          map.set(index + marker.FROM, marker);
        });

        return map;
      }, new Map()));

    const newMarkers = Array.from(markerSet.entries())
      .sort((cursorA, cursorB) => cursorA[0] - cursorB[0])
      .reduce((markers, [cursor, mark], index, cursors) => {
        if (!markers.length) {
          return [{
            ...mark,
            FROM: cursor,
            TO: cursor + 1,
          }];
        }

        const [
          prevCursor,
          prevPayload,
        ] = cursors[index - 1];

        if (prevCursor + 1 === cursor && isSameMark(prevPayload, mark)) {
          return [
            ...markers.slice(0, markers.length - 1),
            {
              ...markers[markers.length - 1],
              TO: cursor + 1,
            },
          ];
        }

        return [
          ...markers.slice(0, markers.length - 1),
          {
            ...markers[markers.length - 1],
            TO: markers[markers.length - 1].TO,
          },
          {
            ...mark,
            FROM: cursor,
            TO: cursor + 1,
          },
        ];
      }, []);

    dispatch({
      type: Actions.SET_METADATA,
      id: blockId,
      meta: {
        ...meta,
        MARKERS: newMarkers,
      },
    });
  }, [cursorStart, cursorEnd, meta, dispatch, blockId]);

  const markHighlight = useCallback(() => addToMarkers({ TYPE: 'HIGHLIGHT' }), [addToMarkers]);

  const markLink = useCallback(({
    URL,
  }) => {
    addToMarkers({
      TYPE: 'LINK',
      URL,
    });

    setLinkModalShown(false);
  }, [addToMarkers]);

  const showLinkModal = useCallback(() => {
    setShown(false);

    setLinkModalShown(true);
  }, []);

  const eraseMark = useCallback(() => addToMarkers(null), [addToMarkers]);

  const linkModal = useMemo(() => (linkModalShown ? (
    <LinkModal
      top={modalPosY}
      left={modalPosX}
      close={() => setLinkModalShown(false)}
      onSubmit={markLink} />
  ) : null), [linkModalShown, modalPosX, modalPosY, markLink]);

  useEffect(() => {
    setModalPosition({
      x: menuPosX - 120,
      y: menuPosY + 68,
    });
  }, [menuPosX, menuPosY]);

  const tooltip = useMemo(() => (focus && !shown ? (
    <div style={styles.tooltipWrapper}>
      <Tooltip
        type={type}
        hasContent={hasContent}
        blockId={blockId} />
    </div>
  ) : null), [type, hasContent, blockId, focus, shown]);

  return (
    <Fragment>
      <div style={menuStyles} ref={contextMenu}>
        <button
          onClick={markHighlight}
          onMouseEnter={onMouseEnterHighlight}
          onMouseLeave={onMouseLeaveIcon}
          className="artibox-tooltip-btn"
          style={styles.textmenuBtn}
          type="button">
          {highlightIcon}
        </button>
        <button
          onClick={showLinkModal}
          onMouseEnter={onMouseEnterLink}
          onMouseLeave={onMouseLeaveIcon}
          className="artibox-tooltip-btn"
          style={styles.textmenuBtn}
          type="button">
          {linkIcon}
        </button>
        <button
          onClick={eraseMark}
          onMouseEnter={onMouseEnterErase}
          onMouseLeave={onMouseLeaveIcon}
          className="artibox-tooltip-btn"
          style={styles.textmenuBtn}
          type="button">
          {eraseIcon}
        </button>
      </div>
      {linkModal}
      {tooltip}
    </Fragment>
  );
}

export default SelectionContextMenu;
