import { AxiosResponse, AxiosError } from "axios";
import axios from "./axios";
import {
  ApiAccountExists as AccountExists,
  ApiRegisterAccount as RegisterAccount,
  ApiLoginAccount as LoginAccount,
  ApiVerifyEmail as VerifyEmail,
  ApiSendForgotPassword as SendForgotPassword,
  ApiVerifyForgotPassword as VerifyForgotPassword,
  ApiSetForgotPassword as SetForgotPassword,
  ApiChangePassword as ChangePassword,
  ApiChangeEmail as ChangeEmail,
} from "../types/apiResponses";
const baseUrl = "https://development-api.makeready.org";

export const checkIfAccountExists = async (email: string): Promise<boolean> => {
  try {
    const response: AxiosResponse<AccountExists> = await axios.post(
      `${baseUrl}/auth/account_exists`,
      { email }
    );
    return response.data.exists;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};

export const registerAccount = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const response: AxiosResponse<RegisterAccount> = await axios.post(
      `${baseUrl}/auth/register`,
      { email, password }
    );
    return response.status === 200;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
};

export const loginAccount = async (
  email: string,
  password: string
): Promise<LoginAccount> => {
  try {
    const response: AxiosResponse<LoginAccount> = await axios.post(
      `${baseUrl}/auth/login`,
      { email, password }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return { access_token: "", message: "" };
  }
};

export const verifyEmail = async (
  email: string,
  code: string
): Promise<boolean> => {
  try {
    const response: AxiosResponse<VerifyEmail> = await axios.post(
      `${baseUrl}/auth/verify_email`,
      { email, code }
    );
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const sendForgotPassword = async (email: string): Promise<boolean> => {
  try {
    const response: AxiosResponse<SendForgotPassword> = await axios.post(
      `${baseUrl}/auth/forgot_password_send`,
      { email }
    );
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const verifyForgotPassword = async (
  email: string,
  code: string
): Promise<VerifyForgotPassword> => {
  try {
    const response: AxiosResponse<VerifyForgotPassword> = await axios.post(
      `${baseUrl}/auth/forgot_password_callback_verify`,
      { email, code }
    );
    return response.data;
  } catch (error) {
    return { message: "", token: "" };
  }
};

export const setForgotPassword = async (
  token: string,
  newPassword: string
): Promise<boolean> => {
  try {
    const response: AxiosResponse<SetForgotPassword> = await axios.post(
      `${baseUrl}/auth/forgot_password_callback_set`,
      { token, newPassword }
    );
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const changeEmail = async (
  currentPassword: string,
  newEmail: string
): Promise<boolean> => {
  try {
    const response: AxiosResponse<ChangeEmail> = await axios.post(
      `${baseUrl}/auth/change_email`,
      { currentPassword, newEmail }
    );
    return response.status === 200;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  try {
    const response: AxiosResponse<ChangePassword> = await axios.post(
      `${baseUrl}/auth/change_password`,
      { currentPassword, newPassword }
    );
    return response.status === 200;
  } catch (error) {
    console.log(error);
    return false;
  }
};
