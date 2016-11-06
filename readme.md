<a href="http://team15-16.studenti.fiit.stuba.sk:8085/browse/UML-PROD">Build status: <img src="http://team15-16.studenti.fiit.stuba.sk:8085/plugins/servlet/buildStatusImage/UML-PROD"></a>

# 3D UML

## Next Dimension Team

### Inštalácia na linuxe

Potrebuejete mať nainštalované:
 - PHP > 5.6
 - gulp
 - composer
 - npm

```
$ git clone https://github.com/next-dimension-team/3duml
$ cd 3duml
$ composer install
$ sudo chmod -R 777 storage/
$ sudo chmod -R 777 bootstrap/cache/
$ cp .env.example .env
$ php artisan key:generate
$ npm install
$ npm install typings --global
$ typings install
```

# TSLint sa spúšťa nasledovne
```
$ tslint ./resources/assets/js/**/*.ts
```
