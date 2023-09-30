import {
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { Plus } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { TROIRegion } from '../../domains/configs';
import ManageRoiModalForm from './manage-roi-modal-form.component';

type TManageRoiModal = {
  isOpen: boolean;
  onClose: () => void;
  cameraId: string;
  handleAddNewRegion?: (newRegion: TROIRegion) => void;
  handleUpdateSelectedRegion?: (newRegion: TROIRegion) => void;
  selectedRegion?: TROIRegion;
};

function ManageRoiModal({
  isOpen,
  onClose,
  cameraId,
  handleAddNewRegion,
  selectedRegion,
  handleUpdateSelectedRegion,
}: TManageRoiModal) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" closeOnEsc={false}>
      <ModalOverlay />
      <ModalContent overflow="auto" h="full">
        <ModalCloseButton right="2" />
        <ModalHeader>
          <HStack alignItems="center">
            <Icon as={Plus} w={8} h={8} />
            <Text>
              {t(
                `Content.ROIPage.${
                  !selectedRegion ? 'ROICreation' : 'ROIUpdating'
                }`
              )}
            </Text>
          </HStack>
        </ModalHeader>
        <ModalBody pt={0} px={6} h="calc(100% - 64px)">
          <ManageRoiModalForm
            cameraId={cameraId}
            onClose={onClose}
            handleAddNewRegion={handleAddNewRegion}
            selectedRegion={selectedRegion}
            handleUpdateSelectedRegion={handleUpdateSelectedRegion}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ManageRoiModal;
