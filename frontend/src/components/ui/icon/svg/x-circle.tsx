import React, { SVGProps } from 'react';

const svgProps: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 256 256',
};

const Icon = ({ stroke = 'currentColor', strokeWidth = 16, fill = 'none' }: SVGProps<SVGLineElement> = {}) => {
  const props = { stroke, strokeWidth, fill };
  return (
    <>
      <circle {...props} cx='128' cy='128' r='96' strokeMiterlimit='10'></circle>
      <line {...props} x1='160' y1='96' x2='96' y2='160' strokeLinecap='round' strokeLinejoin='round'></line>
      <line {...props} x1='160' y1='160' x2='96' y2='96' strokeLinecap='round' strokeLinejoin='round'></line>
    </>
  );
};

export default { svgProps, Icon };
