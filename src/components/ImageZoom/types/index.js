// @flow strict

type ZoomElementType = HTMLImageElement | HTMLDivElement;

type OnMouseMoveEventType = SyntheticMouseEvent<ZoomElementType>;

type OnTouchMoveEventType = SyntheticTouchEvent<ZoomElementType>;

export type ZoomEventType = OnMouseMoveEventType | OnTouchMoveEventType;
