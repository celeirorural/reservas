// FERIADOS NACIONAIS, ESTADUAL (SP - 09/07) E MUNICIPAIS DE BAURU/SP (CORPUS CHRISTI E 01/08) + CARNAVAL PARA 2026 E 2027
       const feriadosPermitidos = [
           // 2026
           "2026-01-01", // Confraternização Universal
           "2026-02-17", // Carnaval
           "2026-04-03", // Paixão de Cristo (Sexta-feira Santa)
           "2026-04-21", // Tiradentes
           "2026-05-01", // Dia do Trabalho
           "2026-06-04", // Corpus Christi (Municipal Bauru/SP)
           "2026-07-09", // Revolução Constitucionalista (Estadual SP)
           "2026-08-01", // Aniversário de Bauru (Municipal Bauru/SP)
           "2026-09-07", // Independência do Brasil
           "2026-10-12", // Nossa Senhora Aparecida
           "2026-11-02", // Finados
           "2026-11-15", // Proclamação da República
           "2026-11-20", // Consciência Negra
           "2026-12-25", // Natal
           // 2027
           "2027-01-01", // Confraternização Universal
           "2027-02-09", // Carnaval
           "2027-03-26", // Paixão de Cristo (Sexta-feira Santa)
           "2027-04-21", // Tiradentes
           "2027-05-01", // Dia do Trabalho
           "2027-05-27", // Corpus Christi (Municipal Bauru/SP)
           "2027-07-09", // Revolução Constitucionalista (Estadual SP)
           "2027-08-01", // Aniversário de Bauru (Municipal Bauru/SP)
           "2027-09-07", // Independência do Brasil
           "2027-10-12", // Nossa Senhora Aparecida
           "2027-11-02", // Finados
           "2027-11-15", // Proclamação da República
           "2027-11-20", // Consciência Negra
           "2027-12-25"  // Natal
       ];

        const ANO_MINIMO_CALENDARIO = 2026;
        const ANO_MAXIMO_CALENDARIO = 2027;

        // FUNÇÃO UTILITÁRIA PARA FORMATAR DATA EM YYYY-MM-DD RESPEITANDO O FUSO HORÁRIO LOCAL
        function obterDataFormatadaISO(dataObj) {
            const ano = dataObj.getFullYear();
            const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
            const dia = String(dataObj.getDate()).padStart(2, '0');
            return `${ano}-${mes}-${dia}`;
        }

        function ehDataValidaISO(iso) {
            const str = String(iso || '').trim();
            const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
            if (!match) return false;
            const ano = Number(match[1]);
            const mes = Number(match[2]);
            const dia = Number(match[3]);
            if (ano < ANO_MINIMO_CALENDARIO || ano > ANO_MAXIMO_CALENDARIO) return false;
            const d = new Date(ano, mes - 1, dia);
            return d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia;
        }

        function ehDataPassadaISO(iso) {
            const d = dataLocalPorISO(iso);
            if (!d) return true;
            const hoje = new Date();
            const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
            return d < inicioHoje;
        }

        // FUNÇÃO LEGADA MANTIDA PARA COMPATIBILIDADE
        function obterProximoDomingoLocal() {
            const hoje = new Date();
            let proxDom = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
            while (proxDom.getDay() !== 0) {
                proxDom.setDate(proxDom.getDate() + 1);
            }
            return obterDataFormatadaISO(proxDom);
        }

        document.addEventListener("DOMContentLoaded", () => {
            const campoData = document.getElementById('cli-data');
            const hojeObj = new Date();
            const hojeISO = obterDataFormatadaISO(hojeObj);

            campoData.min = hojeISO;
            campoData.max = `${ANO_MAXIMO_CALENDARIO}-12-31`;

            // SELECIONA A PRÓXIMA DATA DISPONÍVEL EM 2026/2027 COMO PADRÃO (FUSO LOCAL)
            campoData.value = obterProximaDataPermitidaCliente(hojeObj);

           // INICIALIZA ESTILO E POP-UP
           const stylePopup = document.createElement('style');
           stylePopup.innerHTML = `
               .popup-notificacao {
                   position: fixed;
                   top: -100px;
                   left: 50%;
                   transform: translateX(-50%);
                   background: #10B981;
                   color: #FFFFFF;
                   border: 1px solid #34D399;
                   padding: 12px 18px;
                   border-radius: 10px;
                   box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
                   z-index: 10000;
                   display: flex;
                   align-items: center;
                   gap: 10px;
                   font-weight: 700;
                   font-size: 0.88rem;
                   transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                   opacity: 0;
                   width: max-content;
                   max-width: 90%;
                   overflow: hidden;
               }
               .popup-notificacao.show {
                   top: 20px;
                   opacity: 1;
               }
               .popup-notificacao i {
                   color: #FFFFFF;
                   font-size: 1.2rem;
                   flex-shrink: 0;
               }
               .popup-notificacao span {
                   line-height: 1.25;
                   display: -webkit-box;
                   -webkit-line-clamp: 2;
                   -webkit-box-orient: vertical;
                   overflow: hidden;
               }
               .popup-progress-bar {
                   position: absolute;
                   bottom: 0;
                   left: 0;
                   height: 3px;
                   background: rgba(255, 255, 255, 0.85);
                   width: 100%;
               }
               .popup-notificacao.show .popup-progress-bar {
                   animation: animBarraTempo 3.5s linear forwards;
               }
               @keyframes animBarraTempo {
                   from { width: 100%; }
                   to { width: 0%; }
               }
           `;
           document.head.appendChild(stylePopup);

           const divPopup = document.createElement('div');
           divPopup.id = 'popup-notificacao';
           divPopup.className = 'popup-notificacao';
           divPopup.innerHTML = `
               <i class="fa-solid fa-circle-check"></i> 
               <span>Reserva concluída com sucesso!</span>
               <div class="popup-progress-bar"></div>
           `;
           document.body.appendChild(divPopup);
           inicializarCalendarioCliente();
           inicializarCustomSelect('cli-horario');
           inicializarCustomSelect('cli-mesa');
           document.getElementById('cli-horario')?.addEventListener('change', () => {
               ocultarAlertaConflitoMesa();
               atualizarSelectMesas();
           });
           document.getElementById('cli-mesa')?.addEventListener('change', () => {
               ocultarAlertaConflitoMesa();
           });
       });

       // VALIDAR SE A DATA ESTÁ DENTRO DAS REGRAS DE FUNCIONAMENTO E NÃO PASSOU
       function validarDataSelecionada() {
           const campoData = document.getElementById('cli-data');
           const dataValor = campoData.value;
           if (!dataValor) return;

           const disp = avaliarDisponibilidadeData(dataValor);
           if (!disp.disponivel) {
               mostrarPopupNotificacao(disp.mensagem || "Reservas disponíveis somente aos domingos, feriados ou em datas liberadas.", "fa-circle-exclamation");
               campoData.value = obterProximaDataPermitidaCliente(new Date());
           }
       }

       // TRAVA DE GRUPO ACIMA DE 30 PESSOAS
       function validarCapacidadeGrupo() {
           const adultos = parseInt(document.getElementById('cli-adultos').value) || 0;
           const kids05 = parseInt(document.getElementById('cli-kids05').value) || 0;
           const kids610 = parseInt(document.getElementById('cli-kids610').value) || 0;
           const totalPessoas = adultos + kids05 + kids610;

           const btnSubmit = document.getElementById('btn-submit');
           const alertaGrupo = document.getElementById('alerta-grupo-grande');
           const btnWspGrupo = document.getElementById('btn-whatsapp-grupo');
           const popup = document.getElementById('grupo-limite-popup');
           const nomeCliente = document.getElementById('cli-nome').value.trim() || 'Cliente';

           if (totalPessoas > 30) {
               btnSubmit.classList.add('hidden');
               alertaGrupo?.classList.add('hidden');
               btnWspGrupo?.classList.add('hidden');

               const totalEl = document.getElementById('grupo-limite-total');
               if (totalEl) totalEl.textContent = totalPessoas;

               const msg = `Olá! Gostaria de solicitar uma reserva especial para um grande evento no Celeiro.\
\
` +
                           `👤 *Responsável:* ${nomeCliente}\
` +
                           `👥 *Total de Integrantes:* ${totalPessoas} pessoas (${adultos} Adultos, ${kids610} Meia, ${kids05} Free)`;
               const btnPopup = document.getElementById('btn-whatsapp-popup');
               if (btnPopup) {
                   btnPopup.href = `https://api.whatsapp.com/send/?phone=5514991449726&text=${encodeURIComponent(msg)}&type=phone_number&app_absent=0`;
               }

               if (popup && popup.classList.contains('hidden')) {
                   popup.classList.remove('hidden');
                   popup.setAttribute('aria-hidden','false');
                   document.body.classList.add('modal-open');
               }
           } else {
               btnSubmit.classList.remove('hidden');
               alertaGrupo?.classList.add('hidden');
               btnWspGrupo?.classList.add('hidden');
               fecharPopupGrupoGrande();
           }
       }

       function fecharPopupGrupoGrande() {
           const popup = document.getElementById('grupo-limite-popup');
           if (!popup) return;
           popup.classList.add('hidden');
           popup.setAttribute('aria-hidden','true');
           document.body.classList.remove('modal-open');
       }

       function mostrarPopupNotificacao(mensagem = 'Reserva concluída com sucesso!', icone = 'fa-circle-check') {
           const popup = document.getElementById('popup-notificacao');
           if (!popup) return;
           const span = popup.querySelector('span');
           const iconeEl = popup.querySelector('i');
           if (span) span.textContent = mensagem;
           if (iconeEl) iconeEl.className = `fa-solid ${icone}`;

           popup.classList.remove('show');
           void popup.offsetWidth; 
           popup.classList.add('show');
           setTimeout(() => { popup.classList.remove('show'); }, 3500);
       }

       // CONFIGURAÇÃO DO FIREBASE
       const firebaseConfig = {
           apiKey: "AIzaSyBpKucUgBttsZtyAHFYBANNQCCnHtLZ1K4",
           authDomain: "celeiro-reservas.firebaseapp.com",
           databaseURL: "https://celeiro-reservas-default-rtdb.firebaseio.com",
           projectId: "celeiro-reservas",
           storageBucket: "celeiro-reservas.appspot.com",
           messagingSenderId: "832965794778",
           appId: "1:832965794778:web:78ae6eee2589c28c6b3ee3"
       };

       firebase.initializeApp(firebaseConfig);
       const dbRef = firebase.database().ref('celeiro_reservas_v3');
       
       let estadoGlobal = {
           reservas: [],
           ocupacaoMesas: {},
           configCasa: { totalMesas: 100, capacidadePessoas: 400, reservasTrancadas: false },
           bloqueio: {
               trancado: false,
               mensagem: "Capacidade lotada para este dia! No momento, não estamos aceitando novas reservas. Agradecemos pela compreensão.",
               datasTrancadas: {},
               datasLiberadas: {}
           }
       };
       let dadosReservaAtual = null;
       let reservaEmProcessamento = false;

       function ehStatusAtivoReserva(status) {
           const s = String(status || 'reservada').toLowerCase();
           return !['cancelada', 'cancelado', 'encerrada', 'encerrado', 'excluida', 'excluído'].includes(s);
       }

       function aplicarDadosSnapshotGlobal(dados) {
           if (dados) {
               estadoGlobal.reservas = dados.reservas
                   ? Object.entries(dados.reservas).map(([firebaseKey, item]) => ({
                       ...(item || {}),
                       id: item?.id || firebaseKey,
                       _firebaseKey: firebaseKey
                   }))
                   : [];
               estadoGlobal.ocupacaoMesas = (dados.ocupacao_mesas && typeof dados.ocupacao_mesas === 'object')
                   ? dados.ocupacao_mesas
                   : {};
               if (dados.configCasa) estadoGlobal.configCasa = dados.configCasa;

               const datasTrancadas = {
                   ...(dados.configCasa?.datasTrancadas && typeof dados.configCasa.datasTrancadas === 'object' ? dados.configCasa.datasTrancadas : {}),
                   ...(dados.bloqueio?.datasTrancadas && typeof dados.bloqueio.datasTrancadas === 'object' ? dados.bloqueio.datasTrancadas : {})
               };

               const datasLiberadas = {
                   ...(dados.configCasa?.datasLiberadas && typeof dados.configCasa.datasLiberadas === 'object' ? dados.configCasa.datasLiberadas : {}),
                   ...(dados.bloqueio?.datasLiberadas && typeof dados.bloqueio.datasLiberadas === 'object' ? dados.bloqueio.datasLiberadas : {})
               };

               estadoGlobal.bloqueio = {
                   trancado: false,
                   mensagem: dados.bloqueio?.mensagem || "Capacidade lotada para este dia! No momento, não estamos aceitando novas reservas. Agradecemos pela compreensão.",
                   datasTrancadas: datasTrancadas,
                   datasLiberadas: datasLiberadas
               };
           } else {
               estadoGlobal.reservas = [];
               estadoGlobal.ocupacaoMesas = {};
               estadoGlobal.bloqueio = { trancado: false, datasTrancadas: {}, datasLiberadas: {} };
           }
       }

       function obterMesasOcupadasNaData(dataISO, ignorarReservaId = null) {
           const ocupadas = new Set();
           if (!dataISO) return ocupadas;

           const reservas = Array.isArray(estadoGlobal?.reservas) ? estadoGlobal.reservas : [];
           reservas.forEach(r => {
               if (!r || r.data !== dataISO) return;
               if (ignorarReservaId && String(r.id) === String(ignorarReservaId)) return;
               if (!ehStatusAtivoReserva(r.status)) return;
               const m = parseInt(r.mesa, 10);
               if (!isNaN(m)) ocupadas.add(m);
           });

           const locksData = estadoGlobal?.ocupacaoMesas?.[dataISO];
           if (locksData && typeof locksData === 'object') {
               Object.entries(locksData).forEach(([mesaKey, lock]) => {
                   if (!lock || !lock.reservaId) return;
                   if (ignorarReservaId && String(lock.reservaId) === String(ignorarReservaId)) return;
                   if (!ehStatusAtivoReserva(lock.status)) return;
                   const m = parseInt(lock.mesa ?? mesaKey, 10);
                   if (!isNaN(m)) ocupadas.add(m);
               });
           }

           return ocupadas;
       }

       async function ocuparLockMesaAtomico(dataISO, mesaNum, dadosLock) {
           const lockRef = dbRef.child('ocupacao_mesas').child(String(dataISO)).child(String(parseInt(mesaNum, 10)));
           const txResult = await lockRef.transaction((currentLock) => {
               if (
                   currentLock &&
                   currentLock.reservaId &&
                   String(currentLock.reservaId) !== String(dadosLock.reservaId) &&
                   ehStatusAtivoReserva(currentLock.status)
               ) {
                   // Aborta atomicamente: outro cliente acabou de reservar esta mesa nesta data
                   return;
               }
               return {
                   reservaId: String(dadosLock.reservaId),
                   data: String(dataISO),
                   horario: String(dadosLock.horario || ''),
                   mesa: parseInt(mesaNum, 10),
                   nome: String(dadosLock.nome || ''),
                   status: String(dadosLock.status || 'reservada'),
                   atualizadoEm: new Date().toISOString()
               };
           });
           return txResult;
       }

       async function liberarLockMesa(dataISO, mesaNum, reservaId = null) {
           if (!dataISO || !mesaNum) return;
           const mesaKey = String(parseInt(mesaNum, 10));
           const lockRef = dbRef.child('ocupacao_mesas').child(String(dataISO)).child(mesaKey);
           try {
               await lockRef.transaction((curr) => {
                   if (!curr) return curr;
                   if (!reservaId || !curr.reservaId || String(curr.reservaId) === String(reservaId)) {
                       return null;
                   }
                   return curr;
               });
           } catch (err) {
               console.warn('Aviso ao liberar lock de mesa:', err);
           }
       }

       function mostrarAlertaConflitoMesa(mensagem = 'Ops! Essa mesa acabou de ser reservada por outra pessoa. Escolha outra mesa para continuar.') {
           const box = document.getElementById('alerta-conflito-mesa');
           const txt = document.getElementById('alerta-conflito-mesa-texto');
           if (txt) txt.textContent = mensagem;
           if (box) {
               box.classList.remove('hidden');
               box.scrollIntoView({ behavior: 'smooth', block: 'center' });
           } else {
               alert(mensagem);
           }
           mostrarPopupNotificacao('Mesa indisponível. Escolha outra mesa!', 'fa-circle-exclamation');
       }

       function ocultarAlertaConflitoMesa() {
           const box = document.getElementById('alerta-conflito-mesa');
           if (box) box.classList.add('hidden');
       }

       firebase.database().ref('.info/connected').on('value', (snap) => {
           const container = document.getElementById('conexao-status-container');
           if (snap.val() === true) {
               container.innerHTML = `<span class="status-conexao-badge sc-online"><i class="fa-solid fa-circle"></i> Online</span>`;
           } else {
               container.innerHTML = `<span class="status-conexao-badge sc-offline"><i class="fa-solid fa-wifi"></i> Offline</span>`;
           }
       });

       let clienteDataEscolhidaManualmente = false;
       let clienteMesAtual = new Date();
       let clienteDataSelecionada = null;

       dbRef.on('value', (snapshot) => {
           aplicarDadosSnapshotGlobal(snapshot.val());
           if (
               !clienteDataEscolhidaManualmente &&
               (!clienteDataSelecionada || !ehDataPermitidaCliente(clienteDataSelecionada) || verificarSeReservasTrancadas(clienteDataSelecionada))
           ) {
               const proxLivre = obterProximaDataPermitidaCliente(new Date());
               if (proxLivre) {
                   clienteDataSelecionada = proxLivre;
                   const campo = document.getElementById('cli-data');
                   if (campo) campo.value = proxLivre;
                   const d = dataLocalPorISO(proxLivre);
                   if (d) clienteMesAtual = new Date(d.getFullYear(), d.getMonth(), 1);
               }
           }
           atualizarInterfaceBloqueioCliente();
           atualizarSelectMesas();
           renderCalendarioCliente();
           atualizarAdminSeAberto();
       });

       function normalizarChaveDataISO(chave) {
           const str = String(chave || '').trim();
           if (/^\d{4}_\d{2}_\d{2}$/.test(str)) return str.replace(/_/g, '-');
           if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
           return '';
       }

       function verificarDataEspecificaTrancada(dataISO, bloqueioObj = estadoGlobal?.bloqueio, configObj = estadoGlobal?.configCasa) {
           if (!dataISO) return false;
           const keyOriginal = String(dataISO);
           const keyUnder = keyOriginal.replace(/-/g, '_');
           const mapas = [bloqueioObj?.datasTrancadas, configObj?.datasTrancadas];
           return mapas.some((mapa) => Boolean(mapa && (mapa[keyOriginal] === true || mapa[keyUnder] === true)));
       }

       function verificarDataEspecificaLiberada(dataISO, bloqueioObj = estadoGlobal?.bloqueio, configObj = estadoGlobal?.configCasa) {
           if (!dataISO) return false;
           const keyOriginal = String(dataISO);
           const keyUnder = keyOriginal.replace(/-/g, '_');
           const mapas = [bloqueioObj?.datasLiberadas, configObj?.datasLiberadas];
           return mapas.some((mapa) => Boolean(mapa && (mapa[keyOriginal] === true || mapa[keyUnder] === true)));
       }

       function ehDomingoISO(dataISO) {
           const d = dataLocalPorISO(dataISO);
           return Boolean(d && d.getDay() === 0);
       }

       function ehFeriadoISO(dataISO) {
           return feriadosPermitidos.includes(String(dataISO || '').trim());
       }

       function ehFuncionamentoPadraoISO(dataISO) {
           return ehDomingoISO(dataISO) || ehFeriadoISO(dataISO);
       }

       /*
        * ORDEM DE PRIORIDADE RIGOROSA DE DISPONIBILIDADE:
        * 1. Data bloqueada manualmente: NÃO permite reservas.
        * 2. Data liberada manualmente: permite reservas.
        * 3. Domingo ou feriado: permite reservas.
        * 4. Qualquer outro dia: NÃO permite reservas.
        */
       function avaliarDisponibilidadeData(dataISO, bloqueioObj = estadoGlobal?.bloqueio, configObj = estadoGlobal?.configCasa, ignorarPassado = false) {
           const iso = String(dataISO || '').trim();
           if (!iso || !ehDataValidaISO(iso)) {
               return {
                   data: iso,
                   disponivel: false,
                   prioridade: 0,
                   motivo: 'data_invalida',
                   mensagem: 'Por favor, selecione uma data válida dentro do calendário de 2026 ou 2027.'
               };
           }

           if (!ignorarPassado && ehDataPassadaISO(iso)) {
               return {
                   data: iso,
                   disponivel: false,
                   prioridade: 0,
                   motivo: 'data_passada',
                   mensagem: 'Não é possível realizar reservas para datas que já passaram.'
               };
           }

           const bloqueadaManual = verificarDataEspecificaTrancada(iso, bloqueioObj, configObj);
           if (bloqueadaManual) {
               return {
                   data: iso,
                   disponivel: false,
                   prioridade: 1,
                   motivo: 'bloqueada_manual',
                   ehDomingo: ehDomingoISO(iso),
                   ehFeriado: ehFeriadoISO(iso),
                   bloqueadaManual: true,
                   liberadaManual: verificarDataEspecificaLiberada(iso, bloqueioObj, configObj),
                   mensagem: 'Esta data está bloqueada para novas reservas no momento. Escolha outra data disponível.'
               };
           }

           const liberadaManual = verificarDataEspecificaLiberada(iso, bloqueioObj, configObj);
           if (liberadaManual) {
               return {
                   data: iso,
                   disponivel: true,
                   prioridade: 2,
                   motivo: 'liberada_manual',
                   ehDomingo: ehDomingoISO(iso),
                   ehFeriado: ehFeriadoISO(iso),
                   bloqueadaManual: false,
                   liberadaManual: true,
                   mensagem: 'Data liberada manualmente pela administração.'
               };
           }

           const domingo = ehDomingoISO(iso);
           const feriado = ehFeriadoISO(iso);
           if (domingo || feriado) {
               return {
                   data: iso,
                   disponivel: true,
                   prioridade: 3,
                   motivo: feriado ? 'feriado' : 'domingo',
                   ehDomingo: domingo,
                   ehFeriado: feriado,
                   bloqueadaManual: false,
                   liberadaManual: false,
                   mensagem: feriado ? 'Feriado com funcionamento normal para reservas.' : 'Domingo com funcionamento normal para reservas.'
               };
           }

           return {
               data: iso,
               disponivel: false,
               prioridade: 4,
               motivo: 'dia_comum_indisponivel',
               ehDomingo: false,
               ehFeriado: false,
               bloqueadaManual: false,
               liberadaManual: false,
               mensagem: 'Reservas são permitidas somente aos domingos, feriados ou em datas liberadas pela administração.'
           };
       }

       function obterListaDatasTrancadas() {
           const conjunto = new Set();
           const mapas = [estadoGlobal?.bloqueio?.datasTrancadas, estadoGlobal?.configCasa?.datasTrancadas];
           mapas.forEach((mapa) => {
               if (!mapa || typeof mapa !== 'object') return;
               Object.entries(mapa).forEach(([chave, valor]) => {
                   if (valor === true) {
                       const iso = normalizarChaveDataISO(chave);
                       if (iso && ehDataValidaISO(iso)) conjunto.add(iso);
                   }
               });
           });
           return Array.from(conjunto).sort();
       }

       function obterListaDatasLiberadas() {
           const conjunto = new Set();
           const mapas = [estadoGlobal?.bloqueio?.datasLiberadas, estadoGlobal?.configCasa?.datasLiberadas];
           mapas.forEach((mapa) => {
               if (!mapa || typeof mapa !== 'object') return;
               Object.entries(mapa).forEach(([chave, valor]) => {
                   if (valor === true) {
                       const iso = normalizarChaveDataISO(chave);
                       if (iso && ehDataValidaISO(iso)) conjunto.add(iso);
                   }
               });
           });
           return Array.from(conjunto).sort();
       }

       // VERIFICA SE A DATA ESPECÍFICA ESTÁ BLOQUEADA INDIVIDUALMENTE
       function verificarSeReservasTrancadas(dataISO) {
           if (!dataISO) return false;
           return verificarDataEspecificaTrancada(dataISO);
       }

       // ATUALIZA A INTERFACE PÚBLICA DO CLIENTE CONFORME AS REGRAS DE DISPONIBILIDADE
       function atualizarInterfaceBloqueioCliente() {
           const campoData = document.getElementById('cli-data');
           const dataSelecionada = campoData ? campoData.value : (typeof clienteDataSelecionada !== 'undefined' ? clienteDataSelecionada : '');
           const disp = dataSelecionada
               ? avaliarDisponibilidadeData(dataSelecionada)
               : { disponivel: false, prioridade: 0, motivo: 'data_invalida' };
           const indisponivel = !disp.disponivel;
           const bloqueadaManual = disp.prioridade === 1;

           const bannerBloqueio = document.getElementById('container-bloqueio-cliente');
           const bannerTitulo = bannerBloqueio?.querySelector('.banner-bloqueio-titulo');
           const bannerMsg = bannerBloqueio?.querySelector('.banner-bloqueio-mensagem');
           const containerHorarioMesa = document.getElementById('container-horario-mesa');
           const selectHorario = document.getElementById('cli-horario');
           const selectMesa = document.getElementById('cli-mesa');
           const btnSubmit = document.getElementById('btn-submit');

           if (bannerBloqueio) {
               if (indisponivel) {
                   if (bannerTitulo && bannerMsg) {
                       if (bloqueadaManual) {
                           bannerTitulo.textContent = 'Capacidade Esgotada';
                           bannerMsg.textContent = 'Capacidade lotada para este dia! No momento, não estamos aceitando novas reservas. Agradecemos pela compreensão.';
                       } else {
                           bannerTitulo.textContent = 'Dia Indisponível para Reservas';
                           bannerMsg.textContent = 'Funcionamos regularmente aos domingos e feriados. Selecione uma data disponível no calendário acima.';
                       }
                   }
                   bannerBloqueio.classList.remove('hidden');
               } else {
                   bannerBloqueio.classList.add('hidden');
               }
           }

           if (containerHorarioMesa) {
               if (indisponivel) {
                   containerHorarioMesa.classList.add('hidden');
               } else {
                   containerHorarioMesa.classList.remove('hidden');
               }
           }

           if (selectHorario) {
               selectHorario.disabled = indisponivel;
           }

           if (selectMesa) {
               selectMesa.disabled = indisponivel;
               if (indisponivel) {
                   selectMesa.innerHTML = `<option value="">${bloqueadaManual ? 'Reservas encerradas para esta data' : 'Data indisponível para reservas'}</option>`;
                   selectMesa.value = '';
               }
           }

           sincronizarCustomSelect('cli-horario');
           sincronizarCustomSelect('cli-mesa');

           if (btnSubmit) {
               if (indisponivel) {
                   btnSubmit.disabled = true;
                   btnSubmit.classList.add('btn-submit-bloqueado');
                   btnSubmit.innerHTML = bloqueadaManual
                       ? `<i class="fa-solid fa-lock"></i> RESERVAS TRANCADAS • CAPACIDADE LOTADA`
                       : `<i class="fa-solid fa-calendar-xmark"></i> DATA INDISPONÍVEL PARA RESERVAS`;
               } else {
                   btnSubmit.disabled = false;
                   btnSubmit.classList.remove('btn-submit-bloqueado');
                   btnSubmit.innerHTML = `<i class="fa-solid fa-check-circle"></i> CONFIRMAR MINHA RESERVA`;
               }
           }
       }

       // LIMITE DE MESAS LIVRES EXIBIDAS NA SEQUÊNCIA (3 MESAS)
       const LIMITE_MESAS_SEQUENCIA = 3;

       // OBTÉM AS PRÓXIMAS MESAS DISPONÍVEIS NA SEQUÊNCIA NUMÉRICA CRESCENTE
       function obterProximasMesasLivres(dataISO, limite = LIMITE_MESAS_SEQUENCIA) {
           if (!dataISO) return [];
           if (!avaliarDisponibilidadeData(dataISO).disponivel) return [];
           const totalMesas = estadoGlobal.configCasa?.totalMesas || 100;
           const mesasOcupadas = obterMesasOcupadasNaData(dataISO);
           const mesasLivres = [];

           for (let i = 1; i <= totalMesas; i++) {
               if (!mesasOcupadas.has(i)) {
                   mesasLivres.push(i);
               }
           }

           mesasLivres.sort((a, b) => a - b);
           return typeof limite === 'number' && limite > 0 ? mesasLivres.slice(0, limite) : mesasLivres;
       }

       function atualizarSelectMesas() {
           const selectMesa = document.getElementById('cli-mesa');
           const campoData = document.getElementById('cli-data');
           if (!selectMesa) return;

           const dataSelecionada = campoData ? campoData.value : '';
           const mesaAtual = selectMesa.value;

           selectMesa.innerHTML = '<option value="">selecione o N° da sua mesa</option>';

           if (!dataSelecionada) {
               sincronizarCustomSelect('cli-mesa');
               return;
           }

           // SE A DATA NÃO ESTIVER DISPONÍVEL PELA REGRA DE PRIORIDADE, NÃO EXIBE MESAS
           const dispData = avaliarDisponibilidadeData(dataSelecionada);
           if (!dispData.disponivel) {
               selectMesa.innerHTML = `<option value="">${dispData.prioridade === 1 ? 'Reservas encerradas para esta data' : 'Data indisponível para reservas'}</option>`;
               selectMesa.value = '';
               selectMesa.disabled = true;
               sincronizarCustomSelect('cli-mesa');
               return;
           }

           selectMesa.disabled = false;

           // OBTÉM APENAS AS PRÓXIMAS MESAS DISPONÍVEIS NA SEQUÊNCIA (3 MESAS)
           const proximasMesas = obterProximasMesasLivres(dataSelecionada, LIMITE_MESAS_SEQUENCIA);

           if (proximasMesas.length === 0) {
               selectMesa.innerHTML = '<option value="">Nenhuma mesa disponível para esta data</option>';
           } else {
               proximasMesas.forEach(mesaNum => {
                   const opt = document.createElement('option');
                   opt.value = mesaNum;
                   opt.textContent = `Mesa ${mesaNum} • Livre`;
                   selectMesa.appendChild(opt);
               });
           }

           if (mesaAtual && proximasMesas.includes(parseInt(mesaAtual))) {
               selectMesa.value = mesaAtual;
           } else {
               selectMesa.value = '';
           }
           sincronizarCustomSelect('cli-mesa');
       }

       function getPessoasNaData(dataISO) {
           return estadoGlobal.reservas
               .filter(r => {
                   if (r.data !== dataISO) return false;
                   const status = String(r.status || 'reservada').toLowerCase();
                   return !['cancelada', 'cancelado', 'encerrada', 'encerrado', 'excluida', 'excluído'].includes(status);
               })
               .reduce((total, r) => total + (Number(r.adultos) || 0) + (Number(r.kids05) || 0) + (Number(r.kids610) || 0), 0);
       }

       function formatarDataBR(dataISO) {
           if (!dataISO) return '-';
           const partes = dataISO.split('-');
           return `${partes[2]}/${partes[1]}/${partes[0]}`;
       }


/* ============================================================
   CALENDÁRIO DO CLIENTE
   ============================================================ */
const nomesMesesCliente = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];
const nomesDiasCliente = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];

function dataLocalPorISO(iso){
    const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso||'').trim());
    if(!match) return null;
    const ano=Number(match[1]);
    const mes=Number(match[2]);
    const dia=Number(match[3]);
    const d=new Date(ano,mes-1,dia);
    if(d.getFullYear()!==ano || d.getMonth()!==mes-1 || d.getDate()!==dia) return null;
    return d;
}

function ehDataPermitidaCliente(iso){
    return avaliarDisponibilidadeData(iso).disponivel === true;
}

function obterProximaDataPermitidaCliente(dataBase=new Date()){
    const hoje=new Date();
    const inicioHoje=new Date(hoje.getFullYear(),hoje.getMonth(),hoje.getDate());
    const min2026=new Date(ANO_MINIMO_CALENDARIO,0,1);
    const base=new Date(dataBase.getFullYear(),dataBase.getMonth(),dataBase.getDate());
    let inicio=base < inicioHoje ? inicioHoje : base;
    if(inicio < min2026) inicio=min2026;
    const fimCalendario=new Date(ANO_MAXIMO_CALENDARIO,11,31);

    const cursor=new Date(inicio.getFullYear(),inicio.getMonth(),inicio.getDate());
    while(cursor<=fimCalendario){
        const iso=obterDataFormatadaISO(cursor);
        if(ehDataPermitidaCliente(iso)){
            return iso;
        }
        cursor.setDate(cursor.getDate()+1);
    }
    return '';
}

function getReservasDaDataCliente(iso){
    return (Array.isArray(estadoGlobal?.reservas)?estadoGlobal.reservas:[]).filter(r=>{
        if(r.data!==iso) return false;
        const status=String(r.status||'reservada').toLowerCase();
        return !['cancelada','cancelado','encerrada','encerrado','excluida','excluído'].includes(status);
    });
}

function mudarMesCliente(delta){
    const nova=new Date(clienteMesAtual.getFullYear(),clienteMesAtual.getMonth()+delta,1);
    const hoje=new Date();
    const mesAtualReal=new Date(hoje.getFullYear(),hoje.getMonth(),1);
    const mesMaxCalendario=new Date(ANO_MAXIMO_CALENDARIO,11,1);
    if(nova < mesAtualReal || nova > mesMaxCalendario) return;
    clienteMesAtual=nova;
    renderCalendarioCliente();
}

function irParaMesAtualCliente(){
    const hoje=new Date();
    clienteMesAtual=new Date(hoje.getFullYear(),hoje.getMonth(),1);
    const campo=document.getElementById('cli-data');
    const atual=campo?.value;
    const atualValida=atual && ehDataPermitidaCliente(atual);
    clienteDataSelecionada=atualValida?atual:obterProximaDataPermitidaCliente(hoje);
    if(campo) campo.value=clienteDataSelecionada;
    atualizarInterfaceBloqueioCliente();
    atualizarSelectMesas();
    renderCalendarioCliente();
}

function selecionarDataCliente(iso){
    const disp = avaliarDisponibilidadeData(iso);
    if(!disp.disponivel){
        if(disp.prioridade === 1){
            mostrarPopupNotificacao('Esta data está bloqueada para novas reservas.', 'fa-lock');
        } else if(disp.prioridade === 4){
            mostrarPopupNotificacao('Reservas disponíveis somente aos domingos, feriados ou em datas liberadas.', 'fa-calendar-xmark');
        }
        return;
    }
    clienteDataEscolhidaManualmente=true;
    ocultarAlertaConflitoMesa();
    clienteDataSelecionada=iso;
    const campo=document.getElementById('cli-data');
    if(campo) campo.value=iso;
    const d=dataLocalPorISO(iso);
    if(d) clienteMesAtual=new Date(d.getFullYear(),d.getMonth(),1);
    atualizarInterfaceBloqueioCliente();
    atualizarSelectMesas();
    renderCalendarioCliente();
}

function renderCalendarioCliente(){
    const grid=document.getElementById('client-calendar');
    const titulo=document.getElementById('client-month-title');
    if(!grid||!titulo) return;

    const ano=clienteMesAtual.getFullYear();
    const mes=clienteMesAtual.getMonth();
    titulo.textContent=`${nomesMesesCliente[mes]} ${ano}`;

    const hoje=new Date();
    const mesHoje=new Date(hoje.getFullYear(),hoje.getMonth(),1);
    const mesMaxCalendario=new Date(ANO_MAXIMO_CALENDARIO,11,1);
    const podeVoltar=clienteMesAtual>mesHoje;
    const podeAvancar=clienteMesAtual<mesMaxCalendario;
    const botoes=document.querySelectorAll('.client-calendar-nav button');
    if(botoes[0]) botoes[0].disabled=!podeVoltar;
    if(botoes[2]) botoes[2].disabled=!podeAvancar;

    let html=nomesDiasCliente.map(d=>`<div class="client-weekday">${d}</div>`).join('');
    const primeiroDia=new Date(ano,mes,1).getDay();
    const totalDias=new Date(ano,mes+1,0).getDate();

    for(let i=0;i<primeiroDia;i++) html+=`<button type="button" class="client-day empty" tabindex="-1" aria-hidden="true"></button>`;

    const inicioHoje=new Date(hoje.getFullYear(),hoje.getMonth(),hoje.getDate());
    const hojeISO=obterDataFormatadaISO(hoje);

    for(let dia=1;dia<=totalDias;dia++){
        const d=new Date(ano,mes,dia);
        const iso=obterDataFormatadaISO(d);
        const disp=avaliarDisponibilidadeData(iso);
        const passada=d<inicioHoje;
        const feriado=ehFeriadoISO(iso);
        const trancado=!passada && disp.prioridade===1;
        const liberadoExtra=!passada && disp.prioridade===2;
        const clicavel=disp.disponivel;
        const reservas=getReservasDaDataCliente(iso);
        const classes=[
            'client-day',
            clicavel?'valid':'',
            feriado?'feriado':'',
            liberadoExtra?'released':'',
            trancado?'blocked lotado':'',
            (iso===clienteDataSelecionada && clicavel)?'selected':'',
            iso===hojeISO?'today':'',
            passada?'past':''
        ].filter(Boolean).join(' ');
        const label=trancado
            ?'<span class="client-day-label">BLOQUEADO</span>'
            :(liberadoExtra
                ?'<span class="client-day-label">LIBERADO</span>'
                :(feriado?'<span class="client-day-label">FERIADO</span>':''));
        const badge=reservas.length?`<span class="client-day-reservas">${reservas.length}</span>`:'';
        const ariaLabel=clicavel
            ?`Selecionar ${formatarDataBR(iso)}${liberadoExtra?' (Liberado extra)':(feriado?' (Feriado)':'')}`
            :(trancado?'Data bloqueada para reservas':'Data indisponível');
        html+=`<button type="button" class="${classes}" ${clicavel?`onclick="selecionarDataCliente('${iso}')"`:'disabled'} aria-label="${ariaLabel}"><span class="client-day-number">${dia}</span>${label}${badge}</button>`;
    }
    grid.innerHTML=html;
}

function inicializarCalendarioCliente(){
    const campo=document.getElementById('cli-data');
    if(!campo) return;
    const hoje=new Date();
    const inicial=campo.value && ehDataPermitidaCliente(campo.value) && !verificarSeReservasTrancadas(campo.value)
        ? campo.value
        : obterProximaDataPermitidaCliente(hoje);
    clienteDataSelecionada=inicial;
    campo.value=inicial;
    const d=dataLocalPorISO(inicial) || new Date(Math.min(ANO_MAXIMO_CALENDARIO, Math.max(ANO_MINIMO_CALENDARIO, hoje.getFullYear())), hoje.getMonth(), 1);
    clienteMesAtual=new Date(d.getFullYear(),d.getMonth(),1);
    atualizarInterfaceBloqueioCliente();
    renderCalendarioCliente();
    atualizarSelectMesas();
}



/* ============================================================
   SELECTS PERSONALIZADOS — CLIENTE
   ============================================================ */
function fecharTodosCustomSelects(except=null){
    document.querySelectorAll('.custom-select.is-open').forEach(el=>{
        if(el!==except){
            el.classList.remove('is-open');
            el.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded','false');
        }
    });
}

function sincronizarCustomSelect(selectId){
    const select=document.getElementById(selectId);
    const wrapper=document.querySelector(`.custom-select[data-select-id="${selectId}"]`);
    if(!select||!wrapper) return;
    const trigger=wrapper.querySelector('.custom-select-trigger');
    const menu=wrapper.querySelector('.custom-select-menu');
    if(!trigger||!menu) return;
    const selected=select.options[select.selectedIndex];
    const value=select.value;
    const text=selected?.textContent?.trim() || 'Selecione';
    trigger.childNodes[0].nodeValue=text+' ';
    trigger.classList.toggle('placeholder',!value);
    menu.innerHTML='';
    Array.from(select.options).forEach(option=>{
        const item=document.createElement('button');
        item.type='button';
        item.className='custom-select-option'+(option.value===value&&value!==''?' selected':'')+(option.disabled?' disabled':'');
        item.setAttribute('role','option');
        item.setAttribute('aria-selected',option.value===value?'true':'false');
        item.textContent=option.textContent;
        item.disabled=option.disabled;
        item.addEventListener('click',()=>{
            if(option.disabled) return;
            select.value=option.value;
            select.dispatchEvent(new Event('change',{bubbles:true}));
            sincronizarCustomSelect(selectId);
            fecharTodosCustomSelects();
        });
        menu.appendChild(item);
    });
}

function inicializarCustomSelect(selectId){
    const wrapper=document.querySelector(`.custom-select[data-select-id="${selectId}"]`);
    if(!wrapper) return;
    const trigger=wrapper.querySelector('.custom-select-trigger');
    trigger.addEventListener('click',(event)=>{
        event.stopPropagation();
        const abrir=!wrapper.classList.contains('is-open');
        fecharTodosCustomSelects(wrapper);
        wrapper.classList.toggle('is-open',abrir);
        trigger.setAttribute('aria-expanded',abrir?'true':'false');
        if(abrir){
            const selected=wrapper.querySelector('.custom-select-option.selected');
            selected?.scrollIntoView({block:'nearest'});
        }
    });
    document.getElementById(selectId)?.addEventListener('change',()=>sincronizarCustomSelect(selectId));
    sincronizarCustomSelect(selectId);
}

document.addEventListener('click',()=>fecharTodosCustomSelects());

              // ENVIO DO FORMULÁRIO DE AUTORRESERVA COM PROTEÇÃO CONTRA CONCORRÊNCIA
       document.getElementById('form-autorreserva').onsubmit = async function(e) {
           e.preventDefault();

           if (reservaEmProcessamento) return;

           const btnSubmit = document.getElementById('btn-submit');
           const restaurarBotaoPadrao = () => {
               if (btnSubmit) {
                   btnSubmit.disabled = false;
                   btnSubmit.innerHTML = `<i class="fa-solid fa-check-circle"></i> CONFIRMAR MINHA RESERVA`;
               }
           };

           ocultarAlertaConflitoMesa();
           reservaEmProcessamento = true;
           if (btnSubmit) {
               btnSubmit.disabled = true;
               btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> VERIFICANDO DISPONIBILIDADE...`;
           }

           const nome = document.getElementById('cli-nome').value.trim();
           const adultos = parseInt(document.getElementById('cli-adultos').value) || 0;
           const kids05 = parseInt(document.getElementById('cli-kids05').value) || 0;
           const kids610 = parseInt(document.getElementById('cli-kids610').value) || 0;
           const dataReserva = document.getElementById('cli-data').value;
           const horario = document.getElementById('cli-horario').value;
           const mesaNum = parseInt(document.getElementById('cli-mesa').value);
           const obs = document.getElementById('cli-obs').value.trim();

           const totalNovasPessoas = adultos + kids05 + kids610;
           let idReserva = null;
           let lockAdquirido = false;

           try {
               if (!nome) {
                   alert("Por favor, informe o nome completo do responsável.");
                   restaurarBotaoPadrao();
                   return;
               }

               if (!dataReserva || !ehDataValidaISO(dataReserva)) {
                   mostrarAlertaConflitoMesa("Por favor, selecione uma data válida dentro do calendário de 2026 ou 2027.");
                   restaurarBotaoPadrao();
                   return;
               }

               if (ehDataPassadaISO(dataReserva)) {
                   mostrarAlertaConflitoMesa("Não é possível realizar reservas para datas que já passaram.");
                   restaurarBotaoPadrao();
                   return;
               }

               const dispLocal = avaliarDisponibilidadeData(dataReserva);
               if (!dispLocal.disponivel) {
                   mostrarAlertaConflitoMesa(dispLocal.mensagem);
                   atualizarInterfaceBloqueioCliente();
                   renderCalendarioCliente();
                   return;
               }

               if (!['11:30', '11:45', '12:00'].includes(horario)) {
                   mostrarAlertaConflitoMesa("Selecione um horário válido para a reserva (11:30, 11:45 ou 12:00).");
                   restaurarBotaoPadrao();
                   return;
               }

               if (totalNovasPessoas <= 0) {
                   alert("Por favor, adicione pelo menos 1 integrante para a reserva.");
                   restaurarBotaoPadrao();
                   return;
               }

               if (totalNovasPessoas > 30) {
                   alert("Para reservas acima de 30 pessoas, por favor utilize a solicitação via WhatsApp.");
                   restaurarBotaoPadrao();
                   return;
               }

               if (!mesaNum || isNaN(mesaNum)) {
                   alert("Por favor, selecione o N° da sua mesa.");
                   restaurarBotaoPadrao();
                   return;
               }

               // 1. CONSULTA EM TEMPO REAL DIRETAMENTE NO FIREBASE ANTES DE CONFIRMAR
               const snapAtualizado = await dbRef.once('value');
               const valBanco = snapAtualizado.val();
               aplicarDadosSnapshotGlobal(valBanco);

               // VERIFICAÇÃO RIGOROSA DE DISPONIBILIDADE (PRIORIDADE 1..4) COM DADOS ATUALIZADOS DO BANCO
               const dispBanco = avaliarDisponibilidadeData(dataReserva, valBanco?.bloqueio, valBanco?.configCasa);
               if (!dispBanco.disponivel) {
                   mostrarAlertaConflitoMesa(dispBanco.mensagem);
                   atualizarInterfaceBloqueioCliente();
                   renderCalendarioCliente();
                   return;
               }

               // 1b. VALIDAÇÃO AUTORITATIVA NO BACKEND (/api/reservas/validar) QUANDO HOSPEDADO COM SERVIDOR EXPRESS
               if (typeof fetch === 'function') {
                   try {
                       const backendResp = await fetch('/api/reservas/validar', {
                           method: 'POST',
                           headers: { 'Content-Type': 'application/json' },
                           body: JSON.stringify({
                               data: dataReserva,
                               horario,
                               mesa: mesaNum,
                               adultos,
                               kids05,
                               kids610,
                               nome
                           })
                       });
                       if ([400, 403, 409].includes(backendResp.status)) {
                           const backendData = await backendResp.json().catch(() => ({}));
                           const msgErro = backendData?.message || dispBanco.mensagem || "Esta data não permite novas reservas.";
                           mostrarAlertaConflitoMesa(msgErro);
                           atualizarInterfaceBloqueioCliente();
                           atualizarSelectMesas();
                           renderCalendarioCliente();
                           if (backendResp.status === 409) {
                               restaurarBotaoPadrao();
                           }
                           return;
                       }
                   } catch (backendErr) {
                       // Ambiente estático sem backend Express; validação segue via RTDB + database.rules.json
                   }
               }

               // VERIFICAÇÃO REAL DE OCUPAÇÃO DA MESA NA DATA NO BANCO DE DADOS
               const mesasOcupadasBanco = obterMesasOcupadasNaData(dataReserva);
               if (mesasOcupadasBanco.has(mesaNum)) {
                   atualizarSelectMesas();
                   renderCalendarioCliente();
                   mostrarAlertaConflitoMesa("Ops! Essa mesa acabou de ser reservada por outra pessoa. Escolha outra mesa para continuar.");
                   restaurarBotaoPadrao();
                   return;
               }

               // VERIFICAÇÃO SE A MESA ESTÁ ENTRE AS PRÓXIMAS LIVRES NA SEQUÊNCIA
               const proximasPermitidas = obterProximasMesasLivres(dataReserva, LIMITE_MESAS_SEQUENCIA);
               if (!proximasPermitidas.includes(mesaNum)) {
                   atualizarSelectMesas();
                   renderCalendarioCliente();
                   mostrarAlertaConflitoMesa("Ops! Essa mesa acabou de ser reservada por outra pessoa. Escolha outra mesa para continuar.");
                   restaurarBotaoPadrao();
                   return;
               }

               // VERIFICAÇÃO DE CAPACIDADE MÁXIMA DO DIA
               const capacidadePessoas = estadoGlobal.configCasa.capacidadePessoas || 400;
               const pessoasNaData = getPessoasNaData(dataReserva);
               const assentosDisponiveis = capacidadePessoas - pessoasNaData;

               if (totalNovasPessoas > assentosDisponiveis) {
                   alert(`Infelizmente a casa atingiu o limite de capacidade para este dia. Vagas restantes: ${Math.max(0, assentosDisponiveis)}.`);
                   restaurarBotaoPadrao();
                   return;
               }

               idReserva = `${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
               const novaReserva = {
                   id: idReserva,
                   nome: nome,
                   adultos: adultos,
                   kids05: kids05,
                   kids610: kids610,
                   data: dataReserva,
                   horario: horario,
                   mesa: mesaNum,
                   telefone: document.getElementById('cli-telefone')?.value.trim() || '',
                   obs: obs,
                   status: 'reservada',
                   criadoEm: new Date().toISOString()
               };

               if (btnSubmit) {
                   btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> CONFIRMANDO MESA...`;
               }

               // 2. TRANSAÇÃO ATÔMICA NO FIREBASE PARA IMPEDIR RESERVA SIMULTÂNEA (RACE CONDITION)
               const txResult = await ocuparLockMesaAtomico(dataReserva, mesaNum, {
                   reservaId: idReserva,
                   horario: horario,
                   nome: nome,
                   status: 'reservada'
               });

               if (!txResult.committed || String(txResult.snapshot?.val()?.reservaId || '') !== String(idReserva)) {
                   // Outro cliente venceu a transação simultânea para a mesma mesa
                   const snapPosConflito = await dbRef.once('value');
                   aplicarDadosSnapshotGlobal(snapPosConflito.val());
                   atualizarSelectMesas();
                   renderCalendarioCliente();
                   mostrarAlertaConflitoMesa("Ops! Essa mesa acabou de ser reservada por outra pessoa. Escolha outra mesa para continuar.");
                   restaurarBotaoPadrao();
                   return;
               }

               lockAdquirido = true;

               // 3. DUPLA CHECAGEM EM `reservas` CONTRA REGISTROS LEGADOS SEM LOCK PRÉVIO
               const snapReservasCheck = await dbRef.child('reservas').once('value');
               const reservasCheckObj = snapReservasCheck.val() || {};
               const conflitoLegado = Object.values(reservasCheckObj).find((r) => {
                   if (!r || r.data !== dataReserva) return false;
                   if (String(r.id) === String(idReserva)) return false;
                   if (!ehStatusAtivoReserva(r.status)) return false;
                   return parseInt(r.mesa, 10) === mesaNum;
               });

               if (conflitoLegado) {
                   await liberarLockMesa(dataReserva, mesaNum, idReserva);
                   lockAdquirido = false;
                   const snapRefresh = await dbRef.once('value');
                   aplicarDadosSnapshotGlobal(snapRefresh.val());
                   atualizarSelectMesas();
                   renderCalendarioCliente();
                   mostrarAlertaConflitoMesa("Ops! Essa mesa acabou de ser reservada por outra pessoa. Escolha outra mesa para continuar.");
                   restaurarBotaoPadrao();
                   return;
               }

               // 3b. REVALIDAÇÃO DE DISPONIBILIDADE (PRIORIDADE 1..4) IMEDIATAMENTE ANTES DA GRAVAÇÃO DEFINITIVA
               const snapBloqueioFinal = await dbRef.child('bloqueio').once('value');
               const snapConfigFinal = await dbRef.child('configCasa').once('value');
               const bloqFinal = snapBloqueioFinal.val();
               const cfgFinal = snapConfigFinal.val();
               const dispFinal = avaliarDisponibilidadeData(dataReserva, bloqFinal, cfgFinal);
               if (!dispFinal.disponivel) {
                   await liberarLockMesa(dataReserva, mesaNum, idReserva);
                   lockAdquirido = false;
                   const snapRefresh = await dbRef.once('value');
                   aplicarDadosSnapshotGlobal(snapRefresh.val());
                   atualizarInterfaceBloqueioCliente();
                   renderCalendarioCliente();
                   mostrarAlertaConflitoMesa(dispFinal.mensagem);
                   return;
               }

               // 4. GRAVAÇÃO DEFINITIVA DA RESERVA APÓS LOCK ATÔMICO GARANTIDO
               await dbRef.child('reservas').child(idReserva).set(novaReserva);

               dadosReservaAtual = novaReserva;
               mostrarPopupNotificacao();
               exibirComprovante(novaReserva);
           } catch (error) {
               if (lockAdquirido && idReserva) {
                   await liberarLockMesa(dataReserva, mesaNum, idReserva);
               }
               alert("Erro ao gravar a reserva: " + (error?.message || error));
               restaurarBotaoPadrao();
           } finally {
               reservaEmProcessamento = false;
           }
       };

       function exibirComprovante(reserva) {
           document.getElementById('secao-inicio')?.classList.add('hidden');
           document.getElementById('secao-cancelar')?.classList.add('hidden');
           document.getElementById('secao-formulario').classList.add('hidden');
           document.getElementById('secao-comprovante').classList.remove('hidden');

           document.getElementById('rec-codigo').textContent = `#${reserva.id.slice(-6)}`;
           document.getElementById('rec-nome').textContent = reserva.nome;
           document.getElementById('rec-pessoas').textContent = `${reserva.adultos + reserva.kids05 + reserva.kids610} pessoas (${reserva.adultos} ad, ${reserva.kids610} meia, ${reserva.kids05} free)`;
           document.getElementById('rec-data').textContent = formatarDataBR(reserva.data);
           document.getElementById('rec-horario').textContent = `${reserva.horario}h`;
           document.getElementById('rec-mesa').textContent = `Mesa ${reserva.mesa}`;

           const linhaTelefone = document.getElementById('linha-telefone');
           if (reserva.telefone) {
               document.getElementById('rec-telefone').textContent = reserva.telefone;
               linhaTelefone?.classList.remove('hidden');
           } else {
               linhaTelefone?.classList.add('hidden');
           }

           if (reserva.obs) {
               document.getElementById('rec-obs').textContent = reserva.obs;
               document.getElementById('linha-obs').classList.remove('hidden');
           } else {
               document.getElementById('linha-obs').classList.add('hidden');
           }

           window.scrollTo({ top: 0, behavior: 'smooth' });
       }

       function reiniciarFormulario() {
           ocultarAlertaConflitoMesa();
           clienteDataEscolhidaManualmente = false;
           document.getElementById('form-autorreserva').reset();
           validarCapacidadeGrupo();
           sincronizarCustomSelect('cli-horario');

           const campoData = document.getElementById('cli-data');
           campoData.value = obterProximaDataPermitidaCliente(new Date());
           inicializarCalendarioCliente();

           const btnSubmit = document.getElementById('btn-submit');
           btnSubmit.disabled = false;
           btnSubmit.innerHTML = `<i class="fa-solid fa-check-circle"></i> CONFIRMAR MINHA RESERVA`;

           document.getElementById('secao-inicio')?.classList.add('hidden');
           document.getElementById('secao-cancelar')?.classList.add('hidden');
           document.getElementById('secao-comprovante').classList.add('hidden');
           document.getElementById('secao-formulario').classList.remove('hidden');

           window.scrollTo({ top: 0, behavior: 'smooth' });
       }

       function enviarComprovanteWhatsApp() {
           if (!dadosReservaAtual) {
               alert("Nenhuma reserva ativa encontrada.");
               return;
           }

           const cod = `#${dadosReservaAtual.id.slice(-6)}`;
           const totalP = dadosReservaAtual.adultos + dadosReservaAtual.kids05 + dadosReservaAtual.kids610;

           let textoMsg = `Olá! Confirmei minha reserva no Celeiro pelo sistema:\n\n`;
           textoMsg += `📌 *Código:* ${cod}\n`;
           textoMsg += `👤 *Nome:* ${dadosReservaAtual.nome}\n`;
           textoMsg += `👥 *Integrantes:* ${totalP} (${dadosReservaAtual.adultos} Ad, ${dadosReservaAtual.kids610} Meia, ${dadosReservaAtual.kids05} Free)\n`;
           textoMsg += `📅 *Data:* ${formatarDataBR(dadosReservaAtual.data)}\n`;
           textoMsg += `🕒 *Horário:* ${dadosReservaAtual.horario} (Tolerância até 12:00)\n`;
           textoMsg += `🪑 *Mesa:* Mesa ${dadosReservaAtual.mesa}\n`;
           if (dadosReservaAtual.telefone) {
               textoMsg += `📞 *Telefone:* ${dadosReservaAtual.telefone}\n`;
           }
           if (dadosReservaAtual.obs) {
               textoMsg += `💬 *Preferências/Obs:* ${dadosReservaAtual.obs}\n`;
           }
           textoMsg += `\nSegue meu comprovante de confirmação!`;

           const textoEncoded = encodeURIComponent(textoMsg);
           const urlWhatsApp = `https://api.whatsapp.com/send/?phone=5514991449726&text=${textoEncoded}&type=phone_number&app_absent=0`;

           window.open(urlWhatsApp, '_blank');
       }

/* ============================================================
   ÁREA ADMINISTRATIVA
   ============================================================ */

const ADMIN_PIN = "2323"; // ALTERE ESTE PIN antes de publicar.
let adminAutenticado = false;
let adminMesAtual = new Date();
let adminDataSelecionada = null;
let adminCliquesLogo = 0;
let adminTimerCliques = null;

const nomesMesesAdmin = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const nomesDiasAdmin = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

/*
 * O acesso é discreto: clique 5 vezes no logo.
 * Isso evita deixar um botão administrativo visível para clientes.
 */
function abrirAcessoAdmin() {
    adminCliquesLogo++;

    clearTimeout(adminTimerCliques);
    adminTimerCliques = setTimeout(() => {
        adminCliquesLogo = 0;
    }, 1200);

    if (adminCliquesLogo >= 5) {
        adminCliquesLogo = 0;
        if (adminAutenticado) {
            abrirAreaAdmin();
            return;
        }
        const modal = document.getElementById("admin-pin-modal");
        const input = document.getElementById("admin-pin-input");
        const erro = document.getElementById("admin-pin-erro");

        modal.classList.remove("hidden");
        modal.setAttribute("aria-hidden", "false");
        erro.textContent = "";
        input.value = "";
        setTimeout(() => input.focus(), 80);
    }
}

function fecharPinAdmin() {
    const modal = document.getElementById("admin-pin-modal");
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
}

function verificarPinAdmin() {
    const input = document.getElementById("admin-pin-input");
    const erro = document.getElementById("admin-pin-erro");

    if (input.value === ADMIN_PIN) {
        adminAutenticado = true;
        fecharPinAdmin();
        abrirAreaAdmin();
    } else {
        erro.textContent = "PIN incorreto. Tente novamente.";
        input.value = "";
        input.focus();
    }
}

function abrirAreaAdmin() {
    if (!adminAutenticado) return;

    document.getElementById("secao-inicio")?.classList.add("hidden");
    document.getElementById("secao-cancelar")?.classList.add("hidden");
    document.getElementById("secao-formulario").classList.add("hidden");
    document.getElementById("secao-comprovante").classList.add("hidden");
    document.getElementById("secao-admin").classList.remove("hidden");

    const hoje = new Date();
    adminMesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    // Se hoje for uma data permitida, seleciona hoje; caso contrário,
    // seleciona a próxima data permitida.
    const hojeISO = obterDataFormatadaISO(hoje);
    if (ehDataPermitidaAdmin(hojeISO)) {
        adminDataSelecionada = hojeISO;
    } else {
        adminDataSelecionada = obterProximaDataPermitidaAdmin(hoje);
    }

    document.querySelector(".wsp-float")?.classList.add("hidden");

    atualizarStatusBloqueioAdmin();
    renderAdminCalendario();
    renderAdminReservas();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function fecharAreaAdmin() {
    document.getElementById("secao-admin").classList.add("hidden");
    document.getElementById("secao-formulario").classList.add("hidden");
    document.getElementById("secao-cancelar")?.classList.add("hidden");
    document.getElementById("secao-comprovante").classList.add("hidden");
    document.getElementById("secao-inicio")?.classList.remove("hidden");
    document.querySelector(".wsp-float")?.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ============================================================
   CONTROLE DE EXCEÇÕES E BLOQUEIO INDIVIDUAL POR DIA — ADMIN
   ============================================================ */
let pendenteAcaoBloqueio = null;

function solicitarDesbloqueioDataUnicaAdmin(dataISO) {
    if (!dataISO) return;
    abrirModalConfirmacaoBloqueio('data', { dataISO, novoEstado: false });
}

function solicitarRemoverLiberacaoDataAdmin(dataISO) {
    if (!dataISO) return;
    abrirModalConfirmacaoBloqueio('liberar', { dataISO, novoEstado: false });
}

function focarDataBloqueadaAdmin(dataISO) {
    const d = dataLocalPorISO(dataISO);
    if (!d) return;
    adminMesAtual = new Date(d.getFullYear(), d.getMonth(), 1);
    adminDataSelecionada = dataISO;
    renderAdminCalendario();
    renderAdminReservas();
}

function renderAdminReleasedDatesChips() {
    const wrap = document.getElementById('admin-released-dates-wrap');
    const countEl = document.getElementById('admin-released-dates-count');
    const listEl = document.getElementById('admin-released-dates-list');
    if (!wrap || !countEl || !listEl) return;

    const datas = obterListaDatasLiberadas();
    countEl.textContent = datas.length;

    if (!datas.length) {
        wrap.classList.add('hidden');
        listEl.innerHTML = '';
        return;
    }

    wrap.classList.remove('hidden');
    listEl.innerHTML = datas.map((iso) => `
        <span class="admin-released-chip">
            <button type="button" class="admin-blocked-chip-date" onclick="focarDataBloqueadaAdmin('${iso}')" title="Ver data no calendário">${escaparHTMLAdmin(formatarDataBR(iso))}</button>
            <button type="button" class="admin-blocked-chip-unlock" onclick="solicitarRemoverLiberacaoDataAdmin('${iso}')" title="Remover liberação de ${escaparHTMLAdmin(formatarDataBR(iso))}" aria-label="Remover liberação de ${escaparHTMLAdmin(formatarDataBR(iso))}">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </span>
    `).join('');
}

function renderAdminBlockedDatesChips() {
    const wrap = document.getElementById('admin-blocked-dates-wrap');
    const countEl = document.getElementById('admin-blocked-dates-count');
    const listEl = document.getElementById('admin-blocked-dates-list');
    if (!wrap || !countEl || !listEl) return;

    const datas = obterListaDatasTrancadas();
    countEl.textContent = datas.length;

    if (!datas.length) {
        wrap.classList.add('hidden');
        listEl.innerHTML = '';
        return;
    }

    wrap.classList.remove('hidden');
    listEl.innerHTML = datas.map((iso) => `
        <span class="admin-blocked-chip">
            <button type="button" class="admin-blocked-chip-date" onclick="focarDataBloqueadaAdmin('${iso}')" title="Ver data no calendário">${escaparHTMLAdmin(formatarDataBR(iso))}</button>
            <button type="button" class="admin-blocked-chip-unlock" onclick="solicitarDesbloqueioDataUnicaAdmin('${iso}')" title="Desbloquear ${escaparHTMLAdmin(formatarDataBR(iso))}" aria-label="Desbloquear ${escaparHTMLAdmin(formatarDataBR(iso))}">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </span>
    `).join('');
}

function abrirModalConfirmacaoBloqueio(tipo = 'data', opcoes = {}) {
    if (!adminAutenticado) {
        alert("Ação não autorizada. Acesse a área administrativa com o PIN.");
        return;
    }

    const modal = document.getElementById('admin-lock-modal');
    const title = document.getElementById('admin-lock-modal-title');
    const desc = document.getElementById('admin-lock-modal-desc');
    const icon = document.getElementById('admin-lock-modal-icon');
    const iconWrapper = document.getElementById('admin-lock-icon-wrapper');
    const eyebrow = document.getElementById('admin-lock-modal-eyebrow');
    const erroEl = document.getElementById('admin-lock-error');
    const btnConfirm = document.getElementById('admin-btn-confirm-lock');

    if (!modal || !title || !desc || !btnConfirm) return;
    if (erroEl) erroEl.textContent = '';

    const dataISO = opcoes.dataISO || adminDataSelecionada;
    if (!dataISO) {
        mostrarPopupNotificacao("Por favor, selecione uma data no calendário primeiro.", "fa-circle-exclamation");
        return;
    }

    const dataFormatada = formatarDataBR(dataISO);

    if (tipo === 'liberar') {
        const estaLiberada = verificarDataEspecificaLiberada(dataISO);
        const novoEstado = typeof opcoes.novoEstado === 'boolean' ? opcoes.novoEstado : !estaLiberada;
        pendenteAcaoBloqueio = { tipo: 'liberar', novoEstado: novoEstado, dataISO: dataISO };

        if (novoEstado) {
            if (eyebrow) {
                eyebrow.textContent = "Liberação excepcional de dia";
                eyebrow.style.color = "var(--verde-vibrante)";
            }
            title.textContent = `Liberar ${dataFormatada}`;
            desc.textContent = `Deseja liberar excepcionalmente o dia ${dataFormatada} para que clientes possam reservar? A liberação vale exclusivamente para esta data, sem abrir outros dias da semana.`;
            if (icon) icon.className = "fa-solid fa-calendar-check";
            if (iconWrapper) {
                iconWrapper.style.color = "var(--verde-vibrante)";
                iconWrapper.style.background = "rgba(16, 185, 129, 0.18)";
            }
            btnConfirm.className = "btn-action";
            btnConfirm.style.background = "linear-gradient(135deg, #2E5A44 0%, #1E3D2E 100%)";
            btnConfirm.innerHTML = `<i class="fa-solid fa-calendar-check"></i> Liberar Data`;
        } else {
            if (eyebrow) {
                eyebrow.textContent = "Remover liberação excepcional";
                eyebrow.style.color = "var(--terracota-sol)";
            }
            title.textContent = `Remover liberação de ${dataFormatada}`;
            desc.textContent = `Deseja encerrar a liberação excepcional de ${dataFormatada}? Este dia voltará à regra padrão do restaurante (fechado em dias comuns da semana).`;
            if (icon) icon.className = "fa-solid fa-calendar-xmark";
            if (iconWrapper) {
                iconWrapper.style.color = "var(--terracota-sol)";
                iconWrapper.style.background = "rgba(224, 130, 63, 0.18)";
            }
            btnConfirm.className = "admin-delete-confirm-btn";
            btnConfirm.style.background = "linear-gradient(135deg, #A85A2A 0%, #853F18 100%)";
            btnConfirm.innerHTML = `<i class="fa-solid fa-calendar-xmark"></i> Remover Liberação`;
        }
    } else {
        const estaDataTrancada = verificarDataEspecificaTrancada(dataISO);
        const novoEstado = typeof opcoes.novoEstado === 'boolean' ? opcoes.novoEstado : !estaDataTrancada;
        pendenteAcaoBloqueio = { tipo: 'data', novoEstado: novoEstado, dataISO: dataISO };

        if (novoEstado) {
            if (eyebrow) {
                eyebrow.textContent = "Bloqueio individual de dia";
                eyebrow.style.color = "var(--terracota-sol)";
            }
            title.textContent = `Bloquear ${dataFormatada}`;
            desc.textContent = `Deseja bloquear novas reservas somente para o dia ${dataFormatada}? As reservas existentes serão mantidas e todos os outros dias seguirão suas regras normais.`;
            if (icon) icon.className = "fa-solid fa-lock";
            if (iconWrapper) {
                iconWrapper.style.color = "var(--terracota-sol)";
                iconWrapper.style.background = "rgba(224, 130, 63, 0.18)";
            }
            btnConfirm.className = "admin-delete-confirm-btn";
            btnConfirm.style.background = "linear-gradient(135deg, #A85A2A 0%, #853F18 100%)";
            btnConfirm.innerHTML = `<i class="fa-solid fa-lock"></i> Bloquear Este Dia`;
        } else {
            if (eyebrow) {
                eyebrow.textContent = "Desbloqueio individual de dia";
                eyebrow.style.color = "var(--verde-vibrante)";
            }
            title.textContent = `Desbloquear ${dataFormatada}`;
            desc.textContent = `Deseja desbloquear somente o dia ${dataFormatada}? As demais datas bloqueadas permanecerão bloqueadas.`;
            if (icon) icon.className = "fa-solid fa-lock-open";
            if (iconWrapper) {
                iconWrapper.style.color = "var(--verde-vibrante)";
                iconWrapper.style.background = "rgba(16, 185, 129, 0.18)";
            }
            btnConfirm.className = "btn-action";
            btnConfirm.style.background = "linear-gradient(135deg, #2E5A44 0%, #1E3D2E 100%)";
            btnConfirm.innerHTML = `<i class="fa-solid fa-lock-open"></i> Desbloquear Este Dia`;
        }
    }

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function fecharModalBloqueioAdmin() {
    const modal = document.getElementById('admin-lock-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('modal-open');
    pendenteAcaoBloqueio = null;
}

function montarAtualizacaoDataIndividual(dataISO, bloquear) {
    if (!ehDataValidaISO(dataISO)) return null;
    const keyDash = String(dataISO);
    const keyUnder = keyDash.replace(/-/g, '_');
    const updates = {
        'bloqueio/trancado': false,
        'configCasa/reservasTrancadas': false,
        'bloqueio/atualizadoEm': new Date().toISOString(),
        'bloqueio/atualizadoPor': 'admin'
    };
    if (bloquear) {
        updates[`bloqueio/datasTrancadas/${keyDash}`] = true;
        updates[`bloqueio/datasTrancadas/${keyUnder}`] = null;
        updates[`configCasa/datasTrancadas/${keyDash}`] = true;
        updates[`configCasa/datasTrancadas/${keyUnder}`] = null;
    } else {
        updates[`bloqueio/datasTrancadas/${keyDash}`] = null;
        updates[`bloqueio/datasTrancadas/${keyUnder}`] = null;
        updates[`configCasa/datasTrancadas/${keyDash}`] = null;
        updates[`configCasa/datasTrancadas/${keyUnder}`] = null;
    }
    return updates;
}

function montarAtualizacaoLiberacaoData(dataISO, liberar) {
    if (!ehDataValidaISO(dataISO)) return null;
    const keyDash = String(dataISO);
    const keyUnder = keyDash.replace(/-/g, '_');
    const updates = {
        'bloqueio/trancado': false,
        'configCasa/reservasTrancadas': false,
        'bloqueio/atualizadoEm': new Date().toISOString(),
        'bloqueio/atualizadoPor': 'admin'
    };
    if (liberar) {
        updates[`bloqueio/datasLiberadas/${keyDash}`] = true;
        updates[`bloqueio/datasLiberadas/${keyUnder}`] = null;
        updates[`configCasa/datasLiberadas/${keyDash}`] = true;
        updates[`configCasa/datasLiberadas/${keyUnder}`] = null;
        // Ao liberar explicitamente a data, remove eventual bloqueio manual dessa mesma data
        updates[`bloqueio/datasTrancadas/${keyDash}`] = null;
        updates[`bloqueio/datasTrancadas/${keyUnder}`] = null;
        updates[`configCasa/datasTrancadas/${keyDash}`] = null;
        updates[`configCasa/datasTrancadas/${keyUnder}`] = null;
    } else {
        updates[`bloqueio/datasLiberadas/${keyDash}`] = null;
        updates[`bloqueio/datasLiberadas/${keyUnder}`] = null;
        updates[`configCasa/datasLiberadas/${keyDash}`] = null;
        updates[`configCasa/datasLiberadas/${keyUnder}`] = null;
    }
    return updates;
}

async function confirmarAlteracaoBloqueioAdmin() {
    if (!adminAutenticado) {
        alert("Ação não autorizada. Acesse a área administrativa com o PIN.");
        fecharModalBloqueioAdmin();
        return;
    }
    if (!pendenteAcaoBloqueio || !pendenteAcaoBloqueio.dataISO) return;

    const btnConfirm = document.getElementById('admin-btn-confirm-lock');
    const erroEl = document.getElementById('admin-lock-error');
    if (btnConfirm) {
        btnConfirm.disabled = true;
        btnConfirm.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Atualizando Firebase...`;
    }

    try {
        const tipo = pendenteAcaoBloqueio.tipo || 'data';
        const dataISO = pendenteAcaoBloqueio.dataISO;
        const novo = Boolean(pendenteAcaoBloqueio.novoEstado);
        const updates = tipo === 'liberar'
            ? montarAtualizacaoLiberacaoData(dataISO, novo)
            : montarAtualizacaoDataIndividual(dataISO, novo);
        if (!updates) {
            throw new Error('Data selecionada fora do período permitido (2026–2027).');
        }
        await dbRef.update(updates);

        fecharModalBloqueioAdmin();
        if (tipo === 'liberar') {
            mostrarPopupNotificacao(
                novo ? `Data ${formatarDataBR(dataISO)} liberada excepcionalmente!` : `Liberação de ${formatarDataBR(dataISO)} removida!`,
                novo ? "fa-calendar-check" : "fa-calendar-xmark"
            );
        } else {
            mostrarPopupNotificacao(
                novo ? `Data ${formatarDataBR(dataISO)} bloqueada!` : `Data ${formatarDataBR(dataISO)} desbloqueada!`,
                novo ? "fa-lock" : "fa-lock-open"
            );
        }

        atualizarStatusBloqueioAdmin();
        atualizarInterfaceBloqueioCliente();
        atualizarSelectMesas();
        renderCalendarioCliente();
        renderAdminCalendario();
        renderAdminReservas();
    } catch (erro) {
        console.error("Erro ao alterar disponibilidade:", erro);
        if (erroEl) erroEl.textContent = "Erro ao sincronizar com o Firebase: " + (erro.message || erro);
        else alert("Erro ao atualizar o Firebase: " + (erro.message || erro));
    } finally {
        if (btnConfirm) btnConfirm.disabled = false;
    }
}

function atualizarStatusBloqueioAdmin() {
    if (!adminAutenticado) return;

    const dataSelecionada = adminDataSelecionada;
    const disp = dataSelecionada
        ? avaliarDisponibilidadeData(dataSelecionada, estadoGlobal?.bloqueio, estadoGlobal?.configCasa, true)
        : null;

    const estaDataTrancada = Boolean(disp && disp.prioridade === 1);
    const estaLiberadaManual = Boolean(disp && disp.prioridade === 2);
    const ehPadraoAberto = Boolean(disp && disp.prioridade === 3);
    const ehDiaComumFechado = Boolean(disp && disp.prioridade === 4);

    const selectedDateEl = document.getElementById('admin-lock-selected-date');
    const badge = document.getElementById('admin-lock-badge');
    const btnLiberar = document.getElementById('admin-btn-liberar-data');
    const btnToggle = document.getElementById('admin-btn-toggle-bloqueio');
    const infoText = document.getElementById('admin-lock-info-text');

    if (selectedDateEl) {
        selectedDateEl.textContent = dataSelecionada ? formatarDataBR(dataSelecionada) : '-';
    }

    if (badge) {
        if (!dataSelecionada) {
            badge.className = "admin-lock-badge badge-fechado-padrao";
            badge.innerHTML = `<i class="fa-regular fa-calendar"></i> Selecione uma data`;
        } else if (estaDataTrancada) {
            badge.className = "admin-lock-badge badge-trancado";
            badge.innerHTML = `<i class="fa-solid fa-lock"></i> Dia Bloqueado`;
        } else if (estaLiberadaManual) {
            badge.className = "admin-lock-badge badge-liberado";
            badge.innerHTML = `<i class="fa-solid fa-calendar-check"></i> Liberada (Exceção)`;
        } else if (ehPadraoAberto) {
            badge.className = "admin-lock-badge badge-liberado";
            badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${disp.ehFeriado ? 'Liberado (Feriado)' : 'Liberado (Domingo)'}`;
        } else {
            badge.className = "admin-lock-badge badge-fechado-padrao";
            badge.innerHTML = `<i class="fa-solid fa-ban"></i> Fechado (Dia Comum)`;
        }
    }

    if (btnLiberar) {
        if (!dataSelecionada || ehPadraoAberto || estaDataTrancada) {
            btnLiberar.classList.add('hidden');
        } else if (estaLiberadaManual) {
            btnLiberar.classList.remove('hidden');
            btnLiberar.disabled = false;
            btnLiberar.className = "admin-lock-toggle-btn btn-remover-liberacao";
            btnLiberar.innerHTML = `<i class="fa-solid fa-calendar-xmark"></i> <span>Remover liberação</span>`;
            btnLiberar.title = "Encerrar liberação excepcional e voltar à regra padrão";
            btnLiberar.setAttribute('onclick', "abrirModalConfirmacaoBloqueio('liberar', { novoEstado: false })");
        } else {
            btnLiberar.classList.remove('hidden');
            btnLiberar.disabled = false;
            btnLiberar.className = "admin-lock-toggle-btn btn-liberar";
            btnLiberar.innerHTML = `<i class="fa-solid fa-calendar-check"></i> <span>Liberar data</span>`;
            btnLiberar.title = "Liberar excepcionalmente somente esta data para reservas";
            btnLiberar.setAttribute('onclick', "abrirModalConfirmacaoBloqueio('liberar', { novoEstado: true })");
        }
    }

    if (btnToggle) {
        btnToggle.disabled = !dataSelecionada;
        if (estaDataTrancada) {
            btnToggle.className = "admin-lock-toggle-btn btn-destrancar";
            btnToggle.innerHTML = `<i class="fa-solid fa-lock-open"></i> <span>Desbloquear este dia</span>`;
            btnToggle.title = "Clique para desbloquear somente esta data";
        } else {
            btnToggle.className = "admin-lock-toggle-btn btn-trancar";
            btnToggle.innerHTML = `<i class="fa-solid fa-lock"></i> <span>Bloquear este dia</span>`;
            btnToggle.title = "Clique para bloquear somente esta data";
        }
    }

    if (infoText) {
        if (!dataSelecionada) {
            infoText.textContent = "Selecione uma data no calendário abaixo para gerenciar bloqueios ou liberações excepcionais.";
        } else if (estaDataTrancada) {
            infoText.innerHTML = `🔒 <strong>Dia ${escaparHTMLAdmin(formatarDataBR(dataSelecionada))} bloqueado manualmente:</strong> Prioridade máxima ativa. Clientes não podem fazer novas reservas nesta data, mesmo que seja domingo, feriado ou tenha sido liberada antes. Reservas existentes continuam preservadas.`;
        } else if (estaLiberadaManual) {
            infoText.innerHTML = `✅ <strong>Dia ${escaparHTMLAdmin(formatarDataBR(dataSelecionada))} liberado manualmente:</strong> Funcionamento excepcional ativo somente para esta data. Outros dias comuns da semana continuam indisponíveis.`;
        } else if (ehPadraoAberto) {
            infoText.innerHTML = `📅 <strong>${escaparHTMLAdmin(formatarDataBR(dataSelecionada))} (${disp.ehFeriado ? 'Feriado' : 'Domingo'}):</strong> Aberto pela regra padrão de funcionamento. Caso precise fechar apenas este dia, clique em <strong>Bloquear este dia</strong>.`;
        } else if (ehDiaComumFechado) {
            infoText.innerHTML = `⛔ <strong>${escaparHTMLAdmin(formatarDataBR(dataSelecionada))} (Dia comum da semana):</strong> Indisponível pela regra padrão. Para abrir excepcionalmente apenas esta data, clique em <strong>Liberar data</strong>.`;
        }
    }

    const badgeData = document.getElementById('admin-date-lock-status');
    const btnData = document.getElementById('admin-btn-toggle-date-lock');

    if (dataSelecionada && badgeData && btnData) {
        btnData.classList.remove('hidden');
        if (estaDataTrancada) {
            badgeData.className = "admin-date-lock-status trancada";
            badgeData.innerHTML = `<i class="fa-solid fa-lock"></i> Bloqueada`;
            btnData.disabled = false;
            btnData.title = "Clique para desbloquear esta data específica";
            btnData.innerHTML = `<i class="fa-solid fa-lock-open"></i> <span>Desbloquear data</span>`;
            btnData.setAttribute('onclick', "abrirModalConfirmacaoBloqueio('data')");
        } else if (estaLiberadaManual) {
            badgeData.className = "admin-date-lock-status liberada";
            badgeData.innerHTML = `<i class="fa-solid fa-calendar-check"></i> Liberada Extra`;
            btnData.disabled = false;
            btnData.title = "Clique para remover a liberação excepcional desta data";
            btnData.innerHTML = `<i class="fa-solid fa-calendar-xmark"></i> <span>Remover liberação</span>`;
            btnData.setAttribute('onclick', "abrirModalConfirmacaoBloqueio('liberar', { novoEstado: false })");
        } else if (ehPadraoAberto) {
            badgeData.className = "admin-date-lock-status liberada";
            badgeData.innerHTML = `<i class="fa-solid fa-circle-check"></i> Data Liberada`;
            btnData.disabled = false;
            btnData.title = "Clique para bloquear esta data específica";
            btnData.innerHTML = `<i class="fa-solid fa-lock"></i> <span>Bloquear data</span>`;
            btnData.setAttribute('onclick', "abrirModalConfirmacaoBloqueio('data')");
        } else {
            badgeData.className = "admin-date-lock-status fechado-padrao";
            badgeData.innerHTML = `<i class="fa-solid fa-ban"></i> Dia Comum Fechado`;
            btnData.disabled = false;
            btnData.title = "Clique para liberar excepcionalmente esta data";
            btnData.innerHTML = `<i class="fa-solid fa-calendar-check"></i> <span>Liberar data</span>`;
            btnData.setAttribute('onclick', "abrirModalConfirmacaoBloqueio('liberar', { novoEstado: true })");
        }
    }
}

function ehDataPermitidaAdmin(dataISO) {
    if (!dataISO) return false;
    if (ehDataValidaISO(dataISO)) return true;
    return getReservasDaDataAdmin(dataISO).length > 0;
}

function obterProximaDataPermitidaAdmin(dataInicial) {
    const hoje = dataInicial || new Date();
    const iso = obterDataFormatadaISO(hoje);
    if (ehDataPermitidaAdmin(iso)) return iso;
    return `${ANO_MINIMO_CALENDARIO}-01-01`;
}

function getReservasAtivasAdmin() {
    const reservas = Array.isArray(estadoGlobal.reservas)
        ? estadoGlobal.reservas
        : [];

    return reservas.filter((r) => {
        const status = String(r.status || "reservada").toLowerCase();
        return !["cancelada", "cancelado", "encerrada", "encerrado", "excluida", "excluído"].includes(status);
    });
}

function getReservasDaDataAdmin(dataISO) {
    return getReservasAtivasAdmin()
        .filter((r) => r.data === dataISO)
        .sort((a, b) => String(a.horario || "").localeCompare(String(b.horario || "")));
}

function getTotalPessoasReservaAdmin(r) {
    return (
        Number(r.adultos || 0) +
        Number(r.kids05 || 0) +
        Number(r.kids610 || 0)
    );
}

function mudarMesAdmin(delta) {
    const nova = new Date(
        adminMesAtual.getFullYear(),
        adminMesAtual.getMonth() + delta,
        1
    );
    const minMes = new Date(ANO_MINIMO_CALENDARIO, 0, 1);
    const maxMes = new Date(ANO_MAXIMO_CALENDARIO, 11, 1);
    if (nova < minMes || nova > maxMes) return;
    adminMesAtual = nova;

    renderAdminCalendario();
}

function irParaMesAtualAdmin() {
    const hoje = new Date();
    adminMesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    const hojeISO = obterDataFormatadaISO(hoje);
    adminDataSelecionada = ehDataPermitidaAdmin(hojeISO)
        ? hojeISO
        : obterProximaDataPermitidaAdmin(hoje);

    renderAdminCalendario();
    renderAdminReservas();
}

function selecionarDataAdmin(dataISO) {
    if (!ehDataPermitidaAdmin(dataISO)) return;

    adminDataSelecionada = dataISO;
    renderAdminCalendario();
    renderAdminReservas();
}

function renderAdminCalendario() {
    const calendario = document.getElementById("admin-calendar");
    const titulo = document.getElementById("admin-month-title");

    if (!calendario || !titulo) return;

    const ano = adminMesAtual.getFullYear();
    const mes = adminMesAtual.getMonth();

    titulo.textContent = `${nomesMesesAdmin[mes]} ${ano}`;

    const minMes = new Date(ANO_MINIMO_CALENDARIO, 0, 1);
    const maxMes = new Date(ANO_MAXIMO_CALENDARIO, 11, 1);
    const botoesAdmin = document.querySelectorAll('.admin-calendar-nav button');
    if (botoesAdmin[0]) botoesAdmin[0].disabled = adminMesAtual <= minMes;
    if (botoesAdmin[2]) botoesAdmin[2].disabled = adminMesAtual >= maxMes;

    let html = "";

    nomesDiasAdmin.forEach((dia) => {
        html += `<div class="admin-weekday">${dia}</div>`;
    });

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    for (let i = 0; i < primeiroDia; i++) {
        html += `<div class="admin-day empty"></div>`;
    }

    for (let dia = 1; dia <= totalDias; dia++) {
        const dataObj = new Date(ano, mes, dia);
        const iso = obterDataFormatadaISO(dataObj);
        const permitido = ehDataPermitidaAdmin(iso);
        const disp = avaliarDisponibilidadeData(iso, estadoGlobal?.bloqueio, estadoGlobal?.configCasa, true);
        const ehFeriado = ehFeriadoISO(iso);
        const estaBloqueado = disp.prioridade === 1;
        const estaLiberadoExtra = disp.prioridade === 2;
        const diaComumFechado = disp.prioridade === 4;
        const reservas = getReservasDaDataAdmin(iso);

        const classes = [
            "admin-day",
            permitido ? "valid" : "",
            ehFeriado ? "feriado" : "",
            estaLiberadoExtra ? "released" : "",
            estaBloqueado ? "blocked" : "",
            diaComumFechado ? "dia-fechado" : "",
            iso === adminDataSelecionada ? "selected" : ""
        ].filter(Boolean).join(" ");

        let label = "";
        if (estaBloqueado) {
            label = `<span class="admin-day-lock-badge"><i class="fa-solid fa-lock"></i> Bloq.</span>`;
        } else if (estaLiberadoExtra) {
            label = `<span class="admin-day-release-badge"><i class="fa-solid fa-calendar-check"></i> Extra</span>`;
        } else if (ehFeriado) {
            label = `<span class="admin-day-label">feriado</span>`;
        }

        let badge = "";
        if (reservas.length > 0) {
            badge = `<span class="admin-day-reservas">${reservas.length}</span>`;
        }

        html += `
            <button type="button"
                class="${classes}"
                ${permitido ? `onclick="selecionarDataAdmin('${iso}')"` : "disabled"}
                aria-label="${permitido ? `Selecionar ${formatarDataBR(iso)}${estaBloqueado ? ' (Bloqueado)' : (estaLiberadoExtra ? ' (Liberado extra)' : (diaComumFechado ? ' (Dia comum fechado)' : ''))}` : "Data não disponível"}">
                <span class="admin-day-number">${dia}</span>
                ${label}
                ${badge}
            </button>
        `;
    }

    calendario.innerHTML = html;
    renderAdminReleasedDatesChips();
    renderAdminBlockedDatesChips();
}

function renderAdminReservas() {
    const lista = document.getElementById("admin-reservas-list");
    const titulo = document.getElementById("admin-selected-date-title");
    const contador = document.getElementById("admin-selected-count");

    if (!lista || !titulo || !contador) return;

    atualizarStatusBloqueioAdmin();

    const data = adminDataSelecionada;
    const reservas = getReservasDaDataAdmin(data);
    const busca = (document.getElementById("admin-busca")?.value || "")
        .trim()
        .toLowerCase();

    const reservasFiltradas = reservas.filter((r) => {
        if (!busca) return true;

        const nome = String(r.nome || "").toLowerCase();
        const mesa = String(r.mesa || "").toLowerCase();
        const horario = String(r.horario || "").toLowerCase();

        return (
            nome.includes(busca) ||
            mesa.includes(busca) ||
            horario.includes(busca)
        );
    });

    titulo.textContent = data
        ? formatarDataBR(data)
        : "Selecione uma data";

    contador.textContent = `${reservas.length} ${reservas.length === 1 ? "reserva" : "reservas"}`;

    const totalPessoas = reservas.reduce(
        (total, r) => total + getTotalPessoasReservaAdmin(r),
        0
    );

    const totalAdultos = reservas.reduce(
        (total, r) => total + Number(r.adultos || 0),
        0
    );

    const totalCriancas = reservas.reduce(
        (total, r) => total + Number(r.kids05 || 0) + Number(r.kids610 || 0),
        0
    );

    document.getElementById("admin-total-reservas").textContent = reservas.length;
    document.getElementById("admin-total-pessoas").textContent = totalPessoas;
    document.getElementById("admin-total-adultos").textContent = totalAdultos;
    document.getElementById("admin-total-criancas").textContent = totalCriancas;

    if (!reservasFiltradas.length) {
        const dispDataAdmin = data ? avaliarDisponibilidadeData(data, estadoGlobal?.bloqueio, estadoGlobal?.configCasa, true) : null;
        let mensagemVazia = "Esta data está disponível, mas ainda não possui reservas abertas.";
        if (busca) {
            mensagemVazia = "Tente pesquisar por outro nome, mesa ou horário.";
        } else if (dispDataAdmin?.prioridade === 1) {
            mensagemVazia = "Esta data está bloqueada manualmente para novas reservas.";
        } else if (dispDataAdmin?.prioridade === 4) {
            mensagemVazia = 'Dia comum fechado pela regra padrão (domingos e feriados). Use "Liberar data" acima se desejar abrir exceção.';
        }
        lista.innerHTML = `
            <div class="admin-empty">
                <i class="fa-regular fa-calendar-xmark"></i>
                <strong>${busca ? "Nenhuma reserva encontrada" : "Nenhuma reserva nesta data"}</strong>
                <span>${mensagemVazia}</span>
            </div>
        `;
        return;
    }

    lista.innerHTML = reservasFiltradas.map((r) => {
        const total = getTotalPessoasReservaAdmin(r);
        const status = String(r.status || "reservada").toLowerCase();
        const statusLabel = status === "ocupada" ? "Sentado" : "Pendente";

        const telefone = String(r.telefone || r.telefoneCliente || '').trim();
        const telefoneHtml = telefone
            ? `<a class="admin-reserva-telefone" href="tel:${escaparHTMLAdmin(telefone.replace(/[^0-9+]/g, ''))}"><i class="fa-solid fa-phone"></i> ${escaparHTMLAdmin(telefone)}</a>`
            : `<span class="admin-reserva-telefone sem-telefone"><i class="fa-solid fa-phone-slash"></i> Telefone não informado</span>`;

        return `
            <article class="admin-reserva-card">
                <div class="admin-reserva-top">
                    <div class="admin-reserva-client-head">
                        <div class="admin-reserva-nome">${escaparHTMLAdmin(r.nome || "Sem nome")}</div>
                        ${telefoneHtml}
                        <span class="admin-status ${escaparHTMLAdmin(status)}">
                            <i class="fa-solid ${status === "ocupada" ? "fa-chair" : "fa-clock"}"></i>
                            ${statusLabel}
                        </span>
                    </div>
                    <div class="admin-reserva-card-actions">
                        <div class="admin-reserva-horario">${escaparHTMLAdmin(r.horario || "--:--")}</div>
                        <button type="button" class="admin-edit-icon" onclick="editarReservaAdmin('${escaparHTMLAdmin(r.id)}')" title="Editar reserva" aria-label="Editar reserva de ${escaparHTMLAdmin(r.nome || 'cliente')}">
                            <i class="fa-solid fa-user-gear"></i>
                        </button>
                        <button type="button" class="admin-delete-icon" onclick="solicitarExclusaoReservaAdmin('${escaparHTMLAdmin(r.id)}')" title="Excluir Mesa" aria-label="Excluir reserva da mesa ${escaparHTMLAdmin(r.mesa ?? '')}">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>

                <div class="admin-reserva-info">
                    <div class="admin-reserva-item">
                        <strong>${total}</strong> pessoas
                    </div>
                    <div class="admin-reserva-item">
                        Mesa <strong>${escaparHTMLAdmin(r.mesa ?? "-")}</strong>
                    </div>
                    <div class="admin-reserva-item">
                        Adultos <strong>${Number(r.adultos || 0)}</strong>
                    </div>
                    <div class="admin-reserva-item">
                        Crianças <strong>${Number(r.kids05 || 0) + Number(r.kids610 || 0)}</strong>
                    </div>
                </div>

                ${r.obs ? `
                    <div class="admin-obs">
                        <strong>Observação:</strong> ${escaparHTMLAdmin(r.obs)}
                    </div>
                ` : ""}
            </article>
        `;
    }).join("");
}

function formatarTelefoneAdmin(valor) {
    const numeros = String(valor || '').replace(/\D/g, '').slice(0, 11);
    if (numeros.length <= 2) return numeros ? `(${numeros}` : '';
    if (numeros.length <= 6) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    if (numeros.length <= 10) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

function preencherDatasEdicaoAdmin(dataAtual) {
    const select = document.getElementById('admin-edit-data');
    if (!select) return;

    const datas = [];
    const hoje = new Date();
    const inicio = new Date(Math.max(new Date(ANO_MINIMO_CALENDARIO, 0, 1).getTime(), new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime()));
    const fim = new Date(ANO_MAXIMO_CALENDARIO, 11, 31);
    const cursor = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
    while (cursor <= fim) {
        const iso = obterDataFormatadaISO(cursor);
        if (avaliarDisponibilidadeData(iso, estadoGlobal?.bloqueio, estadoGlobal?.configCasa, true).disponivel || iso === dataAtual) {
            datas.push(iso);
        }
        cursor.setDate(cursor.getDate() + 1);
    }

    if (dataAtual && !datas.includes(dataAtual)) {
        datas.push(dataAtual);
    }

    datas.sort();
    select.innerHTML = datas.map(iso => {
        const disp = avaliarDisponibilidadeData(iso, estadoGlobal?.bloqueio, estadoGlobal?.configCasa, true);
        const tag = disp.prioridade === 2
            ? ' (Liberada)'
            : (disp.ehFeriado ? ' (Feriado)' : (disp.ehDomingo ? ' (Domingo)' : ''));
        return `<option value="${iso}">${escaparHTMLAdmin(formatarDataBR(iso) + tag)}</option>`;
    }).join('');
    select.value = dataAtual || '';
}

function preencherMesasEdicaoAdmin(dataISO, mesaAtual) {
    const select = document.getElementById('admin-edit-mesa');
    if (!select) return;

    const totalMesas = Number(estadoGlobal.configCasa?.totalMesas || 100);
    const idEdicaoAtual = document.getElementById('admin-edit-id')?.value || '';
    const ocupadas = obterMesasOcupadasNaData(dataISO, idEdicaoAtual);

    select.innerHTML = '';

    for (let i = 1; i <= totalMesas; i++) {
        if (!ocupadas.has(i) || Number(mesaAtual) === i) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Mesa ${i} • ${Number(mesaAtual) === i ? 'Atual' : 'Livre'}`;
            select.appendChild(option);
        }
    }

    if (mesaAtual && Array.from(select.options).some(o => String(o.value) === String(mesaAtual))) {
        select.value = String(mesaAtual);
    }
}

function editarReservaAdmin(idReserva) {
    if (!adminAutenticado) return;

    const reserva = getReservasAtivasAdmin().find(r => String(r.id) === String(idReserva));
    if (!reserva) {
        alert('Não foi possível encontrar esta reserva.');
        return;
    }

    document.getElementById('admin-edit-id').value = reserva.id;
    document.getElementById('admin-edit-nome').value = reserva.nome || '';
    document.getElementById('admin-edit-telefone').value = formatarTelefoneAdmin(reserva.telefone || reserva.telefoneCliente || '');
    document.getElementById('admin-edit-horario').value = reserva.horario || '12:00';
    document.getElementById('admin-edit-adultos').value = Number(reserva.adultos || 0);
    document.getElementById('admin-edit-kids05').value = Number(reserva.kids05 || 0);
    document.getElementById('admin-edit-kids610').value = Number(reserva.kids610 || 0);
    document.getElementById('admin-edit-status').value = String(reserva.status || 'reservada').toLowerCase() === 'ocupada' ? 'ocupada' : 'reservada';
    document.getElementById('admin-edit-obs').value = reserva.obs || '';
    document.getElementById('admin-edit-error').textContent = '';

    preencherDatasEdicaoAdmin(reserva.data);
    preencherMesasEdicaoAdmin(reserva.data, reserva.mesa);

    const modal = document.getElementById('admin-edit-modal');
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => document.getElementById('admin-edit-nome')?.focus(), 80);
}

function fecharEdicaoReservaAdmin() {
    const modal = document.getElementById('admin-edit-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
}

async function salvarEdicaoReservaAdmin() {
    const id = document.getElementById('admin-edit-id').value;
    const erro = document.getElementById('admin-edit-error');
    const btn = document.getElementById('admin-edit-save');

    const reservaOriginal = getReservasAtivasAdmin().find(r => String(r.id) === String(id));
    if (!reservaOriginal) {
        erro.textContent = 'Reserva não encontrada.';
        return;
    }

    const nome = document.getElementById('admin-edit-nome').value.trim();
    const telefone = document.getElementById('admin-edit-telefone').value.trim();
    const data = document.getElementById('admin-edit-data').value;
    const horario = document.getElementById('admin-edit-horario').value;
    const mesa = Number(document.getElementById('admin-edit-mesa').value);
    const adultos = Math.max(0, Number(document.getElementById('admin-edit-adultos').value || 0));
    const kids05 = Math.max(0, Number(document.getElementById('admin-edit-kids05').value || 0));
    const kids610 = Math.max(0, Number(document.getElementById('admin-edit-kids610').value || 0));
    const status = document.getElementById('admin-edit-status').value;
    const obs = document.getElementById('admin-edit-obs').value.trim();

    erro.textContent = '';

    if (!nome) {
        erro.textContent = 'Informe o nome do cliente.';
        return;
    }
    if (!data || (!ehDataValidaISO(data) && data !== reservaOriginal.data)) {
        erro.textContent = 'Selecione uma data válida dentro do calendário de 2026 ou 2027.';
        return;
    }
    if (!mesa) {
        erro.textContent = 'Selecione uma mesa.';
        return;
    }

    const totalPessoas = adultos + kids05 + kids610;
    if (totalPessoas <= 0) {
        erro.textContent = 'Informe pelo menos 1 pessoa na reserva.';
        return;
    }
    if (totalPessoas > 30) {
        erro.textContent = 'Reservas acima de 30 pessoas devem ser tratadas pelo atendimento de grupos.';
        return;
    }

    // Não permite duas reservas na mesma mesa/data, exceto a própria reserva que está sendo editada.
    const conflitoMesa = getReservasAtivasAdmin().find(r =>
        String(r.id) !== String(id) && r.data === data && Number(r.mesa) === mesa
    );
    if (conflitoMesa) {
        erro.textContent = `A Mesa ${mesa} já está reservada para ${formatarDataBR(data)}.`;
        return;
    }

    // Confere capacidade do novo dia, descontando a própria reserva do cálculo.
    const capacidade = Number(estadoGlobal.configCasa?.capacidadePessoas || 400);
    const pessoasOutrasReservas = getReservasAtivasAdmin()
        .filter(r => String(r.id) !== String(id) && r.data === data)
        .reduce((sum, r) => sum + getTotalPessoasReservaAdmin(r), 0);

    if (pessoasOutrasReservas + totalPessoas > capacidade) {
        erro.textContent = `A capacidade desta data seria ultrapassada. Restam ${Math.max(0, capacidade - pessoasOutrasReservas)} lugares.`;
        return;
    }

    const dadosAtualizados = {
        nome,
        telefone,
        data,
        horario,
        mesa,
        adultos,
        kids05,
        kids610,
        obs,
        status
    };

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SALVANDO...';

    const targetKey = String(reservaOriginal._firebaseKey || reservaOriginal.id || id);
    const mudouMesaOuData = (reservaOriginal.data !== data || Number(reservaOriginal.mesa) !== mesa);
    let novoLockAdquirido = false;

    try {
        const snapLive = await dbRef.once('value');
        aplicarDadosSnapshotGlobal(snapLive.val());

        const ocupadasLive = obterMesasOcupadasNaData(data, id);
        if (ehStatusAtivoReserva(status) && ocupadasLive.has(mesa)) {
            erro.textContent = `A Mesa ${mesa} já está reservada para ${formatarDataBR(data)}.`;
            return;
        }

        if (ehStatusAtivoReserva(status)) {
            const txEdit = await ocuparLockMesaAtomico(data, mesa, {
                reservaId: id,
                horario: horario,
                nome: nome,
                status: status
            });
            if (!txEdit.committed || String(txEdit.snapshot?.val()?.reservaId || '') !== String(id)) {
                erro.textContent = `A Mesa ${mesa} acabou de ser reservada para ${formatarDataBR(data)}.`;
                return;
            }
            novoLockAdquirido = true;
        }

        await dbRef.child('reservas').child(targetKey).update(dadosAtualizados);

        if (!ehStatusAtivoReserva(status)) {
            await liberarLockMesa(reservaOriginal.data, reservaOriginal.mesa, id);
        } else if (mudouMesaOuData) {
            await liberarLockMesa(reservaOriginal.data, reservaOriginal.mesa, id);
        }

        fecharEdicaoReservaAdmin();

        // Mantém a data selecionada no calendário após a edição.
        adminDataSelecionada = data;
        adminMesAtual = new Date(`${data}T12:00:00`);
        adminMesAtual = new Date(adminMesAtual.getFullYear(), adminMesAtual.getMonth(), 1);
        renderAdminCalendario();
        renderAdminReservas();
        atualizarSelectMesas();
        renderCalendarioCliente();
    } catch (error) {
        if (novoLockAdquirido && mudouMesaOuData) {
            await liberarLockMesa(data, mesa, id);
        }
        erro.textContent = 'Não foi possível salvar: ' + error.message;
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> SALVAR ALTERAÇÕES';
    }
}

document.addEventListener('input', (event) => {
    if (event.target?.id === 'admin-edit-telefone' || event.target?.id === 'cli-telefone') {
        event.target.value = formatarTelefoneAdmin(event.target.value);
    }
});

document.addEventListener('change', (event) => {
    if (event.target?.id === 'admin-edit-data') {
        const mesaAtual = document.getElementById('admin-edit-mesa')?.value;
        preencherMesasEdicaoAdmin(event.target.value, mesaAtual);
    }
});

let idReservaParaExcluir = null;

function solicitarExclusaoReservaAdmin(idReserva) {
    if (!adminAutenticado) return;
    const reserva = getReservasAtivasAdmin().find(r => String(r.id) === String(idReserva));
    if (!reserva) {
        mostrarPopupNotificacao('Reserva não encontrada.', 'fa-triangle-exclamation');
        return;
    }

    idReservaParaExcluir = idReserva;

    const modal = document.getElementById('admin-delete-modal');
    const infoContainer = document.getElementById('admin-delete-reserva-info');
    const erroContainer = document.getElementById('admin-delete-error');
    const btnConfirmar = document.getElementById('admin-btn-confirm-delete');

    if (erroContainer) erroContainer.textContent = '';
    if (btnConfirmar) {
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = '<i class="fa-solid fa-trash-can"></i> Sim, Excluir';
    }

    const total = getTotalPessoasReservaAdmin(reserva);
    if (infoContainer) {
        infoContainer.innerHTML = `
            <div><strong>Cliente:</strong> ${escaparHTMLAdmin(reserva.nome || 'Sem nome')}</div>
            <div><strong>Mesa:</strong> Mesa ${escaparHTMLAdmin(reserva.mesa ?? '-')} &bull; <strong>Horário:</strong> ${escaparHTMLAdmin(reserva.horario || '--:--')}</div>
            <div><strong>Data:</strong> ${escaparHTMLAdmin(formatarDataBR(reserva.data))} &bull; <strong>Total:</strong> ${total} pessoa(s)</div>
        `;
    }

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function fecharModalExclusaoAdmin() {
    const modal = document.getElementById('admin-delete-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    idReservaParaExcluir = null;
}

async function confirmarExclusaoReservaAdmin() {
    if (!idReservaParaExcluir) return;

    const id = idReservaParaExcluir;
    const btn = document.getElementById('admin-btn-confirm-delete');
    const erro = document.getElementById('admin-delete-error');

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> EXCLUINDO...';
    }

    try {
        const reservaAlvo = estadoGlobal.reservas.find(r => String(r.id) === String(id));
        const targetKey = String(reservaAlvo?._firebaseKey || id);
        await dbRef.child('reservas').child(targetKey).remove();

        if (reservaAlvo) {
            await liberarLockMesa(reservaAlvo.data, reservaAlvo.mesa, reservaAlvo.id || targetKey);
        }
        
        // Remove também da lista local para resposta imediata
        estadoGlobal.reservas = estadoGlobal.reservas.filter(r => String(r.id) !== String(id));

        fecharModalExclusaoAdmin();
        renderAdminCalendario();
        renderAdminReservas();
        atualizarSelectMesas();
        renderCalendarioCliente();

        mostrarPopupNotificacao('Reserva de mesa excluída com sucesso!', 'fa-trash-can');
    } catch (error) {
        if (erro) erro.textContent = 'Erro ao excluir reserva: ' + (error.message || error);
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Sim, Excluir';
        }
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const editModal = document.getElementById('admin-edit-modal');
        if (editModal && !editModal.classList.contains('hidden')) {
            fecharEdicaoReservaAdmin();
        }
        const deleteModal = document.getElementById('admin-delete-modal');
        if (deleteModal && !deleteModal.classList.contains('hidden')) {
            fecharModalExclusaoAdmin();
        }
        const pinModal = document.getElementById('admin-pin-modal');
        if (pinModal && !pinModal.classList.contains('hidden')) {
            fecharPinAdmin();
        }
        const lockModal = document.getElementById('admin-lock-modal');
        if (lockModal && !lockModal.classList.contains('hidden')) {
            fecharModalBloqueioAdmin();
        }
        const cancelModal = document.getElementById('cancel-confirm-modal');
        if (cancelModal && !cancelModal.classList.contains('hidden')) {
            fecharModalConfirmacaoCancelamento();
        }
    }
});

function escaparHTMLAdmin(valor) {
    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* Atualiza a área administrativa em tempo real quando o Firebase mudar. */
function atualizarAdminSeAberto() {
    if (!adminAutenticado) return;

    const secao = document.getElementById("secao-admin");
    if (!secao || secao.classList.contains("hidden")) return;

    atualizarStatusBloqueioAdmin();
    renderAdminCalendario();
    renderAdminReservas();
}

/* ============================================================
   TELA INICIAL E FLUXO DE CANCELAMENTO PELO CLIENTE
   ============================================================ */
let reservaSelecionadaParaCancelar = null;

function normalizarTextoBusca(texto) {
    return String(texto || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

function ehStatusReservaAtiva(status) {
    const s = String(status || 'reservada').toLowerCase();
    return !['cancelada', 'cancelado', 'encerrada', 'encerrado', 'excluida', 'excluído'].includes(s);
}

function voltarParaInicio() {
    fecharModalConfirmacaoCancelamento();
    document.getElementById('secao-formulario')?.classList.add('hidden');
    document.getElementById('secao-comprovante')?.classList.add('hidden');
    document.getElementById('secao-cancelar')?.classList.add('hidden');
    document.getElementById('secao-admin')?.classList.add('hidden');
    document.getElementById('secao-inicio')?.classList.remove('hidden');
    document.querySelector('.wsp-float')?.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function irParaAgendarReserva() {
    document.getElementById('secao-inicio')?.classList.add('hidden');
    document.getElementById('secao-cancelar')?.classList.add('hidden');
    document.getElementById('secao-comprovante')?.classList.add('hidden');
    document.getElementById('secao-admin')?.classList.add('hidden');
    document.getElementById('secao-formulario')?.classList.remove('hidden');

    atualizarInterfaceBloqueioCliente();
    atualizarSelectMesas();
    renderCalendarioCliente();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetarTelaCancelamento() {
    reservaSelecionadaParaCancelar = null;
    const form = document.getElementById('form-buscar-reserva');
    if (form) form.reset();

    const erroBox = document.getElementById('cancel-busca-erro');
    if (erroBox) {
        erroBox.classList.add('hidden');
        erroBox.innerHTML = '';
    }

    document.getElementById('cancel-busca-card')?.classList.remove('hidden');
    document.getElementById('cancel-resultado-card')?.classList.add('hidden');
    document.getElementById('cancel-sucesso-card')?.classList.add('hidden');
}

function irParaCancelarReserva() {
    resetarTelaCancelamento();
    document.getElementById('secao-inicio')?.classList.add('hidden');
    document.getElementById('secao-formulario')?.classList.add('hidden');
    document.getElementById('secao-comprovante')?.classList.add('hidden');
    document.getElementById('secao-admin')?.classList.add('hidden');
    document.getElementById('secao-cancelar')?.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => document.getElementById('cancel-nome')?.focus(), 120);
}

function voltarParaBuscaCancelamento() {
    reservaSelecionadaParaCancelar = null;
    document.getElementById('cancel-resultado-card')?.classList.add('hidden');
    document.getElementById('cancel-sucesso-card')?.classList.add('hidden');
    document.getElementById('cancel-busca-card')?.classList.remove('hidden');
    setTimeout(() => document.getElementById('cancel-nome')?.focus(), 80);
}

function exibirErroBuscaCancelamento(mensagem) {
    const erroBox = document.getElementById('cancel-busca-erro');
    if (!erroBox) return;
    erroBox.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i><span>${escaparHTMLAdmin(mensagem)}</span>`;
    erroBox.classList.remove('hidden');
}

function ocultarErroBuscaCancelamento() {
    const erroBox = document.getElementById('cancel-busca-erro');
    if (!erroBox) return;
    erroBox.classList.add('hidden');
    erroBox.innerHTML = '';
}

function calcularTotalPessoasCancelamento(reserva) {
    if (!reserva) return null;
    const temCamposGrupo = (
        reserva.adultos !== undefined ||
        reserva.kids05 !== undefined ||
        reserva.kids610 !== undefined
    );
    if (temCamposGrupo) {
        const adultos = Number(reserva.adultos || 0);
        const kids05 = Number(reserva.kids05 || 0);
        const kids610 = Number(reserva.kids610 || 0);
        const total = adultos + kids05 + kids610;
        return {
            total,
            texto: `${total} ${total === 1 ? 'pessoa' : 'pessoas'} (${adultos} ad, ${kids610} meia, ${kids05} free)`
        };
    }
    if (reserva.pessoas !== undefined || reserva.quantidadePessoas !== undefined) {
        const total = Number(reserva.pessoas ?? reserva.quantidadePessoas ?? 0);
        return {
            total,
            texto: `${total} ${total === 1 ? 'pessoa' : 'pessoas'}`
        };
    }
    return null;
}

async function buscarReservaParaCancelar(event) {
    if (event) event.preventDefault();
    ocultarErroBuscaCancelamento();

    const inputNome = document.getElementById('cancel-nome');
    const inputMesa = document.getElementById('cancel-mesa');
    const btnBuscar = document.getElementById('btn-buscar-reserva');

    const nomeInformado = String(inputNome?.value || '').trim();
    const mesaRaw = String(inputMesa?.value || '').trim();
    const mesaNumero = parseInt(mesaRaw, 10);

    if (!nomeInformado) {
        exibirErroBuscaCancelamento('Por favor, informe o nome completo utilizado na reserva.');
        inputNome?.focus();
        return;
    }

    if (!mesaRaw || isNaN(mesaNumero) || mesaNumero <= 0) {
        exibirErroBuscaCancelamento('Por favor, informe um número de mesa válido.');
        inputMesa?.focus();
        return;
    }

    if (btnBuscar) {
        btnBuscar.disabled = true;
        btnBuscar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> BUSCANDO RESERVA...';
    }

    try {
        let listaReservas = Array.isArray(estadoGlobal?.reservas) ? estadoGlobal.reservas : [];

        // Consulta os registros mais recentes diretamente no Firebase
        try {
            const snapshot = await dbRef.child('reservas').once('value');
            const dados = snapshot.val();
            if (dados && typeof dados === 'object') {
                listaReservas = Object.entries(dados).map(([firebaseKey, item]) => ({
                    ...(item || {}),
                    id: item?.id || firebaseKey,
                    _firebaseKey: firebaseKey
                }));
                estadoGlobal.reservas = listaReservas;
            } else if (dados === null) {
                listaReservas = [];
                estadoGlobal.reservas = [];
            }
        } catch (fbError) {
            console.warn('Falha ao consultar Firebase diretamente, utilizando estado local sincronizado:', fbError);
        }

        const nomeNormalizado = normalizarTextoBusca(nomeInformado);
        const hojeISO = obterDataFormatadaISO(new Date());

        const correspondencias = listaReservas.filter((r) => {
            if (!r || !ehStatusReservaAtiva(r.status)) return false;
            const nomeReserva = normalizarTextoBusca(r.nome);
            const mesaReserva = parseInt(r.mesa, 10);
            return nomeReserva === nomeNormalizado && !isNaN(mesaReserva) && mesaReserva === mesaNumero;
        });

        if (!correspondencias.length) {
            exibirErroBuscaCancelamento('Não encontramos uma reserva com esses dados. Confira o nome e o número da mesa e tente novamente.');
            return;
        }

        // Prioriza reservas de hoje ou futuras em ordem cronológica; se todas forem passadas, pega a mais recente
        correspondencias.sort((a, b) => {
            const dataA = String(a.data || '');
            const dataB = String(b.data || '');
            const aFutura = dataA >= hojeISO;
            const bFutura = dataB >= hojeISO;
            if (aFutura && !bFutura) return -1;
            if (!aFutura && bFutura) return 1;
            if (aFutura && bFutura) return dataA.localeCompare(dataB);
            return dataB.localeCompare(dataA);
        });

        const reservaEncontrada = correspondencias[0];
        reservaSelecionadaParaCancelar = reservaEncontrada;
        exibirResultadoReservaCancelamento(reservaEncontrada);
    } finally {
        if (btnBuscar) {
            btnBuscar.disabled = false;
            btnBuscar.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Buscar reserva';
        }
    }
}

function exibirResultadoReservaCancelamento(reserva) {
    const listaEl = document.getElementById('cancel-detalhes-lista');
    if (!listaEl || !reserva) return;

    const linhas = [];

    linhas.push(`
        <div class="recibo-linha">
            <span class="rotulo">Nome do cliente:</span>
            <span class="valor">${escaparHTMLAdmin(reserva.nome || '-')}</span>
        </div>
    `);

    linhas.push(`
        <div class="recibo-linha">
            <span class="rotulo">Número da mesa:</span>
            <span class="valor recibo-destaque">Mesa ${escaparHTMLAdmin(reserva.mesa ?? '-')}</span>
        </div>
    `);

    if (reserva.data) {
        linhas.push(`
            <div class="recibo-linha">
                <span class="rotulo">Data da reserva:</span>
                <span class="valor">${escaparHTMLAdmin(formatarDataBR(reserva.data))}</span>
            </div>
        `);
    }

    if (reserva.horario) {
        linhas.push(`
            <div class="recibo-linha">
                <span class="rotulo">Horário:</span>
                <span class="valor">${escaparHTMLAdmin(reserva.horario)}h</span>
            </div>
        `);
    }

    const infoPessoas = calcularTotalPessoasCancelamento(reserva);
    if (infoPessoas && infoPessoas.total > 0) {
        linhas.push(`
            <div class="recibo-linha">
                <span class="rotulo">Quantidade de pessoas:</span>
                <span class="valor">${escaparHTMLAdmin(infoPessoas.texto)}</span>
            </div>
        `);
    }

    listaEl.innerHTML = linhas.join('');

    document.getElementById('cancel-busca-card')?.classList.add('hidden');
    document.getElementById('cancel-sucesso-card')?.classList.add('hidden');
    document.getElementById('cancel-resultado-card')?.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function abrirModalConfirmacaoCancelamento() {
    if (!reservaSelecionadaParaCancelar) {
        voltarParaBuscaCancelamento();
        return;
    }

    const modal = document.getElementById('cancel-confirm-modal');
    const resumo = document.getElementById('cancel-confirm-resumo');
    const erroEl = document.getElementById('cancel-confirm-error');
    const btnConfirmar = document.getElementById('btn-confirmar-cancelamento-final');

    if (erroEl) erroEl.textContent = '';
    if (btnConfirmar) {
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = '<i class="fa-solid fa-calendar-xmark"></i> Sim, cancelar reserva';
    }

    if (resumo) {
        const r = reservaSelecionadaParaCancelar;
        const partesInfo = [];
        if (r.data) partesInfo.push(`<strong>Data:</strong> ${escaparHTMLAdmin(formatarDataBR(r.data))}`);
        if (r.horario) partesInfo.push(`<strong>Horário:</strong> ${escaparHTMLAdmin(r.horario)}h`);
        resumo.innerHTML = `
            <div><strong>Cliente:</strong> ${escaparHTMLAdmin(r.nome || '-')}</div>
            <div><strong>Mesa:</strong> Mesa ${escaparHTMLAdmin(r.mesa ?? '-')}</div>
            ${partesInfo.length ? `<div>${partesInfo.join(' &bull; ')}</div>` : ''}
        `;
    }

    if (modal) {
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }
}

function fecharModalConfirmacaoCancelamento() {
    const modal = document.getElementById('cancel-confirm-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('modal-open');
}

async function confirmarCancelamentoCliente() {
    if (!reservaSelecionadaParaCancelar) {
        fecharModalConfirmacaoCancelamento();
        return;
    }

    const btn = document.getElementById('btn-confirmar-cancelamento-final');
    const erroEl = document.getElementById('cancel-confirm-error');
    const targetKey = String(reservaSelecionadaParaCancelar._firebaseKey || reservaSelecionadaParaCancelar.id || '').trim();

    if (!targetKey) {
        if (erroEl) erroEl.textContent = 'Não foi possível identificar o registro da reserva.';
        return;
    }

    if (erroEl) erroEl.textContent = '';
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> CANCELANDO...';
    }

    try {
        // Confirma no banco antes de atualizar para evitar cancelamentos duplicados ou incorretos
        const snapAtual = await dbRef.child('reservas').child(targetKey).once('value');
        const dadosAtuais = snapAtual.val();

        if (!dadosAtuais) {
            throw new Error('Esta reserva não existe mais no sistema.');
        }

        if (!ehStatusReservaAtiva(dadosAtuais.status)) {
            throw new Error('Esta reserva já foi cancelada anteriormente.');
        }

        await dbRef.child('reservas').child(targetKey).update({
            status: 'cancelada',
            canceladaEm: new Date().toISOString(),
            canceladaPor: 'cliente'
        });

        await liberarLockMesa(dadosAtuais.data, dadosAtuais.mesa, dadosAtuais.id || targetKey);

        // Atualiza imediatamente o estado local enquanto o listener do Firebase sincroniza
        estadoGlobal.reservas = estadoGlobal.reservas.map((r) => {
            const key = String(r._firebaseKey || r.id || '');
            if (key === targetKey) {
                return { ...r, status: 'cancelada' };
            }
            return r;
        });
        if (dadosAtuais.data && dadosAtuais.mesa && estadoGlobal.ocupacaoMesas?.[dadosAtuais.data]) {
            const mKey = String(parseInt(dadosAtuais.mesa, 10));
            const lockAtual = estadoGlobal.ocupacaoMesas[dadosAtuais.data][mKey];
            if (!lockAtual || String(lockAtual.reservaId || '') === String(dadosAtuais.id || targetKey)) {
                delete estadoGlobal.ocupacaoMesas[dadosAtuais.data][mKey];
            }
        }

        reservaSelecionadaParaCancelar = null;
        fecharModalConfirmacaoCancelamento();

        atualizarSelectMesas();
        renderCalendarioCliente();
        atualizarAdminSeAberto();

        document.getElementById('cancel-busca-card')?.classList.add('hidden');
        document.getElementById('cancel-resultado-card')?.classList.add('hidden');
        document.getElementById('cancel-sucesso-card')?.classList.remove('hidden');

        mostrarPopupNotificacao('Reserva cancelada com sucesso!', 'fa-circle-check');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        if (erroEl) {
            erroEl.textContent = error.message || 'Erro ao cancelar reserva. Tente novamente.';
        }
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-calendar-xmark"></i> Sim, cancelar reserva';
        }
    }
}

