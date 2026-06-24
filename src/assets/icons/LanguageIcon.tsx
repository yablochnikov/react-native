import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const LanguageIcon = () => (
  <Svg width={24} height={24} fill="none">
    <Path
      d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18"
      stroke="#FA8A34"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <Path
      d="M12 20.759c2.071 0 3.75-3.922 3.75-8.759 0-4.837-1.679-8.758-3.75-8.758S8.25 7.163 8.25 12c0 4.837 1.679 8.759 3.75 8.759Z"
      stroke="#FA8A34"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </Svg>
);

export default LanguageIcon;
