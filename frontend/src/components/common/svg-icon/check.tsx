import React, { SVGProps } from 'react';

const svgProps: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 256 256',
};

const Icon = ({
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = 16,
}: React.SVGProps<SVGPolylineElement> = {}) => (
  <polyline
    {...{ fill, stroke, strokeWidth }}
    points='216 72.005 104 184 48 128.005'
    strokeLinecap='round'
    strokeLinejoin='round'
  ></polyline>
);

export default { svgProps, Icon };
