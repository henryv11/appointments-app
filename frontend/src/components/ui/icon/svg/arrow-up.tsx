import React, { SVGProps } from 'react';

const svgProps: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 256 256',
};

const Icon = ({ strokeWidth = 16 }: IconProps = {}) => (
  <>
    <rect width='256' height='256' fill='none'></rect>
    <line
      x1='128'
      y1='216'
      x2='128'
      y2='40'
      fill='none'
      stroke='#000000'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
    ></line>
    <polyline
      points='56 112 128 40 200 112'
      fill='none'
      stroke='#000000'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
    ></polyline>
  </>
);

export default { svgProps, Icon };

interface IconProps {
  strokeWidth?: number;
}
