# MOVI Together 2.0 — Stanze sincronizzate (beta)

Il frontend GitHub Pages è già predisposto: se non è configurato un backend, la funzione online rimane disabilitata e il precedente voto tramite link continua a funzionare.

## Attivazione
1. Pubblica la cartella `together-server/` come servizio Node.js su un host HTTPS che supporti processi sempre attivi, impostando root directory `together-server`, comando `npm start` e la variabile `MOVI_ORIGIN=https://marinoguido2017-beep.github.io`.
2. Verifica `https://TUO-SERVER/health` (deve rispondere `{"ok":true}`).
3. Aggiorna il file pubblico `together-config.js` con `window.MOVI_TOGETHER_API = {apiBase:"https://TUO-SERVER"};` (senza slash finale).
4. Carica MOVI e crea una stanza dalla sezione Coppia.

## Funzionamento
- Una stanza contiene esattamente 5 titoli, selezionati tra i 63 film locali.
- L'host riceve un codice di 8 caratteri, da condividere con un altro dispositivo.
- Ogni persona può votare sì/no; i due dispositivi verificano gli aggiornamenti ogni circa 3,5 secondi.
- Il risultato appare dopo 5 voti per ciascuna persona.
- Le stanze durano 2 ore, o fino al riavvio del servizio.
- Nessuna registrazione, nessun trailer o catalogo commerciale necessario.

## Sicurezza e limiti
**Beta non adatta a un lancio pubblico ad alto traffico**: memoria volatile, niente rate limiting, nessuna protezione anti-abuso, nessuna persistenza e capienza fino a 1000 stanze. Il codice stanza non è una password: condividilo soltanto con una persona fidata. Non inserire dati personali nei codici. Il token di accesso alla stanza rimane soltanto in memoria sul dispositivo.
Prima di monetizzare: aggiungere rate limits, autenticazione/room tokens robusti, database con scadenza, logging minimo, informativa privacy, monitoraggio e gestione errori. I piani free di hosting potrebbero andare in sleep, imporre limiti o richiedere un metodo di pagamento. Non assumere gratuità illimitata.
