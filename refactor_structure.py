import re

def refactor_structure():
    with open('c:\\Users\\Raí\\Downloads\\prefs\\painel-semapa\\src\\app\\app.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Main dashboard padding
    content = content.replace(
        '<div style="padding:24px 26px 64px;display:flex;flex-direction:column;gap:22px">',
        '<div class="dashboard" style="padding: 24px 26px 64px;">'
    )
    
    # 2. KPI Grid
    content = content.replace(
        '<div data-strip="1" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));background:#fff;border:1px solid var(--color-border);border-radius:6px;overflow:hidden">',
        '<div class="kpi-grid">'
    )
    
    # 3. Chart wrappers
    # <section data-split="1" style="display:grid;grid-template-columns:minmax(0,1fr) 296px;gap:0;background:#fff;border:1px solid var(--color-border);border-radius:6px;overflow:hidden;animation:sobe .4s ease .06s both">
    content = re.sub(
        r'<section data-split="1"[^>]*>',
        '<section class="trend-row" style="animation: sobe .4s ease .06s both;">',
        content
    )
    # The other <div data-split="1"...>
    content = re.sub(
        r'<div data-split="1"[^>]*>',
        '<div class="trend-row">',
        content
    )

    with open('c:\\Users\\Raí\\Downloads\\prefs\\painel-semapa\\src\\app\\app.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    refactor_structure()
