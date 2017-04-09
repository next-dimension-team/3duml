![Build Status](http://team15-16.studenti.fiit.stuba.sk:8085/plugins/servlet/wittified/build-status/UML-PROD)
![Production Deployment](http://team15-16.studenti.fiit.stuba.sk:8085/plugins/servlet/wittified/deploy-status/1081345)

# 3D UML

## Next Dimension Team

### Inštalácia na linuxe

Potrebuejete mať nainštalované:
 - Apache 2
 - PHP > 5.6
 - npm
 - composer

```
$ git clone https://github.com/next-dimension-team/3duml
$ cd 3duml
$ composer install
$ sudo chmod -R 777 storage/
$ sudo chmod -R 777 bootstrap/cache/
$ cp .env.example .env
$ php artisan key:generate
$ npm install
```

### Development server
- pri vývoji možno spustiť development server s možnosťou detekcie zmien,
rekompilácie a automatického reloadu v prehliadači bez potreby spúšťania buildu (hot module replacement)
- spúsťa sa na `http://localhost:8080/` súčasne s Laravel development serverom ako proxy pre backend na `http://127.0.0.1:8000`
```
$ npm run start:hmr
```
### Build
- predvolne sa spúšťa development konfigurácia nasledovne
```
$ npm run build
```
- pre zmenu url pre požiadavky na backend API (predvolene: `http://localhost/`) ak chceme spustiť aplikáciu napríklad na Laravel development serveri
```
$ HOST=127.0.0.1 PORT=8000 npm run build
```
- spustenie buildu s produkčným nastavením
```
$ npm run build:prod
```
- následne možno prejsť na localhost ak máme nainštalovaný Apache alebo spustiť Laravel development server
```
$ php artisan serve
```

### Codestyle - TSLint
```
$ npm run lint
```

### Codestyle - PHP CS Fixer
#### Zobrazí problémy štýlu kódu
```
$ php-cs-fixer fix --dry-run --diff
```
#### Opraví problémy štýlu kódu
```
$ php-cs-fixer fix
```

### Clean
- príkazom možno prečistiť zložku projektu (node_modules, build)
```
$ npm run clean
```

### Seed sekvenčných diagramov
#### Minimal
```
$ php artisan migrate:refresh
$ php artisan db:seed --class MinimalSequenceDiagramSeeder
```

### Dialogove okno
```
let confirmDialog = this.inputService.createConfirmDialog("Test confirm", "Confirm it");

confirmDialog.componentInstance.onYes.subscribe(result => {
  console.log("Confirm dialog - YES");
});

confirmDialog.componentInstance.onNo.subscribe(result => {
  console.log("Confirm dialog - NO");
});
```

### Vzor kontroléra
```
import { Injectable } from '@angular/core';
import { DialogService } from '../../dialog/services';
import { Datastore } from '../../datastore';
import * as M from '../../sequence-diagram/models';

@Injectable()
export class SomeController {

  constructor(
    protected dialogService: DialogService,
    protected datastore: Datastore
  ) {
    //
  }

  /*
   * Create operation
   */
  public someOperaion(callback?: any): void {
    this.dialogService.createInputDialog("Creating diagram", "", "Enter name of new digram.")
      .componentInstance.onOk.subscribe(name => {
        
        let interaction = this.datastore.createRecord(M.Interaction, {
          name: name
        });

      })
  }

}
```