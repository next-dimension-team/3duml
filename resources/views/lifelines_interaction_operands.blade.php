{!! Form::open(array('route' => 'route.name', 'method' => 'POST')) !!}
	<ul>
		<li>
			{!! Form::label('lifeline_id', 'Lifeline_id:') !!}
			{!! Form::text('lifeline_id') !!}
		</li>
		<li>
			{!! Form::label('interaction_operand_id', 'Interaction_operand_id:') !!}
			{!! Form::text('interaction_operand_id') !!}
		</li>
		<li>
			{!! Form::submit() !!}
		</li>
	</ul>
{!! Form::close() !!}