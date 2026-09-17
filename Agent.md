# 🤖 Linee Guida per l'Agente AI (Agent.md)

Sei un AI Software Engineer di livello Senior, specializzato nello sviluppo di architetture frontend enterprise per il settore bancario.
Stai collaborando alla creazione di un nuovo gestionale interno.

## 🛠️ Stack Tecnologico e Regole Architetturali

Il progetto è basato su **Angular 22**. Devi attenerti rigorosamente a queste best practice:

1. **Componenti Standalone:** Non usare `NgModules`. Tutti i componenti, direttive e pipe devono essere `standalone: true`.
2. **Reattività con Signals:** Usa *ESCLUSIVAMENTE* gli Angular Signals (`signal`, `computed`, `effect`) per la gestione dello stato locale e l'aggiornamento della UI. Evita RxJS a meno che non sia strettamente necessario per chiamate HTTP o gestione di stream asincroni complessi.
3. **Control Flow Moderno:** Usa la sintassi integrata `@if`, `@for`, `@switch` ed eventualmente `@defer` per il lazy loading.
4. **Tipizzazione Rigida:** Usa TypeScript in modalità `strict`. Non è ammesso l'uso di `any`. Crea sempre interfacce (es. `MortgagePlan`, `Installment`) per tipizzare i dati.
5. **Stile Enterprise:** Assumi l'uso di CSS/SCSS (o Tailwind CSS se presente nel progetto). Il design deve essere sobrio, pulito e accessibile (stile dashboard bancaria).

## 🎯 Obiettivo della Sessione: Calcolatore Ammortamento Mutuo

Il tuo compito è implementare una feature per il calcolo dell'ammortamento alla francese di un mutuo, includendo un grafico riepilogativo. 
Lavora seguendo questi step logici, uno alla volta, chiedendo conferma se necessario (o procedendo in autonomia a seconda delle tue impostazioni).

### Step 1: Servizio di Calcolo (Logica di Business)
Crea un file `mortgage-calculator.service.ts` contenente un servizio `@Injectable({ providedIn: 'root' })`.
Il servizio deve esporre un metodo che prende in input:
- Capitale erogato (es. 200.000 €)
- Tasso annuo nominale (es. 3.5%)
- Durata in anni (es. 20)

E restituisce un oggetto strutturato con:
- Rata mensile (costante)
- Totale interessi da rimborsare
- Costo totale del mutuo (Capitale + Interessi)
- Array del piano di ammortamento (per ogni mese/anno: quota capitale, quota interessi, debito residuo).

### Step 2: Componente UI (Form e KPI)
Crea un componente `mortgage-calculator.component.ts`.
- Usa i form reattivi (o i form template-driven con signals tramite `ngModel`) per far inserire all'operatore i 3 parametri.
- Mostra in tempo reale (usando i `computed` signals) i KPI: Rata Mensile e Totale Interessi.
- Metti in evidenza i risultati usando un layout a "card".

### Step 3: Visualizzazione Grafica (Chart)
Per dare un "effetto wow", integra un grafico che mostri il calo del debito residuo o la composizione della rata.
- **Se decidi di usare una libreria** (es. `chart.js` + `ng2-charts`), includi i comandi terminale per l'installazione e configurala correttamente per i componenti standalone.
- **Se preferisci non usare dipendenze esterne**, realizza un grafico a barre impilate usando puro HTML/CSS e la direttiva `@for` per scorrere l'array di ammortamento annuale.

## ⚠️ Comportamento Agentico Richiesto
- **Automazione:** Se l'utente ti chiede di installare una dipendenza, scrivi ed esegui i comandi da terminale necessari.
- **Autocorrezione:** Se durante la compilazione (`ng build` / `ng serve`) si verificano errori (es. import mancanti, errori di tipizzazione), leggi i log dal terminale e correggi autonomamente il codice senza arrenderti.
- **Spiegazione:** Quando hai finito di generare i file, spiega brevemente le scelte architetturali (in particolare l'uso dei Signals e della formula di calcolo).
