/* eslint-disable react/no-unknown-property */
import {
  Box,
  Button,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { Trash } from 'phosphor-react';
import { memo, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { TPoint2D } from '../../domains/markup';

type TPointContextMenu = {
  point: TPoint2D | undefined;
  handleMouseDown?: (e: MouseEvent<SVGCircleElement>, id?: number) => void;
  handleDeletePoint?: (e: MouseEvent<HTMLButtonElement>, id?: number) => void;
  fill?: string;
  isArrow?: boolean;
  r?: number;
};

function RoiPoint({
  point,
  handleMouseDown,
  handleDeletePoint,
  fill = '#C53030',
  r = 10,
  isArrow,
}: TPointContextMenu) {
  const { t } = useTranslation('common');
  const { onOpen, onClose, isOpen } = useDisclosure();

  if (!point) return null;

  const handleContextMenuOpen = (e: MouseEvent<SVGCircleElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (handleDeletePoint) onOpen();
  };

  const handleClick = (e: MouseEvent<SVGCircleElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>, id?: number) => {
    if (handleDeletePoint) handleDeletePoint(e, id);
    onClose();
  };

  return (
    <Popover onClose={onClose} isOpen={isOpen}>
      <PopoverTrigger>
        <g>
          {isArrow ? (
            <defs>
              <marker
                id="arrowhead"
                markerWidth="20"
                markerHeight="14"
                refX="10"
                refY="6"
                orient="auto"
                fill="red"
              >
                <polygon points="0 0, 20 5, 0 12" />
              </marker>
            </defs>
          ) : null}
          <circle
            cx={point.x}
            cy={point.y}
            fill={fill}
            r={r}
            onMouseDown={(e) => {
              if (handleMouseDown) handleMouseDown(e, point.id);
            }}
            onContextMenu={handleContextMenuOpen}
            style={{ cursor: handleMouseDown ? 'pointer' : 'default' }}
            onClick={handleClick}
          />
        </g>
      </PopoverTrigger>
      <Portal>
        <Box
          h="100vh"
          w="100vw"
          zIndex="popover"
          pos="absolute"
          top={0}
          left={0}
          visibility={isOpen ? 'visible' : 'hidden'}
        >
          <PopoverContent w={32}>
            <PopoverArrow />
            <PopoverBody>
              <Button
                w="full"
                onClick={(e) => handleDeleteClick(e, point.id)}
                colorScheme="red"
                variant="outline"
                leftIcon={<Icon as={Trash} w={5} h={5} />}
                borderWidth={0}
              >
                {t('Delete')}
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Box>
      </Portal>
    </Popover>
  );
}

export default memo(RoiPoint);
