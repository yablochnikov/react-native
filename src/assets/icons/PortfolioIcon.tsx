import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface IconProps {
  color?: string;
}

const PortfolioIcon = ({ color = '#606773' }: IconProps) => (
  <Svg
    width={27}
    height={27}
    fill="none"
  >
    <Rect
      width={19.375}
      height={15.069}
      x={5.063}
      y={8.201}
      stroke={color}
      strokeWidth={1.688}
      rx={3.375}
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeWidth={1.8}
      d="M12.596 14.66H16.9"
    />
    <Path
      stroke={color}
      strokeWidth={1.8}
      d="M10.446 7.448v-.98a2.25 2.25 0 0 1 2.25-2.25h4.11a2.25 2.25 0 0 1 2.25 2.25v.98"
    />
  </Svg>
);
export default PortfolioIcon;

