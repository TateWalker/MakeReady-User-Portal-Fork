const customMediaQuery = (minWidth: number) =>
  `@media screen and (min-width: ${minWidth}px)`;

export const media = {
  custom: customMediaQuery,
  desktop: customMediaQuery(992),
  tablet: customMediaQuery(768),
  phone: customMediaQuery(320),
};
