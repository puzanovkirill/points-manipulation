import { useMemo, useState } from 'react';
import { getLineCenter } from '../helpers';
import { TPoint2D } from '../types';

const useGetPerpendicularLine = (relativePoints: TPoint2D[]) => {
  const [lineLength, setLineLength] = useState(0);

  const centerPoint =
    relativePoints.length === 2
      ? getLineCenter(relativePoints[0], relativePoints[1])
      : { x: 1, y: 1 };

  const dx =
    relativePoints.length === 2 ? relativePoints[1].x - relativePoints[0].x : 0;
  const dy =
    relativePoints.length === 2 ? relativePoints[1].y - relativePoints[0].y : 0;

  const vectorLength = Math.sqrt(dx ** 2 + dy ** 2);

  const dxPerpendicular = -dy;
  const dyPerpendicular = dx;

  const normalizedVector = {
    x: dxPerpendicular / vectorLength || 0,
    y: dyPerpendicular / vectorLength || 0,
  };

  const perpendicularStart = useMemo(
    () => ({
      x: centerPoint.x + normalizedVector.x * lineLength,
      y: centerPoint.y + normalizedVector.y * lineLength,
    }),
    [
      centerPoint.x,
      centerPoint.y,
      lineLength,
      normalizedVector.x,
      normalizedVector.y,
    ]
  );

  const perpendicularEnd = {
    x: centerPoint.x - normalizedVector.x * lineLength,
    y: centerPoint.y - normalizedVector.y * lineLength,
  };

  const perpendicularLine = {
    start: perpendicularStart,
    end: perpendicularEnd,
  };

  return {
    lineLength,
    setLineLength,
    normalizedVector,
    perpendicularLine,
    centerPoint,
  };
};

export { useGetPerpendicularLine };
