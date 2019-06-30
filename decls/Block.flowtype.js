// @flow

export type BlockProps = {
  content: string,
  id: string,
  focus: boolean,
  firstLoaded: boolean,
};

type TextMarkerType = "HIGHLIGHT" | "LINK";

interface TextMarkerInterface {
  FROM: number,
  TO: number,
  TYPE: TextMarkerType,
}

export type TextHighlightMarkerType = TextMarkerInterface & {

};

export type TextLinkMarkerType = TextMarkerInterface & {
  URL: string,
  NEW_WINDOW: boolean,
};
