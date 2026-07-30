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

interface LinhaDetalhe {
  rotulo: string;
  valor: string;
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
    (email): email is string => Boolean(email),
  );
}

function criarEmail({
  preHeader,
  etiqueta,
  titulo,
  descricao,
  linhas,
  textoBotao,
  caminhoBotao,
  destaque = "verde",
}: {
  preHeader: string;
  etiqueta: string;
  titulo: string;
  descricao: string;
  linhas: LinhaDetalhe[];
  textoBotao: string;
  caminhoBotao: string;
  destaque?: "verde" | "dourado";
}) {
  const corDestaque = destaque === "dourado" ? "#b18a3d" : "#236143";
  const fundoDestaque = destaque === "dourado" ? "#fff8e8" : "#edf7f1";
  const link = env.FRONTEND_URL
    ? `${env.FRONTEND_URL.replace(/\/$/, "")}${caminhoBotao}`
    : null;

  const detalhes = linhas
    .map(
      ({ rotulo, valor }) => `
        <tr>
          <td style="padding:13px 0;border-bottom:1px solid #e4ebe6;color:#64748b;font-size:14px;">
            ${escaparHtml(rotulo)}
          </td>
          <td align="right" style="padding:13px 0;border-bottom:1px solid #e4ebe6;color:#10271c;font-size:15px;font-weight:700;">
            ${escaparHtml(valor)}
          </td>
        </tr>
      `,
    )
    .join("");

  return `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${escaparHtml(titulo)}</title>
      </head>
      <body style="margin:0;padding:0;background:#f2f6f3;font-family:Arial,Helvetica,sans-serif;color:#10271c;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
          ${escaparHtml(preHeader)}
        </div>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2f6f3;">
          <tr>
            <td align="center" style="padding:32px 14px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;">
                <tr>
                  <td style="padding:0 4px 18px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <div style="font-size:20px;font-weight:800;color:#174c34;">
                            Notebook Ometto
                          </div>
                          <div style="margin-top:4px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#6b7d72;">
                            E.E. José Ometto
                          </div>
                        </td>
                        <td align="right">
                          <div style="display:inline-block;border:1px solid #d5e3da;border-radius:999px;padding:7px 11px;background:#ffffff;color:#236143;font-size:12px;font-weight:700;">
                            Sistema escolar
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="overflow:hidden;border:1px solid #d9e4dc;border-radius:18px;background:#ffffff;box-shadow:0 8px 28px rgba(23,76,52,.08);">
                    <div style="height:7px;background:linear-gradient(90deg,#174c34,#3f8a62,#b18a3d);"></div>

                    <div style="padding:34px 34px 18px;">
                      <div style="display:inline-block;border-radius:999px;padding:7px 11px;background:${fundoDestaque};color:${corDestaque};font-size:11px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">
                        ${escaparHtml(etiqueta)}
                      </div>

                      <h1 style="margin:18px 0 8px;color:#10271c;font-size:26px;line-height:1.25;">
                        ${escaparHtml(titulo)}
                      </h1>

                      <p style="margin:0;color:#5c6f63;font-size:15px;line-height:1.65;">
                        ${escaparHtml(descricao)}
                      </p>
                    </div>

                    <div style="padding:8px 34px 30px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                        ${detalhes}
                      </table>

                      ${
                        link
                          ? `
                            <div style="padding-top:26px;">
                              <a href="${escaparHtml(link)}" style="display:inline-block;border-radius:10px;background:#236143;padding:13px 20px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:800;">
                                ${escaparHtml(textoBotao)} &nbsp;→
                              </a>
                            </div>
                          `
                          : ""
                      }
                    </div>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:20px 20px 0;color:#829087;font-size:12px;line-height:1.6;">
                    Esta é uma notificação automática do Sistema Notebook Ometto.<br />
                    E.E. José Ometto
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

async function enviarEmail({
  assunto,
  html,
  chaveIdempotencia,
}: {
  assunto: string;
  html: string;
  chaveIdempotencia: string;
}) {
  const emails = destinatarios();

  if (!env.RESEND_API_KEY || !emails.length) {
    console.warn(
      "Notificação por e-mail desativada: configure RESEND_API_KEY e NOTIFICATION_EMAILS.",
    );
    return;
  }

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": chaveIdempotencia,
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: emails,
        subject: assunto,
        html,
      }),
    });

    if (!resposta.ok) {
      console.error(
        `Erro do serviço de e-mail (${resposta.status}):`,
        await resposta.text(),
      );
    }
  } catch (error) {
    console.error("Não foi possível enviar a notificação por e-mail:", error);
  }
}

export async function notificarAdministradores(dados: DadosNotificacao) {
  const retirada = dados.tipo === "RETIRADA_SOLICITADA";
  const categoria =
    dados.categoria === "INICIAIS" ? "Anos Iniciais" : "Anos Finais";
  const titulo = retirada
    ? "Notebooks prontos para retirada"
    : "Novo pedido de notebooks";

  await enviarEmail({
    assunto: retirada
      ? `Retirada solicitada — Sala ${dados.sala}`
      : `Novo pedido — Sala ${dados.sala}`,
    chaveIdempotencia: `${dados.tipo.toLowerCase()}-${dados.pedidoId}`,
    html: criarEmail({
      preHeader: retirada
        ? `${dados.professor} solicitou a retirada dos notebooks da sala ${dados.sala}.`
        : `${dados.professor} fez um novo pedido para a sala ${dados.sala}.`,
      etiqueta: retirada ? "Retirada solicitada" : "Nova solicitação",
      titulo,
      descricao: retirada
        ? "O professor informou que os equipamentos já podem ser recolhidos pela equipe responsável."
        : "Um novo pedido foi registrado e está aguardando atendimento da equipe responsável.",
      destaque: retirada ? "dourado" : "verde",
      linhas: [
        { rotulo: "Professor", valor: dados.professor },
        { rotulo: "Sala", valor: dados.sala },
        { rotulo: "Quantidade", valor: `${dados.quantidade} notebooks` },
        { rotulo: "Categoria", valor: categoria },
      ],
      textoBotao: "Abrir painel de pedidos",
      caminhoBotao: "/pedidos",
    }),
  });
}

export async function notificarNovoCadastro(dados: DadosNovoCadastro) {
  const categoria =
    dados.categoria === "INICIAIS" ? "Anos Iniciais" : "Anos Finais";

  await enviarEmail({
    assunto: `Novo cadastro para aprovação — ${dados.professor}`,
    chaveIdempotencia: `novo-cadastro-${dados.usuarioId}`,
    html: criarEmail({
      preHeader: `${dados.professor} solicitou acesso ao Sistema Notebook Ometto.`,
      etiqueta: "Aprovação necessária",
      titulo: "Novo cadastro de professor",
      descricao:
        "Um professor solicitou acesso ao sistema. Confira os dados abaixo antes de aprovar o cadastro.",
      destaque: "dourado",
      linhas: [
        { rotulo: "Professor", valor: dados.professor },
        { rotulo: "E-mail", valor: dados.email },
        { rotulo: "Categoria", valor: categoria },
      ],
      textoBotao: "Analisar cadastro",
      caminhoBotao: "/professores",
    }),
  });
}
