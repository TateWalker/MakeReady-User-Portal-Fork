import { externalUrls } from "../lib/data/URLs";
import { Icon, IconShape, Icons } from "./icon";
import { Application } from "../store";
import { useNavigate } from "react-router";

import "./styles/Footer.scss";

export default function Footer() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className={"Footer"}>
      <div className={"Footer__Content"}>
        <div className={"Footer__Logo"} onClick={handleLogoClick}>
          <Icon provider={Icons} shape={IconShape.LOGO_FULL} height={40} />
        </div>
        <div className={"Footer__Tagline"}>The Discipleship Platform</div>
        <div className={"Footer__Social"}>
          <div
            className="Footer__Social__Link"
            onClick={() => window.open(externalUrls.facebook)}
          >
            <Icon provider={Icons} shape={IconShape.FACEBOOK} height={30} />
          </div>
          <div
            className="Footer__Social__Link"
            onClick={() => window.open(externalUrls.tikTok)}
          >
            <Icon provider={Icons} shape={IconShape.TIKTOK} height={30} />
          </div>
          <div
            className="Footer__Social__Link"
            onClick={() => window.open(externalUrls.x)}
          >
            <Icon provider={Icons} shape={IconShape.X} height={30} />
          </div>
          <div
            className="Footer__Social__Link"
            onClick={() => window.open(externalUrls.instagram)}
          >
            <Icon provider={Icons} shape={IconShape.INSTAGRAM} height={30} />
          </div>
          <div
            className="Footer__Social__Link"
            onClick={() => window.open(externalUrls.youtube)}
          >
            <Icon provider={Icons} shape={IconShape.YOUTUBE} height={30} />
          </div>
        </div>
      </div>
    </div>
  );
}
