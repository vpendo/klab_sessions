import { transporter } from "../config/mail";

export const sendResetCodeEmail = async (
  email: string,
  code: string
) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Reset Code",
    text: `Your password reset code is ${code}. This code expires in 10 minutes.`,
  });
};