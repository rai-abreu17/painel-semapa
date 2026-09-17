import re

def refactor_html():
    with open('c:\\Users\\Raí\\Downloads\\prefs\\painel-semapa\\src\\app\\app.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Strip styles from table, thead, tbody, th, td, tr
    # We will use regex to find <table ... style="..."> and replace with <table class="table">
    content = re.sub(r'<table[^>]*style="[^"]*"[^>]*>', '<table class="table">', content)
    
    # Remove styles from th, td, tr but keep other attributes (like click)
    content = re.sub(r'<th([^>]*)style="[^"]*"([^>]*)>', r'<th\1\2>', content)
    content = re.sub(r'<td([^>]*)style="[^"]*"([^>]*)>', r'<td\1\2>', content)
    
    # For tr, we keep [appHoverStyle] but remove style=""
    content = re.sub(r'<tr([^>]*)style="[^"]*"([^>]*)>', r'<tr\1\2>', content)

    # 2. Refactor Modals
    # Replace modal overlay inline styles with class="modal-overlay" (already present somewhat, but let's fix it)
    content = content.replace(
        '<div class="modal-overlay">',
        '<app-modal [isOpen]="vm.modalAberto" title="Quebra-vidro · acesso identificado" subtitle="Você vai abrir um registro individual da camada 3. O titular optou por este programa. O acesso será registrado no log, notificado ao titular no WhatsApp e expira ao fim da janela do programa." (close)="vm.fecharModal()">'
    )
    
    # The current modal has a lot of content inside. We need to close <app-modal>
    # Let's just do it manually for the modal via a separate regex or manual replacement later, because it's complex.

    # 3. Refactor Buttons
    content = re.sub(r'<button([^>]*)class="btn-primary"([^>]*)style="[^"]*"([^>]*)>', r'<button\1class="btn-primary"\2\3>', content)
    content = re.sub(r'<button([^>]*)class="btn-secondary"([^>]*)style="[^"]*"([^>]*)>', r'<button\1class="btn-secondary"\2\3>', content)
    content = re.sub(r'<button([^>]*)class="btn-danger"([^>]*)style="[^"]*"([^>]*)>', r'<button\1class="btn-danger"\2\3>', content)
    
    with open('c:\\Users\\Raí\\Downloads\\prefs\\painel-semapa\\src\\app\\app.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    refactor_html()
