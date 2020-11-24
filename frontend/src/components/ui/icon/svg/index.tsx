import React, { CSSProperties } from 'react';
import accountCircle from './account-circle';
import arrowDown from './arrow-down';
import arrowLeft from './arrow-left';
import arrowRight from './arrow-right';
import arrowUp from './arrow-up';
import block from './block';
import checkBox from './check-box';
import checkBoxBlank from './check-box-blank';
import chevronLeft from './chevron-left';
import chevronRight from './chevron-right';
import code from './code';
import coolCar from './cool-car';
import expandLess from './expand-less';
import expandMore from './expand-more';
import flipBoard from './flip-board';
import menu from './menu';
import xCircle from './x-circle';

const icons = asIconMap({
  accountCircle,
  block,
  checkBox,
  checkBoxBlank,
  chevronLeft,
  chevronRight,
  code,
  coolCar,
  expandLess,
  expandMore,
  menu,
  flipBoard,
  arrowUp,
  arrowLeft,
  arrowRight,
  arrowDown,
  xCircle,
});

export default function SvgIcon<Name extends IconName>({
  icon,
  width,
  height,
  size = 24,
  style,
  className,
  onClick,
  ...iconProps
}: SvgIconProps<Name>) {
  const { svgProps, Icon } = icons[icon];
  width = width ?? size;
  height = height ?? size;
  return (
    <svg
      aria-labelledby='icon-title'
      xmlns='http://www.w3.org/2000/svg'
      role='img'
      width={`${width}px`}
      height={`${height}px`}
      className={className}
      style={style}
      onClick={onClick}
      {...svgProps}
    >
      <title id='icon-title'>{`${icon}Icon`}</title>
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

type InferIconProps<
  Name extends IconName,
  Params = Parameters<typeof icons[Name]['Icon']>[0]
> = Params extends undefined ? {} : Params;

type SvgIconProps<Name extends IconName> = {
  icon: Name;
  width?: number;
  height?: number;
  size?: number;
  style?: CSSProperties;
  className?: string;
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
} & InferIconProps<Name>;
