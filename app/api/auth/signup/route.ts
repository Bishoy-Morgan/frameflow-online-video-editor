import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (!existingUser.password) {
        return Response.json(
          { error: "This email is already registered using Google. Please sign in with Google." },
          { status: 400 }
        );
      }

      return Response.json(
        { error: "This email is already registered. Please sign in instead." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return Response.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
