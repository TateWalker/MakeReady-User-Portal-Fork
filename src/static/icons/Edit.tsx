export default function Edit({ fill = "#8B898E" }: { fill?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_21_1398"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="4"
        y="4"
        width="12"
        height="12"
      >
        <path
          d="M15.4492 6.89453L14.3066 8.03711L11.9629 5.69336L13.1055 4.55078C13.2227 4.43359 13.3691 4.375 13.5449 4.375C13.7207 4.375 13.8672 4.43359 13.9844 4.55078L15.4492 6.01562C15.5664 6.13281 15.625 6.2793 15.625 6.45508C15.625 6.63086 15.5664 6.77734 15.4492 6.89453ZM4.375 13.2812L11.2891 6.36719L13.6328 8.71094L6.71875 15.625H4.375V13.2812Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_21_1398)">
        <rect width="21.7769" height="21.7769" fill={fill} />
      </g>
    </svg>
  );
}
