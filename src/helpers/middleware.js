// @flow
import TagTypes from '../constants/tags.js';
import Actions from '../constants/actions';

const TAG_NAME = 'tags';
const HIGHLIGHT_SYMBOL = '*';

type Tag = {
  type: string,
  from: number,
  to: number,
  url?: string,
  newWindow?: boolean,
};

export function updateTags({
  originContent,
  contentId,
  meta,
  newTag,
  dispatch,
}: {
  originContent: string,
  contentId: string,
  meta: {
    tags: Array<Tag>,
  },
  newTag: Tag,
  dispatch: Function,
}) {
  let valueStr = Array.from(Array(originContent.length)).map(() => '.').join('');
  let linkCursor = 48;
  const linkMap = new Map();
  const tags = meta[TAG_NAME] || [];

  [
    ...tags,
    newTag,
  ].forEach((t) => {
    switch (t.type) {
      case TagTypes.HIGHLIGHT: {
        const notFullyEqual = Array.from(valueStr.substring(t.from, t.to))
          .some(symbol => symbol !== HIGHLIGHT_SYMBOL);

        if (notFullyEqual) {
          Array.from(Array(t.to - t.from)).forEach((_, index) => {
            valueStr = `${valueStr.substring(0, index + t.from)}${HIGHLIGHT_SYMBOL}${valueStr.substring(index + t.from + 1)}`;
          });
        } else {
          // fully equal means delete highlight tag
          Array.from(Array(t.to - t.from)).forEach((_, index) => {
            valueStr = `${valueStr.substring(0, index + t.from)}.${valueStr.substring(index + t.from + 1)}`;
          });
        }
        break;
      }

      case TagTypes.LINK:
        linkCursor += 1;
        linkMap.set(
          String.fromCharCode(linkCursor),
          {
            url: t.url,
            newWindow: t.newWindow || false,
          },
        );

        Array.from(Array(t.to - t.from)).forEach((_, index) => {
          valueStr = `${valueStr.substring(0, index + t.from)}${String.fromCharCode(linkCursor)}${valueStr.substring(index + t.from + 1)}`;
        });
        break;

      default:
        break;
    }
  });

  const newTags = [];
  let isFindingEnd = false;
  let workingLinkCursor = null;

  Array.from(`${valueStr} `).forEach((str, index) => {
    if (index === 0 || valueStr[index] !== valueStr[index - 1]) {
      if (isFindingEnd) {
        switch (valueStr[index - 1]) {
          case HIGHLIGHT_SYMBOL:
            newTags[newTags.length - 1].to = index;

            isFindingEnd = false;
            break;

          default:
            if (valueStr[index - 1] === workingLinkCursor) {
              newTags[newTags.length - 1].to = index;

              isFindingEnd = false;
              workingLinkCursor = null;
            }
            break;
        }
      }

      switch (str) {
        case HIGHLIGHT_SYMBOL: {
          newTags.push({
            type: TagTypes.HIGHLIGHT,
            from: index,
            to: index,
          });

          isFindingEnd = true;
          break;
        }

        default:
          if (linkMap.get(str)) {
            newTags.push({
              type: TagTypes.LINK,
              from: index,
              to: index,
              ...linkMap.get(str),
            });

            workingLinkCursor = str;

            isFindingEnd = true;
          }
          break;
      }
    }
  });

  dispatch({
    type: Actions.SET_TAGS,
    id: contentId,
    tags: newTags,
  });
}

export function updateAllTagsPosition({
  prevCursorIdx,
  nextCursorIdx,
  tags,
}: {
  prevCursorIdx: number,
  nextCursorIdx: number,
  tags: Array<Tag>,
}): [Tag] {
  if (!~prevCursorIdx
    || !~nextCursorIdx
    || prevCursorIdx === nextCursorIdx
  ) {
    return tags;
  }

  const cursorDeviation = nextCursorIdx - prevCursorIdx;
  const newTags = tags.map((tag) => {
    if (cursorDeviation < 0) {
      // delete mode only
      if (prevCursorIdx >= tag.from && prevCursorIdx < tag.to && nextCursorIdx < tag.from) {
        // edit partial link => N - | - P |
        return ({
          ...tag,
          from: nextCursorIdx,
          to: nextCursorIdx + (tag.to - prevCursorIdx),
        });
      }

      if (prevCursorIdx > tag.to && nextCursorIdx < tag.to && nextCursorIdx > tag.from) {
        // edit partial link => | N - | - P
        return ({
          ...tag,
          from: tag.from,
          to: nextCursorIdx,
        });
      }
    }

    if (prevCursorIdx > tag.from
      && prevCursorIdx <= tag.to
      && nextCursorIdx <= tag.to
      && nextCursorIdx > tag.from
    ) {
      // edit link substring => | P-N |
      return ({
        ...tag,
        from: tag.from,
        to: tag.to + cursorDeviation,
      });
    }

    if (prevCursorIdx <= tag.from) {
      // edit some char before the tag => P-N | |
      return ({
        ...tag,
        from: tag.from + cursorDeviation,
        to: tag.to + cursorDeviation,
      });
    }

    if (nextCursorIdx === tag.from && prevCursorIdx === tag.to) {
      // fully equal
      return null;
    }

    return tag;
  }).filter(t => (t && !(t.to <= t.from))); // filter all deleted tags

  return newTags;
}
