// @flow

import {
  useEffect,
  useState,
} from 'react';
import BlockTypes from '../constants/blockTypes';

export default (state) => {
  const [isYouTubeAPILoaded, setYouTubeAPILoaded] = useState(typeof YT !== 'undefined');

  useEffect(() => {
    if (isYouTubeAPILoaded) return;

    // Detect YouTube Block
    if (state.blocks.find((block) => block.type === BlockTypes.YOUTUBE)) {
      const youTubeAPIScript = document.createElement('script');
      youTubeAPIScript.src = 'https://www.youtube.com/iframe_api';

      window.onYouTubeIframeAPIReady = () => {
        setYouTubeAPILoaded(true);

        youTubeAPIScript.remove();
      };

      document.body.appendChild(youTubeAPIScript);
    }
  }, [isYouTubeAPILoaded, state]);

  return isYouTubeAPILoaded;
};
