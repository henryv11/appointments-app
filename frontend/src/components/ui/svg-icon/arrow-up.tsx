import React, { SVGProps } from 'react';

const svgProps: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 256 256',
};

const Icon = ({ strokeWidth = 16, fill = 'none', stroke = 'currentColor' }: SVGProps<SVGLineElement> = {}) => (
  <>
    <rect width='256' height='256' fill={fill}></rect>
    <line
      x1='128'
      y1='216'
      x2='128'
      y2='40'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      stroke={stroke}
      strokeWidth={strokeWidth}
    ></line>
    <polyline
      points='56 112 128 40 200 112'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      stroke={stroke}
      strokeWidth={strokeWidth}
    ></polyline>
  </>
);

export default { svgProps, Icon };
