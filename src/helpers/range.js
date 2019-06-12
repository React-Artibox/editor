/* eslint no-constant-condition: 0 */
export function getSelectedRangeOnPreview(textarea = null, target = null) {
  if (!textarea || !target) return null;
  if (!textarea.current || !target.current) {
    throw new Error('Current object is not a ref node.');
  }

  const {
    current: textareaNode,
  } = textarea;
  const {
    current: targetNode,
  } = target;

  let node = null;
  let foundStart = false;
  let cursor = 0;
  const range = document.createRange();
  range.setStart(targetNode, 0);
  range.collapse(true);
  const nodeStack = [targetNode];

  while (true) {
    node = nodeStack.pop();

    if (!node) break;

    switch (node.nodeType) {
      case Node.TEXT_NODE: {
        const nextCursor = cursor + node.length;

        if (!foundStart
          && textareaNode.selectionStart >= cursor
          && textareaNode.selectionStart <= nextCursor
        ) {
          // Start cursor in this node
          range.setStart(node, textareaNode.selectionStart - cursor);

          foundStart = true;
        }

        if (foundStart
          && textareaNode.selectionEnd >= cursor
          && textareaNode.selectionEnd <= nextCursor
        ) {
          // End cursor in this node
          range.setEnd(node, textareaNode.selectionEnd - cursor);
        }

        cursor = nextCursor;
        break;
      }

      case Node.ELEMENT_NODE:
        Array.from(node.childNodes)
          .reverse()
          .forEach((childNode) => { nodeStack.push(childNode); });
        break;

      default:
        break;
    }
  }

  return range;
}

export default null;
