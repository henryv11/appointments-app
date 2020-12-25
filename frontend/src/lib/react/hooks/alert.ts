import { createElement } from 'react';
import Alert, { AlertProps } from '@/components/common/alert';
import { render, unmountComponentAtNode } from 'react-dom';

const root = document.getElementById('root')!;

export function useAlert(opts1?: Partial<AlertOptions>) {
  function spawnAlert(opts2?: Partial<AlertOptions>) {
    const { duration, ...alertOptions } = { ...opts1, ...opts2 };
    const alertElement = createElement(Alert, alertOptions);
    const alertContainer = document.createElement('div');
    alertContainer.style.cssText = `position: absolute;
                                    z-index: 1000;
                                    width: 500px;
                                    // border: 1px solid black;
                                    ${getPositionCssText(alertOptions.position)}`;
    root.appendChild(alertContainer);
    render(alertElement, alertContainer);
    function unmount() {
      unmountComponentAtNode(alertContainer);
      root.removeChild(alertContainer);
    }
    if (duration) setTimeout(unmount, duration);
  }

  return spawnAlert;
}

function getPositionCssText(position: Position = 'top-middle') {
  const [verticalPosition, horizontalPosition] = position.split('-');
  if (horizontalPosition === 'middle')
    return `${verticalPosition}: 1rem;
            left: 0;
            right: 0;
            margin: 0 auto;`;
  return `${verticalPosition}: 1rem;
          ${horizontalPosition}: 1rem;`;
}

interface AlertOptions extends AlertProps {
  duration: number;
  position: Position;
}

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-middle' | 'bottom-middle';
