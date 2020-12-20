import React, { SVGProps } from 'react';

const svgProps: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 256 256',
};

const Icon = ({ strokeWidth = 16, fill = 'none', stroke = 'currentColor' }: SVGProps<SVGLineElement> = {}) => (
  <>
    <rect width='256' height='256' fill={fill}></rect>
    <line
      x1='40'
      y1='128'
      x2='216'
      y2='128'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      stroke={stroke}
      strokeWidth={strokeWidth}
    ></line>
    <polyline
      points='144 56 216 128 144 200'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      stroke={stroke}
      strokeWidth={strokeWidth}
    ></polyline>
  </>
);

export default { svgProps, Icon };
