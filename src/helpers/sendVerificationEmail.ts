import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/apiResponse";
import VerificationEmail from "../../emails/verificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Anonymous Feedback <onboarding@resend.dev>",
      to: email,
      subject: "Anonmyous Feedback | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Email sent to your Email",
    };
  } catch (error) {
    console.error("Failed to send verification Email", error);
    return {
      success: false,
      message: "Failed to send the verification Email",
    };
  }
}
