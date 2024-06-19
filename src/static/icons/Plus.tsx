export default function Plus({ fill = "#8B898E" }: { fill?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_468_23389"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="5"
        y="4"
        width="14"
        height="16"
      >
        <path
          d="M11.2081 19.4887V12.4728H5V10.8891H11.2398V4H12.9502V10.8891H19V12.4728H12.9502V19.4887H11.2081Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_468_23389)">
        <rect width="24" height="24" fill={fill} />
      </g>
    </svg>
  );
}
