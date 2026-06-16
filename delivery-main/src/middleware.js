import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isPageAdmin = req.nextUrl.pathname.startsWith("/admin");

    // Se tentar acessar /admin e não for admin, redireciona ou bloqueia
    if (isPageAdmin && !token?.isAdmin) {
      return NextResponse.rewrite(new URL("/login?error=AcessoNegado", req.url));
    }
  },
  {
    callbacks: {
      // O middleware só executa se o usuário estiver logado
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  // Adicione aqui as rotas que exigem login E as de admin
  matcher: ["/protegido/:path*", "/admin/:path*"],
};