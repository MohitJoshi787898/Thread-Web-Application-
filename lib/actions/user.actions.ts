"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connctToDB } from "../mongoose";
interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}
export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connctToDB();
  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    console.log(error);
  }
}
export async function fetchUser(userId: string) {
  try {
    connctToDB();
    return await User.findOne({ id: userId });
    //   .populate({userId:userId({path:"communities",
    // model:Community
    // })
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}