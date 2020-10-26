import React from 'react';
import chevronLeft from './chevron-left';
import chevronRight from './chevron-right';
import code from './code';
import expandLess from './expand-less';
import expandMore from './expand-more';

const icons = asIconDescriptors({
  chevronLeft,
  chevronRight,
  code,
  expandMore,
  expandLess,
});

export default function SvgIcon<T extends IconName>({ icon, width, height, size, ...iconProps }: SvgIconProps<T>) {
  const { svgProps, Icon } = icons[icon];
  width = width ?? size ?? 32;
  height = height ?? size ?? 32;
  return (
    <svg
      aria-labelledby='icon-title'
      xmlns='http://www.w3.org/2000/svg'
      width={`${width}px`}
      height={`${height}px`}
      {...svgProps}
    >
      <title id='icon-title'>{`${icon} Icon`}</title>
      <Icon {...(iconProps as never)} />
    </svg>
  );
}

function asIconDescriptors<T extends Record<string, IconDescriptor<Props>>, Props extends Record<string, unknown>>(
  map: { [K in keyof T]: T[K] },
) {
  return map;
}
interface IconDescriptor<T extends Record<string, unknown>> {
  svgProps: React.SVGProps<SVGSVGElement>;
  Icon: (props?: T) => JSX.Element;
}

type IconName = keyof typeof icons;

type InferIconProps<T extends IconName> = Parameters<typeof icons[T]['Icon']>[0] extends undefined
  ? {}
  : Parameters<typeof icons[T]['Icon']>[0];

type SvgIconProps<T extends IconName> = {
  icon: T;
  width?: number;
  height?: number;
  size?: number;
} & InferIconProps<T>;
