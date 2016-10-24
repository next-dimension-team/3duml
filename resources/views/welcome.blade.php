
<!DOCTYPE html>
<html lang="en">
     
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>3D UML</title>
        <link href="{!! elixir('css/app.css') !!}" rel="stylesheet" type="text/css">
		<script src='js/functions.js'></script>
    </head>
    <body>
		<div id="mySidenav" class="sidenav">
		<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
		<a href="#" id="layer">Add layer</a>
		<a href="#">Add arrow</a>
		<a href="#" id="lifeline">Add lifeline</a>
		<a href="#">Remove layer</a>
		</div>

		<span style="font-size:30px;cursor:pointer" class="menu" onclick="openNav()">&#9776; Menu</span>

       <script type="text/javascript" src="{!! elixir('js/bundle.js') !!}"></script>
    </body>
</html>
