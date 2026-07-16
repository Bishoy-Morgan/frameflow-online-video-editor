import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { type NextAuthOptions } from "next-auth";

const DUMMY_HASH = "$2b$10$yirkYGrGfpTD.jPD6Th7y.cRV2PiWDUmuJznKXWxBBPVeWz7wFr.u";
const EMAIL_ATTEMPT_LIMIT = 5;
const IP_ATTEMPT_LIMIT = 20;
const RATE_LIMIT_WINDOW_MINUTES = 15;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
          try {
              if (!credentials?.email || !credentials?.password) return null

              const user = await prisma.user.findUnique({
                  where: { email: credentials.email.toLowerCase() },
              })

              const loginAttempts = await prisma.loginAttempt.count({
                  where: {
                      email: credentials.email.toLowerCase(),
                      createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000) },
                  },
              })

              if (loginAttempts >= EMAIL_ATTEMPT_LIMIT) {
                  throw new Error(`Too many login attempts. Please try again in ${RATE_LIMIT_WINDOW_MINUTES} minutes.`)
              }

              const ipAddress = req?.headers?.['x-forwarded-for'] ?? 'unknown'

              const ipAttempts = await prisma.loginAttempt.count({
                  where: {
                      ip: ipAddress,
                      createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000) },
                  },
              })

              if (ipAttempts >= IP_ATTEMPT_LIMIT) {
                  throw new Error(`Too many login attempts from this network. Please try again in ${RATE_LIMIT_WINDOW_MINUTES} minutes.`)
              }

              const hashToCompare = user?.password ?? DUMMY_HASH
              const isValid = await bcrypt.compare(credentials.password, hashToCompare)

              if (!user || !user.password || !isValid) {
                  await prisma.loginAttempt.create({
                      data: { email: credentials.email.toLowerCase(), ip: ipAddress },
                  })
                  return null
              }

              return {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  image: user.image,
                  role: user.role,
              }
          } catch (err) {
              console.error('authorize() error:', err)
              throw err
          }
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
