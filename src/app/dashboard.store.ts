import { Injectable, computed, signal } from '@angular/core';

export interface Setor {
  id: string;
  nome: string;
  boxes: number;
  cad: number;
  n: number;
  idx?: number;
  vr?: number;
  margem?: number;
  compl: number;
  faixa?: string;
  estado: 'ok' | 'cobertura' | 'amostra' | 'dominancia' | 'semdados';
  falta?: number;
}

export interface Produto {
  id: string;
  nome: string;
  un: string;
  compra: number;
  venda: number;
  vr: number;
  n: number;
  amp: number;
  seed: number;
  flag?: 'choque' | 'ruptura';
  serie: number[];
}

interface Ordem {
  col: string;
  dir: 'asc' | 'desc';
}

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  // ---- props (configuráveis) ----
  readonly limiarK = 5;
  readonly completudeMinima = 50;
  readonly mercadoInicial = 'provisorio';
  readonly telaInicial = 'geral';

  // ---- state ----
  readonly tela = signal<string | null>(null);
  readonly mercado = signal<string | null>(null);
  readonly setor = signal<string>('');
  readonly periodo = signal<string>('30d');
  readonly completude = signal<number | null>(null);
  readonly metrica = signal<string>('variacao');
  readonly produto = signal<string>('camarao');
  readonly ordem = signal<Ordem>({ col: 'vr', dir: 'desc' });
  readonly tabPlanta = signal<boolean>(false);
  readonly hoverSetor = signal<string | null>(null);
  readonly alertaAberto = signal<string | null>(null);
  readonly filtroLog = signal<string>('todos');
  readonly modal = signal<string | null>(null);
  readonly bgMotivo = signal<string>('');
  readonly bgJust = signal<string>('');
  readonly liberado = signal<Record<string, string>>({});
  readonly now = signal<number>(Date.now());
  readonly toast = signal<string>('');

  private _t?: ReturnType<typeof setInterval>;

  startClock() {
    this._t = setInterval(() => this.now.set(Date.now()), 1000);
  }
  stopClock() {
    if (this._t) clearInterval(this._t);
  }

  // ---- dados estáticos ----
  readonly telas: [string, string, string, string][] = [
    ['geral', 'Visão geral', 'Onde intervir esta semana. Tudo nesta tela é agregado e não identifica ninguém.', 'Análise agregada'],
    ['precos', 'Preços e abastecimento', 'Medianas de compra e venda entre feirantes participantes. Base para política de preço e abastecimento.', 'Análise agregada'],
    ['saude', 'Saúde dos negócios', 'Distribuições, nunca indivíduos. O percentual com margem negativa é o número mais acionável do painel.', 'Análise agregada'],
    ['impacto', 'Impacto e realocação', 'Série do índice de movimento ao longo da obra do Mercado Central. Leia junto com o aviso de viés de seleção.', 'Análise agregada'],
    ['adocao', 'Adoção e cobertura', 'Quanto do mercado o serviço já alcança e onde a equipe de campo precisa fazer busca ativa.', 'Análise agregada'],
    ['cadastro', 'Cadastro e ocupação', 'Base cadastral do próprio município: boxes, alvarás e permissionários. Nenhum dado financeiro do chatbot aqui.', 'Bases restritas'],
    ['programas', 'Programas', 'Filas de análise de quem optou por um programa. Cada abertura de registro passa por quebra-vidro.', 'Bases restritas'],
    ['governanca', 'Governança e privacidade', 'Inventário, logs, pedidos de titulares e as regras de supressão em vigor — transparência ativa, não página institucional.', 'Auditoria'],
  ];

  readonly badges: Record<string, string> = { geral: '3', precos: '2', programas: '3', governanca: '1' };

  readonly setores: Setor[] = [
    { id: 'frutas', nome: 'Frutas e hortaliças', boxes: 74, cad: 46, n: 38, idx: 104.2, vr: 2.6, margem: 18, compl: 64, faixa: 'R$ 5–10 mil / mês', estado: 'ok' },
    { id: 'peixes', nome: 'Peixes e mariscos', boxes: 55, cad: 34, n: 29, idx: 88.4, vr: -18.1, margem: 12, compl: 59, faixa: 'R$ 5–10 mil / mês', estado: 'ok' },
    { id: 'regionais', nome: 'Produtos regionais', boxes: 42, cad: 28, n: 24, idx: 101.7, vr: 1.2, margem: 22, compl: 61, faixa: 'R$ 2–5 mil / mês', estado: 'ok' },
    { id: 'mercearias', nome: 'Mercearias', boxes: 68, cad: 15, n: 12, idx: 99.1, vr: -0.8, margem: 15, compl: 44, faixa: 'R$ 5–10 mil / mês', estado: 'cobertura' },
    { id: 'acougues', nome: 'Açougues', boxes: 30, cad: 6, n: 4, compl: 52, estado: 'amostra', falta: 1 },
    { id: 'artesanato', nome: 'Artesanato', boxes: 26, cad: 5, n: 3, compl: 38, estado: 'amostra', falta: 2 },
    { id: 'restaurantes', nome: 'Restaurantes e lanchonetes', boxes: 35, cad: 14, n: 11, compl: 57, estado: 'dominancia' },
    { id: 'servicos', nome: 'Salão e barbearia', boxes: 12, cad: 0, n: 0, compl: 0, estado: 'semdados' },
  ];

  private _serie(base: number, amp: number, seed: number): number[] {
    const s: number[] = [];
    for (let i = 0; i < 12; i++) {
      const v = base * (1 + (amp * Math.sin((i + seed) * 1.05)) / 2 + (i - 6) * amp * 0.055);
      s.push(+v.toFixed(2));
    }
    return s;
  }

  readonly cesta: Produto[] = ([
    { id: 'camarao', nome: 'Camarão seco', un: 'kg', compra: 42.0, venda: 62.0, vr: 18.9, n: 9, amp: 0.22, seed: 1, flag: 'choque' },
    { id: 'tomate', nome: 'Tomate', un: 'kg', compra: 4.2, venda: 6.9, vr: 12.4, n: 31, amp: 0.18, seed: 2, flag: 'choque' },
    { id: 'cebola', nome: 'Cebola', un: 'kg', compra: 3.9, venda: 6.2, vr: 7.1, n: 26, amp: 0.12, seed: 3 },
    { id: 'vinagreira', nome: 'Vinagreira', un: 'maço', compra: 1.4, venda: 2.8, vr: 4.8, n: 11, amp: 0.14, seed: 4 },
    { id: 'farinha', nome: "Farinha d'água", un: 'kg', compra: 5.8, venda: 8.5, vr: 3.6, n: 24, amp: 0.09, seed: 5 },
    { id: 'ovos', nome: 'Ovos', un: 'dúzia', compra: 9.2, venda: 13.5, vr: 2.2, n: 17, amp: 0.07, seed: 6 },
    { id: 'buriti', nome: 'Artesanato de buriti', un: 'peça', compra: 22.0, venda: 38.0, vr: 2.0, n: 6, amp: 0.06, seed: 7 },
    { id: 'alface', nome: 'Alface', un: 'un', compra: 1.8, venda: 3.0, vr: 1.2, n: 19, amp: 0.11, seed: 8 },
    { id: 'arroz', nome: 'Arroz', un: 'kg', compra: 4.6, venda: 6.5, vr: 0.6, n: 20, amp: 0.05, seed: 9 },
    { id: 'cheiro', nome: 'Cheiro-verde', un: 'maço', compra: 1.2, venda: 2.5, vr: 0.0, n: 22, amp: 0.1, seed: 10 },
    { id: 'feijao', nome: 'Feijão', un: 'kg', compra: 6.8, venda: 9.9, vr: -1.8, n: 18, amp: 0.08, seed: 11 },
    { id: 'banana', nome: 'Banana prata', un: 'kg', compra: 3.1, venda: 5.2, vr: -2.1, n: 28, amp: 0.13, seed: 12 },
    { id: 'abacaxi', nome: 'Abacaxi', un: 'un', compra: 5.5, venda: 9.0, vr: -3.4, n: 13, amp: 0.15, seed: 13, flag: 'ruptura' },
    { id: 'pescada', nome: 'Peixe fresco (pescada)', un: 'kg', compra: 18.5, venda: 27.0, vr: -6.2, n: 14, amp: 0.17, seed: 14, flag: 'ruptura' },
  ] as Omit<Produto, 'serie'>[]).map((p) => ({ ...p, serie: this._serie(p.venda, p.amp, p.seed) }));

  readonly motivos = [
    'Análise de elegibilidade — microcrédito',
    'Verificação de documentação apresentada',
    'Atendimento a pedido do próprio titular',
    'Auditoria do encarregado de dados',
  ];
  readonly fimJanela = new Date('2026-08-21T18:00:00');

  // ---- helpers puros ----
  private _k() {
    return this.limiarK ?? 5;
  }
  private _num(v: number, d = 1) {
    return v.toFixed(d).replace('.', ',');
  }
  private _brl(v: number) {
    return 'R$ ' + v.toFixed(2).replace('.', ',');
  }
  private _pct(v: number) {
    return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1).replace('.', ',') + '%';
  }
  private _seta(v: number) {
    return v > 0.5 ? '▲' : v < -0.5 ? '▼' : '▬';
  }
  private _corVar(v: number) {
    return v <= -10 ? 'var(--color-danger)' : v <= -3 ? 'var(--color-warning)' : v >= 3 ? 'var(--color-success)' : 'var(--color-text-secondary)';
  }
  private _path(s: number[], w: number, h: number, pad = 0) {
    const mn = Math.min(...s),
      mx = Math.max(...s),
      r = mx - mn || 1;
    return s
      .map((v, i) => `${i ? 'L' : 'M'}${(pad + (i / (s.length - 1)) * (w - pad)).toFixed(1)},${(h - ((v - mn) / r) * (h - 2) - 1).toFixed(1)}`)
      .join(' ');
  }

  private _estadoTxt(s: Setor) {
    if (s.estado === 'amostra') return `amostra insuficiente · menos de ${this._k()} participantes`;
    if (s.estado === 'dominancia') return 'suprimido por concentração';
    if (s.estado === 'semdados') return 'sem dados no período';
    if (s.estado === 'cobertura') return `cobertura de ${Math.round((s.cad / s.boxes) * 100)}% — tendência ainda não confiável`;
    return `índice ${this._num(s.idx!)} · ${this._pct(s.vr!)} vs. período anterior`;
  }
  private _estadoCor(s: Setor) {
    return s.estado === 'dominancia' ? 'var(--color-danger)' : s.estado === 'amostra' || s.estado === 'cobertura' ? 'var(--color-warning)' : s.estado === 'semdados' ? 'var(--color-text-muted)' : 'var(--color-success)';
  }

  private _pc(p: { blocos: any[] }) {
    return {
      ...p,
      blocos: p.blocos.map((b) => ({
        ...b,
        pl: +((b.x / 800) * 100).toFixed(3),
        pt: +((b.y / 430) * 100).toFixed(3),
        pw: +((b.w / 800) * 100).toFixed(3),
        ph: +((b.h / 430) * 100).toFixed(3),
        rotL: +(((b.x + 4) / 800) * 100).toFixed(3),
        rotT: +(((b.y - 16) / 430) * 100).toFixed(3),
      })),
    };
  }

  private _plan(M: string) {
    if (M === 'provisorio') {
      return this._pc({
        blocos: [
          { x: 8, y: 26, w: 386, h: 190, tx: 14, ty: 19, rot: 'GALPÃO 1' },
          { x: 406, y: 26, w: 386, h: 190, tx: 412, ty: 19, rot: 'GALPÃO 2' },
          { x: 8, y: 236, w: 386, h: 190, tx: 14, ty: 229, rot: 'GALPÃO 3' },
          { x: 406, y: 236, w: 386, h: 190, tx: 412, ty: 229, rot: 'GALPÃO 4' },
        ],
      }) as any;
    }
    return this._pc({
      blocos: [
        { x: 8, y: 26, w: 784, h: 122, tx: 14, ty: 19, rot: 'PAVIMENTO 1 · TÉRREO' },
        { x: 8, y: 168, w: 784, h: 122, tx: 14, ty: 161, rot: 'PAVIMENTO 2' },
        { x: 8, y: 310, w: 784, h: 116, tx: 14, ty: 303, rot: 'PAVIMENTO 3 · SERVIÇOS E ADMINISTRAÇÃO' },
      ],
    }) as any;
  }

  private _cellsFor(M: string): [string, number, number, number, number][] {
    if (M === 'provisorio') {
      return [
        ['frutas', 18, 36, 186, 170],
        ['mercearias', 210, 36, 176, 170],
        ['peixes', 416, 36, 192, 170],
        ['acougues', 614, 36, 170, 170],
        ['regionais', 18, 246, 210, 170],
        ['artesanato', 234, 246, 152, 170],
        ['restaurantes', 416, 246, 228, 170],
        ['servicos', 650, 246, 134, 170],
      ];
    }
    return [
      ['peixes', 18, 36, 264, 104],
      ['acougues', 288, 36, 220, 104],
      ['frutas', 514, 36, 268, 104],
      ['mercearias', 18, 178, 380, 104],
      ['regionais', 404, 178, 378, 104],
      ['restaurantes', 18, 320, 298, 98],
      ['artesanato', 322, 320, 220, 98],
      ['servicos', 548, 320, 234, 98],
    ];
  }

  private _fill(s: Setor, metrica: string) {
    if (s.estado !== 'ok' && s.estado !== 'cobertura')
      return { fill: 'repeating-linear-gradient(45deg,var(--color-surface-muted) 0 5px,var(--color-border-soft) 5px 9px)', fg: 'var(--color-text-primary)', fg2: 'var(--color-text-secondary)', stroke: 'var(--color-border)', sw: 1 };
    if (metrica === 'cobertura') {
      const c = (s.cad / s.boxes) * 100;
      const f = c < 30 ? 'var(--color-surface)' : c < 50 ? 'var(--color-text-muted)' : c < 70 ? 'var(--color-primary)' : 'var(--color-primary-dark)';
      return { fill: f, fg: c < 30 ? 'var(--color-text-primary)' : '#fff', fg2: c < 30 ? 'var(--color-text-secondary)' : 'var(--color-border)', stroke: 'var(--color-primary-dark)', sw: 1 };
    }
    if (metrica === 'margem') {
      const g = s.margem || 0;
      const f = g < 13 ? 'var(--color-warning)' : g < 18 ? 'var(--color-success)' : g < 21 ? 'var(--color-success)' : 'var(--color-success)';
      return { fill: f, fg: '#fff', fg2: 'var(--color-surface)', stroke: 'var(--color-primary-dark)', sw: 1 };
    }
    const f = this._corVar(s.vr!);
    return { fill: f, fg: '#fff', fg2: 'var(--color-surface)', stroke: 'var(--color-primary-dark)', sw: 1 };
  }

  private _valMetrica(s: Setor, metrica: string) {
    if (s.estado === 'amostra') return { val: `n = ${s.n}`, nota: `faltam ${s.falta} p/ destravar` };
    if (s.estado === 'dominancia') return { val: 'suprimido', nota: 'por concentração' };
    if (s.estado === 'semdados') return { val: '—', nota: 'sem cadastro' };
    if (metrica === 'cobertura') return { val: `${Math.round((s.cad / s.boxes) * 100)}%`, nota: `${s.cad}/${s.boxes} boxes` };
    if (metrica === 'margem') return { val: `${s.margem}%`, nota: `n = ${s.n} participantes` };
    return { val: `${this._seta(s.vr!)} ${this._pct(s.vr!)}`, nota: `n = ${s.n} · índice ${this._num(s.idx!)}` };
  }

  // ---- ações (mutadores de estado) ----
  goTela = (t: string) => () => this.tela.set(t);
  setSetor = (e: Event) => {
    const v = (e.target as HTMLSelectElement).value;
    this.setor.set(v);
    this.hoverSetor.set(v || null);
  };
  setCompletude = (e: Event) => this.completude.set(+(e.target as HTMLInputElement).value);
  setMercado = (id: string) => () => this.mercado.set(id);
  setPeriodo = (id: string) => () => this.periodo.set(id);
  setMetrica = (id: string) => () => this.metrica.set(id);
  toggleTabelaPlanta = () => this.tabPlanta.update((v) => !v);
  setOrdem = (col: string) => () =>
    this.ordem.update((o) => ({ col, dir: o.col === col && o.dir === 'desc' ? 'asc' : 'desc' }));
  setProduto = (id: string) => () => this.produto.set(id);
  expandirAlerta = (id: string) => () => this.alertaAberto.update((cur) => (cur === id ? null : id));
  hoverSetorSet = (id: string) => () => this.hoverSetor.set(id);
  filtrarPorSetor = (id: string) => () => this.setor.update((cur) => (cur === id ? '' : id));
  removerSetor = () => this.setor.set('');
  removerCompletude = () => this.completude.set(50);
  removerPeriodo = () => this.periodo.set('30d');
  setFiltroLog = (id: string) => () => this.filtroLog.set(id);
  abrirModal = (id: string) => () => {
    this.modal.set(id);
    this.bgMotivo.set('');
    this.bgJust.set('');
  };
  fecharModal = () => this.modal.set(null);
  setBgMotivo = (e: Event) => this.bgMotivo.set((e.target as HTMLSelectElement).value);
  setBgJust = (e: Event) => this.bgJust.set((e.target as HTMLTextAreaElement).value);

  confirmarBg = () => {
    const bgJustOk = this.bgJust().trim().length >= 15 && !!this.bgMotivo();
    if (!bgJustOk) return;
    const id = this.modal();
    if (!id) return;
    const now = new Date();
    const stamp = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    this.liberado.update((cur) => ({ ...cur, [id]: stamp, [id + '_motivo']: this.bgMotivo() }));
    this.modal.set(null);
    this.toast.set('Acesso registrado no log · titular notificado no WhatsApp');
    setTimeout(() => this.toast.set(''), 4200);
  };

  exportar = () => {
    this.toast.set('CSV agregado gerado · 7 recortes bloqueados pelas regras de supressão');
    setTimeout(() => this.toast.set(''), 4200);
  };

  // ---- view-model computado (equivalente a renderVals()) ----
  readonly vm = computed(() => {
    const k = this._k();
    const tela = this.tela() ?? this.telaInicial;
    const mercado = this.mercado() ?? this.mercadoInicial;
    const completude = this.completude() ?? this.completudeMinima;
    const metrica = this.metrica();
    const st = {
      tela,
      mercado,
      setor: this.setor(),
      periodo: this.periodo(),
      completude,
      metrica,
      produto: this.produto(),
      ordem: this.ordem(),
      tabPlanta: this.tabPlanta(),
      hoverSetor: this.hoverSetor(),
      alertaAberto: this.alertaAberto(),
      filtroLog: this.filtroLog(),
      modal: this.modal(),
      bgMotivo: this.bgMotivo(),
      bgJust: this.bgJust(),
      liberado: this.liberado(),
      now: this.now(),
      toast: this.toast(),
    };

    const t = this.telas.find((x) => x[0] === tela) || this.telas[0];
    const nivel = tela === 'cadastro' ? 2 : tela === 'programas' ? 3 : 1;

    const camada: any =
      nivel === 2
        ? { fundo: 'var(--color-surface)', headerBg: 'var(--color-surface-muted)', linha: 'var(--color-border)', acento: 'var(--color-warning)', titulo: 'var(--color-text-primary)', sub: 'var(--color-text-secondary)', eyebrow: 'var(--color-text-muted)', toolbarBg: '#fff', chipBg: 'var(--color-surface-alt)', chipBr: 'var(--color-border)' }
        : nivel === 3
        ? { fundo: '#fbeceb', headerBg: '#fcf1f1', linha: '#f9d8d6', acento: 'var(--color-danger)', titulo: 'var(--color-danger-strong)', sub: 'var(--color-danger-strong)', eyebrow: 'var(--color-danger-strong)', toolbarBg: '#fff', chipBg: '#fbeceb', chipBr: '#f9d8d6' }
        : { fundo: 'var(--color-bg)', headerBg: 'var(--color-surface-muted)', linha: 'var(--color-border-soft)', acento: 'var(--color-primary-dark)', titulo: 'var(--color-primary-dark)', sub: 'var(--color-text-secondary)', eyebrow: 'var(--color-text-muted)', toolbarBg: '#fff', chipBg: 'var(--color-accent-tint)', chipBr: 'var(--color-border)' };
    camada.trilha = `SEMAPA / ${t[3].toUpperCase()} / ${t[1].toUpperCase()}`;

    const selo =
      nivel === 2
        ? { bg: 'var(--color-surface-alt)', br: '#C9BC9E', fg: 'var(--color-text-primary)', dot: 'var(--color-warning)', nivel: 'CAMADA 2', texto: 'Base cadastral do município' }
        : nivel === 3
        ? { bg: '#fbeceb', br: '#f3c2c0', fg: 'var(--color-danger-strong)', dot: 'var(--color-danger)', nivel: 'CAMADA 3', texto: 'Acesso registrado em log' }
        : { bg: 'var(--color-accent-tint)', br: '#BFCDB8', fg: 'var(--color-text-primary)', dot: 'var(--color-success)', nivel: 'CAMADA 1', texto: 'Agregado · nenhum feirante identificado' };

    const navGrupos = ['Análise agregada', 'Bases restritas', 'Auditoria'].map((g) => ({
      rot: g.toUpperCase(),
      cor: g === 'Bases restritas' ? 'var(--color-danger)' : g === 'Auditoria' ? 'var(--color-primary)' : 'var(--color-text-muted)',
      itens: this.telas
        .filter((x) => x[3] === g)
        .map(([id, nome]) => {
          const at = id === tela,
            b = this.badges[id];
          return {
            nome,
            go: this.goTela(id),
            active: at,
            bg: at ? 'rgba(255,255,255,.13)' : 'transparent',
            fg: at ? '#FFFFFF' : 'var(--color-border)',
            mark: at ? 'var(--color-primary)' : 'transparent',
            w: at ? '600' : '400',
            dot: id === 'cadastro' ? 'var(--color-warning)' : id === 'programas' ? 'var(--color-danger)' : id === 'governanca' ? 'var(--color-primary)' : 'var(--color-success)',
            badge: b || '',
            badgeBg: b ? (id === 'programas' ? 'rgba(217,120,106,.24)' : 'rgba(255,255,255,.12)') : 'transparent',
            badgeFg: b ? (id === 'programas' ? '#f3c2c0' : 'var(--color-border)') : 'transparent',
          };
        }),
    }));

    const setoresView = this.setores.map((s) => {
      const cobPct = Math.round((s.cad / s.boxes) * 100);
      const dinheiroOk = s.estado === 'ok' || s.estado === 'cobertura';
      return {
        ...s,
        cobPct,
        cobTxt: `${cobPct}%`,
        cobLinha: `${s.cad} de ${s.boxes} boxes cadastrados · ${cobPct}%`,
        cobCor: cobPct < 30 ? 'var(--color-warning)' : cobPct < 50 ? 'var(--color-text-muted)' : 'var(--color-primary-dark)',
        completude: s.compl,
        estadoTxt: this._estadoTxt(s),
        marca: this._estadoCor(s),
        nota: s.n >= k ? `n = ${s.n} participantes · ${cobPct}% de cobertura` : `n = ${s.n} · abaixo do limiar k = ${k}`,
        faixa: dinheiroOk ? s.faixa : s.estado === 'dominancia' ? 'suprimido por concentração' : `amostra insuficiente (n = ${s.n})`,
        margemTxt: dinheiroOk ? `${s.margem}%` : '—',
        varTxt: dinheiroOk ? `${this._seta(s.vr!)} ${this._pct(s.vr!)}` : '—',
        varCor: dinheiroOk ? this._corVar(s.vr!) : 'var(--color-text-muted)',
        dinheiroCor: dinheiroOk ? 'var(--color-text-primary)' : 'var(--color-warning)',
        rowBg: dinheiroOk ? 'transparent' : 'var(--color-surface)',
      };
    });

    const plan = this._plan(mercado);
    const cells = this._cellsFor(mercado);
    const byId = (id: string) => this.setores.find((s) => s.id === id)!;
    const plantaCells = cells.map(([id, x, y, w, h]) => {
      const s = byId(id),
        f = this._fill(s, metrica),
        v = this._valMetrica(s, metrica);
      const sel = st.setor === id;
      const motivo =
        s.estado === 'amostra'
          ? `amostra insuficiente: ${s.n} participantes (k = ${k})`
          : s.estado === 'dominancia'
          ? 'suprimido por concentração: um participante responde por mais de 50% do agregado'
          : s.estado === 'semdados'
          ? 'nenhum feirante cadastrado neste setor'
          : `${s.cad} de ${s.boxes} boxes cadastrados`;
      return {
        ...f,
        ...v,
        pl: +((x / 800) * 100).toFixed(3),
        pt: +((y / 430) * 100).toFixed(3),
        pw: +((w / 800) * 100).toFixed(3),
        ph: +((h / 430) * 100).toFixed(3),
        stroke: sel ? 'var(--color-primary)' : f.stroke,
        sw: sel ? 3 : f.sw,
        nome: s.nome,
        tip: `${s.nome} — ${motivo}`,
        hover: this.hoverSetorSet(id),
        go: this.filtrarPorSetor(id),
      };
    });

    const legenda =
      metrica === 'cobertura'
        ? [{ cor: 'var(--color-surface)', rot: '< 30%' }, { cor: 'var(--color-text-muted)', rot: '30–50%' }, { cor: 'var(--color-primary)', rot: '50–70%' }, { cor: 'var(--color-primary-dark)', rot: '> 70%' }, { cor: 'var(--color-surface-alt)', rot: 'suprimido ou sem dados' }]
        : metrica === 'margem'
        ? [{ cor: 'var(--color-warning)', rot: 'até 13%' }, { cor: 'var(--color-success)', rot: '13–18%' }, { cor: 'var(--color-success)', rot: '18–21%' }, { cor: 'var(--color-success)', rot: '> 21%' }, { cor: 'var(--color-surface-alt)', rot: 'suprimido ou sem dados' }]
        : [{ cor: 'var(--color-danger)', rot: 'queda > 10%' }, { cor: 'var(--color-warning)', rot: 'queda de 3 a 10%' }, { cor: 'var(--color-text-secondary)', rot: 'estável' }, { cor: 'var(--color-success)', rot: 'alta > 3%' }, { cor: 'var(--color-surface-alt)', rot: 'suprimido ou sem dados' }];

    const detId = st.hoverSetor || st.setor || 'peixes';
    const dS = setoresView.find((s) => s.id === detId)!;
    const det = {
      nome: dS.nome,
      estadoTxt: dS.estadoTxt,
      estadoCor: this._estadoCor(dS),
      cobPct: dS.cobPct,
      cobCor: dS.cobCor,
      cobFg: dS.cobPct < 18 ? 'var(--color-text-primary)' : '#fff',
      cobLinha: dS.cobLinha,
      linhas:
        dS.estado === 'ok' || dS.estado === 'cobertura'
          ? [
              { rot: 'Índice de movimento', val: this._num(dS.idx!), cor: 'var(--color-primary-dark)' },
              { rot: 'Variação vs. anterior', val: `${this._seta(dS.vr!)} ${this._pct(dS.vr!)}`, cor: this._corVar(dS.vr!) },
              { rot: 'Margem mediana', val: `${dS.margem}%`, cor: 'var(--color-primary-dark)' },
              { rot: 'Participantes / completude', val: `${dS.n} · ${dS.compl}%`, cor: 'var(--color-text-primary)' },
            ]
          : [
              { rot: 'Boxes cadastrados', val: `${dS.cad} de ${dS.boxes}`, cor: 'var(--color-primary-dark)' },
              { rot: 'Participantes', val: String(dS.n), cor: 'var(--color-text-primary)' },
              { rot: 'Valor monetário', val: 'suprimido', cor: 'var(--color-danger)' },
              { rot: 'Limiar em vigor', val: `k ≥ ${k}`, cor: 'var(--color-text-primary)' },
            ],
      explica:
        dS.estado === 'amostra'
          ? `Valores monetários ficam ocultos abaixo de ${k} participantes. Faltam ${dS.falta} cadastros para destravar este setor.`
          : dS.estado === 'dominancia'
          ? 'Um participante concentra mais de 50% do agregado. Qual deles não é informado a nenhum perfil.'
          : dS.estado === 'semdados'
          ? 'Nenhum feirante deste setor aderiu ao serviço. Busca ativa não iniciada.'
          : dS.estado === 'cobertura'
          ? 'Nível absoluto pouco confiável com esta cobertura. Use apenas a tendência.'
          : 'Amostra e cobertura suficientes: nível e tendência podem ser lidos, sempre como mediana entre participantes.',
      acoes: [
        { rot: st.setor === dS.id ? 'Remover filtro do painel' : 'Filtrar painel por este setor', bg: 'var(--color-primary-dark)', br: 'var(--color-primary-dark)', fg: 'var(--color-on-dark)', go: this.filtrarPorSetor(dS.id) },
        { rot: 'Ver adoção e busca ativa', bg: '#fff', br: 'var(--color-border)', fg: 'var(--color-primary-dark)', go: () => { this.tela.set('adocao'); this.setor.set(dS.id); } },
        { rot: 'Ver saúde dos negócios', bg: '#fff', br: 'var(--color-border)', fg: 'var(--color-primary-dark)', go: () => { this.tela.set('saude'); this.setor.set(dS.id); } },
      ],
    };

    const heroSerie = [100, 99.4, 98.1, 97.6, 96.2, 95.4, 96.1, 95.2, 94.8, 95.9, 96.4, 96.8];
    const heroLinha = this._path(heroSerie, 238, 54, 2);
    const heroArea = heroLinha + ` L238,62 L2,62 Z`;

    // preços
    const dir = st.ordem.dir === 'asc' ? 1 : -1;
    const cestaOrd = [...this.cesta].sort((a: any, b: any) => {
      const c = st.ordem.col;
      if (c === 'nome') return dir * a.nome.localeCompare(b.nome);
      if (c === 'spread') return dir * (a.venda / a.compra - b.venda / b.compra);
      return dir * ((a[c] || 0) - (b[c] || 0));
    });
    const cab = (id: string, rot: string, al: string) => ({
      rot,
      al,
      cursor: 'pointer',
      go: this.setOrdem(id),
      w: st.ordem.col === id ? '600' : '400',
      cor: st.ordem.col === id ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
      dir: st.ordem.col === id ? (st.ordem.dir === 'desc' ? ' ↓' : ' ↑') : '',
    });

    const prod = this.cesta.find((p) => p.id === st.produto) || this.cesta[0];
    const serie = prod.serie,
      mn = Math.min(...serie),
      mx = Math.max(...serie);
    const W = 452,
      H = 160,
      X0 = 40;
    const px = (i: number) => X0 + (i / (serie.length - 1)) * (W - X0);
    const py = (v: number) => H - ((v - mn * 0.9) / (mx * 1.1 - mn * 0.9 || 1)) * (H - 26) - 8;
    const linha = serie.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
    const banda =
      serie.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)},${py(v * 1.07).toFixed(1)}`).join(' ') +
      ' ' +
      serie.map((v, i) => `L${px(serie.length - 1 - i).toFixed(1)},${py(serie[serie.length - 1 - i] * 0.93).toFixed(1)}`).join(' ') +
      ' Z';
    const serieGrid = [0, 1, 2, 3].map((i) => {
      const v = mn * 0.9 + (mx * 1.1 - mn * 0.9) * (i / 3);
      const y = py(v);
      return { y: y.toFixed(1), topPct: +((y / 190) * 100).toFixed(3), rot: this._num(v, 2) };
    });
    const serieEventos = [
      { i: 2, rot: 'chuvas' },
      { i: 6, rot: 'São João' },
      { i: 10, rot: 'feriado' },
    ].map((e) => {
      const x = px(e.i);
      return { x: x.toFixed(1), leftPct: +((x / 460) * 100).toFixed(3), rot: e.rot };
    });

    // impacto
    const ser = [100, 100.6, 99.2, 96.4, 94.8, 92.1, 89.6, 87.3, 88.9, 90.2, 91.6, 93.4, 95.1, 96.8, 97.9, 99.4, 100.3, 101.1, 102.4, 103.2, 104.6, 105.4, 106.1, 106.8];
    const IW = 880,
      IH = 212,
      IX = 40,
      imn = 84,
      imx = 110;
    const ipx = (i: number) => IX + (i / (ser.length - 1)) * (IW - IX);
    const ipy = (v: number) => IH - ((v - imn) / (imx - imn)) * (IH - 44) - 8;
    const impactoLinha = ser.slice(0, 21).map((v, i) => `${i ? 'L' : 'M'}${ipx(i).toFixed(1)},${ipy(v).toFixed(1)}`).join(' ');
    const impactoArea = impactoLinha + ` L${ipx(20).toFixed(1)},${IH} L${ipx(0).toFixed(1)},${IH} Z`;
    const impactoProj = ser.slice(20).map((v, i) => `${i ? 'L' : 'M'}${ipx(20 + i).toFixed(1)},${ipy(v).toFixed(1)}`).join(' ');
    const impactoGrid = [85, 90, 100, 108].map((v) => ({ y: ipy(v).toFixed(1), topPct: +((ipy(v) / 266) * 100).toFixed(3), rot: String(v) }));
    const impactoEventos = [
      { i: 2, rot: 'entrega do Mercado da Cidade', cor: 'var(--color-success)', bg: 'var(--color-accent-tint)', lvl: 0 },
      { i: 6, rot: 'fechamento do Mercado Central', cor: 'var(--color-danger)', bg: '#fbeceb', lvl: 1 },
      { i: 9, rot: 'início da obra', cor: 'var(--color-warning)', bg: 'var(--color-surface-alt)', lvl: 0 },
      { i: 21, rot: 'retorno previsto (projeção)', cor: 'var(--color-text-secondary)', bg: 'var(--color-surface)', lvl: 1 },
    ].map((e) => {
      const x = ipx(e.i);
      return { x: x.toFixed(1), leftPct: +((x / 900) * 100).toFixed(3), shift: e.i > 18 ? '-96%' : '-6px', topPct: e.lvl ? 85.5 : 78.5, rot: e.rot, cor: e.cor, bg: e.bg };
    });

    // camada 3
    const msRest = Math.max(0, this.fimJanela.getTime() - st.now);
    const dd = Math.floor(msRest / 86400000),
      hh = Math.floor((msRest % 86400000) / 3600000),
      mm = Math.floor((msRest % 3600000) / 60000),
      ss = Math.floor((msRest % 60000) / 1000);
    const contador = `${dd}d ${String(hh).padStart(2, '0')}h ${String(mm).padStart(2, '0')}m ${String(ss).padStart(2, '0')}s`;

    const filas: Record<string, { id: string; rotulo: string; meta: string }[]> = {
      credito: [
        { id: 'c1', rotulo: 'Registro #4182 · opt-in em 28/07', meta: 'microcrédito · aguardando análise de elegibilidade' },
        { id: 'c2', rotulo: 'Registro #4190 · opt-in em 31/07', meta: 'microcrédito · documentação enviada' },
        { id: 'c3', rotulo: 'Registro #4207 · opt-in em 02/08', meta: 'microcrédito · aguardando análise de elegibilidade' },
      ],
    };
    const abertoNome: Record<string, string> = { c1: 'Josenilde Pereira da Costa', c2: 'Antônio Marcos Ribeiro', c3: 'Maria de Fátima Alves' };
    const abertoMeta: Record<string, string> = {
      c1: 'Box 112 · Frutas e hortaliças · (98) 9****-4471',
      c2: 'Box 087 · Peixes e mariscos · (98) 9****-1180',
      c3: 'Box 204 · Produtos regionais · (98) 9****-2093',
    };

    const programas = [
      { id: 'credito', nome: 'Microcrédito produtivo', inscritos: 42, fila: 3, expira: '21/08/2026', podeVer: true },
      { id: 'capacitacao', nome: 'Capacitação em precificação', inscritos: 63, fila: 8, expira: '30/09/2026', podeVer: false },
      { id: 'regularizacao', nome: 'Regularização cadastral', inscritos: 27, fila: 6, expira: '15/08/2026', podeVer: false },
    ].map((p) => ({
      ...p,
      br: p.podeVer ? '#f3c2c0' : 'var(--color-border-soft)',
      acc: p.podeVer ? 'var(--color-danger)' : 'var(--color-text-muted)',
      escopoTxt: p.podeVer ? 'seu escopo · analista responsável' : 'fora do seu escopo',
      foraEscopo: !p.podeVer,
      fila_itens: (filas[p.id] || []).map((f) => {
        const ab = !!st.liberado[f.id];
        return {
          ...f,
          rotulo: ab ? `🔓 ${abertoNome[f.id]}` : f.rotulo,
          meta: ab ? abertoMeta[f.id] : f.meta,
          aberto: ab,
          fechado: !ab,
          notif: ab ? st.liberado[f.id] : '',
          bg: ab ? '#fbeceb' : 'var(--color-surface-muted)',
          br: ab ? '#f9d8d6' : 'var(--color-border-soft)',
          marca: ab ? 'var(--color-danger)' : 'var(--color-border)',
          abrir: this.abrirModal(f.id),
        };
      }),
    }));

    const nAcessos = Object.keys(st.liberado).filter((x) => !x.includes('_')).length;
    const bgJustOk = st.bgJust.trim().length >= 15 && !!st.bgMotivo;

    const logsBase = [
      { quando: '05/08 09:14', quem: 'Ana Vasconcelos', prog: 'Microcrédito', motivo: 'Análise de elegibilidade — microcrédito', regs: 1, notif: 'notificado 05/08 09:15', qv: true },
      { quando: '04/08 16:02', quem: 'Ana Vasconcelos', prog: '—', motivo: 'Consulta agregada (camada 1)', regs: 0, notif: '—', qv: false },
      { quando: '04/08 11:30', quem: 'Raimundo Lima (DPO)', prog: 'Regularização', motivo: 'Auditoria do encarregado de dados', regs: 3, notif: 'notificados 04/08 11:32', qv: true },
      { quando: '03/08 15:48', quem: 'Carlos Nunes', prog: '—', motivo: 'Exportação de dados abertos agregados', regs: 0, notif: '—', qv: false },
      { quando: '02/08 08:22', quem: 'Ana Vasconcelos', prog: '—', motivo: 'Consulta agregada (camada 1)', regs: 0, notif: '—', qv: false },
      { quando: '31/07 14:05', quem: 'Lúcia Moreira', prog: 'Capacitação', motivo: 'Atendimento a pedido do próprio titular', regs: 1, notif: 'notificado 31/07 14:06', qv: true },
    ];
    const logsNovos = Object.keys(st.liberado)
      .filter((x) => !x.includes('_'))
      .map((id) => ({
        quando: st.liberado[id],
        quem: 'Ana Vasconcelos',
        prog: 'Microcrédito',
        motivo: st.liberado[id + '_motivo'] || 'Análise de elegibilidade — microcrédito',
        regs: 1,
        notif: 'notificado agora',
        qv: true,
      }));
    const logs = [...logsNovos, ...logsBase]
      .filter((l) => st.filtroLog === 'todos' || (st.filtroLog === 'qv' ? l.qv : !l.qv))
      .map((l) => ({ ...l, bg: l.qv ? '#fbeceb' : 'transparent', cor: l.qv ? 'var(--color-danger)' : 'var(--color-text-primary)', w: l.qv ? '600' : '400', marca: l.qv ? 'var(--color-danger)' : 'transparent' }));

    const chips: { k: string; v: string; rm: () => void }[] = [];
    if (st.setor) {
      const s = byId(st.setor);
      chips.push({ k: 'SETOR', v: s.nome, rm: this.removerSetor });
    }
    if (completude !== 50) chips.push({ k: 'COMPLETUDE', v: `≥ ${completude}%`, rm: this.removerCompletude });
    if (st.periodo !== '30d') chips.push({ k: 'PERÍODO', v: st.periodo === '12s' ? '12 semanas' : 'ano corrente', rm: this.removerPeriodo });

    const alertasSrc = [
      {
        id: 'a1', titulo: 'Peixes e mariscos: queda de 18% por 3 semanas seguidas', nota: 'n = 14 · coorte fixa · setor com 62% de cobertura', cor: 'var(--color-danger)', chipBg: '#fbeceb', seta: '▼', prioridade: 'ALTA',
        porque: 'O índice do setor caiu de 108 para 88 em três leituras semanais consecutivas, sempre sobre a mesma coorte de 14 feirantes presentes em todos os períodos. A queda coincide com a ruptura de oferta de camarão seco e pescada, o que sugere problema de abastecimento e não de demanda.',
        ev: ['3 semanas consecutivas', '−18,1% acumulado', '2 rupturas de oferta no setor'], go: () => { this.tela.set('saude'); this.setor.set('peixes'); },
      },
      {
        id: 'a2', titulo: 'Camarão seco: choque de preço acima de 2 desvios-padrão', nota: '+18,9% na semana · n = 9 feirantes reportando venda', cor: 'var(--color-warning)', chipBg: 'var(--color-surface-alt)', seta: '▲', prioridade: 'MÉDIA',
        porque: 'A variação semanal ficou 2,4 desvios-padrão acima da média das últimas 12 semanas. Ao mesmo tempo, o número de feirantes reportando venda caiu de 14 para 9 — preço subindo com menos oferta é o padrão clássico de choque de abastecimento.',
        ev: ['2,4σ da série de 12 semanas', '14 → 9 feirantes reportando', 'spread caiu 6 p.p.'], go: () => { this.tela.set('precos'); this.produto.set('camarao'); },
      },
      {
        id: 'a3', titulo: 'Mercearias: cobertura de 22% — tendência ainda não confiável', nota: '15 de 68 boxes cadastrados · busca ativa recomendada', cor: 'var(--color-warning)', chipBg: 'var(--color-surface-alt)', seta: '▬', prioridade: 'CAMPO',
        porque: 'Com 22% de cobertura o nível absoluto do setor não é confiável e a variação tem intervalo largo. É o maior setor do mercado em número de boxes e o de menor adesão — prioridade da equipe de campo nas próximas duas semanas.',
        ev: ['22% de cobertura', 'maior setor em boxes (68)', 'faltam 6 cadastros para 30%'], go: () => { this.tela.set('adocao'); this.setor.set('mercearias'); },
      },
    ];

    return {
      st,
      navGrupos, telaNome: t[1], telaSub: t[2], camada, selo, irGovernanca: this.goTela('governanca'),
      mercadosOpt: ([
        ['provisorio', 'Mercado da Cidade', 'provisório · 4 galpões'],
        ['definitivo', 'Mercado Central', 'reconstruído · 3 pavimentos'],
      ] as [string, string, string][]).map(([id, nome, meta]) => ({
        nome, meta, go: this.setMercado(id),
        bg: mercado === id ? 'var(--color-primary-dark)' : '#fff', fg: mercado === id ? 'var(--color-on-dark)' : 'var(--color-text-secondary)', w: mercado === id ? '600' : '400',
      })),
      periodosOpt: ([
        ['30d', '30 DIAS'], ['12s', '12 SEMANAS'], ['ano', 'ANO'],
      ] as [string, string][]).map(([id, rot]) => ({
        rot, go: this.setPeriodo(id),
        bg: st.periodo === id ? 'var(--color-primary-dark)' : '#fff', fg: st.periodo === id ? 'var(--color-on-dark)' : 'var(--color-text-secondary)', w: st.periodo === id ? '600' : '400',
      })),
      setorSel: st.setor, completude, chips, setores: this.setores, setoresView, k,
      setSetor: this.setSetor, setCompletude: this.setCompletude,
      ehGeral: tela === 'geral', ehPrecos: tela === 'precos', ehSaude: tela === 'saude', ehImpacto: tela === 'impacto',
      ehAdocao: tela === 'adocao', ehCadastro: tela === 'cadastro', ehProgramas: tela === 'programas', ehGov: tela === 'governanca',

      heroLinha, heroArea,
      heroNotas: [{ rot: 'PARTICIPANTES', val: '121 de 450' }, { rot: 'LANÇAMENTOS', val: '8.412' }, { rot: 'COMPLETUDE MÉDIA', val: '58%' }],
      kpis: [
        { rot: 'Feirantes participantes', valor: '121', sub: '27% da base de permissionários', nota: 'adesão voluntária · registro parcial', cor: 'var(--color-primary-dark)', acento: 'var(--color-primary-dark)', barra: 27, tone: 'primary-dark' as const },
        { rot: 'Variação vs. período anterior', valor: '▼ 3,4%', sub: 'n = 121 · coorte fixa', nota: 'quem entrou no meio não altera a série', cor: 'var(--color-danger)', acento: 'var(--color-danger)', barra: 34, tone: 'danger' as const },
        { rot: 'Lançamentos registrados no período', valor: '8.412', sub: `completude ≥ ${completude}%`, nota: '58% de completude média entre participantes', cor: 'var(--color-primary-dark)', acento: 'var(--color-success)', barra: 58, tone: 'primary' as const },
      ],
      plantaSub: mercado === 'provisorio' ? '4 galpões · espaço provisório · cerca de 450 feirantes · clique para filtrar' : '3 pavimentos · projeto reconstruído · capacidade de 285 feirantes · clique para filtrar',
      plantaBlocos: (plan as any).blocos, plantaCells, legenda, det,
      metricasOpt: ([
        ['variacao', 'Variação', 'Índice de variação vs. período anterior'],
        ['cobertura', 'Cobertura', 'Percentual de boxes com feirante participante'],
        ['margem', 'Margem', 'Margem mediana entre participantes'],
      ] as [string, string, string][]).map(([id, rot, dica]) => ({
        rot, dica, go: this.setMetrica(id),
        bg: metrica === id ? 'var(--color-primary-dark)' : '#fff', fg: metrica === id ? 'var(--color-on-dark)' : 'var(--color-text-secondary)', w: metrica === id ? '600' : '400',
      })),
      tabelaPlanta: st.tabPlanta, toggleTabelaPlanta: this.toggleTabelaPlanta,
      labelTabelaPlanta: st.tabPlanta ? 'Ocultar dados' : 'Ver dados',
      cabPlanta: [{ rot: 'SETOR', al: 'left' }, { rot: 'BOXES', al: 'right' }, { rot: 'PARTICIPANTES', al: 'right' }, { rot: 'COBERTURA', al: 'right' }, { rot: 'ESTADO', al: 'left' }],
      alertas: alertasSrc.map((a) => ({ ...a, evidencias: a.ev, aberto: st.alertaAberto === a.id, rotExp: st.alertaAberto === a.id ? 'Ocultar' : 'Por quê?', expandir: this.expandirAlerta(a.id) })),
      cardsSupressao: setoresView.filter((s) => s.estado !== 'ok').map((s) => ({
        nome: s.nome, cor: s.estado === 'dominancia' ? 'var(--color-danger)' : 'var(--color-warning)',
        tag: s.estado === 'amostra' ? 'AMOSTRA' : s.estado === 'dominancia' ? 'CONCENTRAÇÃO' : s.estado === 'semdados' ? 'SEM DADOS' : 'COBERTURA BAIXA',
        tagBg: s.estado === 'dominancia' ? '#fbeceb' : 'var(--color-surface-alt)', tagBr: s.estado === 'dominancia' ? '#f9d8d6' : 'var(--color-border)',
        explica: s.estado === 'amostra' ? `Valores monetários ficam ocultos abaixo de ${k} feirantes participantes. A contagem de boxes cadastrados continua pública.`
          : s.estado === 'dominancia' ? 'Um participante concentra mais de 50% do agregado. O valor fica oculto para não revelar um indivíduo — qual deles não é informado a nenhum perfil.'
          : s.estado === 'semdados' ? 'Nenhum feirante deste setor aderiu ao serviço. Sem série no período.'
          : 'O nível absoluto é pouco confiável com esta cobertura. Use apenas a tendência.',
        progRot: s.estado === 'amostra' ? `${s.n} de ${k} participantes` : s.estado === 'cobertura' ? `${s.cobPct}% de 30% de cobertura` : s.estado === 'dominancia' ? `${s.n} participantes · 1º > 50%` : '0 cadastros',
        progVal: s.estado === 'amostra' ? `${Math.round((s.n / k) * 100)}%` : s.estado === 'cobertura' ? `${Math.round((s.cobPct / 30) * 100)}%` : s.estado === 'dominancia' ? 'travado' : '—',
        prog: s.estado === 'amostra' ? (s.n / k) * 100 : s.estado === 'cobertura' ? Math.min(100, (s.cobPct / 30) * 100) : s.estado === 'dominancia' ? 100 : 2,
        acao: s.estado === 'amostra' ? `faltam ${s.falta} cadastros para este setor destravar`
          : s.estado === 'dominancia' ? 'destrava com mais 3 cadastros no setor'
          : s.estado === 'semdados' ? 'busca ativa não iniciada neste setor'
          : `faltam ${Math.ceil(s.boxes * 0.3) - s.cad} cadastros para 30% de cobertura`,
      })),

      cabCesta: [cab('nome', 'PRODUTO', 'left'), cab('compra', 'COMPRA', 'right'), cab('venda', 'VENDA', 'right'), cab('spread', 'SPREAD', 'right'), cab('vr', 'VAR. SEM.', 'right'), { rot: '12 SEMANAS', al: 'left', cursor: 'default', go: () => {}, w: '400', cor: 'var(--color-text-secondary)', dir: '' }],
      cestaView: cestaOrd.map((p) => ({
        ...p,
        compra: this._brl(p.compra), venda: this._brl(p.venda),
        spread: `${Math.round((p.venda / p.compra - 1) * 100)}%`,
        spreadW: Math.min(100, (p.venda / p.compra - 1) * 100 * 1.4),
        varTxt: `${this._seta(p.vr)} ${this._pct(p.vr)}`, cor: this._corVar(p.vr),
        marca: p.flag === 'choque' ? 'var(--color-danger)' : p.flag === 'ruptura' ? 'var(--color-warning)' : 'transparent',
        nota: `por ${p.un} · n = ${p.n} reportando`,
        spark: this._path(p.serie, 94, 20, 2),
        bg: p.id === st.produto ? '#EDF1E7' : 'transparent', w: p.id === st.produto ? '600' : '400',
        go: this.setProduto(p.id),
      })),
      prodSel: { nome: prod.nome, nota: `mediana de venda por ${prod.un} · n = ${prod.n} feirantes reportando · média aparada a 10%`, varTxt: `${this._seta(prod.vr)} ${this._pct(prod.vr)}`, cor: this._corVar(prod.vr) },
      serieLinha: linha, serieBanda: banda, serieGrid, serieEventos, indicePrecos: '106,4',
      choques: [
        { txt: 'Camarão seco · choque de preço (2,4σ)', val: '+18,9%', cor: 'var(--color-danger)' },
        { txt: 'Tomate · choque de preço (2,1σ)', val: '+12,4%', cor: 'var(--color-danger)' },
        { txt: 'Camarão seco · ruptura de oferta', val: '14 → 9', cor: 'var(--color-warning)' },
        { txt: 'Peixe fresco · ruptura de oferta', val: '19 → 14', cor: 'var(--color-warning)' },
        { txt: 'Abacaxi · ruptura de oferta', val: '17 → 13', cor: 'var(--color-warning)' },
      ],
      origem: [{ rot: 'Agricultura familiar local', pct: 38, cor: 'var(--color-success)' }, { rot: 'Atacado externo', pct: 54, cor: 'var(--color-primary-dark)' }, { rot: 'Não declarada', pct: 8, cor: '#9FA9A2' }],

      histograma: [
        { rot: 'Margem negativa', pct: 14, h: 62, cor: 'var(--color-danger)', abs: '17 feirantes', dica: '17 de 121 feirantes participantes · margem mediana abaixo de zero' },
        { rot: '0 – 10%', pct: 22, h: 97, cor: 'var(--color-warning)', abs: '27 feirantes', dica: '27 de 121 feirantes participantes' },
        { rot: '10 – 20%', pct: 31, h: 137, cor: 'var(--color-primary-dark)', abs: '37 feirantes', dica: '37 de 121 feirantes participantes' },
        { rot: '20 – 30%', pct: 21, h: 93, cor: 'var(--color-success)', abs: '26 feirantes', dica: '26 de 121 feirantes participantes' },
        { rot: 'Acima de 30%', pct: 12, h: 53, cor: 'var(--color-success)', abs: '14 feirantes', dica: '14 de 121 feirantes participantes' },
      ],
      maturidade: [
        { rot: 'Registra custos, não apenas vendas', pct: 47, nota: 'maturidade de gestão', cor: 'var(--color-primary-dark)', dash: '0.47 1' },
        { rot: 'Formalizado como MEI', pct: 38, nota: 'autodeclarado no chatbot', cor: 'var(--color-success)', dash: '0.38 1' },
        { rot: 'Aceita pagamento digital', pct: 71, nota: 'Pix ou cartão', cor: 'var(--color-success)', dash: '0.71 1' },
        { rot: 'Completude média de registro', pct: 58, nota: 'dias com lançamento', cor: 'var(--color-warning)', dash: '0.58 1' },
      ],
      cabSaude: [{ rot: 'SETOR', al: 'left' }, { rot: 'FAIXA DE FATURAMENTO MEDIANO', al: 'left' }, { rot: 'MARGEM', al: 'right' }, { rot: 'VARIAÇÃO', al: 'right' }, { rot: 'AMOSTRA', al: 'left' }],

      impactoLinha, impactoProj, impactoArea, impactoGrid, impactoEventos,
      impactoResumo: [{ rot: 'PICO ANTES DA OBRA', val: '100,6', cor: 'var(--color-success)' }, { rot: 'FUNDO NA TRANSIÇÃO', val: '87,3', cor: 'var(--color-danger)' }, { rot: 'RECUPERAÇÃO ATUAL', val: '104,6', cor: 'var(--color-primary-dark)' }],
      barrasSetor: setoresView.filter((s) => s.estado === 'ok' || s.estado === 'cobertura').map((s) => ({ rot: s.nome, val: this._num(s.idx!), w: Math.max(4, ((s.idx! - 80) / 30) * 100), base: Math.round(((100 - 80) / 30) * 100), cor: this._corVar(s.vr!) })),
      coortes: [{ rot: '0 – 3 meses de uso', val: '100,8', w: 52 }, { rot: '3 – 6 meses', val: '104,6', w: 70 }, { rot: '6 meses ou mais', val: '109,2', w: 90 }],

      adocaoKpis: [
        { rot: 'CADASTRADOS NO SERVIÇO', valor: '148', sub: 'de 450 permissionários', barra: 33 },
        { rot: 'ATIVOS EM 7 DIAS', valor: '96', sub: '65% dos cadastrados', barra: 65 },
        { rot: 'ATIVOS EM 30 DIAS', valor: '121', sub: '82% dos cadastrados', barra: 82 },
        { rot: 'RETENÇÃO D30', valor: '64%', sub: 'coorte de maio', barra: 64 },
      ],
      temas: [{ rot: 'Precificação', pct: 34, w: 100, cor: 'var(--color-primary-dark)' }, { rot: 'Controle de custo', pct: 27, w: 79, cor: 'var(--color-success)' }, { rot: 'Formalização (MEI)', pct: 21, w: 62, cor: 'var(--color-warning)' }, { rot: 'Crédito', pct: 18, w: 53, cor: 'var(--color-text-muted)' }],

      cadastroKpis: [
        { rot: 'BOXES OCUPADOS', valor: '342', sub: 'de 386 boxes no provisório' },
        { rot: 'BOXES VAGOS', valor: '44', sub: '11% de vacância' },
        { rot: 'ALVARÁS EM DIA', valor: '268', sub: '78% dos permissionários' },
        { rot: 'PENDÊNCIAS CADASTRAIS', valor: '41', sub: 'documentação vencida ou incompleta' },
      ],
      ocupacao: this.setores.map((s) => {
        const v = Math.round(s.boxes * 0.11),
          o = s.boxes - v;
        return { nome: s.nome, ocupados: o, vagos: v, pctOcup: Math.round((o / s.boxes) * 100), pctVago: Math.round((v / s.boxes) * 100) };
      }),
      pendencias: [
        { nome: 'José Carlos de Almeida', box: 'Box 042', setor: 'Mercearias', pend: 'alvará vencido em 12/06', cor: 'var(--color-danger)', bg: '#fbeceb', br: '#f9d8d6' },
        { nome: 'Terezinha Nunes Silva', box: 'Box 118', setor: 'Frutas e hortaliças', pend: 'documentação incompleta', cor: 'var(--color-warning)', bg: 'var(--color-surface-alt)', br: 'var(--color-border)' },
        { nome: 'Raimundo Costa Filho', box: 'Box 203', setor: 'Peixes e mariscos', pend: 'taxa em atraso · 2 meses', cor: 'var(--color-danger)', bg: '#fbeceb', br: '#f9d8d6' },
        { nome: 'Maria Auxiliadora Lima', box: 'Box 067', setor: 'Produtos regionais', pend: 'transferência em análise', cor: 'var(--color-warning)', bg: 'var(--color-surface-alt)', br: 'var(--color-border)' },
        { nome: 'Domingos Sávio Rocha', box: 'Box 155', setor: 'Açougues', pend: 'vistoria sanitária pendente', cor: 'var(--color-warning)', bg: 'var(--color-surface-alt)', br: 'var(--color-border)' },
      ],
      transferencias: [
        { txt: 'Box 042 · Mercearias — transferência aprovada', data: '02/08/2026', cor: 'var(--color-success)' },
        { txt: 'Box 187 · Restaurantes — cessão indeferida', data: '27/07/2026', cor: 'var(--color-danger)' },
        { txt: 'Box 067 · Produtos regionais — em análise', data: '21/07/2026', cor: 'var(--color-warning)' },
        { txt: 'Box 231 · Artesanato — transferência aprovada', data: '14/07/2026', cor: 'var(--color-success)' },
      ],

      programas, contador,
      acessosMes: [
        { rot: 'Acessos de quebra-vidro', val: String(3 + nAcessos), cor: 'var(--color-danger)' },
        { rot: 'Titulares notificados', val: String(3 + nAcessos), cor: 'var(--color-success)' },
        { rot: 'Acessos negados por falta de justificativa', val: '2', cor: 'var(--color-text-muted)' },
      ],
      modalAberto: !!st.modal, motivos: this.motivos, bgMotivo: st.bgMotivo, bgJust: st.bgJust,
      setBgMotivo: this.setBgMotivo, setBgJust: this.setBgJust, fecharModal: this.fecharModal,
      bgBloqueado: !bgJustOk,
      bgAviso: bgJustOk ? { txt: 'Justificativa válida · o acesso será registrado no seu nome', cor: 'var(--color-success)', contagem: `${st.bgJust.trim().length} caracteres` }
        : { txt: 'Motivo e ao menos 15 caracteres de justificativa', cor: 'var(--color-danger)', contagem: `${st.bgJust.trim().length}/15` },
      bgBotao: bgJustOk ? { bg: 'var(--color-danger)', fg: '#FDF1EE', br: 'var(--color-danger)', cursor: 'pointer' } : { bg: 'var(--color-surface)', fg: '#9AA39D', br: '#DCE1D5', cursor: 'not-allowed' },
      confirmarBg: this.confirmarBg,

      cabInv: ['DADO', 'FINALIDADE', 'BASE LEGAL', 'RETENÇÃO'],
      inventario: [
        { dado: 'Lançamentos de venda e compra', camada: 'camada 1 · agregado', fim: 'Índices de movimento, preço e margem', base: 'Interesse público (art. 7º, III)', ret: '24 meses', marca: 'var(--color-success)' },
        { dado: 'Número de WhatsApp do feirante', camada: 'não trafega ao painel', fim: 'Operação do chatbot', base: 'Execução de contrato', ret: 'enquanto ativo', marca: 'var(--color-text-muted)' },
        { dado: 'Box, permissionário, alvará, taxa', camada: 'camada 2 · identificado', fim: 'Gestão de mercados públicos', base: 'Política pública (art. 7º, III)', ret: 'permanente', marca: 'var(--color-warning)' },
        { dado: 'Adesão a programa (opt-in)', camada: 'camada 3 · restrito', fim: 'Análise de elegibilidade', base: 'Consentimento específico', ret: '12 meses', marca: 'var(--color-danger)' },
        { dado: 'Categoria do tema perguntado', camada: 'camada 1 · agregado', fim: 'Agenda de capacitação', base: 'Interesse público', ret: '12 meses', marca: 'var(--color-success)' },
        { dado: 'Log de acessos do painel', camada: 'auditoria', fim: 'Prestação de contas e auditoria', base: 'Obrigação legal', ret: '60 meses', marca: 'var(--color-primary-dark)' },
      ],
      regras: [
        { rot: 'Limiar mínimo de participantes para valor monetário', val: `n ≥ ${k}` },
        { rot: 'Contagem de boxes cadastrados', val: 'sempre pública' },
        { rot: 'Regra de dominância', val: '1º > 50% ou 1º+2º > 70%' },
        { rot: 'Janela de coorte fixa em comparações', val: '12 semanas' },
        { rot: 'Completude mínima para métricas de nível', val: `≥ ${completude}% dos dias` },
        { rot: 'Agrupamento "outros" de setores pequenos', val: 'composição congelada' },
        { rot: 'Recortes bloqueados', val: 'indivíduo · ranking · série bruta' },
      ],
      filtrosLog: ([
        ['todos', 'TODOS'], ['qv', 'QUEBRA-VIDRO'], ['agg', 'AGREGADO'],
      ] as [string, string][]).map(([id, rot]) => ({ rot, go: this.setFiltroLog(id), bg: st.filtroLog === id ? 'var(--color-primary-dark)' : '#fff', fg: st.filtroLog === id ? 'var(--color-on-dark)' : 'var(--color-text-secondary)', w: st.filtroLog === id ? '600' : '400' })),
      cabLog: [{ rot: 'QUANDO', al: 'left' }, { rot: 'USUÁRIO', al: 'left' }, { rot: 'PROGRAMA', al: 'left' }, { rot: 'MOTIVO', al: 'left' }, { rot: 'REGISTROS', al: 'right' }, { rot: 'TITULAR', al: 'left' }],
      logs,
      pedidos: [
        { tipo: 'Acesso aos próprios dados', meta: 'protocolo 2026-0184 · recebido 03/08', sla: '12 dias', status: 'em atendimento', bg: 'var(--color-surface-alt)', cor: 'var(--color-warning)', br: 'var(--color-border)' },
        { tipo: 'Revogação de consentimento (crédito)', meta: 'protocolo 2026-0179 · recebido 01/08', sla: '2 dias', status: 'concluído', bg: 'var(--color-accent-tint)', cor: 'var(--color-success)', br: '#A9CDB8' },
        { tipo: 'Correção de dado cadastral', meta: 'protocolo 2026-0175 · recebido 29/07', sla: 'vencido há 1 dia', status: 'atrasado', bg: '#fbeceb', cor: 'var(--color-danger)', br: '#f3c2c0' },
        { tipo: 'Exclusão de histórico de lançamentos', meta: 'protocolo 2026-0171 · recebido 26/07', sla: '6 dias', status: 'concluído', bg: 'var(--color-accent-tint)', cor: 'var(--color-success)', br: '#A9CDB8' },
      ],
      exportar: this.exportar,
      toast: st.toast,
    };
  });
}
