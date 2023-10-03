import { dbConnect } from "@/database/mongo.config";
import User from "@/model/user.schema";
import { registerSchemaValidator } from "@/validator/auth-validator";
import VineErrorReporter from "@/validator/error-reporter";
import vine, { errors } from "@vinejs/vine";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
// Db connection for whole page
dbConnect();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validator = vine.compile(registerSchemaValidator);
    validator.errorReporter = () => new VineErrorReporter();
    const output = await validator.validate(body);

    //* Check is email already exist
    const existUser = await User.findOne({ email: output.email });
    if (existUser) {
      return NextResponse.json(
        {
          status: 400,
          errors: {
            email: "Email Already Exist, Try to signin",
          },
        },
        { status: 200 }
      );
    } else {
      //*   Password encryption
      const genSalt = bcrypt.genSaltSync(10);
      output.password = bcrypt.hashSync(output.password, genSalt);
      await User.create(output);
      //* Returning response to front-end
      return NextResponse.json(
        { status: 201, message: "User created successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json(
        { status: 400, error: error.messages },
        { status: 500 }
      );
    }
  }
}
