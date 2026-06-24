import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SignUpIcon = () => (
  <Svg width={24} height={26} fill="none">
    <Path
      d="m3 21.523.135-.937c.175-1.204.872-2.28 1.994-2.754 1.305-.55 3.218-1.165 5.256-1.165 2.037 0 3.95.615 5.255 1.165 1.122.474 1.82 1.55 1.994 2.754l.135.937"
      stroke="#00A385"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
    />
    <Path
      d="M19.204 10.406v4.315M21.25 12.563h-4.09"
      stroke="#00A385"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <Path
      d="M10.385 13.135c2.266 0 4.102-1.977 4.102-4.415s-1.836-4.415-4.102-4.415S6.282 6.281 6.282 8.72s1.837 4.415 4.103 4.415Z"
      stroke="#00A385"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
    />
  </Svg>
);

export default SignUpIcon;
