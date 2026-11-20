// FERIADOS CADASTRADOS ATÉ O FIM DO ANO
       const feriadosPermitidos = [
           "2026-01-01", "2026-03-03", "2026-04-03", "2026-04-21", 
           "2026-05-01", "2026-06-04", "2026-09-07", "2026-10-12", 
           "2026-11-02", "2026-11-15", "2026-11-20", "2026-12-25"
       ];

       // FUNÇÃO UTILITÁRIA PARA FORMATAR DATA EM YYYY-MM-DD RESPEITANDO O FUSO HORÁRIO LOCAL
       function obterDataFormatadaISO(dataObj) {
           const ano = dataObj.getFullYear();
           const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
           const dia = String(dataObj.getDate()).padStart(2, '0');
           return `${ano}-${mes}-${dia}`;
       }

       // FUNÇÃO PARA CALCULAR O PRÓXIMO DOMINGO NO FUSO LOCAL
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
           campoData.max = `${hojeObj.getFullYear()}-12-31`;

           // SELECIONA O PRÓXIMO DOMINGO DISPONÍVEL COMO PADRÃO (FUSO LOCAL)
           campoData.value = obterProximoDomingoLocal();

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
               atualizarSelectMesas();
           });
       });

       // VALIDAR SE A DATA É DOMINGO OU FERIADO CADASTRADO
       function validarDataSelecionada() {
           const campoData = document.getElementById('cli-data');
           const dataValor = campoData.value;
           if (!dataValor) return;

           const partes = dataValor.split('-');
           const dataObj = new Date(partes[0], partes[1] - 1, partes[2]);
           const diaSemana = dataObj.getDay();

           const ehDomingo = (diaSemana === 0);
           const ehFeriado = feriadosPermitidos.includes(dataValor);

           if (!ehDomingo && !ehFeriado) {
               alert("O Celeiro funciona exclusivamente aos DOMINGOS e FERIADOS. Por favor, escolha uma data válida.");
               campoData.value = obterProximoDomingoLocal();
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
           configCasa: { totalMesas: 100, capacidadePessoas: 400, reservasTrancadas: false },
           bloqueio: {
               trancado: false,
               mensagem: "Capacidade lotada para este dia! No momento, não estamos aceitando novas reservas. Agradecemos pela compreensão.",
               datasTrancadas: {}
           }
       };
       let dadosReservaAtual = null;

       firebase.database().ref('.info/connected').on('value', (snap) => {
           const container = document.getElementById('conexao-status-container');
           if (snap.val() === true) {
               container.innerHTML = `<span class="status-conexao-badge sc-online"><i class="fa-solid fa-circle"></i> Online</span>`;
           } else {
               container.innerHTML = `<span class="status-conexao-badge sc-offline"><i class="fa-solid fa-wifi"></i> Offline</span>`;
           }
       });

       dbRef.on('value', (snapshot) => {
           const dados = snapshot.val();
           if (dados) {
               estadoGlobal.reservas = dados.reservas
                   ? Object.entries(dados.reservas).map(([firebaseKey, item]) => ({
                       ...(item || {}),
                       id: item?.id || firebaseKey,
                       _firebaseKey: firebaseKey
                   }))
                   : [];
               if (dados.configCasa) estadoGlobal.configCasa = dados.configCasa;

               const trancadoGlobal = Boolean(
                   dados.bloqueio?.trancado ?? dados.configCasa?.reservasTrancadas ?? false
               );
               const datasTrancadas = dados.bloqueio?.datasTrancadas || dados.configCasa?.datasTrancadas || {};

               estadoGlobal.bloqueio = {
                   trancado: trancadoGlobal,
                   mensagem: dados.bloqueio?.mensagem || "Capacidade lotada para este dia! No momento, não estamos aceitando novas reservas. Agradecemos pela compreensão.",
                   datasTrancadas: datasTrancadas
               };
           } else {
               estadoGlobal.reservas = [];
               estadoGlobal.bloqueio = { trancado: false, datasTrancadas: {} };
           }
           atualizarInterfaceBloqueioCliente();
           atualizarSelectMesas();
           renderCalendarioCliente();
           atualizarAdminSeAberto();
       });

       // VERIFICA SE O BLOQUEIO DE RESERVAS ESTÁ ATIVO (GLOBAL OU ESPECÍFICO DE UMA DATA)
       function verificarSeReservasTrancadas(dataISO) {
           if (!estadoGlobal?.bloqueio) return false;
           if (estadoGlobal.bloqueio.trancado === true || estadoGlobal.configCasa?.reservasTrancadas === true) {
               return true;
           }
           if (dataISO && estadoGlobal.bloqueio.datasTrancadas) {
               const keyOriginal = String(dataISO);
               const keyUnder = keyOriginal.replace(/-/g, '_');
               if (estadoGlobal.bloqueio.datasTrancadas[keyOriginal] === true || estadoGlobal.bloqueio.datasTrancadas[keyUnder] === true) {
                   return true;
               }
           }
           return false;
       }

       // ATUALIZA A INTERFACE PÚBLICA DO CLIENTE QUANDO O BLOQUEIO MUDA
       function atualizarInterfaceBloqueioCliente() {
           const campoData = document.getElementById('cli-data');
           const dataSelecionada = campoData ? campoData.value : (typeof clienteDataSelecionada !== 'undefined' ? clienteDataSelecionada : '');
           const estaTrancado = verificarSeReservasTrancadas(dataSelecionada);

           const bannerBloqueio = document.getElementById('container-bloqueio-cliente');
           const containerHorarioMesa = document.getElementById('container-horario-mesa');
           const selectHorario = document.getElementById('cli-horario');
           const selectMesa = document.getElementById('cli-mesa');
           const btnSubmit = document.getElementById('btn-submit');

           if (bannerBloqueio) {
               if (estaTrancado) {
                   bannerBloqueio.classList.remove('hidden');
               } else {
                   bannerBloqueio.classList.add('hidden');
               }
           }

           if (containerHorarioMesa) {
               if (estaTrancado) {
                   containerHorarioMesa.classList.add('hidden');
               } else {
                   containerHorarioMesa.classList.remove('hidden');
               }
           }

           if (selectHorario) {
               selectHorario.disabled = estaTrancado;
           }

           if (selectMesa) {
               selectMesa.disabled = estaTrancado;
               if (estaTrancado) {
                   selectMesa.innerHTML = '<option value="">Reservas encerradas para esta data</option>';
                   selectMesa.value = '';
               }
           }

           sincronizarCustomSelect('cli-horario');
           sincronizarCustomSelect('cli-mesa');

           if (btnSubmit) {
               if (estaTrancado) {
                   btnSubmit.disabled = true;
                   btnSubmit.classList.add('btn-submit-bloqueado');
                   btnSubmit.innerHTML = `<i class="fa-solid fa-lock"></i> RESERVAS TRANCADAS • CAPACIDADE LOTADA`;
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
           if (verificarSeReservasTrancadas(dataISO)) return [];
           const totalMesas = estadoGlobal.configCasa?.totalMesas || 100;
           const reservasDaData = (Array.isArray(estadoGlobal?.reservas) ? estadoGlobal.reservas : []).filter(r => {
               if (r.data !== dataISO) return false;
               const status = String(r.status || 'reservada').toLowerCase();
               return !['cancelada', 'cancelado', 'encerrada', 'encerrado', 'excluida', 'excluído'].includes(status);
           });

           const mesasOcupadas = new Set(reservasDaData.map(r => parseInt(r.mesa)).filter(n => !isNaN(n)));
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

           // SE AS RESERVAS ESTIVEREM TRANCADAS PARA ESTA DATA, NÃO EXIBE NÚMEROS DE MESAS
           if (verificarSeReservasTrancadas(dataSelecionada)) {
               selectMesa.innerHTML = '<option value="">Reservas encerradas para esta data</option>';
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
let clienteMesAtual = new Date();
let clienteDataSelecionada = null;
const nomesMesesCliente = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];
const nomesDiasCliente = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];

function dataLocalPorISO(iso){
    const p=String(iso||'').split('-');
    if(p.length!==3) return null;
    return new Date(Number(p[0]),Number(p[1])-1,Number(p[2]));
}

function ehDataPermitidaCliente(iso){
    const d=dataLocalPorISO(iso);
    if(!d) return false;
    const hoje=new Date();
    const inicioHoje=new Date(hoje.getFullYear(),hoje.getMonth(),hoje.getDate());
    if(d < inicioHoje) return false;
    return d.getDay()===0 || feriadosPermitidos.includes(iso);
}

function obterProximaDataPermitidaCliente(dataBase=new Date()){
    const d=new Date(dataBase.getFullYear(),dataBase.getMonth(),dataBase.getDate());
    for(let i=0;i<370;i++){
        const iso=obterDataFormatadaISO(d);
        if(ehDataPermitidaCliente(iso)) return iso;
        d.setDate(d.getDate()+1);
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
    if(nova < mesAtualReal) return;
    clienteMesAtual=nova;
    renderCalendarioCliente();
}

function irParaMesAtualCliente(){
    const hoje=new Date();
    clienteMesAtual=new Date(hoje.getFullYear(),hoje.getMonth(),1);
    const campo=document.getElementById('cli-data');
    const atual=campo?.value;
    clienteDataSelecionada=ehDataPermitidaCliente(atual)?atual:obterProximaDataPermitidaCliente(hoje);
    if(campo) campo.value=clienteDataSelecionada;
    atualizarInterfaceBloqueioCliente();
    atualizarSelectMesas();
    renderCalendarioCliente();
}

function selecionarDataCliente(iso){
    if(!ehDataPermitidaCliente(iso)) return;
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
    const podeVoltar=clienteMesAtual>mesHoje;
    const botoes=document.querySelectorAll('.client-calendar-nav button');
    if(botoes[0]) botoes[0].disabled=!podeVoltar;

    let html=nomesDiasCliente.map(d=>`<div class="client-weekday">${d}</div>`).join('');
    const primeiroDia=new Date(ano,mes,1).getDay();
    const totalDias=new Date(ano,mes+1,0).getDate();

    for(let i=0;i<primeiroDia;i++) html+=`<button type="button" class="client-day empty" tabindex="-1" aria-hidden="true"></button>`;

    for(let dia=1;dia<=totalDias;dia++){
        const d=new Date(ano,mes,dia);
        const iso=obterDataFormatadaISO(d);
        const permitido=ehDataPermitidaCliente(iso);
        const feriado=feriadosPermitidos.includes(iso);
        const trancado=permitido && verificarSeReservasTrancadas(iso);
        const reservas=getReservasDaDataCliente(iso);
        const hojeISO=obterDataFormatadaISO(hoje);
        const classes=['client-day',permitido?'valid':'',feriado?'feriado':'',trancado?'lotado':'',iso===clienteDataSelecionada?'selected':'',iso===hojeISO?'today':'',d<new Date(hoje.getFullYear(),hoje.getMonth(),hoje.getDate())?'past':''].filter(Boolean).join(' ');
        const label=feriado?'<span class="client-day-label">FERIADO</span>':(trancado?'<span class="client-day-label" style="background:rgba(224,130,63,0.3);color:var(--terracota-sol);">LOTADO</span>':'');
        const badge=reservas.length?`<span class="client-day-reservas">${reservas.length}</span>`:'';
        html+=`<button type="button" class="${classes}" ${permitido?`onclick="selecionarDataCliente('${iso}')"`: 'disabled'} aria-label="${permitido?'Selecionar '+formatarDataBR(iso)+(trancado?' (Lotado)':''):'Data indisponível'}"><span class="client-day-number">${dia}</span>${label}${badge}</button>`;
    }
    grid.innerHTML=html;
}

function inicializarCalendarioCliente(){
    const campo=document.getElementById('cli-data');
    if(!campo) return;
    const hoje=new Date();
    const inicial=campo.value && ehDataPermitidaCliente(campo.value) ? campo.value : obterProximaDataPermitidaCliente(hoje);
    clienteDataSelecionada=inicial;
    campo.value=inicial;
    const d=dataLocalPorISO(inicial) || hoje;
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

              // ENVIO DO FORMULÁRIO DE AUTORRESERVA
       document.getElementById('form-autorreserva').onsubmit = function(e) {
           e.preventDefault();

           const btnSubmit = document.getElementById('btn-submit');
           btnSubmit.disabled = true;
           btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> PROCESSANDO...`;

           const nome = document.getElementById('cli-nome').value.trim();
           const adultos = parseInt(document.getElementById('cli-adultos').value) || 0;
           const kids05 = parseInt(document.getElementById('cli-kids05').value) || 0;
           const kids610 = parseInt(document.getElementById('cli-kids610').value) || 0;
           const dataReserva = document.getElementById('cli-data').value;
           const horario = document.getElementById('cli-horario').value;
           const mesaNum = parseInt(document.getElementById('cli-mesa').value);
           const obs = document.getElementById('cli-obs').value.trim();

           // VERIFICAÇÃO SE AS RESERVAS ESTÃO TRANCADAS
           if (verificarSeReservasTrancadas(dataReserva)) {
               alert("Capacidade lotada para este dia! No momento, não estamos aceitando novas reservas. Agradecemos pela compreensão.");
               atualizarInterfaceBloqueioCliente();
               btnSubmit.disabled = true;
               btnSubmit.innerHTML = `<i class="fa-solid fa-lock"></i> RESERVAS TRANCADAS`;
               return;
           }

           const totalNovasPessoas = adultos + kids05 + kids610;

           if (totalNovasPessoas <= 0) {
               alert("Por favor, adicione pelo menos 1 integrante para a reserva.");
               btnSubmit.disabled = false;
               btnSubmit.innerHTML = `<i class="fa-solid fa-check-circle"></i> CONFIRMAR MINHA RESERVA`;
               return;
           }

           if (totalNovasPessoas > 30) {
               alert("Para reservas acima de 30 pessoas, por favor utilize a solicitação via WhatsApp.");
               btnSubmit.disabled = false;
               btnSubmit.innerHTML = `<i class="fa-solid fa-check-circle"></i> CONFIRMAR MINHA RESERVA`;
               return;
           }

           if (!mesaNum) {
               alert("Por favor, selecione o N° da sua mesa.");
               btnSubmit.disabled = false;
               btnSubmit.innerHTML = `<i class="fa-solid fa-check-circle"></i> CONFIRMAR MINHA RESERVA`;
               return;
           }

           // VERIFICAÇÃO SE A MESA ESTÁ ENTRE AS PRÓXIMAS LIVRES NA SEQUÊNCIA
           const proximasPermitidas = obterProximasMesasLivres(dataReserva, LIMITE_MESAS_SEQUENCIA);
           if (!proximasPermitidas.includes(mesaNum)) {
               alert("A mesa selecionada não está disponível na sequência permitida. Por favor, escolha uma das próximas mesas disponíveis.");
               atualizarSelectMesas();
               btnSubmit.disabled = false;
               btnSubmit.innerHTML = `<i class="fa-solid fa-check-circle"></i> CONFIRMAR MINHA RESERVA`;
               return;
           }

           // VERIFICAÇÃO DE MESA OCUPADA NA MESMA DATA
           const mesaOcupada = estadoGlobal.reservas.find(r => r.data === dataReserva && parseInt(r.mesa) === mesaNum && !['cancelada', 'cancelado', 'encerrada', 'encerrado', 'excluida', 'excluído'].includes(String(r.status || '').toLowerCase()));
           if (mesaOcupada) {
               alert(`A Mesa ${mesaNum} acabou de ser reservada para este dia por outro cliente. Por favor, escolha outra mesa.`);
               atualizarSelectMesas();
               btnSubmit.disabled = false;
               btnSubmit.innerHTML = `<i class="fa-solid fa-check-circle"></i> CONFIRMAR MINHA RESERVA`;
               return;
           }

           // VERIFICAÇÃO DE CAPACIDADE MÁXIMA DO DIA
           const capacidadePessoas = estadoGlobal.configCasa.capacidadePessoas || 400;
           const pessoasNaData = getPessoasNaData(dataReserva);
           const assentosDisponiveis = capacidadePessoas - pessoasNaData;

           if (totalNovasPessoas > assentosDisponiveis) {
               alert(`Infelizmente a casa atingiu o limite de capacidade para este dia. Vagas restantes: ${assentosDisponiveis}.`);
               btnSubmit.disabled = false;
               btnSubmit.innerHTML = `<i class="fa-solid fa-check-circle"></i> CONFIRMAR MINHA RESERVA`;
               return;
           }

           const idReserva = Date.now().toString();
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
               status: 'reservada'
           };

           // VERIFICAÇÃO FINAL ANTES DE GRAVAR NO BANCO DE DADOS
           if (verificarSeReservasTrancadas(dataReserva)) {
               alert("Capacidade lotada para este dia! No momento, não estamos aceitando novas reservas. Agradecemos pela compreensão.");
               atualizarInterfaceBloqueioCliente();
               btnSubmit.disabled = true;
               btnSubmit.innerHTML = `<i class="fa-solid fa-lock"></i> RESERVAS TRANCADAS`;
               return;
           }

           dbRef.child('reservas').child(idReserva).set(novaReserva)
               .then(() => {
                   dadosReservaAtual = novaReserva;
                   mostrarPopupNotificacao();
                   exibirComprovante(novaReserva);
               })
               .catch((error) => {
                   alert("Erro ao gravar a reserva: " + error.message);
                   btnSubmit.disabled = false;
                   btnSubmit.innerHTML = `<i class="fa-solid fa-check-circle"></i> CONFIRMAR MINHA RESERVA`;
               });
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
           document.getElementById('form-autorreserva').reset();
           validarCapacidadeGrupo();
           sincronizarCustomSelect('cli-horario');

           const campoData = document.getElementById('cli-data');
           campoData.value = obterProximoDomingoLocal();
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
   CONTROLE DE BLOQUEIO / TRANCAMENTO DE RESERVAS — ADMIN
   ============================================================ */
let pendenteAcaoBloqueio = null;

function abrirModalConfirmacaoBloqueio(tipo = 'global') {
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

    if (tipo === 'global') {
        const estaTrancado = Boolean(estadoGlobal.bloqueio?.trancado);
        const novoEstado = !estaTrancado;
        pendenteAcaoBloqueio = { tipo: 'global', novoEstado: novoEstado };

        if (novoEstado) {
            if (eyebrow) {
                eyebrow.textContent = "Confirmar ação";
                eyebrow.style.color = "var(--terracota-sol)";
            }
            title.textContent = "Trancar Todas as Reservas";
            desc.textContent = "Tem certeza de que deseja trancar as reservas? Os clientes verão o aviso 'Capacidade lotada para este dia' e novas autorreservas serão bloqueadas imediatamente em tempo real.";
            if (icon) icon.className = "fa-solid fa-lock";
            if (iconWrapper) {
                iconWrapper.style.color = "var(--terracota-sol)";
                iconWrapper.style.background = "rgba(224, 130, 63, 0.18)";
            }
            btnConfirm.className = "admin-delete-confirm-btn";
            btnConfirm.style.background = "linear-gradient(135deg, #A85A2A 0%, #853F18 100%)";
            btnConfirm.innerHTML = `<i class="fa-solid fa-lock"></i> Sim, Trancar Reservas`;
        } else {
            if (eyebrow) {
                eyebrow.textContent = "Confirmar liberação";
                eyebrow.style.color = "var(--verde-vibrante)";
            }
            title.textContent = "Destrancar Reservas";
            desc.textContent = "Deseja liberar as reservas novamente? A página pública voltará a exibir as mesas disponíveis e permitirá novas reservas conforme a capacidade existente.";
            if (icon) icon.className = "fa-solid fa-lock-open";
            if (iconWrapper) {
                iconWrapper.style.color = "var(--verde-vibrante)";
                iconWrapper.style.background = "rgba(16, 185, 129, 0.18)";
            }
            btnConfirm.className = "btn-action";
            btnConfirm.style.background = "linear-gradient(135deg, #2E5A44 0%, #1E3D2E 100%)";
            btnConfirm.innerHTML = `<i class="fa-solid fa-lock-open"></i> Sim, Destrancar Reservas`;
        }
    } else if (tipo === 'data') {
        const dataISO = adminDataSelecionada;
        if (!dataISO) {
            alert("Por favor, selecione uma data no calendário primeiro.");
            return;
        }
        const dataKey = dataISO.replace(/-/g, '_');
        const estaDataTrancada = Boolean(
            estadoGlobal.bloqueio?.datasTrancadas?.[dataKey] || estadoGlobal.bloqueio?.datasTrancadas?.[dataISO]
        );
        const novoEstado = !estaDataTrancada;
        pendenteAcaoBloqueio = { tipo: 'data', novoEstado: novoEstado, dataISO: dataISO };
        const dataFormatada = formatarDataBR(dataISO);

        if (novoEstado) {
            if (eyebrow) {
                eyebrow.textContent = "Bloqueio por data";
                eyebrow.style.color = "var(--terracota-sol)";
            }
            title.textContent = `Trancar Reservas de ${dataFormatada}`;
            desc.textContent = `Deseja trancar novas reservas especificamente para o dia ${dataFormatada}? Clientes que selecionarem essa data verão a mensagem de capacidade lotada.`;
            if (icon) icon.className = "fa-solid fa-lock";
            if (iconWrapper) {
                iconWrapper.style.color = "var(--terracota-sol)";
                iconWrapper.style.background = "rgba(224, 130, 63, 0.18)";
            }
            btnConfirm.className = "admin-delete-confirm-btn";
            btnConfirm.style.background = "linear-gradient(135deg, #A85A2A 0%, #853F18 100%)";
            btnConfirm.innerHTML = `<i class="fa-solid fa-lock"></i> Trancar Esta Data`;
        } else {
            if (eyebrow) {
                eyebrow.textContent = "Liberação por data";
                eyebrow.style.color = "var(--verde-vibrante)";
            }
            title.textContent = `Liberar Reservas de ${dataFormatada}`;
            desc.textContent = `Deseja liberar as reservas para o dia ${dataFormatada}? A página pública voltará a permitir agendamentos para essa data.`;
            if (icon) icon.className = "fa-solid fa-lock-open";
            if (iconWrapper) {
                iconWrapper.style.color = "var(--verde-vibrante)";
                iconWrapper.style.background = "rgba(16, 185, 129, 0.18)";
            }
            btnConfirm.className = "btn-action";
            btnConfirm.style.background = "linear-gradient(135deg, #2E5A44 0%, #1E3D2E 100%)";
            btnConfirm.innerHTML = `<i class="fa-solid fa-lock-open"></i> Liberar Esta Data`;
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

async function confirmarAlteracaoBloqueioAdmin() {
    if (!adminAutenticado) {
        alert("Ação não autorizada. Acesse a área administrativa com o PIN.");
        fecharModalBloqueioAdmin();
        return;
    }
    if (!pendenteAcaoBloqueio) return;

    const btnConfirm = document.getElementById('admin-btn-confirm-lock');
    const erroEl = document.getElementById('admin-lock-error');
    if (btnConfirm) {
        btnConfirm.disabled = true;
        btnConfirm.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Atualizando Firebase...`;
    }

    try {
        if (pendenteAcaoBloqueio.tipo === 'global') {
            const novo = pendenteAcaoBloqueio.novoEstado;
            const agora = new Date().toISOString();
            await Promise.all([
                dbRef.child('bloqueio').child('trancado').set(novo),
                dbRef.child('bloqueio').child('mensagem').set("Capacidade lotada para este dia! No momento, não estamos aceitando novas reservas. Agradecemos pela compreensão."),
                dbRef.child('bloqueio').child('atualizadoEm').set(agora),
                dbRef.child('bloqueio').child('atualizadoPor').set('admin'),
                dbRef.child('configCasa').child('reservasTrancadas').set(novo)
            ]);

            fecharModalBloqueioAdmin();
            mostrarPopupNotificacao(
                novo ? "Reservas trancadas com sucesso!" : "Reservas liberadas com sucesso!",
                novo ? "fa-lock" : "fa-lock-open"
            );
        } else if (pendenteAcaoBloqueio.tipo === 'data' && pendenteAcaoBloqueio.dataISO) {
            const dataISO = pendenteAcaoBloqueio.dataISO;
            const key = dataISO.replace(/-/g, '_');
            const novo = pendenteAcaoBloqueio.novoEstado;

            await Promise.all([
                dbRef.child('bloqueio').child('datasTrancadas').child(key).set(novo),
                dbRef.child('configCasa').child('datasTrancadas').child(key).set(novo)
            ]);

            fecharModalBloqueioAdmin();
            mostrarPopupNotificacao(
                novo ? `Data ${formatarDataBR(dataISO)} trancada!` : `Data ${formatarDataBR(dataISO)} liberada!`,
                novo ? "fa-lock" : "fa-lock-open"
            );
        }

        atualizarStatusBloqueioAdmin();
        atualizarInterfaceBloqueioCliente();
        atualizarSelectMesas();
        renderAdminCalendario();
        renderAdminReservas();
    } catch (erro) {
        console.error("Erro ao alterar bloqueio:", erro);
        if (erroEl) erroEl.textContent = "Erro ao sincronizar com o Firebase: " + (erro.message || erro);
        else alert("Erro ao atualizar o Firebase: " + (erro.message || erro));
    } finally {
        if (btnConfirm) btnConfirm.disabled = false;
    }
}

function atualizarStatusBloqueioAdmin() {
    if (!adminAutenticado) return;

    const estaTrancado = Boolean(estadoGlobal.bloqueio?.trancado);
    const badge = document.getElementById('admin-lock-badge');
    const btnToggle = document.getElementById('admin-btn-toggle-bloqueio');
    const infoText = document.getElementById('admin-lock-info-text');

    if (badge) {
        if (estaTrancado) {
            badge.className = "admin-lock-badge badge-trancado";
            badge.innerHTML = `<i class="fa-solid fa-lock"></i> Reservas Trancadas`;
        } else {
            badge.className = "admin-lock-badge badge-liberado";
            badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Reservas Liberadas`;
        }
    }

    if (btnToggle) {
        if (estaTrancado) {
            btnToggle.className = "admin-lock-toggle-btn btn-destrancar";
            btnToggle.innerHTML = `<i class="fa-solid fa-lock-open"></i> <span>Destrancar Reservas</span>`;
            btnToggle.title = "Clique para liberar as reservas para o público";
        } else {
            btnToggle.className = "admin-lock-toggle-btn btn-trancar";
            btnToggle.innerHTML = `<i class="fa-solid fa-lock"></i> <span>Trancar Reservas</span>`;
            btnToggle.title = "Clique para trancar e impedir novas reservas";
        }
    }

    if (infoText) {
        if (estaTrancado) {
            infoText.innerHTML = `⚠️ <strong>Bloqueio ativo no sistema:</strong> A página pública exibe o aviso <em>"Capacidade lotada para este dia! No momento, não estamos aceitando novas reservas. Agradecemos pela compreensão."</em> e impede seleção de mesas e horários.`;
        } else {
            infoText.textContent = `Quando as reservas estiverem trancadas, a página pública oculta mesas e horários e exibe o aviso de capacidade lotada em tempo real.`;
        }
    }

    // Status da data selecionada na lista
    const dataSelecionada = adminDataSelecionada;
    const badgeData = document.getElementById('admin-date-lock-status');
    const btnData = document.getElementById('admin-btn-toggle-date-lock');

    if (dataSelecionada && badgeData && btnData) {
        btnData.classList.remove('hidden');
        const dataKey = dataSelecionada.replace(/-/g, '_');
        const estaDataTrancada = Boolean(
            estadoGlobal.bloqueio?.datasTrancadas?.[dataKey] || estadoGlobal.bloqueio?.datasTrancadas?.[dataSelecionada]
        );

        if (estaTrancado) {
            badgeData.className = "admin-date-lock-status trancada";
            badgeData.innerHTML = `<i class="fa-solid fa-lock"></i> Trancada (Geral)`;
            btnData.disabled = true;
            btnData.title = "O bloqueio geral do sistema já está trancando todas as datas";
            btnData.innerHTML = `<i class="fa-solid fa-lock"></i> <span>Bloqueio geral ativo</span>`;
        } else if (estaDataTrancada) {
            badgeData.className = "admin-date-lock-status trancada";
            badgeData.innerHTML = `<i class="fa-solid fa-lock"></i> Data Trancada`;
            btnData.disabled = false;
            btnData.title = "Clique para liberar esta data específica";
            btnData.innerHTML = `<i class="fa-solid fa-lock-open"></i> <span>Liberar data</span>`;
        } else {
            badgeData.className = "admin-date-lock-status liberada";
            badgeData.innerHTML = `<i class="fa-solid fa-circle-check"></i> Data Liberada`;
            btnData.disabled = false;
            btnData.title = "Clique para trancar esta data específica";
            btnData.innerHTML = `<i class="fa-solid fa-lock"></i> <span>Trancar data</span>`;
        }
    }
}

function ehDataPermitidaAdmin(dataISO) {
    if (!dataISO) return false;

    const partes = dataISO.split("-");
    const data = new Date(
        Number(partes[0]),
        Number(partes[1]) - 1,
        Number(partes[2])
    );

    return data.getDay() === 0 || feriadosPermitidos.includes(dataISO);
}

function obterProximaDataPermitidaAdmin(dataInicial) {
    const data = new Date(
        dataInicial.getFullYear(),
        dataInicial.getMonth(),
        dataInicial.getDate()
    );

    for (let i = 0; i < 370; i++) {
        const iso = obterDataFormatadaISO(data);
        if (ehDataPermitidaAdmin(iso)) return iso;
        data.setDate(data.getDate() + 1);
    }

    return obterDataFormatadaISO(dataInicial);
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
    adminMesAtual = new Date(
        adminMesAtual.getFullYear(),
        adminMesAtual.getMonth() + delta,
        1
    );

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
        const ehFeriado = feriadosPermitidos.includes(iso);
        const reservas = getReservasDaDataAdmin(iso);

        const classes = [
            "admin-day",
            permitido ? "valid" : "",
            ehFeriado ? "feriado" : "",
            iso === adminDataSelecionada ? "selected" : ""
        ].filter(Boolean).join(" ");

        let label = "";
        if (ehFeriado) label = `<span class="admin-day-label">feriado</span>`;

        let badge = "";
        if (reservas.length > 0) {
            badge = `<span class="admin-day-reservas">${reservas.length}</span>`;
        }

        html += `
            <button type="button"
                class="${classes}"
                ${permitido ? `onclick="selecionarDataAdmin('${iso}')"` : "disabled"}
                aria-label="${permitido ? `Selecionar ${formatarDataBR(iso)}` : "Data não disponível"}">
                <span class="admin-day-number">${dia}</span>
                ${label}
                ${badge}
            </button>
        `;
    }

    calendario.innerHTML = html;
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
        lista.innerHTML = `
            <div class="admin-empty">
                <i class="fa-regular fa-calendar-xmark"></i>
                <strong>${busca ? "Nenhuma reserva encontrada" : "Nenhuma reserva nesta data"}</strong>
                <span>${busca ? "Tente pesquisar por outro nome, mesa ou horário." : "Esta data está disponível, mas ainda não possui reservas abertas."}</span>
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

    const dataBase = dataAtual ? new Date(`${dataAtual}T12:00:00`) : new Date();
    const anoBase = dataBase.getFullYear();
    const mesBase = dataBase.getMonth();
    const datas = [];

    // Mostra 18 meses em torno da data atual da reserva, sempre somente domingos/feriados.
    for (let offset = -6; offset <= 12; offset++) {
        const mes = new Date(anoBase, mesBase + offset, 1);
        const totalDias = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
        for (let dia = 1; dia <= totalDias; dia++) {
            const d = new Date(mes.getFullYear(), mes.getMonth(), dia);
            const iso = obterDataFormatadaISO(d);
            if (ehDataPermitidaAdmin(iso)) datas.push(iso);
        }
    }

    if (dataAtual && !datas.includes(dataAtual) && ehDataPermitidaAdmin(dataAtual)) {
        datas.push(dataAtual);
    }

    datas.sort();
    select.innerHTML = datas.map(iso =>
        `<option value="${iso}">${escaparHTMLAdmin(formatarDataBR(iso))}</option>`
    ).join('');
    select.value = dataAtual || '';
}

function preencherMesasEdicaoAdmin(dataISO, mesaAtual) {
    const select = document.getElementById('admin-edit-mesa');
    if (!select) return;

    const totalMesas = Number(estadoGlobal.configCasa?.totalMesas || 100);
    const reservas = getReservasAtivasAdmin().filter(r => r.data === dataISO && String(r.id) !== String(document.getElementById('admin-edit-id')?.value || ''));
    const ocupadas = new Set(reservas.map(r => Number(r.mesa)));

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
    if (!data || !ehDataPermitidaAdmin(data)) {
        erro.textContent = 'A data deve ser um domingo ou feriado permitido.';
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

    try {
        await dbRef.child('reservas').child(id).update(dadosAtualizados);
        fecharEdicaoReservaAdmin();

        // Mantém a data selecionada no calendário após a edição.
        adminDataSelecionada = data;
        adminMesAtual = new Date(`${data}T12:00:00`);
        adminMesAtual = new Date(adminMesAtual.getFullYear(), adminMesAtual.getMonth(), 1);
        renderAdminCalendario();
        renderAdminReservas();
    } catch (error) {
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
        await dbRef.child('reservas').child(id).remove();
        
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

        // Atualiza imediatamente o estado local enquanto o listener do Firebase sincroniza
        estadoGlobal.reservas = estadoGlobal.reservas.map((r) => {
            const key = String(r._firebaseKey || r.id || '');
            if (key === targetKey) {
                return { ...r, status: 'cancelada' };
            }
            return r;
        });

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

