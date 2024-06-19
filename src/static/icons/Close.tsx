export default function Close({ fill = "#8B898E" }: { fill?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_468_23335"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="5"
        y="5"
        width="14"
        height="14"
      >
        <path
          d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
          fill="#57719C"
        />
      </mask>
      <g mask="url(#mask0_468_23335)">
        <rect width="24" height="24" fill={fill} />
      </g>
    </svg>
  );
}
