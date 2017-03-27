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
        
        // Create root interaction
        $rootInteraction = factory(Interaction::class)->create([
            'name' => 'ATM System Diagram',
        ]);
        $rootInteractionFragment = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($rootInteraction),
            function ($m) {
                $m->save();
            }
        );
        // Create interactions (Layer)
        $interactionA = factory(Interaction::class)->create([
            'name' => 'Interaction 1',
        ]);
        $interactionFragmentA = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($interactionA)
            ->parent()->associate($rootInteractionFragment),
            function ($m) {
                $m->save();
            }
        );

        // Create lifelines
        $lifelineA = tap(
            factory(Lifeline::class)->states('resetOrder')->make([
                'name' => 'cust: Customer',
            ])
            ->interaction()->associate($interactionA),
            function ($m) {
                $m->save();
            }
        );

        $lifelineB = tap(
            factory(Lifeline::class)->make([
                'name' => 'teller: ATM',
            ])
            ->interaction()->associate($interactionA),
            function ($m) {
                $m->save();
            }
        );

        $lifelineC = tap(
            factory(Lifeline::class)->make([
                'name' => 'theirBank: Bank',
            ])
            ->interaction()->associate($interactionA),
            function ($m) {
                $m->save();
            }
        );

        // Lifeline A,B,C Occurrence Specifications

        //Lifeline A Occ
        $occurrenceSpecificationA = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 1,
            ])
            ->covered()->associate($lifelineA),
            function ($m) {
                $m->save();
            }
        );

        //Lifeline B Occ
         $occurrenceSpecificationB = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 1,
            ])
            ->covered()->associate($lifelineB),
            function ($m) {
                $m->save();
            }
        );

        //Lifeline B Occ
        $occurrenceSpecificationC = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 2,
            ])
            ->covered()->associate($lifelineB),
            function ($m) {
                $m->save();
            }
        );

        //Lifeline C Occ
         $occurrenceSpecificationD = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 2,
            ])
            ->covered()->associate($lifelineC),
            function ($m) {
                $m->save();
            }
        );

        //Lifeline C  Occ
        $occurrenceSpecificationE = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 6,
            ])
            ->covered()->associate($lifelineC),
            function ($m) {
                $m->save();
            }
        );

        //Lifeline B Occ
        $occurrenceSpecificationF = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 6,
            ])
            ->covered()->associate($lifelineB),
            function ($m) {
                $m->save();
            }
        );

        //Lifeline B Occ
        $occurrenceSpecificationO = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 15,
            ])
            ->covered()->associate($lifelineB),
            function ($m) {
                $m->save();
            }
        );

        //Lifeline A Occ
        $occurrenceSpecificationP = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 15,
            ])
            ->covered()->associate($lifelineA),
            function ($m) {
                $m->save();
            }
        );

        // Messages
        factory(Message::class)->make([
            'name' => 'withdrawCash(accountNumber, amount)',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($interactionA)
            ->sendEvent()->associate($occurrenceSpecificationA)
            ->receiveEvent()->associate($occurrenceSpecificationB)
            ->save();

        factory(Message::class)->make([
            'name' => 'getBalance(accountNumber): Real',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($interactionA)
            ->sendEvent()->associate($occurrenceSpecificationC)
            ->receiveEvent()->associate($occurrenceSpecificationD)
            ->save();

        factory(Message::class)->make([
            'name' => 'balance',
            'sort' => 'asynchCall'
        ])
            ->interaction()->associate($interactionA)
            ->sendEvent()->associate($occurrenceSpecificationE)
            ->receiveEvent()->associate($occurrenceSpecificationF)
            ->save();

        factory(Message::class)->make([
            'name' => 'cash',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($interactionA)
            ->sendEvent()->associate($occurrenceSpecificationO)
            ->receiveEvent()->associate($occurrenceSpecificationP)
            ->save();

        // Combined Fragment
        //TODO: spravit REF namiesto opt1 a opt3
        //TODO: "opt-y" maju byt medzi 2. a 3. lifelinou
        $opt1 = factory(CombinedFragment::class)->create([
            'operator' => 'opt',
        ]);
        $opt1F = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($opt1)
            ->parent()->associate($interactionFragmentA),
            function ($m) {
                $m->save();
            }
        );

        // Interaction Operand
        $optIO1 = factory(InteractionOperand::class)->create([
            'constraint' => '',
        ]);
        $optIO1F1 = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($optIO1)
            ->parent()->associate($opt1F),
            function ($m) {
                $m->save();
            }
        );

        // Opt interaction
        $optI1 = factory(Interaction::class)->create();
        $optIF1 = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($optI1)
            ->parent()->associate($optIO1F1),
            function ($m) {
                $m->save();
            }
        );

        //Lifeline B Occurrence for First opt
        $occurrenceSpecificationG = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 4,
            ])
            ->covered()->associate($lifelineB),
            function ($m) {
                $m->save();
            }
        );

        //Lifeline C Occurrence for First opt
        $occurrenceSpecificationH = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 4,
            ])
            ->covered()->associate($lifelineC),
            function ($m) {
                $m->save();
            }
        );

        //Interaction Operand1 Message
        factory(Message::class)->make([
            'name' => 'balanceLookup(accountNumber): Real',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($optI1)
            ->sendEvent()->associate($occurrenceSpecificationG)
            ->receiveEvent()->associate($occurrenceSpecificationH)
            ->save();

        // Combined Fragment
        $opt2 = factory(CombinedFragment::class)->create([
            'operator' => 'opt',
        ]);
        $opt2F = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($opt2)
            ->parent()->associate($interactionFragmentA),
            function ($m) {
                $m->save();
            }
        );

        // Interaction Operand
        $optIO2 = factory(InteractionOperand::class)->create([
            'constraint' => '',
        ]);
        $optIO2F2 = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($optIO2)
            ->parent()->associate($opt2F),
            function ($m) {
                $m->save();
            }
        );

        // Opt interaction
        $optI2 = factory(Interaction::class)->create();
        $optIF2 = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($optI2)
            ->parent()->associate($optIO2F2),
            function ($m) {
                $m->save();
            }
        );

        //Lifeline B Occurrence for Second opt
        $occurrenceSpecificationI = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 8,
            ])
            ->covered()->associate($lifelineB),
            function ($m) {
                $m->save();
            }
        );

        //Lifeline C Occurrence for Second opt
        $occurrenceSpecificationJ = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 8,
            ])
            ->covered()->associate($lifelineC),
            function ($m) {
                $m->save();
            }
        );

        //Lifeline C Occurrence for Second opt
        $occurrenceSpecificationK = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 12,
            ])
            ->covered()->associate($lifelineC),
            function ($m) {
                $m->save();
            }
        );

        //Lifeline B Occurrence for Second opt
        $occurrenceSpecificationL = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 12,
            ])
            ->covered()->associate($lifelineB),
            function ($m) {
                $m->save();
            }
        );

        //Interaction Operand2 Message
        factory(Message::class)->make([
            'name' => 'debit(accountNumber, account)',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($optI2)
            ->sendEvent()->associate($occurrenceSpecificationI)
            ->receiveEvent()->associate($occurrenceSpecificationJ)
            ->save();

        //Interaction Operand2 Message
        factory(Message::class)->make([
            'name' => '',
            'sort' => 'asynchCall'
        ])
            ->interaction()->associate($optI2)
            ->sendEvent()->associate($occurrenceSpecificationK)
            ->receiveEvent()->associate($occurrenceSpecificationL)
            ->save();
        
        // Combined Fragment
        $opt3 = factory(CombinedFragment::class)->create([
            'operator' => 'opt',
        ]);
        $opt3F = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($opt3)
            ->parent()->associate($optIF2),
            function ($m) {
                $m->save();
            }
        );

        // Interaction Operand
        $optIO3 = factory(InteractionOperand::class)->create([
            'constraint' => '',
        ]);
        $optIO3F3 = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($optIO3)
            ->parent()->associate($opt3F),
            function ($m) {
                $m->save();
            }
        );

        // Opt interaction
        $optI3 = factory(Interaction::class)->create();
        $optIF3 = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($optI3)
            ->parent()->associate($optIO3F3),
            function ($m) {
                $m->save();
            }
        );

        //Lifeline B Occurrence for First opt
        $occurrenceSpecificationM = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 10,
            ])
            ->covered()->associate($lifelineB),
            function ($m) {
                $m->save();
            }
        );

        //Lifeline C Occurrence for First opt
        $occurrenceSpecificationN = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 10,
            ])
            ->covered()->associate($lifelineC),
            function ($m) {
                $m->save();
            }
        );

        //Interaction Operand1 Message
        factory(Message::class)->make([
            'name' => 'debitAccount(accountNumber, amount)',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($optI3)
            ->sendEvent()->associate($occurrenceSpecificationM)
            ->receiveEvent()->associate($occurrenceSpecificationN)
            ->save();
    }
}