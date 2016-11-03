{!! Form::open(array('route' => 'route.name', 'method' => 'POST')) !!}
	<ul>
		<li>
			{!! Form::label('name', 'Name:') !!}
			{!! Form::text('name') !!}
		</li>
		<li>
			{!! Form::label('qualified_name', 'Qualified_name:') !!}
			{!! Form::text('qualified_name') !!}
		</li>
		<li>
			{!! Form::label('visibility', 'Visibility:') !!}
			{!! Form::text('visibility') !!}
		</li>
		<li>
			{!! Form::label('lifeline_id', 'Lifeline_id:') !!}
			{!! Form::text('lifeline_id') !!}
		</li>
		<li>
			{!! Form::label('order', 'Order:') !!}
			{!! Form::text('order') !!}
		</li>
		<li>
			{!! Form::submit() !!}
		</li>
	</ul>
{!! Form::close() !!}