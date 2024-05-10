import { usernameValidation } from "@/Schemas/signupSchema.schema";
import dbConnect from "@/lib/dbConnect";
import { z } from "zod";

const UsernameValidationSchema = z.object({
    username:usernameValidation
})

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    //validate with Zod
    UsernameValidationSchema.safeParse(queryParams.username);
  } catch (error) {
    console.error("Error checking Username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking Username",
      },
      { status: 500 }
    );
  }
}
