// @flow

import { BLOCK_NAMES } from '../constants/blockTypes';
import { ALIGN_NAMES } from '../constants/aligns';

export function toJSON(storedObject = {}) {
  return {
    blocks: storedObject.blocks.map(block => ({
      type: BLOCK_NAMES[block.type],
      content: block.content,
      meta: {
        ...block.meta,
        ...(block.meta.ALIGN ? { ALIGN: ALIGN_NAMES[block.meta.ALIGN] } : {}),
      },
    })),
  };
}
