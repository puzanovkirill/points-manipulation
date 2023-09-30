import { TPoint2D } from '../types';

export const getScalarProduct = (
  firstPoint: { x: number; y: number },
  secondPoint: { x: number; y: number }
) => firstPoint.x * secondPoint.x + firstPoint.y * secondPoint.y;

export const getRelativeQuadrilateralMidline = (
  boundaryPoint: TPoint2D[],
  clientRect: DOMRect
) => {
  const x1 =
    ((boundaryPoint[0].x + boundaryPoint[3].x) / 2) * (clientRect?.width ?? 0);
  const y1 =
    ((boundaryPoint[0].y + boundaryPoint[3].y) / 2) * (clientRect?.height ?? 0);
  const x2 =
    ((boundaryPoint[1].x + boundaryPoint[2].x) / 2) * (clientRect?.width ?? 0);
  const y2 =
    ((boundaryPoint[1].y + boundaryPoint[2].y) / 2) * (clientRect?.height ?? 0);

  return [
    {
      id: x1 * y1,
      x: x1,
      y: y1,
    },
    {
      id: x2 * y2,
      x: x2,
      y: y2,
    },
  ];
};

export const getLineCenter = (start: TPoint2D, end: TPoint2D) => ({
  x: (start.x + end.x) / 2,
  y: (start.y + end.y) / 2,
});
