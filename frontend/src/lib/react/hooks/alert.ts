import { createElement } from 'react';
import Alert from '@/components/common/alert';
import { render, unmountComponentAtNode } from 'react-dom';

const root = document.getElementById('root')!;

export function useAlert(opts1?: Partial<AlertProps>) {
  function spawnAlert(opts2?: Partial<AlertProps>) {
    const alertOptions = { ...opts1, ...opts2 };
    const alertElement = createElement(Alert, alertOptions);
    const alertContainer = document.createElement('div');
    alertContainer.style.cssText = `
    position: absolute;
    z-index: 1000;
    width: 500px;
    border: 1px solid black;
    ${getPositionCssText(alertOptions.position)}
    `;
    root.appendChild(alertContainer);
    render(alertElement, alertContainer);
    function unmount() {
      unmountComponentAtNode(alertContainer);
      root.removeChild(alertContainer);
    }
    if (alertOptions.duration) setTimeout(unmount, alertOptions.duration);
  }

  return spawnAlert;
}

interface AlertProps {
  duration: number;
  position: Position;
}

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-middle' | 'bottom-middle';

function getPositionCssText(position: Position = 'top-middle') {
  const [verticalPosition, horizontalPosition] = position.split('-');
  if (horizontalPosition === 'middle')
    return `
        ${verticalPosition}: 1rem;
        left: 0;
        right: 0;
    `;
  return `
    ${verticalPosition}: 1rem;
    ${horizontalPosition}: 1rem;
  `;
}
