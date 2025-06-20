import Image from "next/image";
import Link from "next/link";

// Placeholder for icons, you can replace these with actual icons or SVGs
const FeatureIcon = ({ className }: { className?: string }) => (
  <svg
    className={`w-8 h-8 text-blue-600 ${className}`}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M5 13l4 4L19 7"></path> {/* Example checkmark icon */}
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
    <svg
        className={`w-6 h-6 ${className}`}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path> {/* Example user icon */}
    </svg>
);

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="row-start-1 w-full flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-800 shadow-md">
        <Image
            className="dark:invert"
            src="/estaciona-uai-logo.png"
            alt="App Logo"
            width={50}
            height={50}
            priority
        />
        <Link href="/signin">
          <UserIcon className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer" />
        </Link>
      </header>

      <main className="flex flex-col gap-12 row-start-2 items-center text-center w-full max-w-4xl">
        {/* Hero Section */}
        <section className="flex flex-col gap-6 items-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Bem-vindo ao EstacionaUai
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
            Encontre e reserve vagas de estacionamento facilmente, ou anuncie seu próprio estacionamento para outros usarem.
          </p>
          <div className="flex gap-4 items-center flex-col sm:flex-row mt-6">
            <Link
              href="/signup/customer"
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6"
            >
              Encontre Vagas
            </Link>
            <Link
              href="/signup/manager"
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6"
            >
              Cadastre Seu Estacionamento
            </Link>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12">
          <h2 className="text-3xl font-bold mb-8">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
              <FeatureIcon />
              <h3 className="text-xl font-semibold mt-4 mb-2">1. Chega de filas</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Fure a fila e reserve sua vaga com antecedência, evitando esperas desnecessárias!
              </p>
              <Image
                  src="/chega-de-filas.png"
                  alt="Chega de filas"
                  width={200}
                  height={150}
                  className="rounded-md mt-2"
              />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
              <FeatureIcon />
              <h3 className="text-xl font-semibold mt-4 mb-2">2. Chega de procura</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Sempre saiba onde estacionou seu carro com suas vagas nas mãos!
              </p>
              <Image
                  src="/chega-de-procura.png"
                  alt="Chega de procura"
                  width={200}
                  height={150}
                  className="rounded-md mt-2"
              />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
              <FeatureIcon />
              <h3 className="text-xl font-semibold mt-4 mb-2">3. Fure a fila de novo!</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Pague num instante!
              </p>
              <Image
                  src="/pague-num-instante.png"
                  alt="Pague num instante"
                  width={200}
                  height={150}
                  className="rounded-md mt-2"
              />
            </div>

          </div>
        </section>

        {/* Our Vision Section */}
        <section className="w-full py-12">
          <h2 className="text-3xl font-bold mb-8">Nossa Visão</h2>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              No EstacionaUai, nossa visão é revolucionar a mobilidade urbana criando um ecossistema de estacionamento eficiente e integrado. Nosso objetivo é conectar motoristas a vagas disponíveis sem esforço, reduzindo o congestionamento, economizando tempo e tornando a navegação na cidade uma experiência mais agradável para todos. Acreditamos no uso da tecnologia para construir cidades mais inteligentes e comunidades mais conectadas.
            </p>
          </div>
        </section>

      </main>
      <footer className="row-start-3 flex gap-4 flex-wrap items-center justify-center py-8 border-t border-gray-200 dark:border-gray-700 w-full">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} EstacionaUai. Todos os direitos reservados.
        </p>
        {/* You can add more footer links here if needed */}
        {/* <Link href="/about" className="text-sm text-blue-600 hover:underline">Sobre Nós</Link>
        <Link href="/contact" className="text-sm text-blue-600 hover:underline">Contato</Link> */}
      </footer>
    </div>
  );
}