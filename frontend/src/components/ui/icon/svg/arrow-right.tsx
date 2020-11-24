import React, { SVGProps } from 'react';

const svgProps: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 256 256',
};

const Icon = ({ strokeWidth = 16 }: IconProps = {}) => (
  <>
    <rect width='256' height='256' fill='none'></rect>
    <line
      x1='40'
      y1='128'
      x2='216'
      y2='128'
      fill='none'
      stroke='#000000'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
    ></line>
    <polyline
      points='144 56 216 128 144 200'
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
