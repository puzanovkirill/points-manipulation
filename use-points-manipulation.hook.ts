import {
  MouseEvent as ReactMouseEvent,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { TLine2D, TPoint2D } from '../types';

type TUsePointsManipulation = {
  points?: TPoint2D[];
  setPoints?: (points: TPoint2D[]) => void;
  divRef: RefObject<HTMLDivElement>;
};

const usePointsManipulation = ({
  setPoints,
  divRef,
  points,
}: TUsePointsManipulation) => {
  const clientRect = divRef.current?.getBoundingClientRect();
  const [relativePoints, setRelativePoints] = useState<TPoint2D[]>(
    points?.map((point) => ({
      id: point.x * point.y,
      x: point.x * (clientRect?.width ?? 1),
      y: point.y * (clientRect?.height ?? 1),
    })) ?? []
  );
  const [lines, setLines] = useState<TLine2D[]>([]);

  const addPoint = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (clientRect) {
      const cursorPosition = {
        x: e.pageX - clientRect.left,
        y: e.pageY - clientRect.top,
      };

      setRelativePoints([
        ...relativePoints,
        {
          id: cursorPosition.x * cursorPosition.y,
          x: cursorPosition.x,
          y: cursorPosition.y,
        },
      ]);
      if (setPoints && points)
        setPoints([
          ...points,
          {
            x: cursorPosition.x / clientRect.width,
            y: cursorPosition.y / clientRect.height,
          },
        ]);
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

        if (setPoints)
          setPoints([
            ...filteredPoints.map((point) => ({
              x: point.x / clientRect.width,
              y: point.y / clientRect.height,
            })),
          ]);
      }
    },
    [clientRect?.height, clientRect?.width, relativePoints, setPoints]
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

        if (setPoints)
          setPoints([
            ...relativePoints.map((point) =>
              point.id !== id
                ? {
                    x: point.x / clientRect.width,
                    y: point.y / clientRect.height,
                  }
                : { x: x / clientRect.width, y: y / clientRect.height }
            ),
          ]);
      }
    },
    [clientRect?.height, clientRect?.width, relativePoints, setPoints]
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

  const groupPointsCoordinates = useCallback(() => {
    const coordinates = [];
    for (let i = 0; i < relativePoints.length - 1; i += 1) {
      coordinates.push({
        x1: relativePoints[i].x,
        y1: relativePoints[i].y,
        x2: relativePoints[i + 1].x,
        y2: relativePoints[i + 1].y,
      });
    }

    setLines(coordinates);
  }, [relativePoints]);

  useEffect(() => {
    if (relativePoints.length > 1) groupPointsCoordinates();
  }, [groupPointsCoordinates, relativePoints]);

  useEffect(() => {
    if (clientRect?.height && clientRect?.width && points) {
      setRelativePoints(
        points.map((point) => ({
          id: point.x * point.y,
          x: point.x * (clientRect?.width ?? 0),
          y: point.y * (clientRect?.height ?? 0),
        }))
      );
    }
    groupPointsCoordinates();
  }, [clientRect?.height, clientRect?.width]);

  return {
    setRelativePoints,
    relativePoints,
    lines,
    addPoint,
    deletePoint,
    onMouseDown,
  };
};

export { usePointsManipulation };
