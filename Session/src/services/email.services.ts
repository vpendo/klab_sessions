export const sendResetCodeEmail = async (
  email: string,
  code: string
) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.EMAIL_API_KEY!,
    },
    body: JSON.stringify({
      sender: {
        email: process.env.EMAIL_FROM!,
      },
      to: [
        {
          email,
        },
      ],
      subject: "Password Reset Code",
      textContent: `Your password reset code is ${code}. This code expires in 10 minutes.`,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Email API error: ${error}`);
  }
};