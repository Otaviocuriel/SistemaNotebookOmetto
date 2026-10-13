import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Bell,
  Check,
  KeyRound,
  LayoutPanelTop,
  LockKeyhole,
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

interface ToggleProps {
  ativo: boolean;
  onChange: (ativo: boolean) => void;
  label: string;
}

function Toggle({ ativo, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ativo}
      aria-label={label}
      onClick={() => onChange(!ativo)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-[#d5e8dc] dark:focus:ring-emerald-950 ${
        ativo
          ? "bg-[#347b58]"
          : "bg-slate-300 dark:bg-slate-600"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
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
    setDensidade,
    setReduzirAnimacoes,
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

  function fecharModalSenha() {
    if (salvando) return;

    setModalSenha(false);
    setErro("");
    setSenha({
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    });
  }

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

      setSenha({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
      });

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
      <div className="mx-auto w-full max-w-6xl space-y-7">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#347b58] dark:text-emerald-400">
            Administração
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Configurações
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
            Personalize a interface e mantenha sua conta protegida.
          </p>
        </section>

        {sucesso && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <Check size={20} />
            <p>{sucesso}</p>
          </div>
        )}

        {erro && !modalSenha && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            <AlertCircle size={20} />
            <p>{erro}</p>
          </div>
        )}

        <SecaoConfiguracao
          titulo="Aparência"
          descricao="Escolha como o sistema será exibido neste dispositivo."
          icone={<LayoutPanelTop size={22} />}
        >
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <TemaCard
              ativo={tema === "claro"}
              titulo="Tema claro"
              descricao="Visual leve para ambientes iluminados."
              icone={<Sun size={23} />}
              onClick={() => definirTema("claro")}
            />

            <TemaCard
              ativo={tema === "escuro"}
              titulo="Tema escuro"
              descricao="Mais conforto para ambientes com pouca luz."
              icone={<Moon size={23} />}
              onClick={() => definirTema("escuro")}
            />
          </div>

          <LinhaConfiguracao
            titulo="Densidade compacta"
            descricao="Reduz os espaços para exibir mais informações na tela."
          >
            <Toggle
              label="Ativar densidade compacta"
              ativo={densidade === "compacta"}
              onChange={(ativo) =>
                setDensidade(ativo ? "compacta" : "confortavel")
              }
            />
          </LinhaConfiguracao>

          <LinhaConfiguracao
            titulo="Reduzir animações"
            descricao="Diminui movimentos e transições da interface."
          >
            <Toggle
              label="Reduzir animações"
              ativo={reduzirAnimacoes}
              onChange={setReduzirAnimacoes}
            />
          </LinhaConfiguracao>
        </SecaoConfiguracao>

        <section className="grid gap-6 lg:grid-cols-2">
          <SecaoConfiguracao
            titulo="Conta e segurança"
            descricao="Dados da conta atualmente conectada."
            icone={<ShieldCheck size={22} />}
          >
            <div className="space-y-4 p-5">
              <InformacaoConta label="Nome" valor={usuario?.nome ?? "—"} />

              <InformacaoConta
                label="E-mail"
                valor={usuario?.email ?? "—"}
              />

              <InformacaoConta
                label="Perfil"
                valor={
                  usuario?.tipo === "ADMIN"
                    ? "Administrador"
                    : "Professor"
                }
              />

              <button
                type="button"
                onClick={() => {
                  setErro("");
                  setSucesso("");
                  setModalSenha(true);
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#b9d0c0] bg-white px-4 py-3 font-semibold text-[#1f513a] transition hover:bg-[#f2f7f4] dark:border-slate-600 dark:bg-slate-800 dark:text-emerald-300 dark:hover:bg-slate-700"
              >
                <KeyRound size={18} />
                Alterar minha senha
              </button>
            </div>
          </SecaoConfiguracao>

          <SecaoConfiguracao
            titulo="Escola"
            descricao="Identificação desta instalação."
            icone={<School size={22} />}
          >
            <div className="space-y-4 p-5">
              <InformacaoConta
                label="Unidade"
                valor="E.E. José Ometto"
              />

              <InformacaoConta
                label="Sistema"
                valor="Notebook Ometto"
              />

              <InformacaoConta label="Versão" valor="1.1.0" />

              <button
                type="button"
                onClick={() => navigate("/professores")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#b9d0c0] bg-white px-4 py-3 font-semibold text-[#1f513a] transition hover:bg-[#f2f7f4] dark:border-slate-600 dark:bg-slate-800 dark:text-emerald-300 dark:hover:bg-slate-700"
              >
                <Users size={18} />
                Gerenciar professores
              </button>
            </div>
          </SecaoConfiguracao>
        </section>

        <SecaoConfiguracao
          titulo="Avisos"
          descricao="Notificações enviadas pela escola."
          icone={<Bell size={22} />}
        >
          <div className="flex items-start gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
            <Bell className="mt-0.5 shrink-0 text-[#347b58] dark:text-emerald-400" size={18} />

            <p>
              Quando o envio estiver configurado no servidor, os administradores
              receberão e-mails de novos cadastros, pedidos e retiradas.
            </p>
          </div>
        </SecaoConfiguracao>
      </div>

      <Modal
        isOpen={modalSenha}
        title="Alterar senha"
        onClose={fecharModalSenha}
      >
        <form onSubmit={alterarSenha} className="space-y-5">
          <div className="flex items-start gap-3 rounded-xl border border-[#c7d9cd] bg-[#f2f7f4] p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
            <div className="rounded-lg bg-white p-2 text-[#1f513a] dark:bg-slate-800 dark:text-emerald-300">
              <LockKeyhole size={20} />
            </div>

            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Para proteger sua conta, informe a senha atual antes de criar uma
              nova senha.
            </p>
          </div>

          {erro && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
            >
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
              <p>{erro}</p>
            </div>
          )}

          <CampoSenha
            id="senha-atual"
            label="Senha atual"
            value={senha.senhaAtual}
            onChange={(valor) =>
              setSenha({ ...senha, senhaAtual: valor })
            }
          />

          <CampoSenha
            id="nova-senha"
            label="Nova senha"
            value={senha.novaSenha}
            minLength={10}
            maxLength={72}
            onChange={(valor) =>
              setSenha({ ...senha, novaSenha: valor })
            }
          >
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Use de 10 a 72 caracteres, combinando letras e números.
            </p>
          </CampoSenha>

          <CampoSenha
            id="confirmar-senha"
            label="Confirmar nova senha"
            value={senha.confirmarSenha}
            onChange={(valor) =>
              setSenha({ ...senha, confirmarSenha: valor })
            }
          />

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-700">
            <button
              type="button"
              onClick={fecharModalSenha}
              disabled={salvando}
              className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={salvando}
              className="rounded-xl bg-[#1f513a] px-5 py-2.5 font-semibold text-white transition hover:bg-[#173d2c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {salvando ? "Salvando..." : "Salvar nova senha"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

interface SecaoConfiguracaoProps {
  titulo: string;
  descricao: string;
  icone: ReactNode;
  children: ReactNode;
}

function SecaoConfiguracao({
  titulo,
  descricao,
  icone,
  children,
}: SecaoConfiguracaoProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
        <div className="rounded-xl bg-[#e5f0e9] p-2.5 text-[#1f513a] dark:bg-emerald-950/50 dark:text-emerald-300">
          {icone}
        </div>

        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">
            {titulo}
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {descricao}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

interface LinhaConfiguracaoProps {
  titulo: string;
  descricao: string;
  children: ReactNode;
}

function LinhaConfiguracao({
  titulo,
  descricao,
  children,
}: LinhaConfiguracaoProps) {
  return (
    <div className="flex items-center justify-between gap-5 border-t border-slate-200 px-5 py-4 first:border-t-0 dark:border-slate-700">
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-100">
          {titulo}
        </p>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {descricao}
        </p>
      </div>

      {children}
    </div>
  );
}

interface TemaCardProps {
  ativo: boolean;
  titulo: string;
  descricao: string;
  icone: ReactNode;
  onClick: () => void;
}

function TemaCard({
  ativo,
  titulo,
  descricao,
  icone,
  onClick,
}: TemaCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${
        ativo
          ? "border-[#347b58] bg-[#f2f7f4] text-[#1f513a] ring-1 ring-[#347b58] dark:border-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300"
          : "border-slate-200 bg-white text-slate-700 hover:border-[#b9d0c0] hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      }`}
    >
      <div
        className={`rounded-xl p-2.5 ${
          ativo
            ? "bg-white dark:bg-slate-800"
            : "bg-slate-100 dark:bg-slate-700"
        }`}
      >
        {icone}
      </div>

      <span className="min-w-0 flex-1">
        <strong className="block">{titulo}</strong>

        <small className="mt-1 block text-slate-500 dark:text-slate-400">
          {descricao}
        </small>
      </span>

      {ativo && <Check className="shrink-0" size={19} />}
    </button>
  );
}

interface InformacaoContaProps {
  label: string;
  valor: string;
}

function InformacaoConta({
  label,
  valor,
}: InformacaoContaProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-900/60">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <strong className="break-all text-right text-sm text-slate-800 dark:text-slate-100">
        {valor}
      </strong>
    </div>
  );
}

interface CampoSenhaProps {
  id: string;
  label: string;
  value: string;
  minLength?: number;
  maxLength?: number;
  onChange: (valor: string) => void;
  children?: ReactNode;
}

function CampoSenha({
  id,
  label,
  value,
  minLength,
  maxLength,
  onChange,
  children,
}: CampoSenhaProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>

      <input
        id={id}
        type="password"
        required
        value={value}
        minLength={minLength}
        maxLength={maxLength}
        autoComplete={
          id === "senha-atual"
            ? "current-password"
            : "new-password"
        }
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#347b58] focus:ring-4 focus:ring-[#e5f0e9] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-emerald-950"
      />

      {children}
    </div>
  );
}
