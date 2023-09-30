/* eslint-disable no-nested-ternary */
import { Flex, HStack, Skeleton } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { ChangeEvent, useCallback } from 'react';
import { ValidationSchemas } from '../../consts';
import { TROIRegion } from '../../domains/configs';
import { TPoint2D, useGetPreviewImage } from '../../domains/markup';
import LinePreview from './line-preview.component';
import ManageRoiModalFormFields from './manage-roi-modal-form-fields.component';
import RegionPreview from './region-preview.component';

type TManageRoiModalForm = {
  cameraId: string;
  onClose: () => void;
  handleAddNewRegion?: (newRegion: TROIRegion) => void;
  handleUpdateSelectedRegion?: (newRegion: TROIRegion) => void;
  selectedRegion: TROIRegion | undefined;
};

function ManageRoiModalForm({
  cameraId,
  onClose,
  handleAddNewRegion,
  selectedRegion,
  handleUpdateSelectedRegion,
}: TManageRoiModalForm) {
  const { image } = useGetPreviewImage(cameraId);

  const formik = useFormik({
    initialValues: {
      name: selectedRegion?.name ? selectedRegion.name : '',
      points: selectedRegion?.points.length
        ? selectedRegion.points
        : ([] as TPoint2D[]),
      type: selectedRegion?.trigger_settings ? 'line' : 'roi',
      vectorPoint: selectedRegion?.trigger_settings?.direction,
    },
    validationSchema: ValidationSchemas.CREATE_ROI,
    onSubmit: (values) => {
      if (selectedRegion && handleUpdateSelectedRegion)
        handleUpdateSelectedRegion(values);
      else {
        const newRegion: TROIRegion = {
          name: values.name,
          points: values.points.map(({ x, y }) => ({ x, y })),
          trigger_settings:
            values.type === 'line' && values.vectorPoint
              ? {
                  direction: values.vectorPoint,
                  is_roi: false,
                }
              : undefined,
        };

        if (handleAddNewRegion) handleAddNewRegion(newRegion);
      }
      onClose();
    },
  });

  const handleChangeType = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    formik.setFieldValue('points', []);
    formik.setFieldValue('vectorPoint', undefined);
    formik.setFieldValue('type', e.target.value);
  }, []);

  const handleSetPoints = useCallback((newPoints: TPoint2D[]) => {
    formik.setFieldValue('points', newPoints);
  }, []);

  const handleSetVectorPoint = useCallback((vector: TPoint2D | undefined) => {
    formik.setFieldValue('vectorPoint', vector);
  }, []);

  return (
    <form onSubmit={formik.handleSubmit} style={{ height: '100%' }}>
      <Flex gap={2} flexDirection="column" h="full">
        <HStack alignItems="flex-start">
          <ManageRoiModalFormFields
            errors={formik.errors}
            values={formik.values}
            handleChange={formik.handleChange}
            handleChangeType={handleChangeType}
            onClose={onClose}
          />
          {image ? (
            formik.values.type === 'line' ? (
              <LinePreview
                image={image}
                points={formik.values.points}
                setPoints={handleSetPoints}
                vectorPoint={formik.values.vectorPoint}
                setVectorPoint={handleSetVectorPoint}
              />
            ) : (
              <RegionPreview
                points={formik.values.points}
                setPoints={handleSetPoints}
                image={image}
              />
            )
          ) : (
            <Skeleton w={900} h={400} />
          )}
        </HStack>
      </Flex>
    </form>
  );
}

export default ManageRoiModalForm;
