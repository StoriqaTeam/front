// @flow strict

type ZoomElementType = HTMLImageElement | HTMLDivElement;

type OnMouseMoveEventType = SyntheticMouseEvent<ZoomElementType>;

type OnTouchMoveEventType = SyntheticTouchEvent<ZoomElementType>;

export type ZoomEventType = OnMouseMoveEventType | OnTouchMoveEventType;

export type OffsetType = $Shape<{
  offsetY: number,
  offsetX: number,
  pageY: number,
  pageX: number,
}>;

export type ZoomFnType = ZoomEventType => OffsetType;
