import re

def refactor_shell():
    with open('c:\\Users\\Raí\\Downloads\\prefs\\painel-semapa\\src\\app\\app.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the <nav data-rail="1" ...> and extract it.
    nav_start = content.find('<nav data-rail="1"')
    nav_end = content.find('</nav>') + 6
    
    if nav_start == -1 or nav_end == -1:
        print("Nav not found!")
        return

    # Extract the <main ...> start tag.
    main_start = content.find('<main style="')
    main_end = content.find('>', main_start) + 1

    # Replace the shell wrapper
    content = content.replace(
        '<div data-shell="1" style="display:flex;min-height:100vh;align-items:stretch;background:var(--color-bg)">',
        '<div data-shell="1" style="display:flex;flex-direction:column;min-height:100vh;background:var(--color-bg)">'
    )

    # We will build a new header that includes the branding, user info, and navigation items.
    # The existing nav items are generated using @for (g of vm.navGrupos; track g.rot).
    
    new_header = """
<header style="background:var(--color-primary-dark);color:var(--color-on-dark);padding:14px 24px;display:flex;justify-content:space-between;align-items:center;">
    <div style="display:flex;align-items:center;gap:12px">
        <span style="flex:none;width:30px;height:30px;border:1.5px solid var(--color-primary);transform:rotate(45deg);display:flex;align-items:center;justify-content:center"><span style="width:12px;height:12px;background:var(--color-primary);display:block"></span></span>
        <span style="display:flex;flex-direction:column;gap:1px">
            <span style="font-family:'IBM Plex Sans Condensed',sans-serif;font-weight:700;font-size:18px;letter-spacing:.02em;line-height:1">Gerenciamento de Acesso</span>
            <span style="font-size:10px;color:var(--color-on-dark-muted);font-family:'IBM Plex Mono',monospace;letter-spacing:.04em">SEMAPA · PREFEITURA DE SÃO LUÍS</span>
        </span>
    </div>
    
    <!-- Top Navigation -->
    <nav style="display:flex;gap:16px;align-items:center;">
        @for (g of vm.navGrupos; track g.rot) {
            <div style="display:flex;gap:4px;align-items:center;border-right:1px solid rgba(255,255,255,0.15);padding-right:16px;">
            @for (it of g.itens; track it.nome) {
                <button (click)="it.go()" style="background:transparent;border:0;color:#fff;font-size:13px;font-weight:500;cursor:pointer;padding:8px 12px;border-radius:4px;transition:background 0.2s" [appHoverStyle]="'background:rgba(255,255,255,0.1)'">
                    {{ it.nome }}
                </button>
            }
            </div>
        }
    </nav>

    <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:34px;height:34px;border-radius:50%;background:var(--color-primary);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#fff">AV</div>
        <span style="font-size:12.5px;font-weight:600;display:flex;flex-direction:column;text-align:left">
           Ana Vasconcelos
           <span style="font-size:10px;color:var(--color-on-dark-muted);font-weight:400;font-family:'IBM Plex Mono',monospace">Sessão Auditada</span>
        </span>
    </div>
</header>
<main style="flex:1;min-width:0;display:flex;flex-direction:column;background:{{ vm.camada.fundo }};transition:background .3s ease">
"""
    # Remove the old nav and replace the main start
    content = content[:nav_start] + content[nav_end:main_start] + new_header + content[main_end:]
    
    with open('c:\\Users\\Raí\\Downloads\\prefs\\painel-semapa\\src\\app\\app.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    refactor_shell()
