/* 🤖 this file was generated by svg-to-ts */
export default function ArrowRight({ fill = "#8B898E" }: { fill?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <mask
        id="b"
        width="14"
        height="14"
        x="5"
        y="5"
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
      >
        <path
          fill="#fff"
          d="m12 5 7 7-7 7-1.228-1.228 4.871-4.912H5v-1.72h10.643l-4.871-4.912z"
        />
      </mask>
      <g mask="url(#b)">
        <path fill={fill} d="M0 0h24v24H0z" />
      </g>
    </svg>
  );
}
