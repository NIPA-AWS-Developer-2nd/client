// Main Component
export { InstallPrompt } from './InstallPrompt';

// Platform-specific Prompts
export { WindowsDesktopPrompt } from './components/WindowsDesktopPrompt';
export { MacOSDesktopPrompt } from './components/MacOSDesktopPrompt';
export { AndroidPrompt } from './components/AndroidPrompt';
export { IOSPrompt } from './components/IOSPrompt';

// Modals and Guides
export { InstallGuideModal } from './modals/InstallGuideModal';
export { BrowserInstallGuide } from './modals/BrowserInstallGuide';
export { SafariRedirectGuide } from './modals/SafariRedirectGuide';

// Styles
export * from './utils/styles';