# MOVI — Architettura catalogo professionale (fase integrazione)

## Stato
L'app attuale è una web app statica su GitHub Pages: non può custodire credenziali API private. I 63 titoli di raccomandazione sono dimostrativi e Wikidata è la fonte aperta usata per la ricerca internazionale. Non è ancora attiva nessuna API commerciale.

## Fornitori candidati
- Watchmode: catalogo, metadati, disponibilità e deep link. Per pubblicità/abbonamenti occorre piano che consenta uso commerciale; verificare separatamente diritti e condizioni relativi alle immagini, trailer e IA.
- TMDB: occorre accordo commerciale scritto, esplicitamente compatibile con suggerimenti AI, monetizzazione, caching e immagini.
- IMDb: i dataset gratuiti sono limitati a uso non commerciale.

## Contratto suggerito per backend autorizzato
GET /api/catalog/search?q=...&country=IT&language=it-IT&type=movie|series&page=1
GET /api/catalog/title/:id?country=IT&language=it-IT
GET /api/catalog/discover?mood=...&maxMinutes=120&country=IT&type=movie&page=1
GET /api/catalog/providers?country=IT
POST /api/recommendations
Body: { mood, type, duration, likedIds, dislikedIds, watchedIds, providers, country:"IT", language:"it-IT" }

Ogni scheda normalizzata:
{ id, provider, sourceId, title, originalTitle, type, year, durationMinutes, genres, synopsisIt, posterUrl, posterRights, trailerUrl, trailerEmbedAllowed, watchOptions:[{service,country,offerType,deeplink,checkedAt}], metadataUpdatedAt }

## Sicurezza e conformità
- Conservare API key solo nel backend, mai nel repository GitHub Pages o Javascript pubblico.
- Autorizzare esplicitamente immagini, metadati, trailer e uso algoritmico/AI.
- Non inventare disponibilità, durata, traduzioni o trailer.
- Rendere revocabili i fornitori e gestire cache, quote e attribuzioni.
- Non usare la chiave developer non commerciale per monetizzare.
- Valutare privacy, GDPR, cancellazione dati e gestione consenso ads prima del lancio.

## Milestone
1. Confermare contratto commerciale e quota API sostenibile.
2. Deploy proxy server su piattaforma di hosting con secrets.
3. Collegare la ricerca MOVI ai risultati normalizzati del backend.
4. Aggiungere discovery e ranking su dati licenziati.
5. Audit dei diritti immagini/trailer e solo dopo advertising.
