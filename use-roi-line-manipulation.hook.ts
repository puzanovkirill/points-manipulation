import {
  MouseEvent as ReactMouseEvent,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { getRelativeQuadrilateralMidline, getScalarProduct } from '../helpers';
import { TPoint2D } from '../types';
import { useGetPerpendicularLine } from './use-get-perpendicular-line.hook';

type TUseRoiLineManipulation = {
  points: TPoint2D[];
  setPoints: (points: TPoint2D[]) => void;
  divRef: RefObject<HTMLDivElement>;
  vectorPoint: TPoint2D | undefined;
  setVectorPoint: (vector: TPoint2D | undefined) => void;
};

const useRoiLineManipulation = ({
  points,
  setPoints,
  divRef,
  vectorPoint,
  setVectorPoint,
}: TUseRoiLineManipulation) => {
  const clientRect = divRef.current?.getBoundingClientRect();
  const [relativePoints, setRelativePoints] = useState<TPoint2D[]>([]);

  const { normalizedVector, lineLength, perpendicularLine, setLineLength } =
    useGetPerpendicularLine(relativePoints);

  // Точки "ковра"
  const [boundaryPoints, setBoundaryPoints] = useState<TPoint2D[]>([]);

  const onVectorMouseMove = useCallback(
    (e: MouseEvent, clickX: number, clickY: number) => {
      if (clientRect) {
        const cursorPosition = {
          x: e.pageX - clientRect.left,
          y: e.pageY - clientRect.top,
        };
        let { x, y } = cursorPosition;

        if (cursorPosition.x < 10) x = 10;
        else if (cursorPosition.x > clientRect.width - 10)
          x = clientRect.width - 10;

        if (cursorPosition.y < 10) y = 10;
        else if (cursorPosition.y > clientRect.height - 10)
          y = clientRect.height - 10;

        const scalarValue = getScalarProduct(
          { x: normalizedVector.x, y: normalizedVector.y },
          { x: x - clickX, y: y - clickY }
        );

        if (lineLength + scalarValue <= 5) return;

        setLineLength(lineLength + scalarValue);
        setVectorPoint({
          x: perpendicularLine.start.x / clientRect.width,
          y: perpendicularLine.start.y / clientRect.height,
        });
      }
    },
    [
      clientRect?.height,
      clientRect?.width,
      lineLength,
      normalizedVector.x,
      normalizedVector.y,
      perpendicularLine.start.x,
      perpendicularLine.start.y,
      setLineLength,
      setVectorPoint,
    ]
  );

  const handleVectorMouseDown = useCallback(
    (e: ReactMouseEvent<SVGCircleElement>) => {
      if (e.button !== 0) return;
      if (clientRect) {
        const x = e.pageX - clientRect.left;
        const y = e.pageY - clientRect.top;

        const handleMouseMove = (event: MouseEvent) => {
          onVectorMouseMove(event, x, y);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.onmouseup = null;
        });
      }
    },
    [clientRect?.height, clientRect?.width, onVectorMouseMove]
  );

  const addLinePoint = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (clientRect) {
      const cursorPosition = {
        x: e.pageX - clientRect.left,
        y: e.pageY - clientRect.top,
      };

      if (relativePoints.length < 2) {
        setRelativePoints([
          ...relativePoints,
          {
            id: cursorPosition.x * cursorPosition.y,
            x: cursorPosition.x,
            y: cursorPosition.y,
          },
        ]);
        setPoints([
          ...points,
          {
            x: cursorPosition.x / clientRect.width,
            y: cursorPosition.y / clientRect.height,
          },
        ]);
      }
    }
  };

  const deletePoint = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement>, id?: number) => {
      e.stopPropagation();
      e.preventDefault();
      if (id && clientRect) {
        const filteredPoints = relativePoints.filter(
          (point) => point.id !== id
        );

        setRelativePoints(filteredPoints);
      }
    },
    [clientRect?.height, clientRect?.width, relativePoints]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent, id?: number) => {
      if (clientRect && id) {
        const cursorPosition = {
          x: e.pageX - clientRect.left,
          y: e.pageY - clientRect.top,
        };
        let { x, y } = cursorPosition;

        if (cursorPosition.x < 0) x = 0;
        else if (cursorPosition.x > clientRect.width) x = clientRect.width;

        if (cursorPosition.y < 0) y = 0;
        else if (cursorPosition.y > clientRect.height) y = clientRect.height;

        setRelativePoints([
          ...relativePoints.map((point) =>
            point.id !== id ? point : { id, x, y }
          ),
        ]);
      }
    },
    [clientRect?.height, clientRect?.width, relativePoints]
  );

  const onMouseDown = useCallback(
    (e: ReactMouseEvent<SVGCircleElement>, id?: number) => {
      if (e.button !== 0) return;
      if (clientRect && id) {
        const handleMouseMove = (event: MouseEvent) => {
          onMouseMove(event, id);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.onmouseup = null;
        });
      }
    },
    [clientRect?.height, clientRect?.width, onMouseMove]
  );

  useEffect(() => {
    if (clientRect && points.length === 4)
      setRelativePoints(getRelativeQuadrilateralMidline(points, clientRect));
  }, [clientRect?.width, clientRect?.height]);

  useEffect(() => {
    if (relativePoints.length === 2 && perpendicularLine.start && clientRect) {
      if (!vectorPoint) setLineLength(75);

      setVectorPoint({
        x: perpendicularLine.start.x / clientRect.width,
        y: perpendicularLine.start.y / clientRect.height,
      });

      setBoundaryPoints([
        {
          x: relativePoints[0].x + normalizedVector.x * lineLength,
          y: relativePoints[0].y + normalizedVector.y * lineLength,
        },
        {
          x: relativePoints[1].x + normalizedVector.x * lineLength,
          y: relativePoints[1].y + normalizedVector.y * lineLength,
        },
        {
          x: relativePoints[1].x - normalizedVector.x * lineLength,
          y: relativePoints[1].y - normalizedVector.y * lineLength,
        },
        {
          x: relativePoints[0].x - normalizedVector.x * lineLength,
          y: relativePoints[0].y - normalizedVector.y * lineLength,
        },
      ]);
    }
  }, [relativePoints, lineLength]);

  useEffect(() => {
    if (clientRect)
      setPoints(
        boundaryPoints.map((point) => ({
          x: point.x / clientRect.width,
          y: point.y / clientRect.height,
        }))
      );
  }, [boundaryPoints]);

  useEffect(() => {
    if (lineLength === 0 && clientRect && points.length === 4) {
      const relativeBoundaryPoints = points.map((point) => ({
        x: point.x * clientRect.width,
        y: point.y * clientRect.height,
      }));

      const newLength =
        Math.sqrt(
          (relativeBoundaryPoints[0].x - relativeBoundaryPoints[3].x) ** 2 +
            (relativeBoundaryPoints[0].y - relativeBoundaryPoints[3].y) ** 2
        ) / 2;

      setLineLength(newLength);
    }
  }, [vectorPoint, clientRect?.width, clientRect?.height]);

  return {
    perpendicularLine,
    boundaryPoints,
    handleVectorMouseDown,
    relativePoints,
    addLinePoint,
    onMouseDown,
    deletePoint,
  };
};

export { useRoiLineManipulation };
