import React from 'react';
import accountCircle from './account-circle';
import block from './block';
import checkBox from './check-box';
import checkBoxBlank from './check-box-blank';
import chevronLeft from './chevron-left';
import chevronRight from './chevron-right';
import code from './code';
import expandLess from './expand-less';
import expandMore from './expand-more';
import menu from './menu';

const icons = asIconMap({
  accountCircle,
  block,
  checkBox,
  checkBoxBlank,
  chevronLeft,
  chevronRight,
  code,
  expandLess,
  expandMore,
  menu,
});

export default function SvgIcon<Name extends IconName>({
  icon,
  width,
  height,
  size = 32,
  ...iconProps
}: SvgIconProps<Name>) {
  const { svgProps, Icon } = icons[icon];
  width = width ?? size;
  height = height ?? size;
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

function asIconMap<IconsObject extends Record<string, IconDescriptor<Props>>, Props extends Record<string, unknown>>(
  map: { [Key in keyof IconsObject]: IconsObject[Key] },
) {
  return map;
}
interface IconDescriptor<IconProps extends Record<string, unknown>> {
  svgProps: React.SVGProps<SVGSVGElement>;
  Icon: (props?: IconProps) => JSX.Element;
}

type IconName = keyof typeof icons;

type InferIconProps<Name extends IconName> = Parameters<typeof icons[Name]['Icon']>[0] extends undefined
  ? {}
  : Parameters<typeof icons[Name]['Icon']>[0];

type SvgIconProps<Name extends IconName> = {
  icon: Name;
  width?: number;
  height?: number;
  size?: number;
} & InferIconProps<Name>;
