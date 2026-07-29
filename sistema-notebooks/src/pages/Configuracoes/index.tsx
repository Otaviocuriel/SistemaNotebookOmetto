import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  KeyRound,
  LayoutPanelTop,
  Moon,
  School,
  ShieldCheck,
  Sun,
  Users,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import Modal from "../../components/ui/Modal";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useSettings } from "../../context/SettingsContext";
import { api, mensagemErro } from "../../services/api";

function Toggle({
  ativo,
  onChange,
  label,
}: {
  ativo: boolean;
  onChange: (ativo: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ativo}
      aria-label={label}
      onClick={() => onChange(!ativo)}
      className={`relative h-7 w-12 rounded-full transition ${
        ativo ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-600"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
          ativo ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

export default function Configuracoes() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { tema, definirTema } = useTheme();
  const {
    densidade,
    reduzirAnimacoes,
    mostrarAvisos,
    setDensidade,
    setReduzirAnimacoes,
    setMostrarAvisos,
  } = useSettings();
  const [modalSenha, setModalSenha] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [senha, setSenha] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  async function alterarSenha(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setSucesso("");
    if (senha.novaSenha !== senha.confirmarSenha) {
      setErro("A confirmação não corresponde à nova senha.");
      return;
    }

    setSalvando(true);
    try {
      await api.patch("/usuarios/me/senha", {
        senhaAtual: senha.senhaAtual,
        novaSenha: senha.novaSenha,
      });
      setSenha({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
      setModalSenha(false);
      setSucesso("Sua senha foi alterada com sucesso.");
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl space-y-7">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
            Administração
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Configurações
          </h1>
          <p className="mt-2 max-w-2xl text-slate-500">
            Ajuste a experiência do sistema e mantenha sua conta protegida.
          </p>
        </header>

        {sucesso && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <Check size={20} /> {sucesso}
          </div>
        )}
        {erro && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {erro}
          </div>
        )}

        <section className="settings-section">
          <div className="settings-section__heading">
            <div className="settings-icon"><LayoutPanelTop size={21} /></div>
            <div>
              <h2>Aparência</h2>
              <p>Escolha como o sistema deve aparecer neste dispositivo.</p>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => definirTema("claro")}
              className={`choice-card ${tema === "claro" ? "choice-card--active" : ""}`}
            >
              <Sun size={22} />
              <span><strong>Tema claro</strong><small>Fundo leve para ambientes iluminados</small></span>
              {tema === "claro" && <Check className="ml-auto" size={19} />}
            </button>
            <button
              type="button"
              onClick={() => definirTema("escuro")}
              className={`choice-card ${tema === "escuro" ? "choice-card--active" : ""}`}
            >
              <Moon size={22} />
              <span><strong>Tema escuro</strong><small>Mais conforto em ambientes escuros</small></span>
              {tema === "escuro" && <Check className="ml-auto" size={19} />}
            </button>
          </div>

          <div className="settings-row">
            <div>
              <strong>Densidade compacta</strong>
              <p>Reduz os espaços para mostrar mais informações na tela.</p>
            </div>
            <Toggle
              label="Ativar densidade compacta"
              ativo={densidade === "compacta"}
              onChange={(ativo) =>
                setDensidade(ativo ? "compacta" : "confortavel")
              }
            />
          </div>
          <div className="settings-row">
            <div>
              <strong>Reduzir animações</strong>
              <p>Diminui movimentos e transições da interface.</p>
            </div>
            <Toggle
              label="Reduzir animações"
              ativo={reduzirAnimacoes}
              onChange={setReduzirAnimacoes}
            />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="settings-section">
            <div className="settings-section__heading">
              <div className="settings-icon"><ShieldCheck size={21} /></div>
              <div><h2>Conta e segurança</h2><p>Dados da conta atualmente conectada.</p></div>
            </div>
            <div className="space-y-4 p-5">
              <div className="account-line"><span>Nome</span><strong>{usuario?.nome}</strong></div>
              <div className="account-line"><span>E-mail</span><strong>{usuario?.email}</strong></div>
              <button
                type="button"
                onClick={() => {
                  setErro("");
                  setModalSenha(true);
                }}
                className="secondary-action"
              >
                <KeyRound size={18} /> Alterar minha senha
              </button>
            </div>
          </div>

          <div className="settings-section">
            <div className="settings-section__heading">
              <div className="settings-icon"><School size={21} /></div>
              <div><h2>Escola</h2><p>Identificação desta instalação.</p></div>
            </div>
            <div className="space-y-4 p-5">
              <div className="account-line"><span>Unidade</span><strong>E.E. José Ometto</strong></div>
              <div className="account-line"><span>Sistema</span><strong>Notebook Ometto</strong></div>
              <button
                type="button"
                onClick={() => navigate("/professores")}
                className="secondary-action"
              >
                <Users size={18} /> Gerenciar professores
              </button>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section__heading">
            <div className="settings-icon"><Bell size={21} /></div>
            <div>
              <h2>Avisos</h2>
              <p>Controle os indicadores visuais exibidos neste navegador.</p>
            </div>
          </div>
          <div className="settings-row">
            <div>
              <strong>Mostrar indicador de avisos</strong>
              <p>Exibe um ponto no cabeçalho quando os avisos estiverem ativos.</p>
            </div>
            <Toggle
              label="Mostrar indicador de avisos"
              ativo={mostrarAvisos}
              onChange={setMostrarAvisos}
            />
          </div>
          <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-500 dark:border-slate-700">
            Os e-mails de novos pedidos e retiradas continuam sendo enviados aos
            endereços configurados no servidor.
          </div>
        </section>
      </div>

      <Modal
        isOpen={modalSenha}
        title="Alterar senha"
        onClose={() => !salvando && setModalSenha(false)}
      >
        <form onSubmit={alterarSenha} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="senha-atual">Senha atual</label>
            <input
              id="senha-atual"
              type="password"
              required
              value={senha.senhaAtual}
              onChange={(event) =>
                setSenha({ ...senha, senhaAtual: event.target.value })
              }
              className="form-control"
            />
          </div>
          <div>
            <label className="form-label" htmlFor="nova-senha">Nova senha</label>
            <input
              id="nova-senha"
              type="password"
              required
              minLength={10}
              maxLength={72}
              value={senha.novaSenha}
              onChange={(event) =>
                setSenha({ ...senha, novaSenha: event.target.value })
              }
              className="form-control"
            />
            <p className="mt-2 text-xs text-slate-500">
              Use de 10 a 72 caracteres, com letras e números.
            </p>
          </div>
          <div>
            <label className="form-label" htmlFor="confirmar-senha">Confirmar nova senha</label>
            <input
              id="confirmar-senha"
              type="password"
              required
              value={senha.confirmarSenha}
              onChange={(event) =>
                setSenha({ ...senha, confirmarSenha: event.target.value })
              }
              className="form-control"
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-700">
            <button type="button" onClick={() => setModalSenha(false)} className="secondary-button">
              Cancelar
            </button>
            <button disabled={salvando} className="primary-button">
              {salvando ? "Salvando..." : "Salvar nova senha"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

