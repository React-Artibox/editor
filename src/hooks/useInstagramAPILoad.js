// @flow

import {
  useEffect,
  useState,
} from 'react';
import BlockTypes from '../constants/blockTypes';

export default (state) => {
  const [isLoaded, setIsLoaded] = useState(typeof instgrm !== 'undefined');

  useEffect(() => {
    if (isLoaded) return;

    // Detect YouTube Block
    if (state.blocks.find((block) => block.type === BlockTypes.INSTAGRAM)) {
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.onload = () => {
        setIsLoaded(true);

        script.remove();
      };
      script.async = true;

      document.body.appendChild(script);
    }
  }, [isLoaded, state]);

  return isLoaded;
};
