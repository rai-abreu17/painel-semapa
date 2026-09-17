import re

def refactor_cards():
    with open('c:\\Users\\Raí\\Downloads\\prefs\\painel-semapa\\src\\app\\app.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacing inline styled cards with class="card"
    # Example: <section style="background:#fff;border:1px solid var(--color-border);border-radius:6px;overflow:hidden;min-width:0;display:flex;flex-direction:column">
    content = re.sub(
        r'<section style="background:#fff;border:1px solid var\(--color-border\);border-radius:6px;overflow:hidden;min-width:0;display:flex;flex-direction:column">',
        '<section class="card chart-card">',
        content
    )
    
    # And <section style="background:#fff;border:1px solid var(--color-border);border-radius:6px;padding:20px 22px;display:flex;flex-direction:column;gap:12px">
    content = re.sub(
        r'<section style="background:#fff;border:1px solid var\(--color-border\);border-radius:6px;padding:20px 22px;display:flex;flex-direction:column;gap:12px">',
        '<section class="card" style="padding:20px 22px;display:flex;flex-direction:column;gap:12px">',
        content
    )
    
    # Header of cards: <div style="padding:18px 20px 14px;display:flex;justify-content:space-between;align-items:flex-end;gap:14px;flex-wrap:wrap;border-bottom:1px solid var(--color-border-soft)">
    content = re.sub(
        r'<div style="padding:18px 20px 14px;display:flex;justify-content:space-between;align-items:flex-end;gap:14px;flex-wrap:wrap;border-bottom:1px solid var\(--color-border-soft\)">',
        '<div class="chart-card__header">',
        content
    )

    with open('c:\\Users\\Raí\\Downloads\\prefs\\painel-semapa\\src\\app\\app.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    refactor_cards()
