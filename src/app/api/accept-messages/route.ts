import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }
  const userId = user?._id;
  const { isAcceptingMessage } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage,
      },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message:
            "User not found. Failed to update message acceptance status.",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Updated message acceptance status.",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating message acceptance status.", error);
    return Response.json(
      {
        success: false,
        message: "Error updating message acceptance status.",
      },
      { status: 500 }
    );
  }
}
export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }
  const userId = user?._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found. Failed to fetch message acceptance status.",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Successfull fetched message acceptance status.",
        isAcceptingMessage: foundUser?.isAcceptingMessage,
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching message acceptance status.", error);
    return Response.json(
      {
        success: false,
        message: "Error fetching message acceptance status.",
      },
      { status: 500 }
    );
  }
}
