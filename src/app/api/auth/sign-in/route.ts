import { dbConnect } from "@/database/mongo.config";
import User from "@/model/user.schema";
import { registerErrorType } from "@/ts/type";
import { loginSchemaValidator } from "@/validator/auth-validator";
import VineErrorReporter from "@/validator/error-reporter";
import vine, { errors } from "@vinejs/vine";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
// Db connection for whole page
dbConnect();

type ResponseType = {
  status: number;
  errors: registerErrorType | any;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validator = vine.compile(loginSchemaValidator);
    validator.errorReporter = () => new VineErrorReporter();
    const output = await validator.validate(body);
    //* Check is email already exist
    const existUser = await User.findOne({ email: output.email });
    if (existUser) {
      const encryptPassCode = bcrypt.compareSync(
        output.password!,
        existUser.password
      );
      if (encryptPassCode) {
        return NextResponse.json<ResponseType>(
          {
            status: 200,
            errors: {
              email: "Account logged in",
            },
          },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          status: 400,

          errors: {
            email: "Wrong credential",
            password: "Wrong credential",
          },
        },
        { status: 200 }
      );
    } else {
      //*   Password encryption
      //* Returning response to front-end
      return NextResponse.json<ResponseType>(
        {
          status: 400,
          errors: {
            email: `No user found with this email ${output.email}`,
          },
        },
        { status: 200 }
      );
    }
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json<ResponseType>(
        { status: 400, errors: error.messages },
        { status: 500 }
      );
    }
  }
}
