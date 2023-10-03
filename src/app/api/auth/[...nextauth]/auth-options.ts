import { dbConnect } from "@/database/mongo.config";
import User from "@/model/user.schema";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  pages: {
    signIn: "/authwall/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Next Auth",
      //  To make an form by next auth default style
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "enter your password",
        },
      },
      async authorize(credentials, req) {
        // To add some logic here to look up the user credential
        dbConnect();
        const user = await User.findOne({ email: credentials?.email });
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
};
