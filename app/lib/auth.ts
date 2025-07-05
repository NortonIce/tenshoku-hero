import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/db/mongodb";
import User from "@/db/models/User";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile?.sub) {
        try {
          await connectDB();

          // Check if user already exists
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user if doesn't exist
            await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              googleId: profile.sub,
            });
          }

          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token }: { token: JWT }) {
      try {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });

        if (dbUser) {
          token.id = dbUser._id.toString();
        }
      } catch (error) {
        console.error("Error in jwt callback:", error);
      }

      return token;
    },
    async session({ session, token }) {
      // console.log('Session callback - Initial session:', session);
      // console.log('Session callback - Token:', token);

      if (session.user) {
        session.user.id = token.id as string;
        console.log("Session callback - Updated session:", session);
      }
      return session;
    },
  },
};
