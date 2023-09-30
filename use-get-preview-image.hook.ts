import { useReactiveVar } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { agentStatusReactive } from '../../../layouts';
import { CameraStatuses } from '../../camera';

const useGetPreviewImage = (cameraId: string) => {
  const [image, setImage] = useState<string | undefined>(undefined);

  const agentStatus = useReactiveVar(agentStatusReactive);
  const camera =
    agentStatus && agentStatus.status && agentStatus.status.stream_sources
      ? agentStatus.status.stream_sources.find(
          (item) => item.ColorSource.uuid === cameraId
        )
      : undefined;

  const cameraStatusCode = camera ? camera.ColorSource.status.code : 0;
  const isCameraRunning = cameraStatusCode === CameraStatuses.ACTIVE;

  function handleOnMessage(event: MessageEvent<string>) {
    setImage(`data:image/jpeg;base64,${event.data}`);
  }

  const handleOneMessageMemoized = useCallback(handleOnMessage, []);

  useEffect(() => {
    if (!isCameraRunning) {
      return undefined;
    }

    const newStream = new EventSource(`/preview_image/sse/${cameraId}`);
    newStream.onmessage = handleOneMessageMemoized;

    return () => {
      newStream.close();
    };
  }, [handleOneMessageMemoized, isCameraRunning, cameraId]);

  return { image };
};

export { useGetPreviewImage };
