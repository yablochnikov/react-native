import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  color?: string;
}

const ArrowIcon = ({ color = '#06070A' }: IconProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
  >
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m15.436 5-6.873 7 6.873 7"
    />
  </Svg>
);
export default ArrowIcon;
