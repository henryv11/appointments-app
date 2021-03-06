import React, { SVGProps } from 'react';

const svgProps: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24',
};

const Icon = ({ fill = 'currentColor', stroke = 'none', strokeWidth = 16 }: SVGProps<SVGPathElement> = {}) => (
  <path
    {...{ fill, stroke, strokeWidth }}
    d='M9.29 6.71a.996.996 0 0 0 0 1.41L13.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z'
  />
);

export default { svgProps, Icon };
