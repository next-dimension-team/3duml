<?php

use Illuminate\Database\Seeder;
use App\Models\Message;
use App\Models\Lifeline;
use App\Models\Interaction;
use App\Models\CombinedFragment;
use App\Models\InteractionOperand;
use App\Models\InteractionFragment;
use App\Models\OccurrenceSpecification;
use App\Models\ExecutionSpecification;

/*
 * Original sequence diagram on link: https://postimg.org/image/urtp7bhup/
 * note: extension spec. are not exactly same in seed as there. 
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

        // Create root interaction
        $root = factory(Interaction::class)->create([
            'name' => 'Complicated Sequence Diagram',
        ]);
        $rootF = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $root->id,
            'fragmentable_type' => 'interaction',
        ]);

        // Create interactions
        $interactionA = factory(Interaction::class)->create([
            'name' => 'Interaction A',
        ]);
        $interactionFragmentA = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($interactionA),
            function ($interactionFragmentA) {
                $interactionFragmentA->save();
            }
        );
        $interactionFragmentA->makeChildOf($rootF);

        // Create lifelines
        $lifelineA = factory(Lifeline::class)->create([
            'name' => 'Life A',
            'order' => 1,
        ]);
        $lifelineB = factory(Lifeline::class)->create([
            'name' => 'Life B',
            'order' => 2,
        ]);
        $lifelineC = factory(Lifeline::class)->create([
            'name' => 'Life C',
            'order' => 3,
        ]);
        $lifelineD = factory(Lifeline::class)->create([
            'name' => 'Life D',
            'order' => 4,
        ]);

        // Lifeline A Occurrence Specifications
        $ocA1 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineA->id,
            'time' => 1,
        ]);
        $ocA2 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineA->id,
            'time' => 5,
        ]);
        $ocA3 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineA->id,
            'time' => 6,
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
        $esA1F->makeChildOf($interactionFragmentA);
        
        $esA2 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocA3->id,
            'finish_occurrence_specification_id' => $ocA3->id,
        ]);
        $esA2F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esA2->id,
            'fragmentable_type' => 'execution_specification',
        ]);
        $esA2F->makeChildOf($interactionFragmentA);

        // Lifeline B Occurrence Specifications
        $ocB1 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 1,
        ]);
        $ocB2 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 2,
        ]);
        $ocB3 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 4,
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
        $esB1F->makeChildOf($interactionFragmentA);

        // Lifeline C Occurrence Specifications
        $ocC1 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'time' => 2,
        ]);
        $ocC2 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'time' => 3,
        ]);
        $ocC3 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'time' => 4,
        ]);
        $ocC4 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'time' => 5,
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
        $esC1F->makeChildOf($interactionFragmentA);

        $esC2 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocC4->id,
            'finish_occurrence_specification_id' => $ocC4->id,
        ]);
        $esC2F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esC2->id,
            'fragmentable_type' => 'execution_specification',
        ]);
        $esC2F->makeChildOf($interactionFragmentA);

         // Lifeline D Occurrence Specifications
        $ocD1 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineD->id,
            'time' => 3,
        ]);
        $ocD2 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineD->id,
            'time' => 6,
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
        $esD1F->makeChildOf($interactionFragmentA);

        $esD2 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocD2->id,
            'finish_occurrence_specification_id' => $ocD2->id,
        ]);
        $esD2F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esD2->id,
            'fragmentable_type' => 'execution_specification',
        ]);
        $esD2F->makeChildOf($interactionFragmentA);

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