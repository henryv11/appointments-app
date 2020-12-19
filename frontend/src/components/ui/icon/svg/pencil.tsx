import React, { SVGProps } from 'react';

const svgProps: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 256 256',
};

const Icon = ({ fill = 'none', stroke = 'currentColor', strokeWidth = 16 }: SVGProps<SVGPathElement> = {}) => (
  <path
    {...{ fill, stroke, strokeWidth }}
    strokeLinecap='round'
    strokeLinejoin='round'
    d='M92.686 216H48a8 8 0 01-8-8v-44.686a8 8 0 012.343-5.657l120-120a8 8 0 0111.314 0l44.686 44.686a8 8 0 010 11.314l-120 120A8 8 0 0192.686 216zM136 64l56 56M95.489 215.489l-54.98-54.98'
  />
);

export default { svgProps, Icon };
