# AtAVi - Accoglienza tramite Assitente Virtuale

## Installazione

### Pre - requisiti
In questa guida non verranno trattati i seguenti punti, tuttavia essi sono necessari per il funzionamento e la manutenzione di AtAVi
 * Installare [Node.js](https://nodejs.org/it/download/)
 * Registrare un account su [Amazon Web Services](https://aws.amazon.com/it/)
 * installare e configurare [AWS Command Line Interface](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)
 * installare e configurare [Apex](https://apex.run)

### Configurazione AtAVi
1. Eseguire il seguente comando
```sh
$ node aws-configure.js
```

2. Copiare l'ARN del Topic SNS ottenuto dal comando precedente ed incollarlo nella variabile presente in cima al file situato in:
  * /lambda/lambda-functions/skill-functions/functions/core/index.js
  
3. Copiare l'ARN del ruolo ottenuto dallo script precedente ed incollarlo nella voce "role" del file json situato in:
  * /lambda/lambda-functions/admin-functions/auth/project.json
  * /lambda/lambda-functions/admin-functions/rules/project.json
  * /lambda/lambda-functions/util-functions/project.json
  * /lambda/lambda-functions/skill-fuctions/project.json

4. Creare o copiare un [Incoming Webhook](https://my.slack.com/services/new/incoming-webhook/) su Slack ed incollarlo nella variabile presente in cima al file in:
  * /lambda/lambda-functions/util-functions/functions/sendSlack/index.js
  
5. Cambiare (nel caso in cui si ritenga opportuno) il canale slack di default (#general), la variabile si trova in cima al file
  * /lambda/lambda-functions/skill-functions/functions/core/index.js
  
### Configurazione Amministrazione
Dentro alla cartella /admin/ è presente un file README con le istruzioni per la configurazione del pannello di amministrazione

### Deployment del codice
Dentro alla cartella /lambda/ è presente un file README con le istruzioni per il deployment e il testing delle lambda functions.

## Reset configurazioni AWS
Se per qualche motivo servisse cancellare le modifiche fatte da *aws-configure.js* seguire le istruzioni riportate di seguito:

1. Aprire il file *aws-reset.js* modificare in cima al codice le variabili insernendo l'id del topic SNS da cancellare e l'id dell API da cancellare (tali dati possono essere trovati nel pannelli di amministrazione di AWS e nei file modificati manualmente in fase di configurazione.

2. Eseguire il comando
```sh
$ node aws-reset.js
```
3. Eseguire i comando
```sh
$ aws lambda delete-function --function-name util_addCur

$ aws lambda delete-function --function-name util_addCustomer

$ aws lambda delete-function --function-name util_checkConstraints

$ aws lambda delete-function --function-name skill_core

$ aws lambda delete-function --function-name rules_updateEmployeeRule

$ aws lambda delete-function --function-name rules_updateCustomerRule

$ aws lambda delete-function --function-name rules_getCustomerRule

$ aws lambda delete-function --function-name rules_getAllEmployeeRules

$ aws lambda delete-function --function-name rules_addCustomerRule

$ aws lambda delete-function --function-name rules_getEmployeeRule

$ aws lambda delete-function --function-name rules_deleteCustomerRule
	  
$ aws lambda delete-function --function-name rules_deleteEmployeeRule
  
$ aws lambda delete-function --function-name rules_addEmployeeRule

$ aws lambda delete-function --function-name rules_getAllCustomerRules
```

