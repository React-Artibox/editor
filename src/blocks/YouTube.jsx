// @flow

import React, {
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';
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
};

function YouTube({
  content,
  id,
  focus,
  firstLoaded,
}: BlockProps) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [player, setPlayer] = useState(null);
  const container = useRef();
  const video = useRef();
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    const { current } = video;

    if (width && height && current) {
      const playerInstance = new YT.Player(current, {
        width,
        height,
        videoId: content,
        playerVars: {
          enablejsapi: true,
          rel: 0,
        },
        events: {
          onReady: () => {
            setPlayer(playerInstance);
          },
        },
      });
    }
  }, [width, height, content]);

  useEffect(() => {
    const { current } = container;

    if (current) {
      const containerWidth = current.offsetWidth;

      setWidth(containerWidth);
      setHeight(Math.round(containerWidth * 0.75));
    }
  }, [container]);

  useEffect(() => {
    const { current } = container;

    if (current && firstLoaded) {
      current.querySelector('.artibox-input').focus();
    }

    dispatch({
      type: Actions.LOADED,
      id,
    });
  }, [dispatch, firstLoaded, id]);

  return (
    <div style={focus ? styles.focusWrapper : styles.wrapper}>
      <div ref={container} style={styles.container}>
        <textarea
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
          })}
          onDoubleClick={() => {
            const playerState = player.getPlayerState();

            if (playerState === YT.PlayerState.PLAYING) {
              player.pauseVideo();
            } else if (~[
              YT.PlayerState.PAUSED,
              YT.PlayerState.CUED,
              YT.PlayerState.ENDED,
            ].indexOf(playerState)) {
              player.playVideo();
            }
          }} />
        <div
          style={{
            height,
            width,
          }}
          ref={video} />
      </div>
    </div>
  );
}

export default YouTube;
