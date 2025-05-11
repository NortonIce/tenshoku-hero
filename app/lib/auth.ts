import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: '/auth/signin',
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
                        const newUser = await User.create({
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
        async jwt({ token, user, account }) {
            console.log('JWT callback - Initial token:', token);
            console.log('JWT callback - User:', user);
            console.log('JWT callback - Account:', account);

            try {
                await connectDB();
                const dbUser = await User.findOne({ email: token.email });
                console.log('JWT callback - Found user in DB:', dbUser);
                if (dbUser) {
                    token.id = dbUser._id.toString();
                    console.log('JWT callback - Updated token:', token);
                }
            } catch (error) {
                console.error("Error in jwt callback:", error);
            }

            return token;
        },
        async session({ session, token }) {
            console.log('Session callback - Initial session:', session);
            console.log('Session callback - Token:', token);
            
            if (session.user) {
                session.user.id = token.id as string;
                console.log('Session callback - Updated session:', session);
            }
            return session;
        }
    },
}; 