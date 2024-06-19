export default function X({ fill = "#8B898E" }: { fill?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_468_23487"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="3"
        y="3"
        width="18"
        height="18"
      >
        <path
          d="M13.7142 10.6226L20.4162 3H18.8286L13.0068 9.61726L8.3604 3H3L10.0278 13.0074L3 20.9999H4.5876L10.7316 14.0104L15.6396 20.9999H21M5.1606 4.17142H7.5996L18.8274 19.8861H16.3878"
          fill="black"
        />
      </mask>
      <g mask="url(#mask0_468_23487)">
        <rect width="24" height="24" fill={fill} />
      </g>
    </svg>
  );
}
