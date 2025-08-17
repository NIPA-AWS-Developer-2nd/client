import React from "react";
import { Modal } from "../Modal";
import { Button } from "../Button";
import { FaBell } from "react-icons/fa";
import {
  NotificationIcon,
  ModalContent,
  Title,
  Description,
  FeatureList,
  FeatureItem,
  ButtonContainer,
} from "./NotificationPermissionModal.styles";

interface NotificationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

export const NotificationPermissionModal: React.FC<
  NotificationPermissionModalProps
> = ({ isOpen, onClose, onAccept, onDecline }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      maxWidth="400px"
    >
      <ModalContent>
        <NotificationIcon>
          <FaBell />
        </NotificationIcon>
        <Title>번개 소식을 놓치지 마세요!</Title>
        <Description>
          번개 모임, 채팅, 미션 업데이트 등 서비스의 <br />
          중요한 알림을 받으려면 푸시 알림 허용이 필요해요.
        </Description>

        <FeatureList>
          <FeatureItem>• 새로운 채팅 메시지 실시간 알림</FeatureItem>
          <FeatureItem>• 미션 생성 및 업데이트 소식</FeatureItem>
          <FeatureItem>• 미팅 일정 및 참여 안내</FeatureItem>
          <FeatureItem>• 보상 지급 등 다양한 혜택 알림</FeatureItem>
        </FeatureList>

        <ButtonContainer>
          <Button variant="outline" onClick={onDecline}>
            나중에
          </Button>
          <Button variant="primary" onClick={onAccept}>
            알림 허용
          </Button>
        </ButtonContainer>
      </ModalContent>
    </Modal>
  );
};
