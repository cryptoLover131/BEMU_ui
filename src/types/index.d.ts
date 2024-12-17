interface Window {
    StickyShowcase: (config: {
      data: Array<{
        image: string;
        meta: string;
        title: string;
      }>;
      containerId: string;
      waveOptions: {
        speed: number;
        frequency: number;
        amplitude: number;
      };
    }) => void;
  }
  