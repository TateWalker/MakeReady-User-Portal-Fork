import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export default function Terms() {
  const subscriptionAgreement = <Link to="">Subscription Agreement</Link>;
  const termsOfService = <Link to="">Terms of Service</Link>;
  const privacyPolicy = <Link to="">Privacy Policy</Link>;
  return (
    <TermsWrapper>
      By using Makeready.org streaming services, you acknowledge and agree that
      Makeready.org respects your privacy and will not sell or distribute your
      personal data to third parties. By clicking "Agree & Continue," you
      confirm that you have read, understood, and accept our{" "}
      {subscriptionAgreement} and {termsOfService}. Your continued use of the
      service also signifies that you have thoroughly reviewed our{" "}
      {privacyPolicy}.
    </TermsWrapper>
  );
}
const TermsWrapper = styled.div`
  color: var(--Dark, #18141d);
  font-family: Open Sans;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 150% */
  letter-spacing: -0.24px;
  a {
    color: var(--Primary, #6c47ff);
    text-decoration: none;
  }
`;
