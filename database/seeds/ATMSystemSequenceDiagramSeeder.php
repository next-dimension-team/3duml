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
 * https://creately.com/diagram/example/gsxb10kl5/ATM+System
 */
class ATMSystemSequenceDiagramSeeder extends Seeder
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
            'name' => 'ATM System Sequence Diagram',
        ]);
        $rootF = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $root->id,
            'fragmentable_type' => 'interaction',
        ]);

        // Create lifelines
        $lifelineA = factory(Lifeline::class)->create([
            'name' => 'cust: Customer',
            'layer_id' => $layer->id,
        ]);
        $lifelineB = factory(Lifeline::class)->create([
            'name' => 'teller: ATM',
            'layer_id' => $layer->id,
        ]);
        $lifelineC = factory(Lifeline::class)->create([
            'name' => 'theirBank: Bank',
            'layer_id' => $layer->id,
        ]);

        // Lifeline A Occurrence Specifications
        $ocA1 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineA->id,
            'time' => 1 * $t,
        ]);
        $ocA2 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineA->id,
            'time' => 12 * $t,
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

        // Lifeline B Occurrence Specifications
        $ocB1 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 1 * $t,
        ]);
        $ocB2 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 2 * $t,
        ]);
        $ocB3 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 5 * $t,
        ]);
        $ocB4 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 7 * $t,
        ]);
        $ocB5 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 10 * $t,
        ]);
        $ocB6 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
            'time' => 12 * $t,
        ]);

        // Lifeline B Execution Specifications
        $esB1 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocB1->id,
            'finish_occurrence_specification_id' => $ocB6->id,
        ]);
        $esB1F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esB1->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        // Lifeline C Occurrence Specifications
        $ocC1 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'time' => 2 * $t,
        ]);
        $ocC2 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'time' => 5 * $t,
        ]);
        $ocC3 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'time' => 7 * $t,
        ]);
        $ocC4 = factory(OccurrenceSpecification::class)->create([
            'lifeline_id' => $lifelineC->id,
            'time' => 10 * $t,
        ]);

        // Lifeline C Execution Specifications
        $esC1 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocC1->id,
            'finish_occurrence_specification_id' => $ocC2->id,
        ]);
        $esC1F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esC1->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        $esC2 = factory(ExecutionSpecification::class)->create([
            'start_occurrence_specification_id' => $ocC3->id,
            'finish_occurrence_specification_id' => $ocC4->id,
        ]);
        $esC2F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $esC2->id,
            'fragmentable_type' => 'execution_specification',
        ]);

        // Messages
        $message1 = factory(Message::class)->create([
            'name' => 'withdrawCash(accountNumber, amount)',
            'sort' => 'synchCall',
            'interaction_id' => $root->id,
            'send_event_id' => $ocA1->id,
            'receive_event_id' => $ocB1->id,
        ]);
        $message2 = factory(Message::class)->create([
            'name' => 'getBalance(accountNumber): Real',
            'sort' => 'synchCall',
            'interaction_id' => $root->id,
            'send_event_id' => $ocB2->id,
            'receive_event_id' => $ocC1->id,
        ]);
        $message3 = factory(Message::class)->create([
            'name' => 'balance',
            'sort' => 'asynchCall',
            'interaction_id' => $root->id,
            'send_event_id' => $ocC2->id,
            'receive_event_id' => $ocB3->id,
        ]);
        $message4 = factory(Message::class)->create([
            'name' => 'cash',
            'sort' => 'synchCall',
            'interaction_id' => $root->id,
            'send_event_id' => $ocB6->id,
            'receive_event_id' => $ocA2->id,
        ]);

        // Create fragments
        $cf1 = factory(CombinedFragment::class)->create([
            'operator' => 'opt',
        ]);
        $cf1F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $cf1->id,
            'fragmentable_type' => 'combined_fragment',
        ]);
        $cf1F->makeChildOf($rootF);

        $io1 = factory(InteractionOperand::class)->create();
        $io1F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $io1->id,
            'fragmentable_type' => 'interaction_operand',
            'parent_id' => $rootF->id,
        ]);
        $io1F->makeChildOf($cf1F);

        $interaction1 = factory(Interaction::class)->create();
        $interaction1F = factory(InteractionFragment::class)->create([
            'fragmentable_id' => $interaction1->id,
            'fragmentable_type' => 'interaction',
        ]);
        $interaction1F->makeChildOf($io1F);

        // Create messages in fragments
        $interaction1message1 = factory(Message::class)->create([
            'name' => 'debit(accountNumber, account)',
            'sort' => 'synchCall',
            'interaction_id' => $interaction1->id,
            'send_event_id' => $ocB4->id,
            'receive_event_id' => $ocC3->id,
        ]);
        $interaction1message2 = factory(Message::class)->create([
            'name' => '',
            'sort' => 'asynchCall',
            'interaction_id' => $interaction1->id,
            'send_event_id' => $ocC4->id,
            'receive_event_id' => $ocB5->id,
        ]);
    }
}
