import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "@/models/user"; // Adjust the path as necessary

async function insertUser() {
  try {
    await mongoose.connect("mongodb://localhost:27017/ecommerce", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const hashedPassword = await bcrypt.hash("securepassword", 10);

    const user = new User({
      name: "John Doe",
      email: "john.doe@example.com",
      password: hashedPassword,
      role: "user",
    });

    const savedUser = await user.save();
    console.log("User inserted successfully:", savedUser);
  } catch (error) {
    console.error("Error inserting user:", error);
  } finally {
    await mongoose.disconnect();
  }
}

export { insertUser };
