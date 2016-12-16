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

class FragmentsSequenceDiagramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $t = 40;

        // Create layer
        $layer = factory(Layer::class)->create([
            'depth' => 0,
        ]);

        // Create root interaction
        $root = factory(Interaction::class)->create([
            'name' => 'Fragments Sequence Diagram'
        ]);
        $rootF = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $root->id,
            'fragmentable_type' => 'interaction',
        ]);

        // Create lifelines
        $lifelineA = factory(Lifeline::class)->create([
            'name' => 'john: Person',
            'layer_id' => $layer->id
        ]);
        $lifelineB = factory(Lifeline::class)->create([
            'name' => 'anna: Person',
            'layer_id' => $layer->id
        ]);
        $lifelineC = factory(Lifeline::class)->create([
            'name' => 'bill: Person',
            'layer_id' => $layer->id
        ]);

        // Lifeline A Occurrence Specifications
        $ocA1 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineA->id,
            'time' => 7*$t
        ]);
        $ocA2 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineA->id,
            'time' => 9*$t
        ]);
        $ocA3 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineA->id,
            'time' => 14*$t
        ]);
        $ocA4 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineA->id,
            'time' => 15*$t
        ]);

        // Lifeline A Execution Specifications
        $esA1 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocA1->id,
            'finish_occurrence_specification_id' => $ocA1->id
        ]);
        $esA1F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esA1->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        $esA2 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocA2->id,
            'finish_occurrence_specification_id' => $ocA2->id
        ]);
        $esA2F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esA2->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        $esA3 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocA3->id,
            'finish_occurrence_specification_id' => $ocA4->id
        ]);
        $esA3F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esA3->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        // Lifeline B Occurrence Specifications
        $ocB1 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 4*$t
        ]);
        $ocB2 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 5*$t
        ]);
        $ocB3 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 9*$t
        ]);
        $ocB4 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 10*$t
        ]);
        $ocB5 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 12*$t
        ]);
        $ocB6 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 14*$t
        ]);
        $ocB7 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 17*$t
        ]);
        $ocB8 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 18*$t
        ]);
        $ocB9 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 20*$t
        ]);

        // Lifeline B Execution Specifications
        $esB1 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocB1->id,
            'finish_occurrence_specification_id' => $ocB2->id
        ]);
        $esB1F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esB1->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        $esB2 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocB3->id,
            'finish_occurrence_specification_id' => $ocB4->id
        ]);
        $esB2F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esB2->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        $esB3 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocB5->id,
            'finish_occurrence_specification_id' => $ocB5->id
        ]);
        $esB3F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esB3->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        $esB4 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocB6->id,
            'finish_occurrence_specification_id' => $ocB6->id
        ]);
        $esB4F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esB4->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        $esB5 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocB7->id,
            'finish_occurrence_specification_id' => $ocB8->id
        ]);
        $esB5F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esB2->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        $esB6 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocB9->id,
            'finish_occurrence_specification_id' => $ocB9->id
        ]);
        $esB6F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esB6->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        // Lifeline C Occurrence Specifications
        $ocC1 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'time' => 4*$t
        ]);
        $ocC2 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'time' => 5*$t
        ]);
        $ocC3 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'time' => 7*$t
        ]);
        $ocC4 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'time' => 10*$t
        ]);
        $ocC5 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'time' => 12*$t
        ]);
        $ocC6 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'time' => 15*$t
        ]);
        $ocC7 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'time' => 17*$t
        ]);
        $ocC8 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'time' => 18*$t
        ]);
        $ocC9 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'time' => 20*$t
        ]);

        // Lifeline C Execution Specifications
        $esC1 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocC1->id,
            'finish_occurrence_specification_id' => $ocC1->id
        ]);
        $esC1F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esC1->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        $esC2 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocC2->id,
            'finish_occurrence_specification_id' => $ocC2->id
        ]);
        $esC2F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esC2->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        $esC3 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocC3->id,
            'finish_occurrence_specification_id' => $ocC3->id
        ]);
        $esC3F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esC3->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        $esC4 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocC4->id,
            'finish_occurrence_specification_id' => $ocC4->id
        ]);
        $esC4F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esC4->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        $esC5 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocC5->id,
            'finish_occurrence_specification_id' => $ocC5->id
        ]);
        $esC5F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esC5->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        $esC6 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocC6->id,
            'finish_occurrence_specification_id' => $ocC6->id
        ]);
        $esC6F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esC6->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        $esC7 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocC7->id,
            'finish_occurrence_specification_id' => $ocC8->id
        ]);
        $esC7F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esC7->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        $esC8 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocC9->id,
            'finish_occurrence_specification_id' => $ocC9->id
        ]);
        $esC8F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esC8->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        // Messages
        factory(Message::class)->create([
            'name' => 'd()',
            'sort' => 'synchCall',
            'interaction_id' => $root->id,
            'send_event_id' => $ocA2->id,
            'receive_event_id' => $ocB3->id
        ]);
        factory(Message::class)->create([
            'name' => 'd()',
            'sort' => 'synchCall',
            'interaction_id' => $root->id,
            'send_event_id' => $ocB4->id,
            'receive_event_id' => $ocC4->id
        ]);

        // Create fragments

        // Opt
        $opt = factory(CombinedFragment::class)->create([
            'operator' => 'opt'
        ]);
        $optF = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $opt->id,
            'fragmentable_type' => 'combined_fragment',
        ]);
        $optF->makeChildOf($rootF);

        $optIO1 = factory(InteractionOperand::class)->create([
            'constraint' => 'N > 0'
        ]);
        $optIO1F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $optIO1->id,
            'fragmentable_type' => 'interaction_operand',
        ]);
        $optIO1F->makeChildOf($optF);

        // Opt interaction
        $optI = factory(Interaction::class)->create();
        $optIF = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $optI->id,
            'fragmentable_type' => 'interaction',
        ]);
        $optIF->makeChildOf($optIO1F);

        // Loop
        $loop = factory(CombinedFragment::class)->create([
            'operator' => 'loop'
        ]);
        $loopF = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $loop->id,
            'fragmentable_type' => 'combined_fragment',
        ]);
        $loopF->makeChildOf($optIF);

        // Loop Operand 1
        $loopIO1 = factory(InteractionOperand::class)->create([
            'constraint' => 'i < N'
        ]);
        $loopIO1F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $loopIO1->id,
            'fragmentable_type' => 'interaction_operand',
        ]);
        $loopIO1F->makeChildOf($loopF);

        // Loop interaction
        $interaction2 = factory(Interaction::class)->create();
        $interaction2F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $interaction2->id,
            'fragmentable_type' => 'interaction',
        ]);
        $interaction2F->makeChildOf($loopIO1F);

        // Alt
        $alt = factory(CombinedFragment::class)->create([
            'operator' => 'alt'
        ]);
        $altF = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $alt->id,
            'fragmentable_type' => 'combined_fragment',
        ]);
        $altF->makeChildOf($rootF);

        // Alt Operand 1
        $altIO1 = factory(InteractionOperand::class)->create([
            'constraint' => 'N > 0'
        ]);
        $altIO1F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $altIO1->id,
            'fragmentable_type' => 'interaction_operand',
        ]);
        $altIO1F->makeChildOf($altF);

        // Alt Operand 1 Interaction
        $altIO1I = factory(Interaction::class)->create();
        $altIO1IF = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $altIO1I->id,
            'fragmentable_type' => 'interaction',
        ]);
        $altIO1IF->makeChildOf($altIO1F);

        // Alt Operand 2
        $altIO2 = factory(InteractionOperand::class)->create([
            'constraint' => 'N <= 0'
        ]);
        $altIO2F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $altIO2->id,
            'fragmentable_type' => 'interaction_operand',
        ]);
        $altIO2F->makeChildOf($altF);

        // Alt Operand 2 Interaction
        $altIO2I = factory(Interaction::class)->create();
        $altIO2IF = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $altIO2I->id,
            'fragmentable_type' => 'interaction',
        ]);
        $altIO2IF->makeChildOf($altIO2F);

        // Par
        $par = factory(CombinedFragment::class)->create([
            'operator' => 'par'
        ]);
        $parF = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $par->id,
            'fragmentable_type' => 'combined_fragment',
        ]);
        $parF->makeChildOf($altIO2IF);

        // Par Operand 1
        $parIO1 = factory(InteractionOperand::class)->create([
            'constraint' => ''
        ]);
        $parIO1F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $parIO1->id,
            'fragmentable_type' => 'interaction_operand',
        ]);
        $parIO1F->makeChildOf($parF);

        // Par Operand 1 Interaction
        $parIO1I = factory(Interaction::class)->create();
        $parIO1IF = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $parIO1I->id,
            'fragmentable_type' => 'interaction',
        ]);
        $parIO1IF->makeChildOf($parIO1F);

        // Par Operand 2
        $parIO2 = factory(InteractionOperand::class)->create([
            'constraint' => ''
        ]);
        $parIO2F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $parIO2->id,
            'fragmentable_type' => 'interaction_operand',
        ]);
        $parIO2F->makeChildOf($parF);

        // Par Operand 2 Interaction
        $parIO2I = factory(Interaction::class)->create();
        $parIO2IF = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $parIO2I->id,
            'fragmentable_type' => 'interaction',
        ]);
        $parIO2IF->makeChildOf($parIO2F);

        // Create messages in fragments

        // Loop messages
        factory(Message::class)->create([
            'name' => 'a()',
            'sort' => 'synchCall',
            'interaction_id' => $interaction2->id,
            'send_event_id' => $ocB1->id,
            'receive_event_id' => $ocC1->id
        ]);
        factory(Message::class)->create([
            'name' => 'b()',
            'sort' => 'synchCall',
            'interaction_id' => $interaction2->id,
            'send_event_id' => $ocB2->id,
            'receive_event_id' => $ocC2->id
        ]);

        // Opt messages
        factory(Message::class)->create([
            'name' => 'c()',
            'sort' => 'synchCall',
            'interaction_id' => $optI->id,
            'send_event_id' => $ocA1->id,
            'receive_event_id' => $ocC3->id
        ]);

        // Alt Operand 1 Messages
        factory(Message::class)->create([
            'name' => 'f()',
            'sort' => 'synchCall',
            'interaction_id' => $altIO1I->id,
            'send_event_id' => $ocB5->id,
            'receive_event_id' => $ocC5->id
        ]);

        // Alt Operand 2 Messages
        factory(Message::class)->create([
            'name' => 'g()',
            'sort' => 'synchCall',
            'interaction_id' => $altIO2I->id,
            'send_event_id' => $ocA3->id,
            'receive_event_id' => $ocB6->id
        ]);
        factory(Message::class)->create([
            'name' => 'h()',
            'sort' => 'synchCall',
            'interaction_id' => $altIO2I->id,
            'send_event_id' => $ocA4->id,
            'receive_event_id' => $ocC6->id
        ]);

        // Par Operand 1 Messages
        factory(Message::class)->create([
            'name' => 'x()',
            'sort' => 'synchCall',
            'interaction_id' => $parIO1I->id,
            'send_event_id' => $ocB7->id,
            'receive_event_id' => $ocC7->id
        ]);
        factory(Message::class)->create([
            'name' => 'y()',
            'sort' => 'synchCall',
            'interaction_id' => $parIO1I->id,
            'send_event_id' => $ocC8->id,
            'receive_event_id' => $ocB8->id
        ]);

        // Par Operand 2 Messages
        factory(Message::class)->create([
            'name' => 'z()',
            'sort' => 'synchCall',
            'interaction_id' => $parIO2I->id,
            'send_event_id' => $ocB9->id,
            'receive_event_id' => $ocC9->id
        ]);
    }
}
