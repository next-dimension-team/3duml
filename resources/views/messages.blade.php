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
			{!! Form::label('message_kind', 'Message_kind:') !!}
			{!! Form::text('message_kind') !!}
		</li>
		<li>
			{!! Form::label('message_sort', 'Message_sort:') !!}
			{!! Form::text('message_sort') !!}
		</li>
		<li>
			{!! Form::label('interaction_id', 'Interaction_id:') !!}
			{!! Form::text('interaction_id') !!}
		</li>
		<li>
			{!! Form::submit() !!}
		</li>
	</ul>
{!! Form::close() !!}