import React, { useState } from "react";
import ReusableModal from "../ReusableModal";
import { styled } from "styled-components";
import Button from "../Button";
import OTP from "../OTP";
import IconBox from "../IconBox";
import Check from "../../static/icons/Check";
import InputField from "../InputField";
import { changeEmail, verifyEmail } from "../../api/auth";
import Close from "../../static/icons/Close";
import DefaultSpinner from "../DefaultSpinner";
import { IButtonMode } from "../Button";
import { colors } from "../../styles/Colors";
interface IProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  setEmail: (email: string) => void;
}

export default function ChangeEmailModal(props: IProps) {
  const { isOpen, onClose, email, setEmail } = props;
  const [step, setStep] = useState(1);
  const [otpDigits, setOtpDigits] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(
    "enterNew" as keyof typeof headerTitles
  );
  const title = "Change Email";
  const headerTitles = {
    enterNew: "Enter a new email address",
    verifyEmail: "Please verify your email",
    success: "Email successfully updated",
    error: "Error changing email address",
  };
  const subtitles = {
    enterNew:
      "This will replace the process you use to login by changing your email address. Please enter the new email below to continue.",
    verifyEmail:
      "For security purposes, Your email address must be verified before changes can be made to your login. A 6-digit code was sent to your  email address that will expire in 15 minutes. Please enter it below.",
    success: "Returning you to the profile screen.",
    error:
      "There was an error updating your email address. Please try again later.",
  };

  const handleStageChange = async () => {
    if (currentStage === "enterNew") {
      setIsLoading(true);
      try {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          let token = JSON.parse(accessToken).token;
          let response = await changeEmail(password, newEmail);
          if (response) {
            setStep(2);
            setCurrentStage("verifyEmail");
          } else {
            setCurrentStage("error");
          }
        }
      } catch (e) {
        console.log("Failed to send verification email");
        setCurrentStage("error");
      } finally {
        setIsLoading(false);
      }
    }
    if (currentStage === "verifyEmail") {
      setIsLoading(true);
      try {
        const response = await verifyEmail(newEmail, otpDigits);
        if (response) {
          setCurrentStage("success");
          setEmail(newEmail);
          setTimeout(() => {
            onClose();
          }, 3000);
        } else {
          setCurrentStage("error");
        }
      } catch (e) {
        console.log("Failed to verify email");
        setCurrentStage("error");
      } finally {
        setIsLoading(false);
      }
    }
    if (currentStage === "error") {
      setCurrentStage("enterNew");
      setStep(1);
    }
  };

  const handleContentRender = () => {
    if (currentStage === "enterNew") {
      return (
        <>
          <OTPNoticeWrapper>
            <OTPSubtitle>Current email address</OTPSubtitle>
            <OTPEmailText>{email}</OTPEmailText>
          </OTPNoticeWrapper>
          <InputField
            placeholder="New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <InputField
            placeholder="Current Password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </>
      );
    }
    if (currentStage === "verifyEmail") {
      return (
        <>
          <OTP digits={otpDigits} setDigits={(e) => setOtpDigits(e)} />
          <OTPNoticeWrapper>
            <OTPSubtitle>The code was sent to your new email</OTPSubtitle>
            <OTPEmailText>{newEmail}</OTPEmailText>
          </OTPNoticeWrapper>
        </>
      );
    }
    if (currentStage === "success") {
      return (
        <SuccessWrapper>
          <CheckIcon>
            <IconBox>
              <Check fill="#fff" />
            </IconBox>
          </CheckIcon>
          <SuccessTextWrapper>
            <SuccessTextMain>{headerTitles[currentStage]}</SuccessTextMain>
            <SuccessTextSub>{subtitles[currentStage]}</SuccessTextSub>
          </SuccessTextWrapper>
        </SuccessWrapper>
      );
    }
    if (currentStage === "error") {
      return (
        <SuccessWrapper>
          <FailIcon>
            <IconBox>
              <Close fill="#fff" />
            </IconBox>
          </FailIcon>
          <SuccessTextWrapper>
            <SuccessTextMain>{headerTitles[currentStage]}</SuccessTextMain>
            <SuccessTextSub>{subtitles[currentStage]}</SuccessTextSub>
          </SuccessTextWrapper>
        </SuccessWrapper>
      );
    }
  };
  return (
    <EmailModal isOpen={isOpen} onClose={onClose} title={title}>
      {currentStage !== "success" && currentStage !== "error" && (
        <>
          <StepBar>
            <Step filled={true} />
            <Step filled={step > 1} />
          </StepBar>
          <TopWrapper>
            <StepTitle>{headerTitles[currentStage]}</StepTitle>
            <StepSubtitle>{subtitles[currentStage]}</StepSubtitle>
          </TopWrapper>
        </>
      )}
      {handleContentRender()}
      {currentStage !== "success" && (
        <BottomWrapper>
          {currentStage !== "error" && (
            <CancelButton onClick={() => onClose()}>
              <CancelButtonText>Cancel</CancelButtonText>
            </CancelButton>
          )}
          <ConfirmButton
            mode={IButtonMode.PURPLE}
            onClick={() => handleStageChange()}
            disabled={
              (step === 1 && newEmail === "") ||
              (step === 2 && otpDigits === "")
            }
          >
            {isLoading ? (
              <DefaultSpinner />
            ) : (
              <ConfirmButtonText>Continue</ConfirmButtonText>
            )}
          </ConfirmButton>
        </BottomWrapper>
      )}
    </EmailModal>
  );
}

const EmailModal = styled(ReusableModal)`
  gap: 20px;
  max-width: 400px;
`;

const OTPNoticeWrapper = styled.div`
  display: flex;
  padding-left: 20px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-left: 4px solid #6c47ff;
`;

const SharedSubtitle = styled.div`
  color: #18141d;
  font-family: Open Sans;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 171.429% */
  letter-spacing: -0.28px;
`;

const SharedText = styled.div`
  color: #18141d;
  font-family: Open Sans;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 111.111% */
  letter-spacing: -0.36px;
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

const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

const StepTitle = styled(SharedText)``;

const StepSubtitle = styled(SharedSubtitle)`
  align-self: stretch;
`;

const BottomWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

const CancelButton = styled(Button)`
  min-height: 46px;
`;

const ConfirmButton = styled(Button)`
  min-height: 46px;
`;

const CancelButtonText = styled(SharedSubtitle)`
  ${CancelButton}:hover & {
    color: ${colors.white};
  }
  color: #18141d;
  font-family: Open Sans;
  font-weight: 700;
  line-height: 24px; /* 142.857% */
`;

const ConfirmButtonText = styled(CancelButtonText)`
  color: #fff;
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
