import React, { useState } from "react";
import ReusableModal from "../ReusableModal";
import { styled } from "styled-components";
import Button, { IButtonMode } from "../Button";
import OTP from "../OTP";
import IconBox from "../IconBox";
import Check from "../../static/icons/Check";
import InputField from "../InputField";
import { changeEmail, changePassword, verifyEmail } from "../../api/auth";
import Close from "../../static/icons/Close";
import DefaultSpinner from "../DefaultSpinner";
import { updateProfile } from "../../api/profile";
import { colors } from "../../styles/Colors";
import { Application } from "../../store";
interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangeZipModal(props: IProps) {
  const { isOpen, onClose } = props;
  const [step, setStep] = useState(1);
  const [zip, setZip] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(
    "enterNew" as keyof typeof headerTitles
  );
  const title = "Change Zip";
  const headerTitles = {
    enterNew: "Enter a new zip code",
    success: "Zip code successfully updated",
    error: "Error changing zip code",
  };
  const subtitles = {
    enterNew:
      "This will change your zip code. Please enter the new zip below to continue",
    success: "Returning you to the profile screen.",
    error: "There was an error updating your zip. Please try again later.",
  };

  const handleStageChange = async () => {
    if (currentStage === "enterNew") {
      setIsLoading(true);
      try {
        let response = await updateProfile(undefined, Number(zip));
        if (response) {
          Application.session.user.getSelf();
          setStep(2);
          setCurrentStage("success");
          setTimeout(() => {
            onClose();
          }, 3000);
        } else {
          setCurrentStage("error");
        }
      } catch (e) {
        console.log("Failed to change zip");
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
          <ZipField
            placeholder="Zip"
            value={zip}
            inputMode="numeric"
            type="number"
            onChange={(e) => setZip(e.target.value)}
          />
          <PassInstructionsText>
            Zip must be a valid 5 digit zip code
          </PassInstructionsText>
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
            onClick={() => handleStageChange()}
            mode={IButtonMode.PURPLE}
            disabled={
              step === 1 &&
              (zip === "" || zip.length !== 5 || isNaN(Number(zip)))
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

const CancelButtonText = styled(SharedSubtitle)`
  font-family: Open Sans;
  font-weight: 700;
  line-height: 24px; /* 142.857% */
  ${CancelButton}:hover & {
    color: ${colors.white};
  }
`;

const ConfirmButtonText = styled(CancelButtonText)`
  color: #fff;
`;

const ConfirmButton = styled(Button)``;

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

const PassInstructionsText = styled(SharedSubtitle)`
  font-family: Open Sans;
  font-size: 12px;
  line-height: 20px; /* 166.667% */
  letter-spacing: -0.24px;
`;

const ZipField = styled(InputField)`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield; /* Firefox */
  }
`;
