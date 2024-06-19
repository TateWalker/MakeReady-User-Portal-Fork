/* 🤖 this file was generated by svg-to-ts */
export default function Play({ fill = "#8B898E" }: { fill?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <mask
        id="c"
        width="10"
        height="12"
        x="8"
        y="6"
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
      >
        <path fill="#000" d="m8 6 9.14 5.82L8 17.64z" />
      </mask>
      <g mask="url(#c)">
        <path fill={fill} d="M0 0h24v24H0z" />
      </g>
    </svg>
  );
}