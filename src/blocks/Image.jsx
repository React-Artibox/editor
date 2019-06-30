// @flow

import React, {
  Fragment,
  useContext,
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import Actions from '../constants/actions';
import Icons from '../constants/icons';
import {
  Config as ConfigContext,
  Dispatch as DispatchContext,
} from '../constants/context';
import isURL from '../helpers/url';
import Aligns from '../constants/aligns';
import {
  baseStyles,
  metaStyles,
} from '../styles/meta';
import {
  IMAGE_CAPTION,
  IMAGE_LINK,
  IMAGE_ALIGN,
} from '../constants/features';

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
    ...metaStyles.metaModalTitle,
  },
  metaModalTextarea: {
    ...metaStyles.metaModalTextarea,
  },
  metaModalInput: {
    ...metaStyles.metaModalInput,
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
    ...metaStyles.linkTargetButton,
  },
  checkboxWrapper: {
    ...metaStyles.checkboxWrapper,
  },
  checkboxChecked: {
    ...metaStyles.checkboxChecked,
  },
  removeBtn: {
    ...metaStyles.removeBtn,
  },
  removeBtnLine1: {
    ...metaStyles.removeBtnLine1,
  },
  removeBtnLine2: {
    ...metaStyles.removeBtnLine2,
  },
};

function getAlignIcon(align, menuHover) {
  switch (align) {
    case Aligns.RIGHT:
      return <Icons.ALIGN_RIGHT fill={menuHover ? '#242424' : '#DBDBDB'} />;

    case Aligns.CENTER:
      return <Icons.ALIGN_CENTER fill={menuHover ? '#242424' : '#DBDBDB'} />;

    case Aligns.LEFT:
    default:
      return <Icons.ALIGN_LEFT fill={menuHover ? '#242424' : '#DBDBDB'} />;
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
  firstLoaded,
}: BlockProps) {
  const dispatch = useContext(DispatchContext);
  const {
    parseImageURL,
    features,
  } = useContext(ConfigContext);
  const container = useRef();
  const descriptionTextarea = useRef();
  const linkTextInput = useRef();

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [menuHover, setMenuHover] = useState(false);
  const [isDescriptionModalShown, toggleDescriptionModalShown] = useState(false);
  const [description, setDescription] = useState(meta[ImageComponent.DESCRIPTION]);
  const [isLinkModalShown, toggleLinkModalShown] = useState(false);
  const [linkURL, setLinkURL] = useState(meta[ImageComponent.LINK]);
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

      if (current && firstLoaded) {
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

      if (current && firstLoaded) {
        const textarea = current.querySelector('.artibox-input');

        if (textarea) {
          textarea.focus();
        }
      }
    }
  }, [isDescriptionModalShown, container, dispatch, id, description, firstLoaded]);

  // Auto Focus On Link Modal Open
  useEffect(() => {
    if (isLinkModalShown) {
      toggleDescriptionModalShown(false);

      dispatch({
        type: Actions.FOCUS,
        id,
      });

      const { current } = linkTextInput;

      if (current && firstLoaded) {
        current.focus();
      }
    } else {
      const { current } = container;

      dispatch({
        type: Actions.SET_METADATA,
        id,
        meta: {
          [ImageComponent.LINK]: linkURL,
        },
      });

      if (current && firstLoaded) {
        const textarea = current.querySelector('.artibox-input');

        if (textarea) {
          textarea.focus();
        }
      }
    }
  }, [isLinkModalShown, container, dispatch, id, firstLoaded, linkURL]);

  // Update Align
  useEffect(() => {
    dispatch({
      type: Actions.SET_METADATA,
      id,
      meta: {
        [ImageComponent.ALIGN]: align,
      },
    });
  }, [align, dispatch, id]);

  useEffect(() => {
    const { current } = container;

    if (current && firstLoaded) {
      current.querySelector('.artibox-input').focus();
    }

    dispatch({
      type: Actions.LOADED,
      id,
    });
  }, [container, id, dispatch, firstLoaded]);

  const menuItems = useMemo(() => (
    <Fragment>
      {features & IMAGE_CAPTION ? (
        <button
          onClick={() => toggleDescriptionModalShown(!isDescriptionModalShown)}
          className="artibox-tooltip-btn"
          style={styles.imageMenuBtn}
          type="button">
          <Icons.REMARK
            fill={(menuHover || description) ? '#242424' : '#DBDBDB'} />
        </button>
      ) : null}
      {features & IMAGE_LINK ? (
        <button
          onClick={() => toggleLinkModalShown(!isLinkModalShown)}
          className="artibox-tooltip-btn"
          style={styles.imageMenuBtn}
          type="button">
          <Icons.LINK fill={menuHover || isURL(linkURL) ? '#242424' : '#DBDBDB'} />
        </button>
      ) : null}
      {features & IMAGE_ALIGN ? (
        <button
          onClick={setNextAlign(align, setAlign)}
          className="artibox-tooltip-btn"
          style={styles.imageMenuBtn}
          type="button">
          {getAlignIcon(align, menuHover)}
        </button>
      ) : null}
    </Fragment>
  ), [features, menuHover, description, align, isDescriptionModalShown, isLinkModalShown, linkURL]);

  return (
    <div style={focus ? styles.focusWrapper : styles.wrapper}>
      <div ref={container} style={getAlignedStyle(align, styles.mainContent)}>
        <textarea
          value=""
          onChange={e => e.preventDefault()}
          onInput={e => e.preventDefault()}
          className="artibox-input"
          style={styles.input}
          onKeyDown={({ which }) => {
            switch (which) {
              case 13:
                dispatch({
                  type: Actions.NEW_LINE,
                  at: id,
                });
                break;

              case 8:
                dispatch({
                  type: Actions.REMOVE_BLOCK,
                  id,
                });
                break;

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
                  target="_blank"
                  rel="noopener noreferrer">
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
              {menuItems}
            </div>
            <div
              style={(
                isDescriptionModalShown ? styles.descriptionEditorShown : styles.descriptionEditor
              )}>
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

ImageComponent.ALIGN = 'ALIGN';

export default ImageComponent;
