import React, { SVGProps } from 'react';

const svgProps: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24',
};

const Icon = ({ fill = 'currentColor', stroke = 'none', strokeWidth = 16 }: SVGProps<SVGPathElement> = {}) => (
  <path
    {...{ fill, stroke, strokeWidth }}
    d='M14.71 6.71a.996.996 0 0 0-1.41 0L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59a.996.996 0 1 0 1.41-1.41L10.83 12l3.88-3.88c.39-.39.38-1.03 0-1.41z'
  />
);

export default { svgProps, Icon };
