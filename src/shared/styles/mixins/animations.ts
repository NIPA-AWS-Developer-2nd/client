import { css, keyframes } from 'styled-components';

// Keyframes
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const slideInUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const slideInDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const scaleIn = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

export const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Animation mixins
export const animations = {
  fadeIn: (duration = '0.2s') => css`
    animation: ${fadeIn} ${duration} ease-in-out;
  `,
  
  fadeOut: (duration = '0.2s') => css`
    animation: ${fadeOut} ${duration} ease-in-out;
  `,
  
  slideInUp: (duration = '0.3s') => css`
    animation: ${slideInUp} ${duration} ease-out;
  `,
  
  slideInDown: (duration = '0.3s') => css`
    animation: ${slideInDown} ${duration} ease-out;
  `,
  
  slideInLeft: (duration = '0.3s') => css`
    animation: ${slideInLeft} ${duration} ease-out;
  `,
  
  slideInRight: (duration = '0.3s') => css`
    animation: ${slideInRight} ${duration} ease-out;
  `,
  
  scaleIn: (duration = '0.2s') => css`
    animation: ${scaleIn} ${duration} ease-out;
  `,
  
  pulse: (duration = '2s') => css`
    animation: ${pulse} ${duration} ease-in-out infinite;
  `,
  
  spin: (duration = '1s') => css`
    animation: ${spin} ${duration} linear infinite;
  `,
  
  // Transition utilities
  transition: {
    fast: css`
      transition: all 0.15s ease-in-out;
    `,
    normal: css`
      transition: all 0.2s ease-in-out;
    `,
    slow: css`
      transition: all 0.3s ease-in-out;
    `,
  },
};