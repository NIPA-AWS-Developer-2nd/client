declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (element: HTMLElement, options: object) => NaverMap;
        LatLng: new (lat: number, lng: number) => unknown;
        Marker: new (options: object) => unknown;
        Circle: new (options: object) => NaverCircle;
        Position: {
          TOP_RIGHT: string;
        };
      };
    };
  }
}

interface NaverMap {
  setZoom: (zoom: number) => void;
  setCenter: (center: unknown) => void;
}

interface NaverCircle {
  setMap: (map: NaverMap | null) => void;
}

export {};