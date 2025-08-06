import styled from "styled-components";

export const ModalOverlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  visibility: ${({ $show }) => ($show ? "visible" : "hidden")};
  transition: all 0.3s ease;
  padding: 20px;

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export const ModalContainer = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CloseButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1101;

  &:hover {
    color: rgba(255, 255, 255, 0.7);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
  }
`;

export const NavigationButton = styled.button<{ 
  $position: 'left' | 'right';
  disabled: boolean;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $position }) => $position}: -100px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border: none;
  background: ${({ disabled }) => disabled 
    ? 'rgba(0, 0, 0, 0.3)' 
    : 'rgba(0, 0, 0, 0.6)'
  };
  color: white;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  z-index: 1101;
  border-radius: 50%;
  backdrop-filter: blur(4px);
  
  /* 활성화된 버튼은 더 잘 보이게 */
  opacity: ${({ disabled }) => disabled ? 0.4 : 1};
  
  /* 그림자 추가로 가시성 향상 */
  box-shadow: ${({ disabled }) => disabled 
    ? '0 2px 8px rgba(0, 0, 0, 0.1)'
    : '0 4px 12px rgba(0, 0, 0, 0.3)'
  };

  /* 데스크톱에서만 호버 효과 */
  @media (hover: hover) and (pointer: fine) {
    &:hover:not(:disabled) {
      background: rgba(0, 0, 0, 0.8);
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    }
  }

  /* 활성 상태 (클릭) */
  &:active:not(:disabled) {
    transform: translateY(-50%) scale(0.95);
  }

  @media (max-width: 768px) {
    ${({ $position }) => $position}: 10px;
    width: 44px;
    height: 44px;
    background: ${({ disabled }) => disabled 
      ? 'rgba(0, 0, 0, 0.2)' 
      : 'rgba(0, 0, 0, 0.5)'
    };
  }

  @media (max-width: 480px) {
    ${({ $position }) => $position}: 5px;
    width: 40px;
    height: 40px;
  }
  
  /* 포커스 아웃라인 제거 */
  &:focus {
    outline: none;
    box-shadow: ${({ disabled }) => disabled 
      ? '0 2px 8px rgba(0, 0, 0, 0.1)'
      : '0 4px 12px rgba(0, 0, 0, 0.3)'
    };
  }
`;

export const ImageContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  max-height: 100%;
`;

export const Image = styled.img`
  max-width: 100%;
  max-height: calc(90vh - 100px);
  width: auto;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  object-fit: contain;

  @media (max-width: 768px) {
    max-height: calc(90vh - 80px);
    border-radius: 8px;
  }
`;

export const ImageTitle = styled.div`
  margin-top: 16px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 14px;
  font-weight: 500;
  border-radius: 20px;
  text-align: center;
  max-width: 300px;

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px 12px;
    margin-top: 12px;
    max-width: 250px;
  }
  
  /* 포커스 아웃라인 제거 */
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export const ImageCounter = styled.div`
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 14px;
  font-weight: 500;
  border-radius: 20px;
  text-align: center;

  @media (max-width: 768px) {
    bottom: 20px;
    font-size: 12px;
    padding: 6px 12px;
  }
`;