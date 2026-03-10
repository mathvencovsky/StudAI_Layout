export function NewProblemSection() {
  return (
    <section className="relative bg-white py-16 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="relative w-full max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Problem */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-100 rounded-full mb-6">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-sm font-medium text-red-700">O problema</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Estudar não deveria<br />ser tão difícil
            </h2>
            
            <div className="space-y-4 text-lg text-gray-600">
              <p>
                Você sabe o que precisa aprender. Mas não sabe por onde começar, quanto tempo vai levar, ou se está fazendo certo.
              </p>
              <p>
                O resultado? Procrastinação, desistência, e a sensação de que nunca vai conseguir.
              </p>
            </div>
          </div>

          {/* Right: Solution */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-200 rounded-full mb-6">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-700">A solução</span>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                É hora de uma abordagem diferente
              </h3>
              
              <p className="text-lg text-gray-700 mb-6">
                IA que entende você, cria seu plano, e te guia todos os dias.
              </p>

              {/* Visual elements */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-sm font-bold">
                      ✓
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600">Milhares de estudantes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
