import styled, { createGlobalStyle } from "styled-components";
import Anton from "../static/fonts/Anton-Regular.ttf";
import OpenSans from "../static/fonts/OpenSans.ttf";

export const Label = styled.label`
  color: ${(props) => props.theme.colors.default};
`;
const FontStyles = createGlobalStyle`

@font-face {
  font-family: 'Anton';
  src: url(${Anton}) format('truetype')
}
@font-face {
  font-family: 'Open Sans';
  src: url(${OpenSans}) format('truetype')
}
`;
export default FontStyles;
