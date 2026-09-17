import re

def fix_html():
    with open('c:\\Users\\Raí\\Downloads\\prefs\\painel-semapa\\src\\app\\app.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Restore the modal overlay wrapper or close app-modal correctly
    # The modal logic at the bottom:
    # @if (vm.modalAberto) {
    # <app-modal [isOpen]="vm.modalAberto" ...>
    # <div role="dialog" aria-modal="true" class="modal-panel"> ... </div>
    # </div>
    # }
    
    # Let's fix the modal manually by replacing the entire modal block.
    # The modal block starts with `@if (vm.modalAberto) {`
    # and ends around line 870. We will just use string replacement for the entire block.
    
    modal_start = content.find('@if (vm.modalAberto) {')
    modal_end = content.find('@if (vm.toast) {')
    if modal_start != -1 and modal_end != -1:
        modal_block = content[modal_start:modal_end]
        # We need to replace the content of the modal block to use <app-modal> correctly.
        new_modal_block = """@if (vm.modalAberto) {
<app-modal [isOpen]="vm.modalAberto" title="Quebra-vidro · acesso identificado" subtitle="Você vai abrir um registro individual da camada 3. O titular optou por este programa. O acesso será registrado no log, notificado ao titular no WhatsApp e expira ao fim da janela do programa." (close)="vm.fecharModal()">
<div style="padding:24px 28px 26px;display:flex;flex-direction:column;gap:16px">
<label style="display:flex;flex-direction:column;gap:5px">
<span style="font-size:10px;font-family:'IBM Plex Mono',monospace;color:var(--color-text-muted);letter-spacing:.08em">MOTIVO · LISTA FECHADA</span>
<select [value]="vm.bgMotivo" (change)="vm.setBgMotivo($event)" style="border:1px solid #C3CBBC;border-radius:4px;padding:10px;font-size:13px;background:#fff">
<option value="">Selecione o motivo</option>
@for (m of vm.motivos; track m) {<option [value]="m">{{ m }}</option>}
</select>
</label>
<label style="display:flex;flex-direction:column;gap:5px">
<span style="font-size:10px;font-family:'IBM Plex Mono',monospace;color:var(--color-text-muted);letter-spacing:.08em">JUSTIFICATIVA · OBRIGATÓRIA</span>
<textarea [value]="vm.bgJust" (change)="vm.setBgJust($event)" rows="3" placeholder="Descreva por que este registro precisa ser aberto agora." style="border:1px solid #C3CBBC;border-radius:4px;padding:10px;font-size:13px;resize:vertical"></textarea>
<span style="display:flex;justify-content:space-between;gap:10px;font-size:11px;font-family:'IBM Plex Mono',monospace">
<span style="color:{{ vm.bgAviso.cor }}">{{ vm.bgAviso.txt }}</span>
<span style="color:var(--color-text-muted);white-space:nowrap">{{ vm.bgAviso.contagem }}</span>
</span>
</label>
<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;border-top:1px solid var(--color-border-soft);padding-top:16px">
<span style="display:flex;flex-direction:column;gap:2px">
<span style="font-size:9.5px;font-family:'IBM Plex Mono',monospace;color:var(--color-text-muted);letter-spacing:.08em">ESCOPO TEMPORAL</span>
<span style="font-family:'IBM Plex Mono',monospace;font-size:12.5px;color:var(--color-danger);font-weight:600">expira em {{ vm.contador }}</span>
</span>
<span style="display:flex;gap:10px">
<button (click)="vm.fecharModal()" class="btn-secondary" style="padding:10px 15px">Cancelar</button>
<button (click)="vm.confirmarBg()" [disabled]="vm.bgBloqueado" class="btn-danger" style="padding:10px 15px;cursor:{{ vm.bgBotao.cursor }}">Registrar acesso e abrir</button>
</span>
</div>
</div>
</app-modal>
}

"""
        content = content[:modal_start] + new_modal_block + content[modal_end:]

    # Fixing the KPI cards
    # Search for: <div style="padding:20px;display:flex;flex-direction:column;gap:7px;border-right:1px solid var(--color-border-soft);position:relative">
    # We want to replace the whole @for (k of vm.kpis; track k.rot) { ... } inside the kpi grid with <app-kpi-stat-card>

    kpi_start = content.find('@for (k of vm.kpis; track k.rot) {')
    kpi_end = content.find('</div>\n</div>\n\n<section class="trend-row" style="animation: sobe .4s ease .06s both;">')
    
    # Wait, the structure is:
    # <div class="kpi-grid">
    # @for (k of vm.kpis; track k.rot) {
    # <div style="padding:20px; ..."> ... </div>
    # }
    # </div>
    
    if kpi_start != -1:
        # find the end of the @for loop. It's simply replacing the inner block.
        # But wait, there is also the hero section right before the kpi-grid. Let's just use regex.
        pass
        
    content = re.sub(
        r'@for \(k of vm\.kpis; track k\.rot\) \{[\s\S]*?(?=\}\s*</div>\s*</div>)',
        '''@for (k of vm.kpis; track k.rot) {
<app-kpi-stat-card 
  [title]="k.rot" 
  [value]="k.valor" 
  [barra]="k.barra" 
  [sub]="k.sub" 
  [nota]="k.nota"
  [tone]="'primary'">
</app-kpi-stat-card>
}''', content)

    with open('c:\\Users\\Raí\\Downloads\\prefs\\painel-semapa\\src\\app\\app.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    fix_html()
