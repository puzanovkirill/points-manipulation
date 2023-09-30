/* eslint-disable react/no-array-index-key */
import { Box, Image } from '@chakra-ui/react';
import { useRef } from 'react';
import { TPoint2D, usePointsManipulation } from '../../domains/markup';
import RoiPoint from './roi-point.component';

type TRegionPreview = {
  image: string | undefined;
  points: TPoint2D[];
  setPoints: (newPoints: TPoint2D[]) => void;
};

function RegionPreview({ image, points, setPoints }: TRegionPreview) {
  const divRef = useRef<HTMLDivElement>(null);
  const { relativePoints, lines, addPoint, deletePoint, onMouseDown } =
    usePointsManipulation({
      points,
      setPoints,
      divRef,
    });

  return (
    <Box
      ref={divRef}
      overflow="hidden"
      onClick={image ? addPoint : undefined}
      pos="relative"
    >
      <Image src={image} alt="Camera preview" objectFit="contain" h="full" />
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: divRef.current?.getBoundingClientRect().width ?? 0,
          height: divRef.current?.getBoundingClientRect().height ?? 0,
        }}
      >
        {relativePoints.length > 2
          ? lines.map((line) => (
              <line
                key={`${lines.length}${line.x1}${line.y1}${line.x2}${line.y2}`}
                style={{ stroke: 'red', strokeWidth: 1 }}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
              />
            ))
          : null}
        {relativePoints.length > 1 ? (
          <line
            style={{
              stroke: 'red',
              strokeWidth: 1,
            }}
            x1={relativePoints[0].x}
            y1={relativePoints[0].y}
            x2={relativePoints[relativePoints.length - 1].x}
            y2={relativePoints[relativePoints.length - 1].y}
          />
        ) : null}
        {relativePoints.map((point, index) => (
          <RoiPoint
            key={`${index}${point.x}${point.y}`}
            handleMouseDown={onMouseDown}
            point={point}
            handleDeletePoint={deletePoint}
          />
        ))}
      </svg>
    </Box>
  );
}

export default RegionPreview;
