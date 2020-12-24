import React, { SVGProps } from 'react';

const svgProps: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 256 256',
};

const Icon = ({ fill = 'none', stroke = 'currentColor', strokeWidth = 16 }: SVGProps<SVGPathElement> = {}) => (
  <>
    <circle cx='128' cy='128' r='96' fill={fill} stroke={stroke} strokeMiterlimit='10' strokeWidth={strokeWidth} />
    <path
      fill={fill}
      stroke={stroke}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
      d='M88 128h80M128 88v80'
    />
  </>
);

export default { svgProps, Icon };
