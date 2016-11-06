<?php

namespace App\Providers;

use NilPortugues\Laravel5\JsonApi\JsonApiSerializer;
use NilPortugues\Laravel5\JsonApi\Laravel5JsonApiServiceProvider;
use NilPortugues\Laravel5\JsonApi\Providers\Laravel51Provider;
use NilPortugues\Laravel5\JsonApi\Providers\Laravel52Provider;

class JSONAPIServiceProvider extends Laravel5JsonApiServiceProvider
{
    const DIR = 'vendor/nilportugues/laravel5-json-api/src/NilPortugues/Laravel5/JsonApi';

    /**
     * Register the service provider.
     */
    public function register()
    {
        $this->mergeConfigFrom(base_path(self::DIR.self::PATH), 'jsonapi');

        $version = '5.0.0';
        if (class_exists(self::LARAVEL_APPLICATION, true)) {
            $class = self::LARAVEL_APPLICATION;
            $version = $class::VERSION;
        }

        switch ($version) {
          case false !== strpos($version, '5.0.'):
          case false !== strpos($version, '5.1.'):
              $provider = new Laravel51Provider();
              break;
            case false !== strpos($version, '5.2.'):
            case false !== strpos($version, '5.3.'):
                $provider = new Laravel52Provider();
                break;
          default:
              throw new \RuntimeException(
                  sprintf('Laravel version %s is not supported. Please use the 5.1 for the time being', $version)
              );
              break;
      }

        $this->app->singleton(JsonApiSerializer::class, $provider->provider());
    }
}
