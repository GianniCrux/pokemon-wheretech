Gotta Catch Em All! 


Pokemon Wheretech è un gioco d'avventura Pokémon basato sul web, costruito utilizzando React e altre tecnologie web. I giocatori possono esplorare una mappa a griglia, incontrare Pokémon selvatici e scegliere se catturarli o lasciarli andare. Il gioco include funzionalità come il salvataggio e il caricamento dello stato del gioco, un registro degli eventi di gioco e meccaniche di movimento di base.

Funzionalità
1. Generazione della Mappa
La mappa viene generata dinamicamente e consiste in box che rappresentano diversi terreni come l'erba e l'acqua.
La posizione iniziale del giocatore è posizionata al centro della mappa.
Il movimento sulla mappa è consentito utilizzando i tasti freccia, con restrizioni che impediscono ai giocatori di camminare sull'acqua.
2. Incontri con Pokémon Selvatici
Mentre si muove sulla mappa, il giocatore ha una probabilità del 20% di incontrare un Pokémon selvatico quando cammina su una tessera d'erba.
Quando appare un Pokémon, compare un messaggio di notifica (toast) al centro dello schermo con l'immagine del Pokémon e il giocatore può scegliere se catturarlo o lasciarlo andare.
3. Sistema di Cattura dei Pokémon
I giocatori possono scegliere di catturare i Pokémon selvatici. I Pokémon catturati vengono aggiunti alla lista di Pokémon catturati dal giocatore.
I giocatori possono anche scegliere di lasciare andare il Pokémon, e l'evento sarà registrato nel registro di gioco.
4. Registro degli Eventi di Gioco
Un registro di gioco semplice tiene traccia degli eventi chiave, come la cattura o il rilascio di un Pokémon. Vengono mostrati solo gli ultimi 10 eventi.
5. Salvataggio e Caricamento dello Stato del Gioco su LocalStorage
Lo stato del gioco (compresa la mappa, la posizione del giocatore, i Pokémon catturati e il registro degli eventi) viene salvato automaticamente su localStorage ogni volta che si verifica un cambiamento nel gioco.
Quando il gioco viene caricato, lo stato salvato viene recuperato da localStorage per consentire ai giocatori di continuare da dove avevano lasciato.
6. Esportazione e Importazione dello Stato del Gioco
I giocatori possono esportare lo stato del gioco corrente come un file JSON, permettendo di salvare i progressi al di fuori del browser.
I giocatori possono anche importare stati di gioco precedentemente salvati da un file JSON, ripristinando il gioco a quello stato esatto.
Tecnologie Utilizzate
React: Framework principale utilizzato per costruire l'interfaccia e la funzionalità dell'app.
React Hot Toast: Utilizzato per mostrare notifiche (toast) per eventi come incontri con Pokémon e azioni riuscite.
PokéAPI: API esterna utilizzata per recuperare le immagini dei Pokémon.
LocalStorage: Sistema di storage del browser per salvare e caricare automaticamente i progressi di gioco.
Come Funziona
Generazione della Mappa
La mappa viene generata dinamicamente utilizzando il componente MapGeneration, che crea una griglia di tessere che rappresentano l'ambiente. Ogni tessera è contrassegnata come erba o acqua. La posizione del giocatore è inizializzata al centro della mappa.

Movimento
I giocatori possono muoversi utilizzando i tasti freccia, e il movimento è limitato alle tessere d'erba. Se il giocatore tenta di muoversi su una tessera d'acqua, viene mostrato un errore.

Incontri con Pokémon
Quando un giocatore si muove su una tessera d'erba, ha una probabilità del 20% di incontrare un Pokémon selvatico. Quando si verifica un incontro, l'immagine del Pokémon viene recuperata dall'API Poké e mostrata in un messaggio al centro dello schermo che chiede al giocatore se vuole catturare o rilasciare il Pokémon.

Cattura dei Pokémon
Se un giocatore sceglie di catturare il Pokémon, viene aggiunto alla sua lista di Pokémon catturati. Se il giocatore lascia andare il Pokémon, l'evento viene registrato e l'incontro termina.

Registro degli Eventi di Gioco
Gli eventi chiave del gioco, come la cattura o il rilascio di un Pokémon, vengono visualizzati nel registro di gioco, che mantiene gli ultimi 10 eventi.

Salvataggio e Caricamento dello Stato del Gioco
Lo stato del gioco (mappa, posizione del giocatore, Pokémon catturati e registro degli eventi) viene automaticamente salvato su localStorage ogni volta che cambia. Quando il gioco viene avviato, controlla se c'è uno stato di gioco salvato e lo carica.

Esportazione e Importazione dello Stato del Gioco
Utilizzando il componente GameStateManager, i giocatori possono esportare lo stato di gioco corrente come un file JSON, che può essere salvato localmente. I giocatori possono anche importare uno stato di gioco precedentemente salvato da un file JSON per continuare i loro progressi.


Futuri miglioramenti o cose che avrei voluto aggiungere ora: 
- Sistema di combattimento
- Gestione dell'inventario dei pokemon
- Log più dettagliato 
- Miglioramenti grafici e bug del toast message

Per eseguire il prodotto basta clonare la repository di git hub, 
posizionarsi nella cartella appena clonata e usare prima npm install e poi npm start. 