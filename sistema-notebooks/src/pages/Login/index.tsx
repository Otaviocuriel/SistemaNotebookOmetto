export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Sistema Notebook
          </h1>

          <p className="text-slate-500 mt-2">
            Faça login para continuar
          </p>
        </div>

        <form className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              E-mail
            </label>

            <input
              type="email"
              placeholder="Digite seu e-mail"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Senha
            </label>

            <input
              type="password"
              placeholder="Digite sua senha"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold cursor-pointer"
          >
            Entrar
          </button>

        </form>

      </div>
    </div>
  );
}