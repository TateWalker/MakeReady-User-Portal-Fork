import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";
import {
  checkIfAccountExists,
  loginAccount,
  registerAccount,
  sendForgotPassword,
  setForgotPassword,
  verifyEmail,
  verifyForgotPassword,
} from "../api/auth";
import Button, { IButtonMode, IButtonSize } from "../components/Button";
import InputField from "../components/InputField";
import IconBox from "../components/IconBox";
import Check from "../static/icons/Check";
import OTP from "../components/OTP";
import {
  headerTexts,
  headerSubtexts,
  buttonTexts,
  authReceiveUpdates,
} from "../lib/data/Auth";
import Terms from "../components/Terms";
import { useNavigate } from "react-router";
import Close from "../static/icons/Close";
import { getSelf, updateProfile } from "../api/profile";
import Checkbox from "../components/Checkbox";
import { classnames } from "../lib/utils/classnames";

// Auth styles
import "./styles/Auth.scss";
import SubmitButton from "../components/SubmitButton";
import { when } from "../lib/utils/when";
import { Application } from "../store";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentStage, setCurrentStage] = useState(
    "enterEmail" as keyof typeof headerTexts
  );

  const [step, setStep] = useState(1);
  const [showForgotPassword, setShowForgotPassword] = useState(true);
  const [forgotPasswordFlow, setForgotPasswordFlow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [verifyForgotPasswordToken, setVerifyForgotPasswordToken] =
    useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isReceiveUpdates, setIsReceiveUpdates] = useState(false);
  const [newPassword2, setNewPassword2] = useState("");
  const [otpDigits, setOtpDigits] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [zip, setZip] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const regularExpression = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/;

  // Handle login
  const handleLogin = async () => {
    try {
      const res = await loginAccount(email, password);
      if (res.message === "Logged in") {
        const token = JSON.stringify({
          expiration: jwtDecode(res.access_token).exp?.toString(),
          token: res.access_token,
        });
        localStorage.setItem("access_token", token);
        // Saving the token is not necessary right now, but soon!
        Application.session.user.setToken(token);
        // Get the profile as soon as the token is loaded
        Application.session.user.getSelf();
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const handleVerifyForgotPassword = async () => {
    try {
      const res = await verifyForgotPassword(email, otpDigits);
      if (res.message === "Code verified") {
        setVerifyForgotPasswordToken(res.token);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const handleStartForgotPassword = () => {
    setCurrentStage("forgotPasswordEmail");
    setForgotPasswordFlow(true);
    setShowForgotPassword(false);
    setStep(1);
  };

  const handleGetProfile = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        const token = JSON.parse(accessToken).token;
        const profileResults = await getSelf();
        console.log("PROFILE RESULTS:", profileResults);
        if (profileResults.name) {
          return true;
        } else {
          return false;
        }
      }
    } catch (e) {
      console.log("Failed to get profile", e);
      return false;
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        const token = JSON.parse(accessToken).token;
        const name = `${firstName} ${lastName}`;
        const profileResults = await updateProfile(name, Number(zip));
        return profileResults === true;
      }
    } catch (e) {
      console.log("Failed to get profile", e);
      return false;
    }
  };

  const handleStageChange = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    if (currentStage === "enterEmail") {
      const results = await checkIfAccountExists(email);
      if (results === true) {
        setCurrentStage("enterPassword");
        setStep(2);
      } else {
        setShowForgotPassword(false);
        setCurrentStage("createPassword");
        setStep(2);
      }
    }
    if (currentStage === "enterPassword") {
      if (
        password === "" ||
        password.length < 8 ||
        !regularExpression.test(password)
      ) {
        setErrorMessage(
          "Password must be at least 8 characters containing letters, numbers, and at least one special character."
        );
        setIsLoading(false);
        return;
      }
      setErrorMessage("");
      const results = await handleLogin();
      setShowForgotPassword(false);
      if (results === true) {
        setErrorMessage("");
        setCurrentStage("loggedIn");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setCurrentStage("loginFailed");
      }
    }
    if (currentStage === "createPassword") {
      if (
        password === "" ||
        password.length < 8 ||
        !regularExpression.test(password)
      ) {
        setErrorMessage(
          "Password must be at least 8 characters containing letters, numbers, and at least one special character."
        );
        setIsLoading(false);
        return;
      }
      const results = await registerAccount(email, password);
      if (results === true) {
        setErrorMessage("");
        setCurrentStage("confirmCode");
      } else {
        // showError
      }
    }
    if (currentStage === "loginFailed") {
      setErrorMessage("");
      setCurrentStage("enterEmail");
      setShowForgotPassword(true);
      setStep(1);
    }
    if (currentStage === "forgotPasswordEmail") {
      const results = await sendForgotPassword(email);
      if (results === true) {
        setErrorMessage("");
        setCurrentStage("confirmCode");
        setStep(2);
      } else {
        // showError
        console.log("Error sending email");
      }
    }
    if (currentStage === "confirmCode") {
      // verify code
      if (forgotPasswordFlow === true) {
        const codeResults = await handleVerifyForgotPassword();
        if (codeResults) {
          setStep(3);
          setCurrentStage("changePassword");
          setErrorMessage("");
        } else {
          // showError
          setErrorMessage("Incorrect code. Try again");
        }
      } else {
        const codeResults = await verifyEmail(email, otpDigits);
        if (codeResults === true) {
          setErrorMessage("");
          const results = await handleLogin();
          if (results === true) {
            const profileResults = await handleGetProfile();
            if (profileResults === true) {
              setCurrentStage("loggedIn");
              setTimeout(() => {
                navigate("/");
              }, 3000);
            } else {
              setCurrentStage("profileData");
            }
          } else {
            setCurrentStage("loginFailed");
          }
        } else {
          setErrorMessage("Incorrect code. Try again");
        }
      }
    }
    if (currentStage === "changePassword") {
      if (
        newPassword !== newPassword2 ||
        newPassword === "" ||
        newPassword2 === "" ||
        newPassword.length < 8 ||
        !regularExpression.test(newPassword)
      ) {
        setErrorMessage(
          "Password must be at least 8 characters containing letters, numbers, and at least one special character."
        );
        setIsLoading(false);
        return;
      }
      setErrorMessage("");
      const results = await setForgotPassword(
        verifyForgotPasswordToken,
        newPassword
      );
      if (results === true) {
        setErrorMessage("");
        setCurrentStage("passwordUpdated");
      } else {
        // showError
        console.log("Error setting new password");
      }
    }
    if (currentStage === "passwordUpdated") {
      setErrorMessage("");
      setCurrentStage("enterEmail");
      setShowForgotPassword(true);
      setStep(1);
    }
    if (currentStage === "profileData") {
      if (firstName === "" || lastName === "" || zip === "") {
        setErrorMessage("Please fill out all fields");
        setIsLoading(false);
        return;
      }
      if (zip.length !== 5 || isNaN(Number(zip))) {
        setErrorMessage("Zip must be a valid 5 digit zip code");
        setIsLoading(false);
        return;
      }
      const results = await handleUpdateProfile();
      if (results === true) {
        Application.session.user.getSelf();
        setErrorMessage("");
        setCurrentStage("loggedIn");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        // showError
        console.log("Error updating profile");
      }
    }
    setIsLoading(false);
  };

  const handleContentRender = () => {
    if (currentStage === "enterEmail") {
      return (
        <InputField
          placeholder="Email"
          autofocus={true}
          onChange={(val) => setEmail(val.target.value)}
          value={email}
        ></InputField>
      );
    }
    if (currentStage === "enterPassword") {
      return (
        <>
          <InputField
            placeholder="Password"
            type="password"
            autofocus={true}
            onChange={(val) => setPassword(val.target.value)}
            value={password}
            autocomplete="on"
          ></InputField>
          <SharedSubtitle>(Case Sensitive)</SharedSubtitle>
          {errorMessage && <ErrorSubtitle>{errorMessage}</ErrorSubtitle>}
        </>
      );
    }
    if (currentStage === "createPassword") {
      return (
        <>
          <InputField
            placeholder="Password"
            autofocus={true}
            onChange={(val) => setPassword(val.target.value)}
            type="password"
            value={password}
          ></InputField>
          <SharedSubtitle>
            Password must be at least 8 characters containing letters, numbers,
            and at least one special character.
          </SharedSubtitle>
          <ErrorSubtitle>{errorMessage}</ErrorSubtitle>
          <ReceiveUpdates>
            <Checkbox
              checked={false}
              onChange={(isChecked: boolean) => {
                setIsReceiveUpdates(isChecked);
              }}
            />
            <UpdatesText>{authReceiveUpdates}</UpdatesText>
          </ReceiveUpdates>
          <Terms />
        </>
      );
    }
    if (currentStage === "forgotPasswordEmail") {
      return (
        <InputField
          placeholder="Email"
          autofocus={true}
          onChange={(val) => setEmail(val.target.value)}
          value={email}
        ></InputField>
      );
    }
    if (currentStage === "confirmCode") {
      return (
        <>
          <OTP digits={otpDigits} setDigits={(e) => setOtpDigits(e)} />
          <OTPNoticeWrapper>
            <OTPSubtitle>
              The confirmation was sent to your account email
            </OTPSubtitle>
            <OTPEmailText>{email}</OTPEmailText>
          </OTPNoticeWrapper>
          <ErrorSubtitle>{errorMessage}</ErrorSubtitle>
        </>
      );
    }
    if (currentStage === "changePassword") {
      return (
        <>
          <InputField
            placeholder="New Password"
            autofocus={true}
            type="password"
            onChange={(val) => setNewPassword(val.target.value)}
            value={newPassword}
          ></InputField>
          <InputField
            placeholder="Retype Password"
            type="password"
            onChange={(val) => setNewPassword2(val.target.value)}
            value={newPassword2}
          ></InputField>
          <SharedSubtitle>
            Password must be at least 8 characters containing letters, numbers,
            and at least one special character.
          </SharedSubtitle>
          <ErrorSubtitle>{errorMessage}</ErrorSubtitle>
        </>
      );
    }
    if (currentStage === "profileData") {
      return (
        <>
          <InputField
            placeholder="First name"
            autofocus={true}
            onChange={(val) => setFirstName(val.target.value)}
            value={firstName}
          ></InputField>
          <InputField
            placeholder="Last name"
            onChange={(val) => setLastName(val.target.value)}
            value={lastName}
          ></InputField>
          <InputField
            placeholder="Zip Code"
            onChange={(val) => setZip(val.target.value)}
            value={zip}
          ></InputField>
          <ErrorSubtitle>{errorMessage}</ErrorSubtitle>
        </>
      );
    }

    if (currentStage === "loggedIn") {
      return (
        <SuccessWrapper>
          <CheckIcon>
            <IconBox>
              <Check fill="#fff" />
            </IconBox>
          </CheckIcon>
          <SuccessTextWrapper>
            <SuccessTextMain>{headerTexts[currentStage]}</SuccessTextMain>
            <SuccessTextSub>{headerSubtexts[currentStage]}</SuccessTextSub>
          </SuccessTextWrapper>
        </SuccessWrapper>
      );
    }
    if (currentStage === "loginFailed") {
      return (
        <SuccessWrapper>
          <FailIcon>
            <IconBox>
              <Close fill="#fff" />
            </IconBox>
          </FailIcon>
          <SuccessTextWrapper>
            <SuccessTextMain>{headerTexts[currentStage]}</SuccessTextMain>
            <SuccessTextSub>{headerSubtexts[currentStage]}</SuccessTextSub>
          </SuccessTextWrapper>
        </SuccessWrapper>
      );
    }
    if (currentStage === "passwordUpdated") {
      return (
        <SuccessWrapper>
          <CheckIcon>
            <IconBox>
              <Check fill="#fff" />
            </IconBox>
          </CheckIcon>
          <SuccessTextWrapper>
            <SuccessTextMain>{headerTexts[currentStage]}</SuccessTextMain>
            <SuccessTextSub>{headerSubtexts[currentStage]}</SuccessTextSub>
          </SuccessTextWrapper>
        </SuccessWrapper>
      );
    }
  };

  useEffect(() => {
    if (currentStage === "enterEmail") {
      setEmail("");
      setPassword("");
      setShowForgotPassword(true);
      setForgotPasswordFlow(false);
      setVerifyForgotPasswordToken("");
      setNewPassword("");
      setNewPassword2("");
      setOtpDigits("");
    }
  }, [currentStage]);

  return (
    <form className="Auth__Form" onSubmit={handleStageChange}>
      <div className={classnames("Auth")}>
        <div className="Auth__Content">
          <div className="Auth__Fields">
            {currentStage !== "loggedIn" &&
              currentStage !== "loginFailed" &&
              currentStage !== "passwordUpdated" && (
                <>
                  <StepBar>
                    <Step filled={true} />
                    <Step filled={step > 1} />
                    <Step filled={step > 2} />
                  </StepBar>

                  <TopWrapper>
                    <StepTitle>{headerTexts[currentStage]}</StepTitle>
                    <StepSubtitle>{headerSubtexts[currentStage]}</StepSubtitle>
                  </TopWrapper>
                </>
              )}
            {handleContentRender()}
          </div>

          {currentStage !== "loggedIn" && (
            <div className={"Auth__Buttons"}>
              <SubmitButton
                disabled={step === 1 && email === ""}
                loading={isLoading}
                label={buttonTexts[currentStage]}
              />
              {when(
                step >= 2,
                <Button
                  mode={IButtonMode.GREY}
                  size={IButtonSize.XLARGE}
                  onClick={() => {
                    setCurrentStage("enterEmail");
                    setStep(1);
                    setErrorMessage("");
                  }}
                >
                  Cancel
                </Button>
              )}
              {showForgotPassword && (
                <ForgotPassword onClick={() => handleStartForgotPassword()}>
                  Forgot password?
                </ForgotPassword>
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

const SharedText = styled.div`
  color: #18141d;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 111.111% */
  letter-spacing: -0.36px;
`;

const StepBar = styled.div`
  display: flex;
  height: 4px;
  align-items: flex-start;
  gap: 4px;
  align-self: stretch;
`;
const Step = styled.div<{ filled?: boolean }>`
  flex: 1 0 0;
  align-self: stretch;
  background: ${(props) => (props.filled ? "#6c47ff" : "#18141D34")};
`;

const SuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  align-items: center;
  gap: 20px;
  align-self: stretch;
`;

const CheckIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background: #6c47ff;
  border-radius: 40px;
`;

const FailIcon = styled(CheckIcon)`
  background: #ff6c6c;
`;

const SuccessTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
`;

const SuccessTextMain = styled(SharedText)`
  display: flex;
  justify-content: center;
`;

const SuccessTextSub = styled(SharedText)`
  font-weight: 400;
  line-height: 24px;
  opacity: 0.7;
`;

const StepTitle = styled(SharedText)``;

const SharedSubtitle = styled.div`
  color: #18141d;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 171.429% */
  letter-spacing: -0.28px;
`;

const StepSubtitle = styled(SharedSubtitle)`
  align-self: stretch;
`;

const UpdatesText = styled(SharedSubtitle)`
  font-size: 12px;
  line-height: 20px; /* 166.667% */
  letter-spacing: -0.24px;
`;

const ReceiveUpdates = styled.div`
  border-top: 1px solid #18141d34;
  /* margin-top: 20px; */
  padding-top: 20px;
  display: flex;
  position: relative;
  padding-left: 40px;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;

  input {
    position: absolute;
    top: 22px;
    left: 0;
    width: 18px;
    height: 18px;
  }
`;

const ForgotPassword = styled(SharedSubtitle)`
  font-weight: 700;
  align-self: stretch;
  cursor: pointer;
`;

const OTPNoticeWrapper = styled.div`
  display: flex;
  padding-left: 20px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-left: 4px solid #6c47ff;
`;

const OTPSubtitle = styled(SharedSubtitle)`
  line-height: 20px;
  font-size: 12px;
  letter-spacing: -0.24px;
  opacity: 0.5;
`;

const OTPEmailText = styled(SharedText)`
  font-size: 14px;
  letter-spacing: -0.28px;
`;

const ErrorSubtitle = styled(SharedSubtitle)`
  color: red;
`;
