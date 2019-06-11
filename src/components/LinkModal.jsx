// @flow
/* eslint no-param-reassign: 0 */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Actions from '../constants/actions';
import TagTypes from '../constants/tags';
import { Dispatch as DispatchContext } from '../constants/context';
import { metaStyles } from '../styles/meta';

const styles = {
  wrapper: {
    position: 'absolute',
    zIndex: 10,
    width: 'auto',
    height: 'auto',
    backgroundColor: '#1B2733',
    borderRadius: 4,
    boxShadow: '0 0 0 1px #000, 0 8px 16px rgba(27, 39, 51, 0.16)',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkEditor: {
    width: 360,
    height: 'auto',
    border: '1px solid #DBDBDB',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.12)',
    opacity: 1,
    transition: 'opacity 0.2s ease-out',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: '0 12px 12px 12px',
    backgroundColor: '#fff',
    overflow: 'visible',
    position: 'relative',
  },
};

const HIGHLIGHT_SYMBOL = '*';

function LinkModal({
  id,
  firstLoaded,
  meta,
  setShowLinkInput,
  from,
  to,
  x,
  y,
  content,
}: {
  id: string,
  firstLoaded: boolean,
  meta: {
    tags: Array<{
      type: string,
    }>,
  },
  setShowLinkInput: Function,
  from: number,
  to: number,
  x: number,
  y: number,
  content: string,
}) {
  const dispatch = useContext(DispatchContext);
  const linkTextInput = useRef();
  const existCurrentMeta = Array.isArray(meta[LinkModal.TAGS])
    ? meta[LinkModal.TAGS].find(t => (t.from === from && t.to === to))
    : null;
  const [currentMeta, setMeta] = useState(existCurrentMeta || {});

  function updateTags(tag) {
    let valueStr = Array.from(Array(content.length)).map(() => '.').join('');
    let linkCursor = 48;
    const linkMap = new Map();
    const tags = meta[LinkModal.TAGS] || [];

    [
      ...tags,
      tag,
    ].forEach((t) => {
      switch (t.type) {
        case TagTypes.HIGHLIGHT:
          Array.from(Array(t.to - t.from)).forEach((n, index) => {
            valueStr = `${valueStr.substring(0, index + t.from)}${HIGHLIGHT_SYMBOL}${valueStr.substring(index + t.from + 1)}`;
          });
          break;

        case TagTypes.LINK:
          linkCursor += 1;
          linkMap.set(String.fromCharCode(linkCursor), t.url);

          Array.from(Array(t.to - t.from)).forEach((n, index) => {
            valueStr = `${valueStr.substring(0, index + t.from)}${String.fromCharCode(linkCursor)}${valueStr.substring(index + t.from + 1)}`;
          });
          break;

        default:
          break;
      }
    });

    const newTags = [];
    let isFindingEnd = false;
    let workingLinkCursor = null;

    Array.from(valueStr).forEach((str, index) => {
      if (index === 0 || valueStr[index] !== valueStr[index - 1]) {
        if (isFindingEnd) {
          switch (valueStr[index - 1]) {
            case HIGHLIGHT_SYMBOL:
              newTags[newTags.length - 1].to = index;

              isFindingEnd = false;
              break;

            default:
              if (valueStr[index - 1] === workingLinkCursor) {
                newTags[newTags.length - 1].to = index;

                isFindingEnd = false;
                workingLinkCursor = null;
              }
              break;
          }
        }

        switch (str) {
          case HIGHLIGHT_SYMBOL:
            newTags.push({
              type: TagTypes.HIGHLIGHT,
              from: index,
              to: index,
            });

            isFindingEnd = true;
            break;

          default:
            if (linkMap.get(str)) {
              newTags.push({
                type: TagTypes.LINK,
                from: index,
                to: index,
                url: linkMap.get(str),
              });

              workingLinkCursor = str;

              isFindingEnd = true;
            }
            break;
        }
      }
    });

    dispatch({
      type: Actions.SET_TAGS,
      id,
      tags: newTags,
    });
  }

  // Auto Focus On Link Modal Open
  useEffect(() => {
    dispatch({
      type: Actions.FOCUS,
      id,
    });

    const { current } = linkTextInput;

    if (current && firstLoaded) {
      current.focus();
    }
  }, [dispatch, firstLoaded, id]);

  return (
    <div
      style={{
        ...styles.wrapper,
        left: x ? x - 20 : 0,
        top: y ? y - 60 : 0,
      }}>
      <div style={styles.linkEditor}>
        <h6 style={metaStyles.metaModalTitle}>Link</h6>
        <button
          onClick={() => setMeta({
            ...currentMeta,
            newWindow: !currentMeta.newWindow,
          })}
          style={metaStyles.linkTargetButton}
          type="button">
          <span style={metaStyles.checkboxWrapper}>
            {currentMeta.newWindow ? (
              <span style={metaStyles.checkboxChecked} />
            ) : null}
          </span>
          Open new window
        </button>
        <button
          onClick={() => {
            updateTags({
              ...currentMeta,
              type: TagTypes.LINK,
              from,
              to,
            });

            setShowLinkInput(false);
          }}
          style={metaStyles.removeBtn}
          type="button">
          <span style={metaStyles.removeBtnLine1} />
          <span style={metaStyles.removeBtnLine2} />
        </button>
        <input
          type="text"
          ref={linkTextInput}
          value={(currentMeta && currentMeta.url) || ''}
          placeholder="https://"
          onChange={({ target }) => setMeta({
            ...currentMeta,
            url: target.value,
          })}
          style={metaStyles.metaModalInput} />
      </div>
    </div>
  );
}

LinkModal.TAGS = 'tags';

export default LinkModal;
