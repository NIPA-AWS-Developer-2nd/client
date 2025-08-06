import { useState, useCallback } from 'react';

interface UseImageModalReturn {
  isOpen: boolean;
  currentIndex: number;
  openModal: (index: number) => void;
  closeModal: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
}

export const useImageModal = (totalImages: number): UseImageModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalImages - 1));
  }, [totalImages]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < totalImages - 1 ? prev + 1 : 0));
  }, [totalImages]);

  return {
    isOpen,
    currentIndex,
    openModal,
    closeModal,
    goToPrevious,
    goToNext,
  };
};