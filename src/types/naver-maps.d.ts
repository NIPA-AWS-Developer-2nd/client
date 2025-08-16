declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (element: HTMLElement, options: object) => unknown;
        LatLng: new (lat: number, lng: number) => unknown;
        Marker: new (options: object) => unknown;
        Circle: new (options: object) => unknown;
        Position: {
          TOP_RIGHT: string;
        };
      };
    };
  }
}

export {};