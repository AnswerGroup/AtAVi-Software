# Lambda
Questa cartella contiene tutte le risorse necessarie per eseguire deployment e testing delle lambda function, sono inoltre presenti degli script che automatizzano i processi più tediosi.

**N.B.** Le seguenti istruzioni hanno come pre-requisito avere configurato correttamente il proprio account AWS ed Apex.

## Azioni preliminari
Per poter utilizzare gli script presenti in questa directory sarà necessario aprire il terminale ed installare le dipendenze nel seguente modo
```sh
$ npm install
```

___

## Guida al deployment
### Installare **solo** le dipendenze utili al **deployment**
Lanciare un terminale nella directory corrente ed eseguire il seguente comando
```sh
$ npm run install-prod
```

### Eliminare le dipendenze **non** utili al **deployment**
Se in precedenza sono state installate anche le dipendenze "sviluppatore" sarà meglio eseguire il seguente comando prima di effetuare il deployment in quanto tali dipendenze non sono rilevanti in fase di deployment
```sh
$ npm run prune-dev
```

### Deployment Lambda functions

* Dirigersi in **lambda-functions/admin-functions/auth** e digitare sul terminale il seguente comando
```sh
$ apex deploy -E env.json
```
* Dirigersi in **lambda-functions/admin-functions/rules** e digitare sul terminale il seguente comando
```sh
$ apex deploy -E env.json
```
_env.json_ deve contenere la chiave con cui si vogliono firmare i JWT. Essi sono necessari per una comunicazione sicura fra Front-End e AWS Lambda.

* Dirigersi in **lambda-functions/skill-functions** e digitare sul terminale il seguente comando
```sh
$ apex deploy
```
* Dirigersi in **lambda-functions/util-functions** e digitare sul terminale il seguente comando
```sh
$ apex deploy
```
___

## Guida al testing

### Installare tutte le dipendenze
```sh
$ npm run install-all
$ sudo npm install -g mocha
$ sudo npm install -g istanbul
```

### Lanciare DynamoDB in locale
1. Scaricare [DynamoDB Local](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html)
2. Scompattare l'archivio scaricato
3. Dirigersi nella cartella dynamodb\_local\_latest
4. Eseguire il comando
```sh
$ java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -port 8000
```
Il processo deve restare in esecuzione durante tutta la fase di testing. Per interrompere il processo digitare CTRL + C nel terminale.
### Configurare il database locale
Lanciare un terminale nella directory corrente ed eseguire il comando
```sh
$ npm run configure
```

### Testing e code coverage
Per effettuare i test sulle funzioni lambda eseguire il comando
```
$ npm run test
```

Per verificare code/branch/function/statement coverage eseguire il comando
```sh
$ npm run cover
```
