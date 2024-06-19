export default function Facebook({ fill = "#8B898E" }: { fill?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_468_23481"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="3"
        y="3"
        width="18"
        height="18"
      >
        <path
          d="M21 12.0546C21 7.0536 16.971 3 12 3C7.029 3 3 7.0536 3 12.0546C3 16.575 6.2904 20.3208 10.5936 21V14.6724H8.3088V12.054H10.5936V10.0596C10.5936 7.7904 11.937 6.5364 13.9932 6.5364C14.9772 6.5364 16.008 6.7134 16.008 6.7134V8.9418H14.8722C13.7544 8.9418 13.4064 9.6402 13.4064 10.3566V12.0546H15.9024L15.5034 14.6718H13.4064V21C17.7096 20.3208 21 16.575 21 12.0546Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_468_23481)">
        <rect width="24" height="24" fill={fill} />
      </g>
    </svg>
  );
}
