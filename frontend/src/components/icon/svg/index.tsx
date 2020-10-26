import React from 'react';
import test from './test';
import test2 from './test2';

const icons = asIconDescriptors({
  test,
  test2,
});

export default function SvgIcon<T extends IconName>({ name, width, height, size, ...iconProps }: SvgIconProps<T>) {
  const { svgProps, Icon } = icons[name];
  width = width ?? size ?? 64;
  height = height ?? size ?? 64;
  return (
    <svg aria-labelledby='title' width={`${width}px`} height={`${height}px`} {...svgProps}>
      <title id='title'>{`${name} Icon`}</title>
      <Icon {...iconProps} />
    </svg>
  );
}

function asIconDescriptors<T extends Record<string, IconDescriptor<Props>>, Props>(map: { [K in keyof T]: T[K] }) {
  return map;
}

type IconName = keyof typeof icons;

interface IconDescriptor<T> {
  svgProps: React.SVGProps<SVGSVGElement>;
  Icon: (props: T) => JSX.Element;
}

type SvgIconProps<T extends IconName> = {
  name: T;
  width?: number;
  height?: number;
  size?: number;
} & Parameters<typeof icons[T]['Icon']>[0];
