// @flow

import React, { Fragment, useContext, useState, useRef, useEffect } from 'react';
import Actions from '../constants/actions';
import Tooltip from '../tools/Tooltip';
import Icons from '../constants/icons';
import {
  Config as ConfigContext,
  Dispatch as DispatchContext,
} from '../constants/context';

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
    width: '70%',
    height: 0,
    overflow: 'hidden',
    backgroundColor: '#fff',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.12)',
    opacity: 1,
    transition: 'opacity 0.2s ease-out',
    position: 'absolute',
    top: 0,
    left: -16,
    border: 0,
    zIndex: 0,
    borderRadius: 4,
  },
  descriptionEditorShown: {
    width: '70%',
    height: 128,
    backgroundColor: '#fff',
    border: '1px solid #DBDBDB',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.12)',
    opacity: 1,
    transition: 'opacity 0.2s ease-out',
    position: 'absolute',
    top: 0,
    left: -16,
    zIndex: 10,
    borderRadius: 4,
  },
  descriptionModalTextarea: {
    border: 0,
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    fontSize: 15,
    color: '#4a4a4a',
    outline: 'none',
    padding: '0.5em 0.6em',
  },
  description: {
    color: '#9b9b9b',
    fontSize: 13,
    textAlign: 'center',
    width: '100%',
    lineHeight: 1.618,
    margin: 0,
  },
};

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

  const [src, setSrc] = useState(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [menuHover, setMenuHover] = useState(false);
  const [isDescriptionModalShown, toggleDescriptionModalShown] = useState(false);
  const [description, setDescription] = useState(meta[ImageComponent.DESCRIPTION]);

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

      if (current) {
        const textarea = current.querySelector('.artibox-input');

        if (textarea) {
          textarea.focus();
        }
      }
    }
  }, [isDescriptionModalShown]);

  return (
    <div style={focus ? styles.focusWrapper : styles.wrapper}>
      <div ref={container} style={styles.mainContent}>
        <textarea
          autoFocus
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
            <canvas width={width} height={height} />
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
                className="artibox-tooltip-btn"
                style={styles.imageMenuBtn}
                type="button">
                <Icons.LINK fill={menuHover ? '#242424' : '#DBDBDB'} />
              </button>
              <button
                className="artibox-tooltip-btn"
                style={styles.imageMenuBtn}
                type="button">
                <Icons.ALIGN fill={menuHover ? '#242424' : '#DBDBDB'} />
              </button>
            </div>
            <div
              style={isDescriptionModalShown ? styles.descriptionEditorShown : styles.descriptionEditor}>
              <textarea
                ref={descriptionTextarea}
                value={description}
                onBlur={() => {
                  toggleDescriptionModalShown(false);

                  dispatch({
                    type: Actions.SET_METADATA,
                    id,
                    meta: {
                      [ImageComponent.DESCRIPTION]: description,
                    },
                  });
                }}
                onChange={({ target }) => setDescription(target.value)}
                style={styles.descriptionModalTextarea} />
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

export default ImageComponent;
