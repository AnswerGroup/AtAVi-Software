# AtAVi-Site

## Configurazione Amministrazione
1. Aprire un terminale ed eseguire il comando
```sh
$ aws apigateway get-rest-api --get-rest-apis --region eu-west-1
```
2. Copiare l'ID relativo all'api **AtAVi** sostituendolo a [YOUR_API_ID] nel file situato in:
  * /admin/site/modules/module.js
  
## Esecuzione pannello di amministrazione
Questo è il pannello di controllo, per far partire il pannello di amministrazione eseguire i comandi:
```sh
$ npm install 
$ node server.js
```

Aprire il browser all'indirizzo https://localhost:8080/
