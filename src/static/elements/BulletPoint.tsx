export default function BulletPoint({ fill = "#6C47FF" }: { fill?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="10" height="10" stroke={fill} stroke-width="4" />
    </svg>
  );
}
