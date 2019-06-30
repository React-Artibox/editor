// @flow
/* eslint no-param-reassign: 0 */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { Dispatch as DispatchContext } from '../constants/context';
import { metaStyles } from '../styles/meta';

const styles = {
  wrapper: {
    position: 'absolute',
    zIndex: 20,
    width: 'auto',
    height: 'auto',
    backgroundColor: '#1B2733',
    borderRadius: 4,
    boxShadow: '0 0 0 1px #000, 0 8px 16px rgba(27, 39, 51, 0.16)',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'auto',
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
  onSubmit,
  top,
  left,
  close,
}: {
  onSubmit: Function,
  top: Function,
  left: Function,
  close: Function,
}) {
  const dispatch = useContext(DispatchContext);
  const input = useRef();
  const [url, setURL] = useState('');
  const [newWindow, setNewWindow] = useState(true);

  // Auto Focus On Link Modal Open
  useEffect(() => {
    const { current } = input;

    if (current) {
      current.focus();
    }
  }, [dispatch]);

  const toggleNewWindow = useCallback(() => setNewWindow(!newWindow), [newWindow]);

  const toggleCheckbox = useMemo(() => (
    newWindow ? <span style={metaStyles.checkboxChecked} /> : null), [newWindow]);

  const updateURL = useCallback(({ target }) => setURL(target.value), []);

  const submit = useCallback(() => onSubmit({
    OPEN_WINDOW: newWindow,
    URL: url,
  }), [newWindow, url, onSubmit]);

  const checkSubmit = useCallback((e) => {
    const { which, shiftKey } = e;

    switch (which) {
      case 13:
        if (shiftKey) break;

        e.preventDefault();

        submit();
        break;
      default:
        break;
    }
  }, [submit]);

  const wrapperStyles = useMemo(() => ({
    ...styles.wrapper,
    left,
    top,
  }), [left, top]);

  return (
    <div style={wrapperStyles}>
      <div style={styles.linkEditor}>
        <h6 style={metaStyles.metaModalTitle}>Link</h6>
        <button
          onClick={toggleNewWindow}
          style={metaStyles.linkTargetButton}
          type="button">
          <span style={metaStyles.checkboxWrapper}>
            {toggleCheckbox}
          </span>
          Open new window
        </button>
        <button
          onClick={close}
          style={metaStyles.removeBtn}
          type="button">
          <span style={metaStyles.removeBtnLine1} />
          <span style={metaStyles.removeBtnLine2} />
        </button>
        <input
          type="text"
          ref={input}
          value={url}
          placeholder="https://"
          onKeyDown={checkSubmit}
          onChange={updateURL}
          style={metaStyles.metaModalInput} />
      </div>
    </div>
  );
}

LinkModal.TAGS = 'tags';

export default LinkModal;
