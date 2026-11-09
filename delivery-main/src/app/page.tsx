"use client";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIceCream, faBolt, faPalette } from '@fortawesome/free-solid-svg-icons';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  function navigateToSecurePage(path: string) {
    // O ambiente da disciplina usa HTTP para páginas públicas e HTTPS para dados sensíveis.
    if (window.location.protocol === "http:") {
      window.location.assign(`https://${window.location.host}${path}`);
      return;
    }
    router.push(path);
  }



  return (
    <>
    
      
      {/* Conteúdo principal */}
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-green-100">
        <AnimatedBackground />
        {/* Hero Section */}
        <section className="container mx-auto px-9 pt-20 pb-1">
          <div className="text-center max-w-4x1 mx-auto">
            <h1 className="text-8xl md:text-8x1 font-bold mb-8 bg-gradient-to-r from-purple-700 to-green-700 bg-clip-text text-transparent">
              Açaí do Vale
               
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Os melhores sorvetes artesanais direto na sua casa!
            </p>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Escolha seus sabores favoritos, personalize com adicionais deliciosos e receba tudo fresquinho em minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigateToSecurePage('/ui/pedido/tamanho')}
                className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-xl transition-all duration-300 transform hover:scale-105  z-20"
              >
                Fazer Pedido
              </button>
              {!session && (
                <button
                  onClick={() => navigateToSecurePage('/login')}
                  className="bg-white hover:bg-gray-50 text-purple-600 px-8 py-4 rounded-xl text-xl font-bold shadow-xl border-2 border-purple-200 transition-all duration-300 transform hover:scale-105  z-20"
                >
                  Entrar
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl text-center transform transition-all hover:scale-105 hover:shadow-3xl border border-white/50">
              <div className="text-purple-600 mb-6">
                <FontAwesomeIcon icon={faIceCream} className="text-6xl" />
              </div>
              <h3 className="text-3xl font-bold text-purple-700 mb-4">Sabores Artesanais</h3>
              <p className="text-gray-600 text-lg">Mais de 10 sabores especiais feitos com ingredientes premium</p>
            </div>
            
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl text-center transform transition-all hover:scale-105 hover:shadow-3xl border border-white/50">
              <div className="text-purple-600 mb-6">
                <FontAwesomeIcon icon={faBolt} className="text-6xl" />
              </div>
              <h3 className="text-3xl font-bold text-purple-700 mb-4">Entrega Rápida</h3>
              <p className="text-gray-600 text-lg">Seu pedido chega fresquinho em até 30 minutos</p>
            </div>
            
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl text-center transform transition-all hover:scale-105 hover:shadow-3xl border border-white/50">
              <div className="text-purple-600 mb-6">
                <FontAwesomeIcon icon={faPalette} className="text-6xl" />
              </div>
              <h3 className="text-3xl font-bold text-purple-700 mb-4">Personalize Tudo</h3>
              <p className="text-gray-600 text-lg">Adicione coberturas, granulados e muito mais!</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="bg-gradient-to-r from-purple-600 to-green-600 rounded-3xl p-16 text-center text-white max-w-4xl mx-auto shadow-2xl backdrop-blur-xl border border-white/20">
            <h2 className="text-5xl font-bold mb-6">Pronto para se deliciar?</h2>
            <p className="text-2xl mb-12 opacity-90">Monte seu sorvete perfeito em apenas alguns cliques!</p>
            <button
              onClick={() => navigateToSecurePage('/ui/cliente/cadastro')}
              className="bg-white text-purple-600 px-12 py-6 rounded-2xl text-2xl font-bold shadow-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-3xl"
            >
              Começar Agora
            </button>
          </div>
        </section>

        <section id="politica-seguranca" className="container mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto rounded-3xl bg-white/95 p-8 shadow-xl border border-purple-100">
            <h2 className="text-3xl font-bold text-purple-700 mb-4">Política de Segurança</h2>
            <p className="text-gray-700 mb-4">
              A Açaí do Vale protege credenciais, dados de cadastro, endereços e informações de pedidos
              usando HTTPS nas páginas e operações que transmitem esses dados. A página institucional e
              o catálogo público permanecem em HTTP para atender ao escopo acadêmico deste projeto.
            </p>
            <p className="text-gray-700 mb-6">
              No ambiente local de demonstração, o HTTPS usa certificado TLS autoassinado gerado com
              OpenSSL. O navegador pode avisar que esse certificado não é confiável por uma autoridade
              pública. A chave privada deve permanecer secreta, fora do repositório e acessível apenas
              ao servidor. Não informe credenciais se a identidade do servidor não puder ser confirmada.
            </p>
            <button
              onClick={() => navigateToSecurePage('/login')}
              className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl font-bold"
            >
              Acessar login seguro (HTTPS)
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
