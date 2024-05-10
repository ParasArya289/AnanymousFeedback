import { usernameValidation } from "@/Schemas/signupSchema.schema";
import { verifySchema } from "@/Schemas/verifySchema.schema";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
const UsernameValidationSchema = z.object({
  username: usernameValidation,
});
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    //validate with Zod
    const usernameResult = UsernameValidationSchema.safeParse({
      username: decodedUsername,
    });
    const codeResult = verifySchema.safeParse({ code });

    if (!usernameResult.success) {
      const usernameErrors =
        usernameResult.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "Invalid username",
        },
        { status: 400 }
      );
    }
    if (!codeResult.success) {
      const codeErrors = codeResult.error.format().code?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            codeErrors?.length > 0
              ? codeErrors.join(",")
              : "Invalid Code format",
        },
        { status: 400 }
      );
    }
    const { username: usernameFromZod } = usernameResult.data;
    const { code: codeFromZod } = codeResult.data;

    //zod validation ends

    const user = await UserModel.findOne({
      username: usernameFromZod,
    });
    if (!user) {
      return Response.json({
        success: false,
        message: "User not found with this username.",
      });
    }
    const isCodeValid = user.verifyCode === codeFromZod;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User verified successfully.",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code expired, please signup again to get a new code.",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Verification code incorrect.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user",error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user.",
      },
      { status: 500 }
    );
  }
}
