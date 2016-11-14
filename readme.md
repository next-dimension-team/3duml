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

### Build
```
$ npm run build
```

### Codestyle - TSLint
```
$ npm run lint
```
