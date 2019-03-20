// @flow

import uuid from 'uuid/v4';
import BLOCK_TYPES, { BLOCK_NAMES } from '../constants/blockTypes';
import ALIGNS, { ALIGN_NAMES } from '../constants/aligns';

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

export function fromJSON(json = { blocks: [] }) {
  return {
    blocks: json.blocks.map((block) => {
      // Skip Symbolize Block
      if (BLOCK_NAMES[block]) return block;

      return {
        id: block.id || uuid(),
        type: BLOCK_TYPES[block.type],
        content: block.content,
        meta: block.meta ? {
          ...block.meta,
          ...(block.meta.ALIGN ? { ALIGN: ALIGNS[block.meta.ALIGN] } : {}),
        } : {},
      };
    }),
  };
}
