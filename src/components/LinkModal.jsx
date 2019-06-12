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
import { updateTags } from '../helpers/middleware.js';

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
              originContent: content,
              contentId: id,
              meta,
              dispatch,
              newTag: {
                ...currentMeta,
                type: TagTypes.LINK,
                from,
                to,
              },
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
