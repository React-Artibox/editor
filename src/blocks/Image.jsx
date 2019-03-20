// @flow

import React, { Fragment, useContext, useState, useRef, useEffect } from 'react';
import Actions from '../constants/actions';
import Tooltip from '../tools/Tooltip';
import Icons from '../constants/icons';
import {
  Config as ConfigContext,
  Dispatch as DispatchContext,
} from '../constants/context';
import isURL from '../helpers/url';
import Aligns from '../constants/aligns';

const baseStyles = {
  metaEditor: {
    width: '70%',
    height: 0,
    overflow: 'hidden',
    backgroundColor: '#fff',
    boxShadow: 'none',
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: -16,
    border: 0,
    zIndex: 0,
  },
  metaEditorShown: {
    height: 'auto',
    overflow: 'visible',
    border: '1px solid #DBDBDB',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.12)',
    opacity: 1,
    transition: 'opacity 0.2s ease-out',
    position: 'absolute',
    top: 0,
    left: -16,
    zIndex: 10,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: '0 12px 12px 12px',
  },
};

const styles = {
  wrapper: {
    width: '100%',
    borderLeft: '2px solid transparent',
    padding: '0 12px',
    margin: '12px 0',
    minHeight: 168,
  },
  focusWrapper: {
    width: '100%',
    borderLeft: '2px solid #FA5F5F',
    padding: '0 12px',
    margin: '12px 0',
    minHeight: 168,
  },
  mainContent: {
    width: '100%',
    position: 'relative',
    minHeight: 168,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  input: {
    fontSize: 1,
    color: 'transparent',
    border: 0,
    width: '100%',
    outline: 'none',
    resize: 'none',
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  placeholder: {
    width: '100%',
    height: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  placeholderText: {
    fontSize: 18,
    color: '#4a4a4a',
    fontWeight: 400,
    letterSpacing: 2,
    padding: '0 0 0 2px',
    margin: '12px 0',
  },
  imageMenu: {
    position: 'absolute',
    top: 0,
    left: -60,
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  imageMenuBtn: {
    border: '1px solid #DBDBDB',
    borderRadius: 4,
    width: 40,
    height: 40,
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  descriptionEditor: {
    ...baseStyles.metaEditor,
    top: 0,
  },
  descriptionEditorShown: {
    ...baseStyles.metaEditor,
    ...baseStyles.metaEditorShown,
    top: 0,
  },
  metaModalTitle: {
    lineHeight: '32px',
    margin: 0,
    fontSize: 12,
    color: '#4a4a4a',
    letterSpacing: 1,
    width: '100%',
    padding: '2px 0 0 1px',
    borderBottom: '1px solid #dfdfdf',
    margin: '0 0 12px 0',
  },
  metaModalTextarea: {
    border: 0,
    backgroundColor: 'transparent',
    width: '100%',
    fontSize: 15,
    color: '#4a4a4a',
    outline: 'none',
    padding: '0.5em 0.6em',
    resize: 'none',
    borderRadius: 4,
    backgroundColor: '#f3f3f3',
    minHeight: '3em',
  },
  metaModalInput: {
    border: 0,
    backgroundColor: 'transparent',
    width: '100%',
    fontSize: 15,
    color: '#4a4a4a',
    outline: 'none',
    padding: '0 0.6em',
    resize: 'none',
    borderRadius: 4,
    backgroundColor: '#f3f3f3',
    height: 30,
    lineHeight: '30px',
  },
  description: {
    color: '#9b9b9b',
    fontSize: 13,
    textAlign: 'center',
    width: '100%',
    lineHeight: 1.618,
    margin: 0,
  },
  linkEditor: {
    ...baseStyles.metaEditor,
    top: 64,
  },
  linkEditorShown: {
    ...baseStyles.metaEditor,
    ...baseStyles.metaEditorShown,
    top: 64,
  },
  activeLink: {
    width: 32,
    height: 32,
    position: 'absolute',
    zIndex: 5,
    right: 8,
    top: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasWrapper: {
    position: 'relative',
    zIndex: 5,
  },
  linkTargetButton: {
    position: 'absolute',
    top: 10,
    left: 48,
    padding: 0,
    outline: 'none',
    cursor: 'pointer',
    border: 0,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    color: '#4a4a4a',
    fontSize: 10,
    letterSpacing: 1,
  },
  checkboxWrapper: {
    width: 12,
    height: 12,
    borderRadius: 6,
    border: '1px solid #dfdfdf',
    padding: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 6px 0 0',
  },
  checkboxChecked: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1BDCDC',
  },
  removeBtn: {
    width: 14,
    height: 14,
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#BD0017',
    borderRadius: 7,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 0,
    padding: 0,
    outline: 'none',
    cursor: 'pointer',
  },
  removeBtnLine1: {
    backgroundColor: '#fff',
    width: 8,
    height: 1,
    transform: 'rotate(45deg)',
    position: 'absolute',
  },
  removeBtnLine2: {
    backgroundColor: '#fff',
    width: 8,
    height: 1,
    transform: 'rotate(135deg)',
    position: 'absolute',
  },
};

function getAlignIcon(align, menuHover) {
  switch (align) {
    case Aligns.RIGHT:
      return <Icons.ALIGN_RIGHT fill={menuHover ? '#242424' : '#DBDBDB'} />

    case Aligns.CENTER:
      return <Icons.ALIGN_CENTER fill={menuHover ? '#242424' : '#DBDBDB'} />

    case Aligns.LEFT:
    default:
      return <Icons.ALIGN_LEFT fill={menuHover ? '#242424' : '#DBDBDB'} />
  }
}

function setNextAlign(align, setAlign) {
  switch (align) {
    case Aligns.RIGHT:
      return () => setAlign(Aligns.LEFT);

    case Aligns.CENTER:
      return () => setAlign(Aligns.RIGHT);

    case Aligns.LEFT:
    default:
      return () => setAlign(Aligns.CENTER);
  }
}

function getAlignedStyle(align, style) {
  switch (align) {
    case Aligns.RIGHT:
      return {
        ...style,
        alignItems: 'flex-end',
      };

    case Aligns.CENTER:
      return {
        ...style,
        alignItems: 'center',
      };

    case Aligns.LEFT:
    default:
      return {
        ...style,
        alignItems: 'flex-start',
      };
  }
}

function ImageComponent({
  content,
  id,
  focus,
  meta,
}: BlockProps) {
  const dispatch = useContext(DispatchContext);
  const { parseImageURL } = useContext(ConfigContext);
  const container = useRef();
  const descriptionTextarea = useRef();
  const linkTextInput = useRef();

  const [src, setSrc] = useState(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [menuHover, setMenuHover] = useState(false);
  const [isDescriptionModalShown, toggleDescriptionModalShown] = useState(false);
  const [description, setDescription] = useState(meta[ImageComponent.DESCRIPTION]);
  const [isLinkModalShown, toggleLinkModalShown] = useState(false);
  const [linkURL, setLinkURL] = useState(meta[ImageComponent.LINK]);
  const [linkSelf, setLinkSelf] = useState(meta[ImageComponent.LINK_SELF]);
  const [align, setAlign] = useState(meta[ImageComponent.ALIGN]);

  // Draw on canvas
  function draw(image) {
    if (width && height) {
      const { current } = container;
      const canvas = current.querySelector('canvas');
      const ctx = canvas.getContext('2d');

      ctx.drawImage(image, 0, 0, width, height);
    }
  }

  // Fetch image width and height for draw
  function fetchImageMetadata(url) {
    const { current } = container;

    const containerWidth = current.offsetWidth;
    const maxHeight = Math.floor(window.innerHeight * 0.4);

    const img = new Image();

    img.onload = () => {
      if (img.height > maxHeight) {
        const targetHeight = maxHeight;
        const targetWidth = Math.floor(img.width / (img.height / maxHeight));

        if (targetWidth > containerWidth) {
          const finalHeight = Math.floor(targetHeight / (targetWidth / containerWidth));

          setWidth(containerWidth);
          setHeight(finalHeight);
        } else {
          setWidth(targetWidth);
          setHeight(targetHeight);
        }
      } else if (img.width > containerWidth) {
        const targetHeight = Math.floor(img.height / (img.width / containerWidth));

        setWidth(containerWidth);
        setHeight(targetHeight);
      } else {
        setWidth(img.width);
        setHeight(img.height);
      }

      draw(img);
    };

    img.src = url;
  }

  // Update Image
  useEffect(() => {
    const { current } = container;

    if (current) {
      if (parseImageURL) {
        if (typeof parseImageURL.then === 'function') {
          parseImageURL(content).then(url => fetchImageMetadata(url));
        } else {
          fetchImageMetadata(parseImageURL(content));
        }
      } else {
        fetchImageMetadata(content);
      }
    }
  });

  // Auto Focus On Description Modal Open
  useEffect(() => {
    if (isDescriptionModalShown) {
      toggleLinkModalShown(false);

      dispatch({
        type: Actions.FOCUS,
        id,
      });

      const { current } = descriptionTextarea;

      if (current) {
        current.focus();
      }
    } else {
      const { current } = container;

      dispatch({
        type: Actions.SET_METADATA,
        id,
        meta: {
          [ImageComponent.DESCRIPTION]: description,
        },
      });

      if (current) {
        const textarea = current.querySelector('.artibox-input');

        if (textarea) {
          textarea.focus();
        }
      }
    }
  }, [isDescriptionModalShown]);

  // Auto Focus On Link Modal Open
  useEffect(() => {
    if (isLinkModalShown) {
      toggleDescriptionModalShown(false);

      dispatch({
        type: Actions.FOCUS,
        id,
      });

      const { current } = linkTextInput;

      if (current) {
        current.focus();
      }
    } else {
      const { current } = container;

      dispatch({
        type: Actions.SET_METADATA,
        id,
        meta: {
          [ImageComponent.LINK]: linkURL,
          [ImageComponent.LINK_SELF]: linkSelf,
        },
      });

      if (current) {
        const textarea = current.querySelector('.artibox-input');

        if (textarea) {
          textarea.focus();
        }
      }
    }
  }, [isLinkModalShown]);

  // Update Align
  useEffect(() => {
    dispatch({
      type: Actions.SET_METADATA,
      id,
      meta: {
        [ImageComponent.ALIGN]: align,
      },
    });
  }, [align]);

  return (
    <div style={focus ? styles.focusWrapper : styles.wrapper}>
      <div ref={container} style={getAlignedStyle(align, styles.mainContent)}>
        <textarea
          autoFocus
          value=""
          onChange={e => e.preventDefault()}
          onInput={e => e.preventDefault()}
          className="artibox-input"
          style={styles.input}
          onKeyDown={({ which }) => {
            switch (which) {
              case 8:
                dispatch({
                  type: Actions.REMOVE_BLOCK,
                  id,
                });

              default:
                break;
            }
          }}
          onFocus={() => dispatch({
            type: Actions.FOCUS,
            id,
          })} />
        {content ? (
          <Fragment>
            <div style={styles.canvasWrapper}>
              <canvas width={width} height={height} />
              {isURL(linkURL) ? (
                <a
                  href={linkURL}
                  style={styles.activeLink}
                  target={linkSelf ? '_self' : '_blank'}>
                  <Icons.LINK fill="#777" />
                </a>
              ) : null}
            </div>
            {description ? (
              <p style={styles.description}>
                {description}
              </p>
            ) : null}
            <div
              onMouseEnter={() => setMenuHover(true)}
              onMouseLeave={() => setMenuHover(false)}
              style={styles.imageMenu}>
              <button
                onClick={() => toggleDescriptionModalShown(!isDescriptionModalShown)}
                className="artibox-tooltip-btn"
                style={styles.imageMenuBtn}
                type="button">
                <Icons.REMARK
                  fill={(menuHover || description) ? '#242424' : '#DBDBDB'} />
              </button>
              <button
                onClick={() => toggleLinkModalShown(!isLinkModalShown)}
                className="artibox-tooltip-btn"
                style={styles.imageMenuBtn}
                type="button">
                <Icons.LINK fill={menuHover || isURL(linkURL) ? '#242424' : '#DBDBDB'} />
              </button>
              <button
                onClick={setNextAlign(align, setAlign)}
                className="artibox-tooltip-btn"
                style={styles.imageMenuBtn}
                type="button">
                {getAlignIcon(align, menuHover)}
              </button>
            </div>
            <div style={isDescriptionModalShown ? styles.descriptionEditorShown : styles.descriptionEditor}>
              <h6 style={styles.metaModalTitle}>Caption</h6>
              <button
                onClick={() => toggleDescriptionModalShown(false)}
                style={styles.removeBtn}
                type="button">
                <span style={styles.removeBtnLine1} />
                <span style={styles.removeBtnLine2} />
              </button>
              <textarea
                ref={descriptionTextarea}
                value={description || ''}
                onChange={({ target }) => setDescription(target.value)}
                style={styles.metaModalTextarea} />
            </div>
            <div style={isLinkModalShown ? styles.linkEditorShown : styles.linkEditor}>
              <h6 style={styles.metaModalTitle}>Link</h6>
              <button
                onClick={() => setLinkSelf(!linkSelf)}
                style={styles.linkTargetButton}
                type="button">
                <span style={styles.checkboxWrapper}>
                  {linkSelf ? null : (
                    <span style={styles.checkboxChecked} />
                  )}
                </span>
                Open new window
              </button>
              <button
                onClick={() => toggleLinkModalShown(false)}
                style={styles.removeBtn}
                type="button">
                <span style={styles.removeBtnLine1} />
                <span style={styles.removeBtnLine2} />
              </button>
              <input
                type="text"
                ref={linkTextInput}
                value={linkURL || ''}
                placeholder="https://"
                onChange={({ target }) => setLinkURL(target.value)}
                style={styles.metaModalInput} />
            </div>
          </Fragment>
        ) : (
          <div style={styles.placeholder}>
            <Icons.PHOTO fill="#DBDBDB" />
            <p style={styles.placeholderText} />
          </div>
        )}
      </div>
    </div>
  );
}

ImageComponent.DESCRIPTION = 'DESCRIPTION';

ImageComponent.LINK = 'LINK';

ImageComponent.LINK_SELF = 'LINK_SELF';

ImageComponent.ALIGN = 'ALIGN';

export default ImageComponent;
