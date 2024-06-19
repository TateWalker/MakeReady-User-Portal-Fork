export default function Building({ fill = "#8B898E" }: { fill?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_604_9510"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="3"
        y="4"
        width="18"
        height="16"
      >
        <path
          d="M17 14.5V16.1797H15.3203V14.5H17ZM17 11.1797V12.8203H15.3203V11.1797H17ZM18.6797 17.8203V9.5H12V11.1797H13.6797V12.8203H12V14.5H13.6797V16.1797H12V17.8203H18.6797ZM10.3203 7.82031V6.17969H8.67969V7.82031H10.3203ZM10.3203 11.1797V9.5H8.67969V11.1797H10.3203ZM10.3203 14.5V12.8203H8.67969V14.5H10.3203ZM10.3203 17.8203V16.1797H8.67969V17.8203H10.3203ZM7 7.82031V6.17969H5.32031V7.82031H7ZM7 11.1797V9.5H5.32031V11.1797H7ZM7 14.5V12.8203H5.32031V14.5H7ZM7 17.8203V16.1797H5.32031V17.8203H7ZM12 7.82031H20.3203V19.5H3.67969V4.5H12V7.82031Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_604_9510)">
        <rect width="24" height="24" fill={fill} />
      </g>
    </svg>
  );
}
