// @flow

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import qs from 'querystring';
import { Dispatch as DispatchContext } from '../constants/context';
import Actions from '../constants/actions';

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
  container: {
    width: '100%',
    position: 'relative',
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
    height: 'calc(100% - 52px)',
    backgroundColor: 'transparent',
    zIndex: 1,
    cursor: 'pointer',
  },
  iframe: {
    border: 0,
    overflow: 'hidden',
  },
};

function Facebook({
  content,
  id,
  focus,
  meta,
}: BlockProps) {
  console.log({
    meta,
    content,
  });
  // const [width, setWidth] = useState(0);
  // const [height, setHeight] = useState(0);
  // const [player, setPlayer] = useState(null);
  const dispatch = useContext(DispatchContext);

  // useEffect(() => {
  //   const { current } = video;
  //
  //   if (width && height && current) {
  //     const playerInstance = new YT.Player(current, {
  //       width,
  //       height,
  //       videoId: content,
  //       playerVars: {
  //         enablejsapi: true,
  //         rel: 0,
  //       },
  //       events: {
  //         onReady: () => {
  //           setPlayer(playerInstance);
  //         },
  //       },
  //     });
  //   }
  // }, [width, height, content]);
  //
  // useEffect(() => {
  //   const { current } = container;
  //
  //   if (current) {
  //     const containerWidth = current.offsetWidth;
  //
  //     setWidth(containerWidth);
  //     setHeight(Math.round(containerWidth * 0.75));
  //   }
  // }, [container]);
  //
  // useEffect(() => {
  //   const { current } = container;
  //
  //   if (current && firstLoaded) {
  //     current.querySelector('.artibox-input').focus();
  //   }
  //
  //   dispatch({
  //     type: Actions.LOADED,
  //     id,
  //   });
  // }, [dispatch, firstLoaded, id]);

  const getIframeSrc = useCallback(() => {
    switch (meta ? meta.type : 'post') {
      case 'post':
        return `https://www.facebook.com/plugins/post.php?${qs.stringify({
          href: `https://www.facebook.com/${content}`,
          width: meta.width,
          height: meta.height,
        })}`;

      case 'video':
        return `https://www.facebook.com/plugins/video.php?${qs.stringify({
          href: `https://www.facebook.com/${content}`,
          width: meta.width,
          height: meta.height,
        })}`;

      default:
        return null;
    }
  }, [content, meta]);

  return (
    <div style={focus ? styles.focusWrapper : styles.wrapper}>
      <div style={styles.container}>
        <textarea
          onInput={(e) => e.preventDefault()}
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
        <iframe
          title={content}
          src={getIframeSrc()}
          width={meta.width}
          height={meta.height}
          style={styles.iframe}
          scrolling="no"
          frameBorder="0"
          allowtransparency="true"
          allow="encrypted-media" />
      </div>
    </div>
  );
}

export default Facebook;
