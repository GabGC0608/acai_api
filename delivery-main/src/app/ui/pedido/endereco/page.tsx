"use client";
import { usePedido } from "../PedidoContext";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EnderecoPage() {
  const { pedido, setPedido } = usePedido();
  const { data: session } = useSession();
  const router = useRouter();
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");
  const [referencia, setReferencia] = useState("");
  const [finalizado, setFinalizado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const valorSubtotal = useMemo(
    () => pedido.potes.reduce((acc, pote) => acc + pote.preco, 0),
    [pedido.potes],
  );
  const valorTotal = useMemo(() => Math.max(0, valorSubtotal - (pedido.desconto || 0)), [valorSubtotal, pedido.desconto]);

  useEffect(() => {
    if (!pedido.cliente?.email && session?.user?.email) {
      setPedido(prev => ({
        ...prev,
        cliente: {
          ...prev.cliente,
          nome: session.user?.name || prev.cliente.nome,
          email: session.user?.email || prev.cliente.email,
        },
      }));
    }
  }, [session, pedido.cliente?.email, setPedido]);

  // Carregar endereço do cliente autenticado
  useEffect(() => {
    const carregarEndereco = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/clientes?email=${encodeURIComponent(session.user.email)}`);
          if (response.ok) {
            const cliente = await response.json();
            if (cliente.endereco) {
              parseEndereco(cliente.endereco);
            }
          }
        } catch (error) {
          console.error('Erro ao carregar endereço:', error);
        } finally {
          setCarregando(false);
        }
      } else {
        setCarregando(false);
      }
    };

    carregarEndereco();
  }, [session?.user?.email]);

  // Helper para fazer parse do endereço completo
  const parseEndereco = (enderecoCompleto: string) => {
    // Formato esperado: "rua, numero[ - complemento], bairro, cidade - estado cep[ (Ref: referencia)]"
    try {
      // Se não houver endereço, apenas retorna
      if (!enderecoCompleto) return;

      // Extrair referência se existir
      const refMatch = enderecoCompleto.match(/\(Ref: ([^)]+)\)/);
      if (refMatch) {
        setReferencia(refMatch[1]);
      }

      // Remove a referência do texto para processar o resto
      let endereco = enderecoCompleto.replace(/\s*\(Ref: [^)]+\)$/, "");

      // Divide por vírgulas e processa cada parte
      const partes = endereco.split(",").map(p => p.trim());
      
      if (partes.length >= 4) {
        // Formato: "rua, numero[ - complemento], bairro, cidade - estado cep"
        const ruaNumero = partes[0]; // "rua"
        const numeroComplemento = partes[1]; // "numero - complemento" ou "numero"
        const bairro_ = partes[2]; // "bairro"
        const cidadeEstadoCep = partes.slice(3).join(",").trim(); // "cidade - estado cep"

        // Parse rua
        setRua(ruaNumero);

        // Parse número e complemento
        if (numeroComplemento.includes("-")) {
          const [num, comp] = numeroComplemento.split("-").map(p => p.trim());
          setNumero(num);
          setComplemento(comp);
        } else {
          setNumero(numeroComplemento);
        }

        // Parse bairro
        setBairro(bairro_);

        // Parse cidade, estado e CEP
        const cidadeMatch = cidadeEstadoCep.match(/^([^-]+)\s*-\s*([A-Z]{2})\s+(\d{5}-?\d{3})/);
        if (cidadeMatch) {
          setCidade(cidadeMatch[1].trim());
          setEstado(cidadeMatch[2].trim());
          setCep(cidadeMatch[3].trim());
        }
      }
    } catch (error) {
      console.error('Erro ao fazer parse do endereço:', error);
    }
  };

  const handleFinalizar = async (e: React.FormEvent) => {
    e.preventDefault();
    const camposObrigatorios = [rua, numero, bairro, cidade, estado, cep];
    if (camposObrigatorios.some((c) => !c)) return;
    const userId = (session?.user as any)?.id;
    if (!userId) {
      alert("Faça login com uma conta válida antes de finalizar.");
      router.push("/ui/pedido/login");
      return;
    }
    const enderecoCompleto = `${rua}, ${numero}${complemento ? " - " + complemento : ""}, ${bairro}, ${cidade} - ${estado} ${cep}${referencia ? " (Ref: " + referencia + ")" : ""}`;
    const pedidoFinal = { ...pedido, endereco: enderecoCompleto, cliente: { ...pedido.cliente, endereco: enderecoCompleto } };
    try {
      // Monta payload compatível com API v1
      // Evitar duplicados na tabela de junção (pedidoId, saborId/adicionalId são únicos)
      const sabores = Array.from(
        new Map(
          pedidoFinal.potes
            .flatMap((pote) => pote.sabores.map((s) => ({ id: Number(s.id) })))
            .map((s) => [s.id, s]),
        ).values(),
      );

      const adicionais = Array.from(
        new Map(
          pedidoFinal.potes
            .flatMap((pote) => (pote.adicionais || []).map((a) => ({ id: Number(a.id) })))
            .map((a) => [a.id, a]),
        ).values(),
      );

      const payload = {
        clienteId: Number(userId),
        sabores,
        adicionais,
        tamanho: pedidoFinal.potes.map((p) => p.tamanho).join(" | "),
        valorTotal,
        cupomCodigo: pedido.cupom?.codigo || null,
        descontoAplicado: pedido.desconto || 0,
        formaPagamento: pedidoFinal.pagamento || "não informado",
        enderecoEntrega: enderecoCompleto,
      };

      await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Salvar endereço no perfil do cliente
      if (session?.user?.email) {
        await fetch("/api/clientes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            endereco: enderecoCompleto,
          }),
        });
      }

      setPedido(pedidoFinal);
      setFinalizado(true);
    } catch (err) {
      alert("Erro ao salvar pedido. Tente novamente.");
    }
  };

  if (finalizado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8 border border-purple-100">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <p className="text-sm text-green-600 font-semibold">Pedido confirmado</p>
              <h1 className="text-3xl font-bold text-purple-800 mt-1 mb-2">Pedido Finalizado!</h1>
              <p className="text-gray-600">Acompanhe o status em “Acompanhar” ou aguarde nosso contato.</p>
            </div>
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold">
              Total pago: R$ {valorTotal.toFixed(2)}
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
              <h2 className="text-lg font-semibold text-purple-800 mb-2">Resumo do Pedido</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                {pedido.potes.map((pote, idx) => (
                  <li key={idx} className="border-b border-purple-100 pb-2 last:border-0">
                    <p className="font-semibold text-purple-800">Pote {idx + 1} · {pote.tamanho}</p>
                    <p>Sabores: {pote.sabores.map((s) => s.nome).join(", ")}</p>
                    <p>Adicionais: {pote.adicionais?.length ? pote.adicionais.map((a) => a.nome).join(", ") : "Nenhum"}</p>
                    <p className="text-green-700 font-semibold">R$ {pote.preco.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-sm text-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Entrega</h2>
              <p><span className="font-semibold">Endereço:</span> {pedido.endereco}</p>
              <p><span className="font-semibold">Pagamento:</span> {pedido.pagamento}</p>
              {pedido.cupom && (
                <p><span className="font-semibold">Cupom:</span> {pedido.cupom.codigo} (-R$ {(pedido.desconto || 0).toFixed(2)})</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-8 space-y-4">
            <p className="text-sm text-purple-100">Etapa 4 de 4</p>
            <h1 className="text-3xl font-bold">Endereço de Entrega</h1>
            <p className="text-purple-50">
              Confira o resumo do seu pedido e informe o endereço para finalizarmos.
            </p>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur">
              <h2 className="text-lg font-semibold mb-3">Resumo</h2>
              <div className="space-y-2 text-sm">
                {pedido.potes.map((pote, idx) => (
                  <div key={idx} className="border-b border-white/20 pb-2 last:border-0">
                    <p className="font-semibold">Pote {idx + 1} · {pote.tamanho}</p>
                    <p className="text-purple-50">Sabores: {pote.sabores.map((s) => s.nome).join(", ")}</p>
                    <p className="text-purple-50">Adicionais: {pote.adicionais?.length ? pote.adicionais.map((a) => a.nome).join(", ") : "Nenhum"}</p>
                    <p className="text-green-100 font-semibold">R$ {pote.preco.toFixed(2)}</p>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm">Pagamento</span>
                  <span className="font-semibold">{pedido.pagamento || "Selecionar"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total</span>
                  <span className="text-xl font-bold text-green-200">R$ {valorTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-4">
            {!session?.user && (
              <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-3 text-sm">
                Você precisa estar logado para finalizar. Volte e faça login.
              </div>
            )}

            {carregando && (
              <div className="w-full bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-3 text-sm">
                Carregando endereço cadastrado...
              </div>
            )}

            <form onSubmit={handleFinalizar} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Rua/Avenida</span>
                  <input
                    value={rua}
                    onChange={(e) => setRua(e.target.value)}
                    className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base bg-gray-50"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Número</span>
                  <input
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base bg-gray-50"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Complemento</span>
                  <input
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    placeholder="Apto, bloco, etc."
                    className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base bg-gray-50"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Bairro</span>
                  <input
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base bg-gray-50"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Cidade</span>
                  <input
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base bg-gray-50"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Estado</span>
                  <input
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base bg-gray-50"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">CEP</span>
                  <input
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base bg-gray-50"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Referência</span>
                  <input
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    placeholder="Ponto de referência"
                    className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base bg-gray-50"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={!rua || !numero || !bairro || !cidade || !estado || !cep}
                className="w-full py-3 rounded-xl text-lg font-semibold shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:from-gray-300 disabled:to-gray-400"
              >
                Finalizar Pedido
              </button>

              <p className="text-sm text-gray-500">
                Se quiser alterar sabores ou adicionais, volte ao carrinho antes de finalizar.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
