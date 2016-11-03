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
			{!! Form::label('specifications_id', 'Specifications_id:') !!}
			{!! Form::text('specifications_id') !!}
		</li>
		<li>
			{!! Form::label('specifications_type', 'Specifications_type:') !!}
			{!! Form::text('specifications_type') !!}
		</li>
		<li>
			{!! Form::label('orderings_id', 'Orderings_id:') !!}
			{!! Form::text('orderings_id') !!}
		</li>
		<li>
			{!! Form::label('orderings_type', 'Orderings_type:') !!}
			{!! Form::text('orderings_type') !!}
		</li>
		<li>
			{!! Form::submit() !!}
		</li>
	</ul>
{!! Form::close() !!}