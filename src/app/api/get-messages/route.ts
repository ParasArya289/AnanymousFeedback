import dbConnect from "@/lib/dbConnect";

import mongoose from "mongoose";
import { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/option";
import UserModel from "@/model/User.model";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;

  if (!session || !_user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(_user._id);
  // console.og
  try {
    // const user = await UserModel.aggregate([
    //   { $match: { username: _user.username } },
    //   { $unwind: "$messages" },
    //   { $sort: { "messages.createdAt": -1 } },
    //   { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    // ]).exec();
    const user = await UserModel.findById(userId, { messages: 1 }).sort({
      "messages.createdAt": -1,
    });
    console.log(user)

    if (!user) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { messages: user.messages },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
