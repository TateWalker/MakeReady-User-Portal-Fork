export default function NotificationsFull({
  fill = "#8B898E",
}: {
  fill?: string;
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_468_23469"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="5"
        y="4"
        width="14"
        height="17"
      >
        <path
          d="M16.6797 15.25L18.3594 16.9297V17.75H5V16.9297L6.67969 15.25V11.1094C6.67969 9.80729 7.00521 8.67448 7.65625 7.71094C8.33333 6.7474 9.25781 6.1224 10.4297 5.83594V5.25C10.4297 4.91146 10.5469 4.625 10.7812 4.39062C11.0156 4.13021 11.3151 4 11.6797 4C12.0443 4 12.3438 4.13021 12.5781 4.39062C12.8125 4.625 12.9297 4.91146 12.9297 5.25V5.83594C14.1016 6.1224 15.013 6.7474 15.6641 7.71094C16.3411 8.67448 16.6797 9.80729 16.6797 11.1094V15.25ZM11.6797 20.25C11.2109 20.25 10.8073 20.0938 10.4688 19.7812C10.1562 19.4688 10 19.0781 10 18.6094H13.3594C13.3594 19.0521 13.1901 19.4427 12.8516 19.7812C12.513 20.0938 12.1224 20.25 11.6797 20.25Z"
          fill="black"
        />
      </mask>
      <g mask="url(#mask0_468_23469)">
        <rect width="24" height="24" fill={fill} />
      </g>
    </svg>
  );
}
