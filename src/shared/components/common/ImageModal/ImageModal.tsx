import React from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  ModalOverlay,
  ModalContainer,
  ImageContainer,
  Image,
  NavigationButton,
  ImageCounter,
} from "./styles";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onPrevious?: () => void;
  onNext?: () => void;
  showNavigation?: boolean;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onPrevious,
  onNext,
  showNavigation = true,
}) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        if (showNavigation && onPrevious) onPrevious();
        break;
      case 'ArrowRight':
        if (showNavigation && onNext) onNext();
        break;
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasMultipleImages = images.length > 1;
  const shouldShowNavigation = showNavigation && hasMultipleImages && onPrevious && onNext;

  return createPortal(
    <ModalOverlay 
      $show={isOpen} 
      onClick={handleOverlayClick} 
      onKeyDown={handleKeyDown} 
      tabIndex={0}
    >
      <ModalContainer>
        {shouldShowNavigation && (
          <NavigationButton 
            $position="left" 
            onClick={onPrevious}
            disabled={currentIndex === 0}
            aria-label="이전 이미지"
          >
            <ChevronLeft size={28} />
          </NavigationButton>
        )}

        <ImageContainer>
          <Image 
            src={images[currentIndex]} 
            alt={`이미지 ${currentIndex + 1}`}
          />
        </ImageContainer>

        {shouldShowNavigation && (
          <NavigationButton 
            $position="right" 
            onClick={onNext}
            disabled={currentIndex === images.length - 1}
            aria-label="다음 이미지"
          >
            <ChevronRight size={28} />
          </NavigationButton>
        )}

        {hasMultipleImages && (
          <ImageCounter>
            {currentIndex + 1} / {images.length}
          </ImageCounter>
        )}
      </ModalContainer>
    </ModalOverlay>,
    document.body
  );
};