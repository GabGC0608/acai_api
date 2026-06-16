import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }, // Alterado para 'password' para padrão do NextAuth
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.cliente.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        // Compara a senha digitada com o hash do banco
        const senhaValida = await bcrypt.compare(credentials.password, user.senha);
        if (!senhaValida) return null;

        // Retornamos tudo que precisamos levar para o Token
        return { 
          id: user.id.toString(),
          email: user.email, 
          name: user.nome, 
          isAdmin: (user as any).isAdmin || false,
          endereco: (user as any).endereco || null // Adicionado endereço aqui
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      // 1. No login via Credentials, o objeto 'user' vem preenchido do authorize
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.endereco = user.endereco;
        token.name = user.name;
        token.email = user.email;
      }

      // 2. Fluxo para Google (Vincula ou cria cliente se não existir)
      if (account?.provider === "google" && token.email) {
        const existing = await prisma.cliente.findUnique({ where: { email: token.email } });
        
        if (existing) {
          token.id = existing.id.toString();
          token.isAdmin = existing.isAdmin;
          token.endereco = existing.endereco;
        } else {
          // Cria novo cliente se for o primeiro login via Google
          const randomPassword = randomBytes(16).toString("hex");
          const hashedPassword = await bcrypt.hash(randomPassword, 10);
          
          const created = await prisma.cliente.create({
            data: {
              email: token.email,
              nome: token.name || token.email,
              senha: hashedPassword,
              isAdmin: false, // Novos usuários Google não são admins por padrão
              endereco: null
            } as any,
          });
          
          token.id = created.id.toString();
          token.isAdmin = created.isAdmin;
          token.endereco = created.endereco;
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      // 3. Passa os dados do token para a sessão acessível no Front-end
      if (session.user) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
        session.user.endereco = token.endereco;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};