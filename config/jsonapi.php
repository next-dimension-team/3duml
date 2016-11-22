<?php

use App\Transformers\LifelineTransformer;
use App\Transformers\MessageTransformer;
use App\Transformers\OccurrenceSpecificationTransformer;
use App\Transformers\InteractionTransformer;
use App\Transformers\InteractionFragmentTransformer;
use App\Transformers\InteractionOperandTransformer;
use App\Transformers\CombinedFragmentTransformer;
use App\Transformers\ExecutionSpecificationTransformer;

return [
    LifelineTransformer::class,
    MessageTransformer::class,
    OccurrenceSpecificationTransformer::class,
    InteractionTransformer::class,
    InteractionFragmentTransformer::class,
    InteractionOperandTransformer::class,
    CombinedFragmentTransformer::class,
    ExecutionSpecificationTransformer::class,
];
