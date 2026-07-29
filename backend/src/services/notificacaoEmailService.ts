import { env } from "../config/env.js";

type Categoria = "INICIAIS" | "FINAIS";
type TipoNotificacao = "NOVO_PEDIDO" | "RETIRADA_SOLICITADA";

interface DadosNotificacao {
  tipo: TipoNotificacao;
  pedidoId: number;
  professor: string;
  sala: string;
  quantidade: number;
  categoria: Categoria;
}

interface DadosNovoCadastro {
  usuarioId: number;
  professor: string;
  email: string;
  categoria: Categoria;
}

function escaparHtml(valor: string) {
  return valor
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function destinatarios() {
  const configurados = env.NOTIFICATION_EMAILS
    ?.split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (configurados?.length) return configurados;

  return [env.OTAVIO_ADMIN_EMAIL, env.GABRIEL_ADMIN_EMAIL].filter(
    (email): email is string => Boolean(email)
  );
}

export async function notificarAdministradores(dados: DadosNotificacao) {
  const emails = destinatarios();
  if (!env.RESEND_API_KEY || !emails.length) {
    console.warn(
      "Notificação por e-mail desativada: configure RESEND_API_KEY e NOTIFICATION_EMAILS."
    );
    return;
  }

  const retirada = dados.tipo === "RETIRADA_SOLICITADA";
  const titulo = retirada
    ? "Retirada de notebooks solicitada"
    : "Novo pedido de notebooks";
  const destaque = retirada
    ? "O professor informou que os notebooks já podem ser retirados."
    : "Um novo pedido de notebooks foi enviado.";
  const categoria =
    dados.categoria === "INICIAIS" ? "Anos Iniciais" : "Anos Finais";

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `${dados.tipo.toLowerCase()}-${dados.pedidoId}`,
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: emails,
        subject: `${titulo} — Sala ${dados.sala}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#0f172a">
            <div style="background:#1d4ed8;color:white;padding:20px 24px;border-radius:12px 12px 0 0">
              <h1 style="font-size:22px;margin:0">Sistema Notebook Ometto</h1>
            </div>
            <div style="border:1px solid #e2e8f0;border-top:0;padding:24px;border-radius:0 0 12px 12px">
              <h2 style="font-size:20px;margin:0 0 8px">${titulo}</h2>
              <p style="color:#475569;margin:0 0 20px">${destaque}</p>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px 0;color:#64748b">Professor</td><td style="padding:8px 0;font-weight:bold">${escaparHtml(dados.professor)}</td></tr>
                <tr><td style="padding:8px 0;color:#64748b">Sala</td><td style="padding:8px 0;font-weight:bold">${escaparHtml(dados.sala)}</td></tr>
                <tr><td style="padding:8px 0;color:#64748b">Quantidade</td><td style="padding:8px 0;font-weight:bold">${dados.quantidade}</td></tr>
                <tr><td style="padding:8px 0;color:#64748b">Categoria</td><td style="padding:8px 0;font-weight:bold">${categoria}</td></tr>
              </table>
              ${
                env.FRONTEND_URL
                  ? `<a href="${env.FRONTEND_URL}/pedidos" style="display:inline-block;margin-top:20px;background:#2563eb;color:white;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:bold">Abrir pedidos</a>`
                  : ""
              }
            </div>
          </div>
        `,
      }),
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.error(`Erro do serviço de e-mail (${resposta.status}):`, detalhe);
    }
  } catch (error) {
    console.error("Não foi possível enviar a notificação por e-mail:", error);
  }
}

export async function notificarNovoCadastro(dados: DadosNovoCadastro) {
  const emails = destinatarios();
  if (!env.RESEND_API_KEY || !emails.length) return;

  const categoria =
    dados.categoria === "INICIAIS" ? "Anos Iniciais" : "Anos Finais";

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `novo-cadastro-${dados.usuarioId}`,
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: emails,
        subject: `Novo cadastro para aprovação — ${dados.professor}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#0f172a">
            <div style="background:#1d4ed8;color:white;padding:20px 24px;border-radius:12px 12px 0 0">
              <h1 style="font-size:22px;margin:0">Sistema Notebook Ometto</h1>
            </div>
            <div style="border:1px solid #e2e8f0;border-top:0;padding:24px;border-radius:0 0 12px 12px">
              <h2 style="font-size:20px;margin:0 0 8px">Novo cadastro aguardando aprovação</h2>
              <p style="color:#475569;margin:0 0 20px">Um professor solicitou acesso ao sistema.</p>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px 0;color:#64748b">Professor</td><td style="padding:8px 0;font-weight:bold">${escaparHtml(dados.professor)}</td></tr>
                <tr><td style="padding:8px 0;color:#64748b">E-mail</td><td style="padding:8px 0;font-weight:bold">${escaparHtml(dados.email)}</td></tr>
                <tr><td style="padding:8px 0;color:#64748b">Categoria</td><td style="padding:8px 0;font-weight:bold">${categoria}</td></tr>
              </table>
              ${
                env.FRONTEND_URL
                  ? `<a href="${env.FRONTEND_URL}/professores" style="display:inline-block;margin-top:20px;background:#2563eb;color:white;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:bold">Analisar cadastro</a>`
                  : ""
              }
            </div>
          </div>
        `,
      }),
    });

    if (!resposta.ok) {
      console.error(`Erro ao notificar novo cadastro (${resposta.status}):`, await resposta.text());
    }
  } catch (error) {
    console.error("Não foi possível notificar o novo cadastro:", error);
  }
}

