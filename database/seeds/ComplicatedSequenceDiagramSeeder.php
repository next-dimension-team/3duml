<?php

use Illuminate\Database\Seeder;
use App\Models\Interaction;
use App\Models\InteractionOperand;
use App\Models\Lifeline;
use App\Models\OccurrenceSpecification;
use App\Models\Message;
use App\Models\CombinedFragment;
use App\Models\InteractionFragment;
use App\Models\ExecutionSpecification;
use App\Models\Layer;

/*
 * Original sequence diagram
 * 
 */
class ComplicatedSequenceDiagramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        // Create layer
        $layer = factory(Layer::class)->create([
            'depth' => 0,
        ]);

        // Create root interaction
        $root = factory(Interaction::class)->create([
            'name' => 'Complicated Sequence Diagram',
        ]);
        $rootF = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $root->id,
            'fragmentable_type' => 'interaction',
        ]);

        // Create lifelines
        $lifelineA = factory(Lifeline::class)->create([
            'name' => 'Life A',
            'layer_id' => $layer->id,
            'order' => 1,
        ]);
        $lifelineB = factory(Lifeline::class)->create([
            'name' => 'Life B',
            'layer_id' => $layer->id,
            'order' => 2,
        ]);
        $lifelineC = factory(Lifeline::class)->create([
            'name' => 'Life C',
            'layer_id' => $layer->id,
            'order' => 3,
        ]);
        $lifelineD = factory(Lifeline::class)->create([
            'name' => 'Life D',
            'layer_id' => $layer->id,
            'order' => 4,
        ]);

        // Lifeline A Occurrence Specifications
        $ocA1 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineA->id,
            'order' => 1,
        ]);
        $ocA2 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineA->id,
            'order' => 2,
        ]);
        $ocA3 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineA->id,
            'order' => 3,
        ]);

        // Lifeline A Execution Specifications
        $esA1 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocA1->id,
            'finish_occurrence_specification_id' => $ocA2->id,
        ]);
        $esA1F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esA1->id,
            'fragmentable_type' => 'execution_specification',
        ]);
        $esA1F->makeChildOf($rootF);
        
        $esA2 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocA3->id,
            'finish_occurrence_specification_id' => $ocA3->id,
        ]);
        $esA2F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esA2->id,
            'fragmentable_type' => 'execution_specification',
        ]);
        $esA2F->makeChildOf($rootF);

        // Lifeline B Occurrence Specifications
        $ocB1 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'order' => 1,
        ]);
        $ocB2 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'order' => 2,
        ]);
        $ocB3 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'order' => 3,
        ]);

        // Lifeline B Execution Specifications
        $esB1 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocB1->id,
            'finish_occurrence_specification_id' => $ocB3->id,
        ]);
        $esB1F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esB1->id,
            'fragmentable_type' => 'execution_specification',
        ]);
        $esB1F->makeChildOf($rootF);

        // Lifeline C Occurrence Specifications
        $ocC1 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'order' => 1,
        ]);
        $ocC2 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'order' => 2,
        ]);
        $ocC3 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'order' => 3,
        ]);
        $ocC4 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'order' => 4,
        ]);

        // Lifeline C Execution Specifications
        $esC1 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocC1->id,
            'finish_occurrence_specification_id' => $ocC3->id,
        ]);
        $esC1F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esC1->id,
            'fragmentable_type' => 'execution_specification',
        ]);
        $esC1F->makeChildOf($rootF);

        $esC2 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocC4->id,
            'finish_occurrence_specification_id' => $ocC4->id,
        ]);
        $esC2F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esC2->id,
            'fragmentable_type' => 'execution_specification',
        ]);
        $esC2F->makeChildOf($rootF);

         // Lifeline D Occurrence Specifications
        $ocD1 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineD->id,
            'order' => 1,
        ]);
        $ocD2 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineD->id,
            'order' => 2,
        ]);

        // Lifeline D Execution Specifications
        $esD1 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocD1->id,
            'finish_occurrence_specification_id' => $ocD1->id,
        ]);
        $esD1F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esD1->id,
            'fragmentable_type' => 'execution_specification',
        ]);
        $esD1F->makeChildOf($rootF);

        $esD2 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocD2->id,
            'finish_occurrence_specification_id' => $ocD2->id,
        ]);
        $esD2F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esD2->id,
            'fragmentable_type' => 'execution_specification',
        ]);
        $esD2F->makeChildOf($rootF);

        // Messages
        $message1 = factory(Message::class)->create([
            'name' => 'a()',
            'sort' => 'synchCall',
            'interaction_id' => $root->id,
            'send_event_id' => $ocA1->id,
            'receive_event_id' => $ocB1->id,
        ]);
        $message2 = factory(Message::class)->create([
            'name' => 'b()',
            'sort' => 'synchCall',
            'interaction_id' => $root->id,
            'send_event_id' => $ocB2->id,
            'receive_event_id' => $ocC1->id,
        ]);
        $message3 = factory(Message::class)->create([
            'name' => 'e()',
            'sort' => 'synchCall',
            'interaction_id' => $root->id,
            'send_event_id' => $ocC2->id,
            'receive_event_id' => $ocD1->id,
        ]);
        $message4 = factory(Message::class)->create([
            'name' => 'c()',
            'sort' => 'synchCall',
            'interaction_id' => $root->id,
            'send_event_id' => $ocC3->id,
            'receive_event_id' => $ocB3->id,
        ]);
        $message5 = factory(Message::class)->create([
            'name' => 'd()',
            'sort' => 'asynchCall',
            'interaction_id' => $root->id,
            'send_event_id' => $ocC4->id,
            'receive_event_id' => $ocA2->id,
        ]);
        $message6 = factory(Message::class)->create([
            'name' => 'f()',
            'sort' => 'asynchCall',
            'interaction_id' => $root->id,
            'send_event_id' => $ocA3->id,
            'receive_event_id' => $ocD2->id,
        ]);
    }
}
