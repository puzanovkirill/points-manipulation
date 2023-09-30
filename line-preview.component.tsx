/* eslint-disable react/no-array-index-key */
import { Box, Image } from '@chakra-ui/react';
import { useRef } from 'react';
import { TPoint2D, useRoiLineManipulation } from '../../domains/markup';
import RoiPoint from './roi-point.component';

type TLinePreview = {
  image: string | undefined;
  points: TPoint2D[];
  setPoints: (newPoints: TPoint2D[]) => void;
  vectorPoint: TPoint2D | undefined;
  setVectorPoint: (vector: TPoint2D | undefined) => void;
};

function LinePreview({
  image,
  points,
  setPoints,
  vectorPoint,
  setVectorPoint,
}: TLinePreview) {
  const divRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const {
    boundaryPoints,
    perpendicularLine,
    handleVectorMouseDown,
    relativePoints,
    addLinePoint,
    onMouseDown,
    deletePoint,
  } = useRoiLineManipulation({
    divRef,
    points,
    setPoints,
    vectorPoint,
    setVectorPoint,
  });

  return (
    <Box
      ref={divRef}
      overflow="hidden"
      onClick={image ? addLinePoint : undefined}
      w="fit-content"
      pos="relative"
    >
      <Image
        ref={imageRef}
        src={image}
        alt="Camera preview"
        objectFit="contain"
        h="full"
      />
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: divRef.current?.getBoundingClientRect().width ?? 0,
          height: divRef.current?.getBoundingClientRect().height ?? 0,
        }}
      >
        {relativePoints.map((point, index) => (
          <RoiPoint
            key={`${index}${point.x}${point.y}`}
            handleMouseDown={onMouseDown}
            point={point}
            handleDeletePoint={deletePoint}
          />
        ))}
        {relativePoints.length === 2 ? (
          <>
            <line
              style={{ stroke: 'red', strokeWidth: 1 }}
              x1={relativePoints[0].x}
              y1={relativePoints[0].y}
              x2={relativePoints[1].x}
              y2={relativePoints[1].y}
            />
            <line
              markerEnd="url(#arrowhead)"
              style={{ stroke: 'red', strokeWidth: 1 }}
              x1={perpendicularLine.end.x}
              y1={perpendicularLine.end.y}
              x2={perpendicularLine.start.x}
              y2={perpendicularLine.start.y}
            />
            <RoiPoint
              handleMouseDown={handleVectorMouseDown}
              point={perpendicularLine.start}
              fill="transparent"
              isArrow
            />
          </>
        ) : null}
        {boundaryPoints.map((point, index) => (
          <RoiPoint
            key={`${index}${point.x}${point.y}`}
            point={point}
            r={4}
            fill="#3182ce"
          />
        ))}
      </svg>
    </Box>
  );
}

export default LinePreview;
