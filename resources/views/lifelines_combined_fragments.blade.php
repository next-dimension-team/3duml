{!! Form::open(array('route' => 'route.name', 'method' => 'POST')) !!}
	<ul>
		<li>
			{!! Form::label('combined_fragment_id', 'Combined_fragment_id:') !!}
			{!! Form::text('combined_fragment_id') !!}
		</li>
		<li>
			{!! Form::label('lifeline_id', 'Lifeline_id:') !!}
			{!! Form::text('lifeline_id') !!}
		</li>
		<li>
			{!! Form::submit() !!}
		</li>
	</ul>
{!! Form::close() !!}