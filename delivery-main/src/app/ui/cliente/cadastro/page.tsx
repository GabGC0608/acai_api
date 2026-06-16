"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function CadastroClientePage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validações Básicas
    if (!nome || !email || !senha) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    // RegEx para Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email deve ter formato válido (ex: usuario@exemplo.com)");
      return;
    }

    // RegEx para Senha Forte
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!senhaRegex.test(senha)) {
      setError("Senha deve ter pelo menos 6 caracteres, 1 maiúscula, 1 minúscula e 1 número");
      return;
    }

    setLoading(true);

    // Formatação do endereço
    const enderecoCompleto = [
      rua.trim(),
      numero.trim(),
      complemento.trim(),
      bairro.trim(),
      cidade.trim(),
    ]
      .filter(Boolean)
      .join(", ");
    const payload = {
      nome,
      email,
        senha,
      // Se a string de endereço for vazia, envia null. Se tiver texto, envia o texto.
      endereco: enderecoCompleto.length > 0 ? enderecoCompleto : null,
      };  



    try {
      // 1. Criar a conta no Banco de Dados
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          senha,
          endereco: enderecoCompleto || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar conta");
      }

      // 2. Login Automático com NextAuth
      const signInResult = await signIn("credentials", {
        email,
        password: senha,
        redirect: false, // Importante para controlarmos o timing do redirecionamento
      });

      if (signInResult?.ok) {
        setSuccess(true);
        // 3. Redirecionamento após feedback visual
        setTimeout(() => {
          router.push("/");
          router.refresh(); // Garante que a sessão seja reconhecida pelo servidor
        }, 2000);
      } else {
        // Se o cadastro foi ok, mas o login falhou por algum motivo técnico
        setError("Conta criada! Redirecionando para login manual...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  // Tela de Sucesso Intermediária
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 text-center border border-green-100">
          <div className="text-6xl mb-4 animate-bounce">✅</div>
          <h1 className="text-3xl font-bold mb-2 text-green-600">Bem-vindo(a)!</h1>
          <p className="text-gray-600">Sua conta foi criada com sucesso.</p>
          <p className="text-gray-400 text-sm mt-2">Redirecionando em instantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-purple-700">Criar Conta</h1>
            <p className="text-gray-500 mt-2">Cadastre-se para começar a fazer seus pedidos</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
              <p className="font-bold">Atenção</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Seção Dados Pessoais */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Seus Dados</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                  <input
                    type="text"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ex: João Silva"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    placeholder="joao@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Senha</label>
                  <input
                    type="password"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                  <input
                    type="password"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Seção Endereço */}
              <div className="space-y-4 bg-gray-50 p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Endereço de Entrega</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Rua</label>
                    <input
                      type="text"
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                      value={rua}
                      onChange={(e) => setRua(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nº</label>
                    <input
                      type="text"
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Complemento</label>
                  <input
                    type="text"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Ex: Apto 402"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bairro</label>
                    <input
                      type="text"
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cidade</label>
                    <input
                      type="text"
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all"
              >
                {loading ? "Processando..." : "Finalizar Cadastro"}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continue com</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Já possui conta?{" "}
            <a href="/login" className="font-semibold text-purple-600 hover:text-purple-500">
              Entre aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}