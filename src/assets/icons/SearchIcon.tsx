import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  color?: string;
}

const SearchIcon = ({ color = '#606773' }: IconProps) => (
  <Svg width={27} height={27} fill="none">
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.063 12.881a7.903 7.903 0 1 1 15.806 0 7.903 7.903 0 0 1-15.806 0Zm7.903-9.591a9.59 9.59 0 1 0 6.16 16.942l3.085 3.085a.844.844 0 1 0 1.193-1.193l-3.086-3.085a9.551 9.551 0 0 0 2.238-6.158 9.59 9.59 0 0 0-9.59-9.591Z"
    />
  </Svg>
);

export default SearchIcon;
