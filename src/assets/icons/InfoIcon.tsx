import Svg, {
  Path,
} from 'react-native-svg';

export function InfoIcon({ ...props }) {
  return (
      <Svg
        width={20}
        height={20}
        fill="none"
        {...props}
      >
        <Path
          stroke="#D63C41"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 18.75a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        />
        <Path
          stroke="#D63C41"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 9h.75v5.25h.75"
        />
        <Path
          fill="#D63C41"
          d="M9.75 6.75a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"
        />
      </Svg>
  );
}
