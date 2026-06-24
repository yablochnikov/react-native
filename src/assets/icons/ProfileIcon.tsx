import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  color?: string;
}

const ProfileIcon = ({ color = '#606773' }: IconProps) => (
  <Svg width={27} height={27} fill="none">
    <Path
      d="m4.412 23.132.12-.772c.239-1.534 1.161-2.89 2.61-3.446 1.578-.605 3.832-1.256 6.228-1.256s4.649.65 6.227 1.256c1.45.557 2.371 1.912 2.61 3.446l.12.772"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6875}
    />
    <Path
      d="M13.369 13.679a4.976 4.976 0 1 0 0-9.953 4.976 4.976 0 0 0 0 9.953Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6875}
    />
  </Svg>
);

export default ProfileIcon;
