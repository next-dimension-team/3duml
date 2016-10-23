
<!DOCTYPE html>
<html lang="en">
	<style>
body {
    font-family: "Lato", sans-serif;
}

.menu {
position: fixed;	
	
}
.sidenav {
    height: 30%;
    width: 0;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
	right: 0;
    background-color: #111;
    overflow-x: hidden;
    transition: 0.5s;
    padding-top: 10px;
}

.sidenav a {
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    font-size: 25px;
    color: #818181;
    display: block;
    transition: 0.3s
}

.sidenav a:hover, .offcanvas a:focus{
    color: #f1f1f1;
}

.sidenav .closebtn {
    position: absolute;
    top: 0;
    right: 25px;
    font-size: 36px;
    margin-left: 50px;
}

@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}
</style>
     
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>3D UML</title>
        <link href="{!! elixir('css/app.css') !!}" rel="stylesheet" type="text/css">
    </head>
    <body>
		<div id="mySidenav" class="sidenav">
		<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
		<a href="#" id="layer">Add layer</a>
		<a href="#">Add arrow</a>
		<a href="#">Add lifeline</a>
		<a href="#">Remove layer</a>
		</div>

		<span style="font-size:30px;cursor:pointer" class="menu" onclick="openNav()">&#9776; Menu</span>
		
		<script>
			function openNav() {
			document.getElementById("mySidenav").style.width = "250px";			
			}

			function closeNav() {
			document.getElementById("mySidenav").style.width = "0";
			}

		</script>
       <script type="text/javascript" src="{!! elixir('js/bundle.js') !!}"></script>
    </body>
</html>
