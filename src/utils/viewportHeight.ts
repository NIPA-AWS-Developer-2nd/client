// iOS Safari 뷰포트 높이 문제 해결을 위한 유틸리티

export class ViewportHeightManager {
  private static instance: ViewportHeightManager;
  private lastHeight: number = 0;

  private constructor() {
    this.init();
  }

  public static getInstance(): ViewportHeightManager {
    if (!ViewportHeightManager.instance) {
      ViewportHeightManager.instance = new ViewportHeightManager();
    }
    return ViewportHeightManager.instance;
  }

  private init(): void {
    this.setVH();
    this.setupEventListeners();
  }

  private setVH(): void {
    // 실제 뷰포트 높이 계산 (iOS Safari 대응)
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    // 디바운스를 위해 높이 변화 감지
    if (Math.abs(window.innerHeight - this.lastHeight) > 100) {
      this.lastHeight = window.innerHeight;
    }
  }

  private setupEventListeners(): void {
    // 리사이즈 이벤트 (데스크톱/태블릿 회전)
    window.addEventListener("resize", () => {
      this.setVH();
    });

    // iOS Safari에서 주소표시줄 변화 감지
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        this.setVH();
      }, 100);
    });

    // 뷰포트 변화 감지 (iOS 전용)
    if (this.isIOS()) {
      window.visualViewport?.addEventListener("resize", () => {
        this.setVH();
      });

      // 스크롤 이벤트로 주소표시줄 변화 감지
      let scrollTimeout: number;
      window.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = window.setTimeout(() => {
          this.setVH();
        }, 150);
      });
    }
  }

  private isIOS(): boolean {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );
  }

  // 현재 실제 뷰포트 높이 반환
  public getCurrentHeight(): number {
    return window.innerHeight;
  }

  // Safe area inset 정보 반환
  public getSafeAreaInsets() {
    const computedStyle = getComputedStyle(document.documentElement);
    return {
      top: computedStyle.getPropertyValue("env(safe-area-inset-top)") || "0px",
      bottom:
        computedStyle.getPropertyValue("env(safe-area-inset-bottom)") || "0px",
      left:
        computedStyle.getPropertyValue("env(safe-area-inset-left)") || "0px",
      right:
        computedStyle.getPropertyValue("env(safe-area-inset-right)") || "0px",
    };
  }
}

// 싱글톤 인스턴스 초기화
export const viewportManager = ViewportHeightManager.getInstance();
