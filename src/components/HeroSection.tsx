import React from "react";
import Button, { IButtonMode } from "./Button";
import { useNavigate } from "react-router";
import { Icon, Icons, IconShape } from "./icon";
import { classnames } from "../lib/utils/classnames";
import { observer } from "mobx-react";
import { Application } from "../store";
import { Breakpoints, useMediaQuery } from "../lib/hooks/useMediaQuery";

// SCSS
import "./styles/HeroSection.scss";
import TitleStack from "./TitleStack";

interface IProps {
  minTouchDistance?: number;
  changeInterval?: number;
}

const HeroSection = observer(({ ...props }: IProps) => {
  const navigate = useNavigate();

  const { minTouchDistance = 10, changeInterval = 15000 } = props;

  // Mobile media query
  const isMobile = useMediaQuery(Breakpoints.mobile);

  // Swipe controls
  const [startX, setStartX] = React.useState(0);
  const [startY, setStartY] = React.useState(0);
  const [swipeDirection, setSwipeDirection] = React.useState<
    "left" | "right" | "up" | "down" | "none"
  >("none");
  const [swiping, setSwiping] = React.useState<boolean>(false);
  const touchEndedRef = React.useRef<boolean>(false);

  const slideShowRef = React.useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = React.useState(0);

  // Create ref for a timer
  const timerRef = React.useRef<number | null>(null);

  // Swipe timing refs to calculate speed
  const swipeStartRef = React.useRef<{ time: number; x: number } | null>(null);
  const swipeEndRef = React.useRef<{
    time: number;
    x: number;
    distance: number;
    speed: number;
  } | null>(null);

  // Handle when touching starts
  const handleTouchStart = (e: TouchEvent) => {
    swipeStartRef.current = { time: Date.now(), x: e.touches[0].clientX };
    touchEndedRef.current = false;
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
    setSwiping(true);
  };

  // Handle clicking the slideshow to go next or previous
  const handleClickMove = (x: number) => {
    const clickSide = x < slideWidth / 2 ? "left" : "right";
    if (!isMobile) return;
    if (clickSide === "left") {
      return handleLeftClick();
    }
    return handleRightClick();
  };

  const handleLeftClick = () => {
    return swipeRight();
  };

  const handleRightClick = () => {
    return swipeLeft();
  };

  // Handle when touching stops
  const handleTouchEnd = (e: TouchEvent) => {
    if (!isMobile) return;
    touchEndedRef.current = true;
    setSwiping(false);
    setSwipeDirection("none");
    const endX = e.changedTouches[0].clientX;
    const distance = Math.abs(endX - startX);
    const starTime = swipeStartRef.current?.time || 0;
    const endTime = Date.now();
    const time = endTime - starTime;
    swipeEndRef.current = {
      time: Date.now(),
      x: endX,
      distance: distance,
      speed: distance / time,
    };
    // Handle like a normal click since the distance is too small
    if (distance < minTouchDistance && swiping) {
      // handleClickMove(endX);
      return;
    }
    if (startX < endX) {
      return swipeRight();
    }
    return swipeLeft();
  };

  const swipeRight = () => {
    Application.ui.hero.prevHero();
  };

  const swipeLeft = () => {
    Application.ui.hero.nextHero();
  };

  // Load hero items
  const heroItems = Application.ui.hero.list;

  // Set direction
  const determineDirection = (x: number, y: number) => {
    if (Math.abs(x) > Math.abs(y)) {
      setSwipeDirection(x > 0 ? "right" : "left");
    } else {
      setSwipeDirection(y > 0 ? "down" : "up");
    }
  };

  // Set swipe indicator width as user swipes
  const handleTouchMove = (e: TouchEvent) => {
    const differenceX = e.touches[0].clientX - startX;
    const differenceY = e.touches[0].clientY - startY;

    // Prevent vertical scroll if going left or right
    if (swipeDirection == "left" || swipeDirection == "right") {
      e.preventDefault();
      e.stopPropagation();
    }

    // Estabslish direction as soon as it's known, only once
    if (swipeDirection === "none") {
      determineDirection(differenceX, differenceY);
    }

    // If there is a change of direction
    if (differenceX > 0 && swipeDirection === "left") {
      setSwipeDirection("right");
    } else if (differenceX < 0 && swipeDirection === "right") {
      setSwipeDirection("left");
    }
  };

  // Unfortunately this was necessary because of the way React handles passive
  // events for touch.
  React.useEffect(() => {
    // Set onTouchStart, onTouchMoveCapture, and onTouchEnd bindings here
    // instead of the slideShowRef element
    if (!slideShowRef.current) return;
    setSlideWidth(slideShowRef.current?.getBoundingClientRect().width || 0);

    slideShowRef.current.addEventListener("touchstart", handleTouchStart);
    slideShowRef.current.addEventListener("touchmove", handleTouchMove, {
      capture: true,
    });
    slideShowRef.current.addEventListener("touchend", handleTouchEnd);

    // Remove event listeners on unmount
    return () => {
      slideShowRef.current?.removeEventListener("touchstart", handleTouchStart);
      slideShowRef.current?.removeEventListener("touchmove", handleTouchMove, {
        capture: true,
      });
      slideShowRef.current?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [slideShowRef.current, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Go to the next slide after changeInterval
  React.useEffect(() => {
    // Every time the slide changes, the timer will be automatically reset
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(() => {
      Application.ui.hero.nextHero();
    }, changeInterval);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [Application.ui.hero.currentIndex]);

  const handleCtaClick = (ctaLink: string | null) => {
    if (!ctaLink) return;
    navigate(ctaLink);
  };

  return (
    <div
      ref={slideShowRef}
      className={classnames("HeroSection", swiping ? "SlideShow--swiping" : "")}
    >
      <div
        className="HeroSection__Arrow HeroSection__Arrow--left"
        onClick={handleLeftClick}
      >
        <Icon
          provider={Icons}
          shape={IconShape.KEYBOARD_ARROW_LEFT}
          size={20}
        />
      </div>
      <div className="HeroSection__Items">
        {heroItems.map((item, index) => {
          return (
            <div
              key={index}
              className={classnames("HeroSection__Item", {
                "HeroSection__Item--active":
                  index === Application.ui.hero.currentIndex,
              })}
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className={"HeroSection__Title"}>
                <TitleStack title={item.title} />
              </div>
              <div className="HeroSection__Content">
                <div className={"HeroSection__Description"}>
                  {item.description}
                </div>
                <div className={"HeroSection__Buttons"}>
                  {item.ctas.map((cta, index) => {
                    const ctaMode: IButtonMode =
                      index === 0 ? IButtonMode.PRIMARY : IButtonMode.PURPLE;
                    let iconShape = cta.iconShape ? cta.iconShape : "PLAY";
                    // Icon on the left if it's the first button
                    if (index === 0) {
                      return (
                        <Button
                          key={index}
                          mode={ctaMode}
                          onClick={() => handleCtaClick(cta.ctaLink)}
                        >
                          <Icon
                            provider={Icons}
                            shape={
                              IconShape[iconShape as keyof typeof IconShape]
                            }
                            size={20}
                          />
                          {cta.title}
                        </Button>
                      );
                    }
                    // Icon on the right if it's the second button
                    iconShape = cta.iconShape ? cta.iconShape : "ARROW_RIGHT";
                    return (
                      <Button
                        key={index}
                        mode={ctaMode}
                        onClick={() => handleCtaClick(cta.ctaLink)}
                      >
                        {cta.title}
                        <Icon
                          provider={Icons}
                          shape={IconShape[iconShape as keyof typeof IconShape]}
                          size={14}
                        />
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="HeroSection__Dots">
        {heroItems.map((item, index) => {
          return (
            <div
              key={index}
              className={classnames(
                "HeroSection__Dot",
                index === Application.ui.hero.currentIndex
                  ? "HeroSection__Dot--active"
                  : ""
              )}
            ></div>
          );
        })}
      </div>
      <div
        className="HeroSection__Arrow HeroSection__Arrow--right"
        onClick={handleRightClick}
      >
        <Icon
          provider={Icons}
          shape={IconShape.KEYBOARD_ARROW_RIGHT}
          size={20}
        />
      </div>
    </div>
  );
});

export default HeroSection;
