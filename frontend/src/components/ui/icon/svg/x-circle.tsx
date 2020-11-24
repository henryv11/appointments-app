import React, { SVGProps } from 'react';

const svgProps: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 256 256',
};

const Icon = ({ color = '#000000', strokeWidth = 16 }: IconProps = {}) => (
  <>
    <rect width='256' height='256' fill='none'></rect>
    <circle
      cx='128'
      cy='128'
      r='96'
      fill='none'
      stroke={color}
      strokeMiterlimit='10'
      strokeWidth={strokeWidth}
    ></circle>
    <line
      x1='160'
      y1='96'
      x2='96'
      y2='160'
      fill='none'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
    ></line>
    <line
      x1='160'
      y1='160'
      x2='96'
      y2='96'
      fill='none'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
    ></line>
  </>
);

export default { svgProps, Icon };

interface IconProps {
  color?: string;
  strokeWidth?: number;
}
