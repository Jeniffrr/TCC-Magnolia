interface TooltipConfig {
  activator: HTMLElement;
  placement: string;
  textTooltip: string;
}

declare class Tooltip {
  component: HTMLElement;
  popperInstance: {
    destroy: () => void;
  };
  
  constructor(config: TooltipConfig);
}

export default Tooltip;