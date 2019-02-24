// @flow

import React, { useContext, useState, useRef, useEffect } from 'react';
import Actions from '../constants/actions';
import Tooltip from '../tools/Tooltip';
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
  },
  focusWrapper: {
    width: '100%',
    borderLeft: '2px solid #FA5F5F',
    padding: '0 12px',
    margin: '12px 0',
  },
  mainContent: {
    width: '100%',
    position: 'relative',
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
};

function ImageComponent({
  content,
  id,
  focus,
}: BlockProps) {
  const dispatch = useContext(DispatchContext);
  const { parseImageURL } = useContext(ConfigContext);
  const container = useRef();

  const [src, setSrc] = useState(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  // Draw on canvas
  function draw(image) {
    if (width && height) {
      const { current } = container;
      const canvas = current.querySelector('canvas');
      const ctx = canvas.getContext('2d');

      current.style.height = `${height}px`;
      current.parentNode.style.height = `${height}px`;

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
          <canvas width={width} height={height} />
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

export default ImageComponent;
