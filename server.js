import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIREBASE_RTDB_BASE = 'https://celeiro-reservas-default-rtdb.firebaseio.com/celeiro_reservas_v3';
const ANO_MINIMO_CALENDARIO = 2026;
const ANO_MAXIMO_CALENDARIO = 2027;
const HORARIOS_PERMITIDOS = new Set(['11:30', '11:45', '12:00']);

// Feriados Nacionais Oficiais do Brasil (2026 e 2027) — sem pontos facultativos (Carnaval / Corpus Christi)
export const FERIADOS_NACIONAIS_NOMES = {
  // 2026
  '2026-01-01': 'Confraternização Universal',
  '2026-04-03': 'Paixão de Cristo (Sexta-feira Santa)',
  '2026-04-21': 'Tiradentes',
  '2026-05-01': 'Dia do Trabalho',
  '2026-09-07': 'Independência do Brasil',
  '2026-10-12': 'Nossa Senhora Aparecida',
  '2026-11-02': 'Finados',
  '2026-11-15': 'Proclamação da República',
  '2026-11-20': 'Dia Nacional de Zumbi e da Consciência Negra',
  '2026-12-25': 'Natal',
  // 2027
  '2027-01-01': 'Confraternização Universal',
  '2027-03-26': 'Paixão de Cristo (Sexta-feira Santa)',
  '2027-04-21': 'Tiradentes',
  '2027-05-01': 'Dia do Trabalho',
  '2027-09-07': 'Independência do Brasil',
  '2027-10-12': 'Nossa Senhora Aparecida',
  '2027-11-02': 'Finados',
  '2027-11-15': 'Proclamação da República',
  '2027-11-20': 'Dia Nacional de Zumbi e da Consciência Negra',
  '2027-12-25': 'Natal',
};

export const FERIADOS_PERMITIDOS = new Set(Object.keys(FERIADOS_NACIONAIS_NOMES));

export function obterHojeSaoPauloISO(agora = new Date()) {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(agora);
  } catch {
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}

export function ehDataValidaISO(iso) {
  const str = String(iso || '').trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
  if (!match) return false;
  const ano = Number(match[1]);
  const mes = Number(match[2]);
  const dia = Number(match[3]);
  if (ano < ANO_MINIMO_CALENDARIO || ano > ANO_MAXIMO_CALENDARIO) return false;
  const d = new Date(Date.UTC(ano, mes - 1, dia, 12, 0, 0));
  return (
    d.getUTCFullYear() === ano &&
    d.getUTCMonth() === mes - 1 &&
    d.getUTCDate() === dia
  );
}

export function ehDomingoISO(iso) {
  if (!ehDataValidaISO(iso)) return false;
  const [ano, mes, dia] = iso.split('-').map(Number);
  return new Date(Date.UTC(ano, mes - 1, dia, 12, 0, 0)).getUTCDay() === 0;
}

export function ehFeriadoISO(iso) {
  return Object.prototype.hasOwnProperty.call(
    FERIADOS_NACIONAIS_NOMES,
    String(iso || '').trim()
  );
}

export function obterNomeFeriadoISO(iso) {
  return FERIADOS_NACIONAIS_NOMES[String(iso || '').trim()] || '';
}

function mapaContemData(mapa, iso) {
  if (!mapa || typeof mapa !== 'object') return false;
  const keyDash = String(iso);
  const keyUnder = keyDash.replace(/-/g, '_');
  return mapa[keyDash] === true || mapa[keyUnder] === true;
}

export function avaliarDisponibilidadeData(
  iso,
  bloqueioObj = {},
  configObj = {},
  hojeISO = obterHojeSaoPauloISO()
) {
  const dataISO = String(iso || '').trim();
  if (!ehDataValidaISO(dataISO)) {
    return {
      data: dataISO,
      disponivel: false,
      prioridade: 0,
      motivo: 'data_invalida',
      mensagem: 'Data inválida ou fora do calendário de 2026 e 2027.',
    };
  }

  if (dataISO < hojeISO) {
    return {
      data: dataISO,
      disponivel: false,
      prioridade: 0,
      motivo: 'data_passada',
      mensagem: 'Não é possível realizar reservas para datas que já passaram.',
    };
  }

  const bloqueadaManual =
    mapaContemData(bloqueioObj?.datasTrancadas, dataISO) ||
    mapaContemData(configObj?.datasTrancadas, dataISO);
  const feriadoNome = obterNomeFeriadoISO(dataISO);

  // Prioridade 1: Data bloqueada manualmente NÃO permite reservas.
  if (bloqueadaManual) {
    return {
      data: dataISO,
      disponivel: false,
      prioridade: 1,
      motivo: 'bloqueada_manual',
      feriadoNome: feriadoNome || null,
      mensagem: 'Esta data está bloqueada para novas reservas no momento. Escolha outra data disponível.',
    };
  }

  const liberadaManual =
    mapaContemData(bloqueioObj?.datasLiberadas, dataISO) ||
    mapaContemData(configObj?.datasLiberadas, dataISO);

  // Prioridade 2: Data liberada manualmente permite reservas.
  if (liberadaManual) {
    return {
      data: dataISO,
      disponivel: true,
      prioridade: 2,
      motivo: 'liberada_manual',
      feriadoNome: feriadoNome || null,
      mensagem: 'Data liberada excepcionalmente pela administração.',
    };
  }

  const domingo = ehDomingoISO(dataISO);
  const feriado = ehFeriadoISO(dataISO);

  // Prioridade 3: Domingo ou feriado nacional permite reservas.
  if (domingo || feriado) {
    return {
      data: dataISO,
      disponivel: true,
      prioridade: 3,
      motivo: feriado ? 'feriado' : 'domingo',
      feriadoNome: feriadoNome || null,
      mensagem: feriado
        ? `Feriado nacional (${feriadoNome}) com funcionamento normal para reservas.`
        : 'Domingo com funcionamento normal para reservas.',
    };
  }

  // Prioridade 4: Qualquer outro dia NÃO permite reservas.
  return {
    data: dataISO,
    disponivel: false,
    prioridade: 4,
    motivo: 'dia_comum_indisponivel',
    feriadoNome: null,
    mensagem: 'Reservas são permitidas somente aos domingos, feriados nacionais ou em datas liberadas pela administração.',
  };
}

function ehStatusAtivoReserva(status) {
  const s = String(status || 'reservada').toLowerCase();
  return !['cancelada', 'cancelado', 'encerrada', 'encerrado', 'excluida', 'excluído'].includes(s);
}

async function fetchFirebaseJson(relativePath = '') {
  const suffix = relativePath ? `/${relativePath.replace(/^\/+/, '')}` : '';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`${FIREBASE_RTDB_BASE}${suffix}.json`, {
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Firebase RTDB retornou HTTP ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export function createApp({ fetchDbSnapshot = () => fetchFirebaseJson('') } = {}) {
  const app = express();
  app.use(express.json());
  app.use(express.static(__dirname));

  app.get('/api/feriados', (_req, res) => {
    const feriados = Object.entries(FERIADOS_NACIONAIS_NOMES).map(([data, nome]) => ({
      data,
      nome,
      ano: Number(data.slice(0, 4)),
    }));
    return res.status(200).json({ feriados });
  });

  app.get('/api/disponibilidade/:data', async (req, res) => {
    try {
      const snapshot = (await fetchDbSnapshot()) || {};
      const resultado = avaliarDisponibilidadeData(
        req.params.data,
        snapshot.bloqueio,
        snapshot.configCasa
      );
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(503).json({
        error: 'Não foi possível validar a disponibilidade no momento.',
        details: err?.message || String(err),
      });
    }
  });

  async function validarPayloadReserva(body) {
    const data = String(body?.data || '').trim();
    const horario = String(body?.horario || '').trim();
    const mesa = parseInt(body?.mesa, 10);
    const adultos = parseInt(body?.adultos ?? 0, 10) || 0;
    const kids05 = parseInt(body?.kids05 ?? 0, 10) || 0;
    const kids610 = parseInt(body?.kids610 ?? 0, 10) || 0;
    const totalPessoas = adultos + kids05 + kids610;

    const snapshot = (await fetchDbSnapshot()) || {};
    const disponibilidade = avaliarDisponibilidadeData(
      data,
      snapshot.bloqueio,
      snapshot.configCasa
    );

    if (!disponibilidade.disponivel) {
      return {
        status: 403,
        payload: {
          allowed: false,
          code: disponibilidade.motivo,
          message: disponibilidade.mensagem,
          availability: disponibilidade,
        },
      };
    }

    if (!HORARIOS_PERMITIDOS.has(horario)) {
      return {
        status: 400,
        payload: {
          allowed: false,
          code: 'horario_invalido',
          message: 'Selecione um horário válido para a reserva (11:30, 11:45 ou 12:00).',
          availability: disponibilidade,
        },
      };
    }

    if (!mesa || isNaN(mesa) || mesa < 1) {
      return {
        status: 400,
        payload: {
          allowed: false,
          code: 'mesa_invalida',
          message: 'Número de mesa inválido.',
          availability: disponibilidade,
        },
      };
    }

    if (totalPessoas <= 0 || totalPessoas > 30) {
      return {
        status: 400,
        payload: {
          allowed: false,
          code: 'grupo_invalido',
          message: totalPessoas > 30
            ? 'Para reservas acima de 30 pessoas, utilize a solicitação via WhatsApp.'
            : 'Informe pelo menos 1 integrante para a reserva.',
          availability: disponibilidade,
        },
      };
    }

    const locksData = snapshot.ocupacao_mesas?.[data] || {};
    const lockMesa = locksData[String(mesa)];
    if (lockMesa && lockMesa.reservaId && ehStatusAtivoReserva(lockMesa.status)) {
      return {
        status: 409,
        payload: {
          allowed: false,
          code: 'mesa_ocupada',
          message: 'Ops! Essa mesa acabou de ser reservada por outra pessoa. Escolha outra mesa para continuar.',
          availability: disponibilidade,
        },
      };
    }

    const reservasObj = snapshot.reservas || {};
    const reservasNaData = Object.values(reservasObj).filter(
      (r) => r && r.data === data && ehStatusAtivoReserva(r.status)
    );
    if (reservasNaData.some((r) => parseInt(r.mesa, 10) === mesa)) {
      return {
        status: 409,
        payload: {
          allowed: false,
          code: 'mesa_ocupada',
          message: 'Ops! Essa mesa acabou de ser reservada por outra pessoa. Escolha outra mesa para continuar.',
          availability: disponibilidade,
        },
      };
    }

    const capacidade = Number(snapshot.configCasa?.capacidadePessoas || 400);
    const pessoasNaData = reservasNaData.reduce(
      (sum, r) => sum + (Number(r.adultos) || 0) + (Number(r.kids05) || 0) + (Number(r.kids610) || 0),
      0
    );
    if (pessoasNaData + totalPessoas > capacidade) {
      return {
        status: 409,
        payload: {
          allowed: false,
          code: 'capacidade_esgotada',
          message: `Infelizmente a casa atingiu o limite de capacidade para este dia. Vagas restantes: ${Math.max(0, capacidade - pessoasNaData)}.`,
          availability: disponibilidade,
        },
      };
    }

    return {
      status: 200,
      payload: {
        allowed: true,
        availability: disponibilidade,
      },
    };
  }

  app.post('/api/reservas/validar', async (req, res) => {
    try {
      const result = await validarPayloadReserva(req.body);
      return res.status(result.status).json(result.payload);
    } catch (err) {
      return res.status(503).json({
        allowed: false,
        code: 'backend_indisponivel',
        message: 'Erro ao validar disponibilidade no servidor.',
        details: err?.message || String(err),
      });
    }
  });

  app.post('/api/reservas', async (req, res) => {
    try {
      const result = await validarPayloadReserva(req.body);
      if (result.status !== 200) {
        return res.status(result.status).json(result.payload);
      }

      const nome = String(req.body?.nome || '').trim();
      if (!nome) {
        return res.status(400).json({
          allowed: false,
          code: 'nome_obrigatorio',
          message: 'Por favor, informe o nome completo do responsável.',
        });
      }

      const idReserva = `${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
      const novaReserva = {
        id: idReserva,
        nome,
        adultos: parseInt(req.body.adultos ?? 0, 10) || 0,
        kids05: parseInt(req.body.kids05 ?? 0, 10) || 0,
        kids610: parseInt(req.body.kids610 ?? 0, 10) || 0,
        data: String(req.body.data).trim(),
        horario: String(req.body.horario).trim(),
        mesa: parseInt(req.body.mesa, 10),
        telefone: String(req.body.telefone || '').trim(),
        obs: String(req.body.obs || '').trim(),
        status: 'reservada',
        criadoEm: new Date().toISOString(),
      };

      const lockRes = await fetch(
        `${FIREBASE_RTDB_BASE}/ocupacao_mesas/${novaReserva.data}/${novaReserva.mesa}.json`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reservaId: idReserva,
            data: novaReserva.data,
            horario: novaReserva.horario,
            mesa: novaReserva.mesa,
            nome: novaReserva.nome,
            status: 'reservada',
            atualizadoEm: novaReserva.criadoEm,
          }),
        }
      );
      if (!lockRes.ok) {
        return res.status(403).json({
          allowed: false,
          code: 'rejeitado_banco',
          message: 'Reserva rejeitada pelas regras do banco de dados.',
        });
      }

      const saveRes = await fetch(`${FIREBASE_RTDB_BASE}/reservas/${idReserva}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaReserva),
      });
      if (!saveRes.ok) {
        await fetch(
          `${FIREBASE_RTDB_BASE}/ocupacao_mesas/${novaReserva.data}/${novaReserva.mesa}.json`,
          { method: 'DELETE' }
        ).catch(() => {});
        return res.status(403).json({
          allowed: false,
          code: 'rejeitado_banco',
          message: 'Reserva rejeitada pelas regras do banco de dados.',
        });
      }

      return res.status(201).json({ allowed: true, reserva: novaReserva });
    } catch (err) {
      return res.status(503).json({
        allowed: false,
        code: 'backend_erro',
        message: 'Erro ao processar reserva no servidor.',
        details: err?.message || String(err),
      });
    }
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  return app;
}

const isMainModule =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);

if (isMainModule) {
  const PORT = 3000;
  const app = createApp();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
