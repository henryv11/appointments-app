import React, { SVGProps } from 'react';

const svgProps: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 256 256',
};

const Icon = ({ fill = 'none', stroke = 'currentColor', strokeWidth = 16 }: SVGProps<SVGPathElement> = {}) => (
  <path
    {...{ fill, stroke, strokeWidth }}
    strokeLinecap='round'
    strokeLinejoin='round'
    d='M215.996 56h-176M104 104v64M152 104v64M199.996 56v152a8 8 0 01-8 8h-128a8 8 0 01-8-8V56M168 56V40a16 16 0 00-16-16h-48a16 16 0 00-16 16v16'
  />
);

export default { svgProps, Icon };
