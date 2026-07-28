import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {

  const navigate = useNavigate();


  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");



  async function entrar(e: React.FormEvent) {

    e.preventDefault();



    const resposta = await fetch(
      "http://localhost:3333/api/auth/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          senha,
        }),

      }
    );



    const dados = await resposta.json();



    if (resposta.ok) {

      localStorage.setItem(
        "token",
        dados.token
      );


      localStorage.setItem(
        "usuario",
        JSON.stringify(dados.usuario)
      );


      navigate("/dashboard");


    } else {

      alert(dados.message);

    }

  }



  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">


        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-slate-800">
            Sistema Notebook
          </h1>

          <p className="text-slate-500 mt-2">
            Faça login para continuar
          </p>

        </div>



        <form 
          onSubmit={entrar}
          className="space-y-5"
        >


          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              E-mail
            </label>


            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
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
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>



          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold cursor-pointer"
          >

            Entrar

          </button>



          <button
            type="button"
            onClick={() => navigate("/cadastro")}
            className="w-full text-blue-600 hover:underline"
          >

            Cadastro

          </button>


        </form>


      </div>

    </div>

  );

}