import React from "react";
import styled from "styled-components";
import { colors } from "../styles/Colors";
import {
  aboutStarter,
  howWeDoIt,
  peopleData,
  vision,
  valuesData,
  whyUs,
  mission,
} from "../lib/data/About";
import BulletPoint from "../static/elements/BulletPoint";
import AboutTitleBox from "../components/AboutTitleBox";
import { media } from "../styles/media";
import { Icon, IconShape, Icons } from "../components/icon";
import { classnames } from "../lib/utils/classnames";

import "./styles/About.scss";
import { observer } from "mobx-react";
import { Breakpoints, useMediaQuery } from "../lib/hooks/useMediaQuery";
import DrawArrow, {
  IDrawArrowColor,
  IDrawArrowDirection,
} from "../static/elements/DrawArrow";
import { when } from "../lib/utils/when";

const About = observer(() => {
  // Mobile media query
  const isMobile = useMediaQuery(Breakpoints.mobile);

  return (
    <div className={classnames("About")}>
      <div className={"About__Hero"}>
        <div className="About__Hero--left">
          <div className={"About__Box About__Box--row About__Box--white"}>
            <div className="About__Box__Title">Mission</div>
            <div className="About__Box__Line About__Box__Line--horizontal"></div>
            <DrawArrow
              direction={IDrawArrowDirection.RIGHT}
              color={IDrawArrowColor.WHITE}
              length={0}
            />
          </div>
        </div>
        <div className="About__Hero--right">
          <div className={"About__Hero__Title"}>
            <div>We exist</div>
            <div>to make men</div>
            <div>ready</div>
          </div>
          <div className={"About__Hero__Description"}>
            To be the next generation of disciple makers
          </div>
        </div>
      </div>
      <div className={"About__How"}>
        <div className={"About__Opening"}>{aboutStarter}</div>
        <div className={"About__Box"}>
          <div className="About__Box__Title">How We Do It</div>
          <DrawArrow
            direction={IDrawArrowDirection.DOWN}
            color={IDrawArrowColor.PURPLE}
            length={50}
          />
        </div>
        <HowListWrapper>
          {howWeDoIt.map((item, idx) => (
            <>
              <HowBoxWrapper>
                <HowIndexBox>
                  <HowIndex>{idx + 1}</HowIndex>
                </HowIndexBox>
                <HowTextWrapper>
                  <HowTextTitle>{item.title}</HowTextTitle>
                  <HowTextDescription>{item.description}</HowTextDescription>
                </HowTextWrapper>
              </HowBoxWrapper>
              <DrawArrow
                direction={
                  isMobile
                    ? IDrawArrowDirection.DOWN
                    : IDrawArrowDirection.RIGHT
                }
                color={IDrawArrowColor.PURPLE}
                length={0}
              />
            </>
          ))}
        </HowListWrapper>
      </div>
      <WhoWrapper>
        <div className={"About__Box About__Box--white"}>
          <div className="About__Box__Title">Who is doing it?</div>
          <DrawArrow
            direction={IDrawArrowDirection.DOWN}
            color={IDrawArrowColor.WHITE}
            length={50}
          />
        </div>
        <div className={"About__Who"}>
          {peopleData.map((person) => {
            const imageStyles: React.CSSProperties = {
              backgroundImage: `url(${person.image})`,
            };
            return (
              <div className={"About__Who__Person"}>
                <div className={"About__Who__Image"} style={imageStyles}></div>
                <div className={"About__Who__Info"}>
                  <h2>{person.name}</h2>
                  {when(person.title, <h3>{person.title}</h3>)}
                  <div>{person.bio}</div>
                </div>
              </div>
            );
          })}
        </div>
      </WhoWrapper>
      <div className={"About__Vision"}>
        <div className={"About__Box"}>
          <div className="About__Box__Title">Vision</div>
          <DrawArrow
            direction={IDrawArrowDirection.DOWN}
            color={IDrawArrowColor.PURPLE}
            length={50}
          />
        </div>
        <div className={"About__Opening"}>{vision}</div>
        <div className={"About__Values"}>
          <div className={"About__Values--left"}>
            <div className={"About__Values__Title"}>Values</div>
            <div className={"About__Values__Bullets"}>
              {valuesData.map((value) => (
                <div className={"About__Values__Bullet"}>{value}</div>
              ))}
            </div>
          </div>
          <div className={"About__Values--right"}>
            <div className={"About__Values__Title"}>Mission</div>
            <div>{mission}</div>
            <div className={"About__Values__Title"}>Core Beliefs</div>
            <div>{whyUs}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

const SharedText = styled.div`
  color: #fff;
  font-family: "Open Sans";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 100% */
  letter-spacing: -0.4px;
`;

const StarterText = styled(SharedText)`
  color: rgba(24, 20, 29, 0.7);
  font-size: 18px;
  line-height: 30px; /* 166.667% */
  letter-spacing: -0.36px;
  ${media.desktop} {
    font-size: 24px;
    line-height: 40px;
    letter-spacing: -0.48px;
  }
`;

const HowListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;

  & svg path {
    fill: ${colors.purple};
  }

  & > :last-child {
    display: none;
  }

  ${media.desktop} {
    flex-direction: row;
  }
`;

const HowBoxWrapper = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
  border: 2px solid #6c47ff;
  ${media.desktop} {
    flex: 1 0 0;
  }
`;

const HowIndexBox = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border: 2px solid #6c47ff;
`;

const HowIndex = styled(SharedText)`
  color: #6c47ff;
  font-weight: 700;
  line-height: 80%; /* 16px */
  text-transform: uppercase;
`;

const HowTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

const HowTextTitle = styled(SharedText)`
  color: #18141d;
  font-weight: 700;
  line-height: 80%; /* 16px */
`;

const HowTextDescription = styled(SharedText)`
  color: #18141db3;
  font-size: 18px;
  line-height: 30px; /* 166.667% */
  letter-spacing: -0.36px;
  align-self: stretch;
`;

const WhoWrapper = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  align-self: stretch;
  background: linear-gradient(180deg, #141316 0%, #202328 100%);
  ${media.desktop} {
    padding: 80px;
  }
`;

export default About;
