import NextAuth, { DefaultSession, User as NextAuthUser } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import "next-auth/jwt";
import client from "@/lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/lib/models";

interface ExtendedUser extends NextAuthUser {
  _id: string;
  image: string;
  password: string;
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      _id: string;
      image: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    image?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth(() => {
  return {
    secret: process.env.AUTH_SECRET,
    adapter: MongoDBAdapter(client),
    trustHost: true,
    debug: process.env.NODE_ENV === "development",
    providers: [
      GitHub({
        allowDangerousEmailAccountLinking: true,
      }),
      Google({
        allowDangerousEmailAccountLinking: true,
      }),
      CredentialsProvider({
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials) return null;

          try {
            const user = await login(credentials as LoginCredentials);
            if (user) {
              return user as ExtendedUser; // Ensure we return ExtendedUser
            }
            return null;
          } catch (error) {
            if (error instanceof Error) {
              // console.log("Authentication error:", error.message);
            } else {
              // console.log("Unexpected error:", error);
            }
            return null;
          }
        },
      }),
    ],
    pages: {
      signIn: "/login",
    },
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          const extendedUser = user as ExtendedUser;
          token._id = extendedUser._id ? String(extendedUser._id) : "";
          token.image = extendedUser.image || "";
        }
        return token;
      },
      async session({ session, token }) {
        if (token) {
          session.user._id = token._id || "";
          session.user.image = token.image || "";
        }
        return session;
      },
    },
  };
});

// Define LoginCredentials for typing
interface LoginCredentials {
  email: string;
  password: string;
}

// Modify `login` to return `ExtendedUser | null`
async function login(
  credentials: LoginCredentials
): Promise<ExtendedUser | null> {
  const { email, password } = credentials;

  try {
    await dbConnect();

    // Find the user with the matching email
    const user = await User.findOne({
      email: credentials.email,
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Compare the provided password with the stored hashed password
    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    // Convert the user document to a plain object
    const userObject: ExtendedUser = {
      ...user.toObject(),
      _id: user._id.toString(),
      image: user.image || "",
      password: user.password || "",
    };

    // Return the user cast as ExtendedUser
    return userObject as ExtendedUser;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Authentication error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return null;
  }
}