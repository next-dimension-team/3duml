<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>3D UML</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css" />
        @if (file_exists(public_path('build/dll')))
            <script type="text/javascript" src="{!! mix('dll/polyfills.dll.js', 'build') !!}"></script>
            <script type="text/javascript" src="{!! mix('dll/vendor.dll.js', 'build') !!}"></script>
        @endif
        <script type="text/javascript" src="{!! mix('polyfills.bundle.js', 'build') !!}"></script>
        <script type="text/javascript" src="{!! mix('vendor.bundle.js', 'build') !!}"></script>
        <script type="text/javascript" src="{!! mix('main.bundle.js', 'build') !!}"></script>
    </head>
    <body>
		<app-root>Loading...</app-root>
    </body>
</html>
