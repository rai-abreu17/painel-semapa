import re

def refactor_dashboard():
    with open('c:\\Users\\Raí\\Downloads\\prefs\\painel-semapa\\src\\app\\app.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace the old sticky header with the new Filters Card
    header_start = content.find('<header style="position:sticky;top:0;z-index:30')
    header_end = content.find('</header>', header_start) + 9

    new_filters_html = """
<div class="card" style="padding:20px 24px; display:flex; flex-wrap:wrap; gap:20px; align-items:flex-end;">
    <!-- Mercado Group -->
    <div style="display:flex;flex-direction:column;gap:6px">
        <span style="font-size:11px;font-weight:600;color:var(--color-text-secondary);letter-spacing:.05em">Mercado</span>
        <div style="display:flex;border:1px solid var(--color-border);border-radius:6px;overflow:hidden">
            @for (m of vm.mercadosOpt; track m.nome) {
            <button (click)="m.go()" style="border:0;cursor:pointer;background:{{ m.bg === 'var(--color-primary-dark)' ? 'var(--color-surface-muted)' : '#fff' }};color:{{ m.bg === 'var(--color-primary-dark)' ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)' }};padding:10px 16px;font-size:13px;font-weight:{{ m.bg === 'var(--color-primary-dark)' ? '600' : '400' }};border-right:1px solid var(--color-border);transition:all .16s ease">
                {{ m.nome }}
            </button>
            }
        </div>
    </div>

    <!-- Período Group -->
    <div style="display:flex;flex-direction:column;gap:6px">
        <span style="font-size:11px;font-weight:600;color:var(--color-text-secondary);letter-spacing:.05em">Período</span>
        <div style="display:flex;border:1px solid var(--color-border);border-radius:6px;overflow:hidden">
            @for (p of vm.periodosOpt; track p.rot) {
            <button (click)="p.go()" style="border:0;cursor:pointer;background:{{ p.bg === 'var(--color-primary-dark)' ? 'var(--color-surface-muted)' : '#fff' }};color:{{ p.bg === 'var(--color-primary-dark)' ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)' }};padding:10px 16px;font-size:13px;font-weight:{{ p.bg === 'var(--color-primary-dark)' ? '600' : '400' }};border-right:1px solid var(--color-border);transition:all .16s ease">
                {{ p.rot }}
            </button>
            }
        </div>
    </div>

    <!-- Setor Select -->
    <div style="display:flex;flex-direction:column;gap:6px;flex:1;min-width:200px">
        <span style="font-size:11px;font-weight:600;color:var(--color-text-secondary);letter-spacing:.05em">Setor</span>
        <select [value]="vm.setorSel" (change)="vm.setSetor($event)" style="width:100%;padding:10px 12px;border:1px solid var(--color-border);border-radius:6px;background:#fff;font-size:13px;color:var(--color-text-primary);outline:none">
            <option value="">Todas as localizações / setores</option>
            @for (s of vm.setores; track s.id) {<option [value]="s.id">{{ s.nome }}</option>}
        </select>
    </div>

    <!-- Chips Ativos -->
    <div style="display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin-left:auto">
        @for (c of vm.chips; track c.k) {
        <span style="display:inline-flex;align-items:center;gap:8px;background:var(--color-surface-muted);border:1px solid var(--color-border-soft);border-radius:16px;padding:4px 12px;font-size:12px;color:var(--color-text-primary)">
            <span style="font-weight:600;color:var(--color-text-secondary)">{{ c.k }}:</span> {{ c.v }}
            <button (click)="c.rm()" aria-label="remover filtro" style="border:0;background:transparent;cursor:pointer;color:var(--color-text-muted);font-size:16px;line-height:1;padding:0;margin-left:4px" [appHoverStyle]="'color:var(--color-danger)'">×</button>
        </span>
        }
    </div>
</div>

<div style="background:#F0F6FA; border-left:4px solid var(--color-primary); padding:14px 20px; border-radius:6px; display:flex; align-items:center; gap:12px; margin-top:16px; color:var(--color-primary-dark); font-size:13.5px">
    <span style="font-size:18px">💡</span> 
    <span><strong>Dica de navegação:</strong> O dashboard é interativo! Você pode clicar nos cartões e nas fatias dos gráficos para abrir a lista detalhada.</span>
</div>
"""
    content = content[:header_start] + new_filters_html + content[header_end:]

    # 2. Re-write the Hero section into the flat KPI Grid.
    # Replace data-hero completely with standard 5-column grid.
    hero_start = content.find('<div data-hero="1"')
    hero_end = content.find('</div>\n</div>\n\n<section class="trend-row"', hero_start) + 12
    if hero_end < 20: # fallback
        hero_end = content.find('<section class="trend-row"', hero_start)

    new_hero_html = """
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:20px">
    <!-- Card 1: Movimento (Azul) -->
    <div class="kpi-card primary-dark" style="background:#082D69;color:#fff;border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:12px;position:relative;overflow:hidden">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <span style="font-size:13px;font-weight:600;opacity:0.9">Índice de movimento</span>
            <span style="background:rgba(255,255,255,0.15);padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">▼ 3,4%</span>
        </div>
        <div style="display:flex;align-items:baseline;gap:8px">
            <span style="font-size:36px;font-weight:700;line-height:1">96,8</span>
        </div>
        <span style="font-size:11px;opacity:0.7">base 100 · coorte fixa de 121</span>
        <div style="height:40px;margin-top:4px">
            <svg viewBox="0 0 400 100" preserveAspectRatio="none" style="width:100%;height:100%;overflow:visible"><path d="M0 65 L40 67 L80 64 L120 74 L160 84 L200 90 L240 88 L280 91 L320 83 L360 85 L400 79 L400 120 L0 120 Z" fill="rgba(255,255,255,0.1)"></path><path d="M0 65 L40 67 L80 64 L120 74 L160 84 L200 90 L240 88 L280 91 L320 83 L360 85 L400 79" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="4"></path></svg>
        </div>
    </div>

    <!-- Cards gerados pelo vm.kpis -->
    @for (k of vm.kpis; track k.rot) {
        <app-kpi-stat-card 
            [title]="k.rot" 
            [mainValue]="k.valor"
            [deltaPct]="k.sub" 
            [hint]="k.nota"
            [tone]="$index === 0 ? 'accent' : 'warning'">
        </app-kpi-stat-card>
    }
    
    <!-- Como só tem 2 no vm.kpis e 1 no hero (total 3), vou criar +2 vazios apenas para compor 5 pro print ficar exato, ou deixar auto-fit que preenche lindamente -->
</div>
"""
    content = content[:hero_start] + new_hero_html + content[hero_end:]

    with open('c:\\Users\\Raí\\Downloads\\prefs\\painel-semapa\\src\\app\\app.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    refactor_dashboard()
