import styled from "styled-components";

export const H1 = styled.h1`
  color: ${(props) => props.theme.colors.default};
  font-weight: bold;
  font-size: 60px;
  margin: 0;
  @media (max-width: 450px) {
    font-size: 34px;
  }
`;

export const div = styled.div`
  color: #fff;
  font-family: Anton;
  text-transform: uppercase;
  font-size: 40px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px;
  letter-spacing: -0.8px;
`;

export const H2 = styled.h2`
  color: ${(props) => props.theme.colors.default};
  font-family: Open Sans;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.28px;
  margin: 0;
`;

export const H3 = styled.h3`
  color: ${(props) => props.theme.colors.default};
  font-weight: bold;
  font-size: 30px;
  @media (max-width: 450px) {
    font-size: 24px;
  }
`;

export const BodyIntro = styled.p`
  color: ${(props) => props.theme.colors.default};
  font-weight: 500;
  font-size: 24px;
  line-height: 140%;
`;

export const BodyMain = styled.p`
  color: ${(props) => props.theme.colors.default};
  font-weight: normal;
  font-size: 20px;
  line-height: 140%;
`;

export const MediumText = styled.p`
  color: ${(props) => props.theme.colors.default};
  font-weight: normal;
  font-size: 17px;
  line-height: 130%;
`;

export const Caption = styled.p`
  color: ${(props) => props.theme.colors.default};
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
`;

export const UpperCaption = styled.p`
  color: ${(props) => props.theme.colors.default};
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;
  text-transform: uppercase;
`;

export const SmallText = styled.p`
  color: ${(props) => props.theme.colors.default};
  font-weight: normal;
  font-size: 13px;
  line-height: 130%;
`;

export const UpperSmallText = styled.p`
  color: ${(props) => props.theme.colors.default};
  font-weight: 600;
  font-size: 13px;
  line-height: 130%;
  text-transform: uppercase;
`;

export const H4 = styled.h4`
  color: ${(props) => props.theme.colors.default};
  font-weight: bold;
  font-size: 20px;
  line-height: 18px;
  @media (max-width: 450px) {
    font-size: 18px;
  }
`;
