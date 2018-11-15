// @flow strict

type ZoomElementType = HTMLImageElement | HTMLDivElement;

type OnMouseMoveEventType = SyntheticMouseEvent<ZoomElementType>;

type OnTouchMoveEventType = SyntheticTouchEvent<ZoomElementType>;

export type ZoomEventType = OnMouseMoveEventType | OnTouchMoveEventType;

export type CoordinateType = {
  pageX: number,
  pageY: number,
};

export type ZoomFnType = ZoomEventType => CoordinateType;
