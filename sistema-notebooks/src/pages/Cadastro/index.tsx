import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Cadastro() {

  const navigate = useNavigate();


  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo: "PROFESSOR",
    categoria: "INICIAIS",
  });



  function atualizar(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  }



  async function cadastrar(e: React.FormEvent) {

    e.preventDefault();


    const resposta = await fetch(
      "http://localhost:3333/api/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),

      }
    );



    const dados = await resposta.json();



    if (resposta.ok) {

      alert("Cadastro realizado com sucesso!");

      navigate("/login");

    } else {

      alert(dados.message);

    }

  }



  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100">


      <form
        onSubmit={cadastrar}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >


        <h1 className="text-3xl font-bold text-center">
          Cadastro
        </h1>



        <input
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={atualizar}
          className="w-full border p-3 rounded-lg"
        />



        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={atualizar}
          className="w-full border p-3 rounded-lg"
        />



        <input
          name="senha"
          placeholder="Senha"
          type="password"
          value={form.senha}
          onChange={atualizar}
          className="w-full border p-3 rounded-lg"
        />



        <select
          name="tipo"
          value={form.tipo}
          onChange={atualizar}
          className="w-full border p-3 rounded-lg"
        >

          <option value="PROFESSOR">
            Professor
          </option>


          <option value="ADMIN">
            Administrador
          </option>

        </select>



        {form.tipo === "PROFESSOR" && (

          <select
            name="categoria"
            value={form.categoria}
            onChange={atualizar}
            className="w-full border p-3 rounded-lg"
          >

            <option value="INICIAIS">
              Anos Iniciais
            </option>


            <option value="FINAIS">
              Anos Finais
            </option>


          </select>

        )}



        <button
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >

          Cadastrar

        </button>



        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full text-blue-600 hover:underline"
        >

          Voltar para Login

        </button>


      </form>


    </div>

  );

}