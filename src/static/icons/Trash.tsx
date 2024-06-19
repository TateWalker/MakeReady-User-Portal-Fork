export default function Trash({
  fill = "#8B898E",
  size = "20",
}: {
  fill?: string;
  size?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_21_869"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="5"
        y="3"
        width="12"
        height="14"
      >
        <path
          d="M16.3646 3.76562V5.33333H5.5V3.76562H8.19792L9 3H12.8646L13.6667 3.76562H16.3646ZM6.26562 15.4323V6.09896H15.599V15.4323C15.599 15.8455 15.441 16.2101 15.125 16.526C14.809 16.842 14.4444 17 14.0312 17H7.83333C7.42014 17 7.05556 16.842 6.73958 16.526C6.42361 16.2101 6.26562 15.8455 6.26562 15.4323Z"
          fill="black"
        />
      </mask>
      <g mask="url(#mask0_21_869)">
        <rect x="0.5" width="20" height="20" fill={fill} />
      </g>
    </svg>
  );
}
