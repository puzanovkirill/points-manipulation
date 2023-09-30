import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  Icon,
  Input,
  Select,
  Stack,
  Text,
  HStack,
} from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import { Info } from 'phosphor-react';
import { ChangeEvent, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomFormLabel } from '../../elements/custom-form-lable.component';

type TInitialValues = {
  name: string;
  points: {
    x: number;
    y: number;
  }[];
  type: string;
  vectorPoint:
    | {
        x: number;
        y: number;
        id?: number | undefined;
      }
    | undefined;
};

type TManageRoiModalFormFields = {
  errors: FormikErrors<TInitialValues>;
  values: TInitialValues;
  handleChange: (e: ChangeEvent<any>) => void;
  handleChangeType: (e: ChangeEvent<HTMLSelectElement>) => void;
  onClose: () => void;
};

function ManageRoiModalFormFields({
  errors,
  values,
  handleChange,
  handleChangeType,
  onClose,
}: TManageRoiModalFormFields) {
  const { t } = useTranslation();

  return (
    <Stack w={368}>
      <FormControl
        display="flex"
        alignItems="flex-start"
        isInvalid={!!errors.name}
      >
        <CustomFormLabel
          label={t('Content.ROIPage.Name')}
          htmlFor="name"
          w={20}
          pt={2}
          minW={20}
        />
        <Box>
          <Input
            name="name"
            value={values.name}
            onChange={handleChange}
            w={72}
            size="sm"
            autoComplete="off"
          />
          <FormErrorMessage>
            {errors.name ? t(`components:errors.${errors.name}`) : null}
          </FormErrorMessage>
        </Box>
      </FormControl>
      <FormControl display="flex" alignItems="flex-start">
        <CustomFormLabel
          label={t('Content.ROIPage.Type')}
          htmlFor="type"
          w={20}
          pt={2}
          minW={20}
        />
        <Select
          name="type"
          onChange={handleChangeType}
          value={values.type}
          size="sm"
        >
          <option value="roi">{t('Content.ROIPage.Region')} *</option>
          <option value="line">{t('Content.ROIPage.Line')} *</option>
        </Select>
      </FormControl>
      {errors.points ? (
        <Text color="red.500" fontSize="sm" pl={20}>
          {t(`components:errors.${errors.points.toString()}`)}
        </Text>
      ) : null}
      <ButtonGroup pt={2} pl={20}>
        <Button type="submit" colorScheme="blue">
          {t('common:Save')}
        </Button>
        <Button onClick={onClose} colorScheme="red">
          {t('common:Cancel')}
        </Button>
      </ButtonGroup>
      <HStack alignItems="flex-start">
        <Icon as={Info} w={6} h={6} color="blue.500" />
        <Text fontStyle="italic" textColor="gray.400" fontSize="sm">
          * {t(`Content.ROIPage.Description.${values.type}`)}
        </Text>
      </HStack>
    </Stack>
  );
}

export default memo(ManageRoiModalFormFields);
