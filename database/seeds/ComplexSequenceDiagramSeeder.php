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

class ComplexSequenceDiagramSeeder extends Seeder
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
            'name' => 'Complex Layers Diagram',
        ]);
        $rootInteractionFragment = factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($rootInteraction)
            ->save();

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
        $interactionFragmentA->makeChildOf($rootInteractionFragment);

        // Create lifelines
        $lifelineA = tap(
            factory(Lifeline::class)->make([
                'name' => 'john: Person',
                'order' => 1
            ])
            ->interaction()
            ->associate($interactionA),
            function ($lifeline) {
            $lifeline->save();
        });

        $lifelineB = tap(
            factory(Lifeline::class)->make([
                'name' => 'anna: Person',
                'order' => 2
            ])
            ->interaction()
            ->associate($interactionA),
            function ($lifeline) {
            $lifeline->save();
        });

        $lifelineC = tap(
            factory(Lifeline::class)->make([
                'name' => 'andrew: Person',
                'order' => 3
            ])
            ->interaction()
            ->associate($interactionA),
            function ($lifeline) {
            $lifeline->save();
        });

        $opt = factory(CombinedFragment::class)->create([
            'operator' => 'opt',
        ]);
        $optF = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($opt),
            function ($optF) {
                $optF->save();
            }
        );
        $optF->makeChildOf($interactionFragmentA);

        // Interaction Operand
        $optIO1 = factory(InteractionOperand::class)->create([
            'constraint' => 'N > 0',
        ]);
        $optIO1F = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($optIO1),
            function ($optIO1F) {
                $optIO1F->save();
            }
        );
        $optIO1F->makeChildOf($optF);

        // Opt interaction
        $optI = factory(Interaction::class)->create();
        $optIF = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($optI),
            function ($optIF) {
                $optIF->save();
            }
        );
        $optIF->makeChildOf($optIO1F);

        $loop = factory(CombinedFragment::class)->create([
            'operator' => 'loop',
        ]);
        $loopF = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($loop),
            function ($loopF) {
                $loopF->save();
            }
        );
        $loopF->makeChildOf($optIF);

        // Interaction Operand
        $loopIO1 = factory(InteractionOperand::class)->create([
            'constraint' => 'i < N',
        ]);
        $loopIO1F = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($loopIO1),
            function ($loopIO1F) {
                $loopIO1F->save();
            }
        );
        $loopIO1F->makeChildOf($loopF);

        // Loop interaction
        $loopI = factory(Interaction::class)->create();
        $loopIF = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($loopI),
            function ($loopIF) {
                $loopIF->save();
            }
        );
        $loopIF->makeChildOf($loopIO1F);

        $occurrenceSpecificationA = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 3
            ])
            ->covered()
            ->associate($lifelineB),
            function ($occurrenceSpecificationA) {
                $occurrenceSpecificationA->save();
            }
        );

        $occurrenceSpecificationB = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 3
            ])
            ->covered()
            ->associate($lifelineC),
            function ($occurrenceSpecificationB) {
                $occurrenceSpecificationB->save();
            }
        );

        // Interaction Operand Messages
        factory(Message::class)->make([
            'name' => 'a()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($loopI)
            ->sendEvent()->associate($occurrenceSpecificationA)
            ->receiveEvent()->associate($occurrenceSpecificationB)
            ->save();

        $occurrenceSpecificationC = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 4
            ])
            ->covered()
            ->associate($lifelineB),
            function ($occurrenceSpecificationC) {
                $occurrenceSpecificationC->save();
            }
        );

        $occurrenceSpecificationD = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 4
            ])
            ->covered()
            ->associate($lifelineC),
            function ($occurrenceSpecificationD) {
                $occurrenceSpecificationD->save();
            }
        );

        // Interaction Operand Messages
        factory(Message::class)->make([
            'name' => 'b()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($loopI)
            ->sendEvent()->associate($occurrenceSpecificationC)
            ->receiveEvent()->associate($occurrenceSpecificationD)
            ->save();
        $occurrenceSpecificationE = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 6
            ])
            ->covered()
            ->associate($lifelineA),
            function ($occurrenceSpecificationE) {
                $occurrenceSpecificationE->save();
            }
        );

        $occurrenceSpecificationF = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 6
            ])
            ->covered()
            ->associate($lifelineC),
            function ($occurrenceSpecificationF) {
                $occurrenceSpecificationF->save();
            }
        );

        // Interaction Operand Messages
        factory(Message::class)->make([
            'name' => 'c()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($optI)
            ->sendEvent()->associate($occurrenceSpecificationE)
            ->receiveEvent()->associate($occurrenceSpecificationF)
            ->save();
        $occurrenceSpecificationG = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 8
            ])
            ->covered()
            ->associate($lifelineA),
            function ($occurrenceSpecificationG) {
                $occurrenceSpecificationG->save();
            }
        );

        $occurrenceSpecificationH = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 8
            ])
            ->covered()
            ->associate($lifelineB),
            function ($occurrenceSpecificationH) {
                $occurrenceSpecificationH->save();
            }
        );

        // Interaction Operand Messages
        factory(Message::class)->make([
            'name' => 'd()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($interactionA)
            ->sendEvent()->associate($occurrenceSpecificationG)
            ->receiveEvent()->associate($occurrenceSpecificationH)
            ->save();
        $occurrenceSpecificationI = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 9
            ])
            ->covered()
            ->associate($lifelineB),
            function ($occurrenceSpecificationI) {
                $occurrenceSpecificationI->save();
            }
        );

        $occurrenceSpecificationJ = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 9
            ])
            ->covered()
            ->associate($lifelineC),
            function ($occurrenceSpecificationJ) {
                $occurrenceSpecificationJ->save();
            }
        );

        // Interaction Operand Messages
        factory(Message::class)->make([
            'name' => 'e()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($interactionA)
            ->sendEvent()->associate($occurrenceSpecificationI)
            ->receiveEvent()->associate($occurrenceSpecificationJ)
            ->save();


        $alt = factory(CombinedFragment::class)->create([
            'operator' => 'alt',
        ]);
        $altF = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($alt),
            function ($altF) {
                $altF->save();
            }
        );
        $altF->makeChildOf($interactionFragmentA);
        $altIO1 = factory(InteractionOperand::class)->create([
            'constraint' => 'N > 0',
        ]);
        $altIO1F = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($altIO1),
            function ($altIO1F) {
                $altIO1F->save();
            }
        );
        $altIO1F->makeChildOf($altF);

        // Alt interaction
        $altI = factory(Interaction::class)->create();
        $altIF = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($altI),
            function ($altIF) {
                $altIF->save();
            }
        );
        $altIF->makeChildOf($altIO1F);

         $occurrenceSpecificationK = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 11
            ])
            ->covered()
            ->associate($lifelineB),
            function ($occurrenceSpecificationK) {
                $occurrenceSpecificationK->save();
            }
        );

        $occurrenceSpecificationL = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 11
            ])
            ->covered()
            ->associate($lifelineC),
            function ($occurrenceSpecificationK) {
                $occurrenceSpecificationK->save();
            }
        );

        // Interaction Operand Messages
        factory(Message::class)->make([
            'name' => 'f()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($altI)
            ->sendEvent()->associate($occurrenceSpecificationK)
            ->receiveEvent()->associate($occurrenceSpecificationL)
            ->save();

        $alt2IO1 = factory(InteractionOperand::class)->create([
            'constraint' => 'N >= 0',
        ]);
        $alt2IO1F = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($alt2IO1),
            function ($alt2IO1F) {
                $alt2IO1F->save();
            }
        );
        $alt2IO1F->makeChildOf($altF);

        // Alt interaction
        $alt2I = factory(Interaction::class)->create();
        $alt2IF = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($alt2I),
            function ($alt2IF) {
                $alt2IF->save();
            }
        );
        $alt2IF->makeChildOf($alt2IO1F);
        $occurrenceSpecificationM = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 13
            ])
            ->covered()
            ->associate($lifelineA),
            function ($occurrenceSpecificationM) {
                $occurrenceSpecificationM->save();
            }
        );

        $occurrenceSpecificationN = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 13
            ])
            ->covered()
            ->associate($lifelineB),
            function ($occurrenceSpecificationN) {
                $occurrenceSpecificationN->save();
            }
        );

        // Interaction Operand Messages
        factory(Message::class)->make([
            'name' => 'g()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($alt2I)
            ->sendEvent()->associate($occurrenceSpecificationM)
            ->receiveEvent()->associate($occurrenceSpecificationN)
            ->save();
        $occurrenceSpecificationO = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 14
            ])
            ->covered()
            ->associate($lifelineA),
            function ($occurrenceSpecificationO) {
                $occurrenceSpecificationO->save();
            }
        );

        $occurrenceSpecificationP = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 14
            ])
            ->covered()
            ->associate($lifelineC),
            function ($occurrenceSpecificationP) {
                $occurrenceSpecificationP->save();
            }
        );

        // Interaction Operand Messages
        factory(Message::class)->make([
            'name' => 'H()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($alt2I)
            ->sendEvent()->associate($occurrenceSpecificationO)
            ->receiveEvent()->associate($occurrenceSpecificationP)
            ->save();

        $par = factory(CombinedFragment::class)->create([
            'operator' => 'par',
        ]);
        $parF = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($par),
            function ($parF) {
                $parF->save();
            }
        );
        $parF->makeChildOf($alt2IF);
        $parIO1 = factory(InteractionOperand::class)->create([
            'constraint' => ' ',
        ]);
        $parIO1F = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($parIO1),
            function ($parIO1F) {
                $parIO1F->save();
            }
        );
        $parIO1F->makeChildOf($parF);

        // par interaction
        $parI = factory(Interaction::class)->create();
        $parIF = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($parI),
            function ($parIF) {
                $parIF->save();
            }
        );
        $parIF->makeChildOf($parIO1F);
         $occurrenceSpecificationQ = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 15
            ])
            ->covered()
            ->associate($lifelineB),
            function ($occurrenceSpecificationQ) {
                $occurrenceSpecificationQ->save();
            }
        );

        $occurrenceSpecificationR = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 15
            ])
            ->covered()
            ->associate($lifelineC),
            function ($occurrenceSpecificationR) {
                $occurrenceSpecificationR->save();
            }
        );

        // Interaction Operand Messages
        factory(Message::class)->make([
            'name' => 'x()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($parI)
            ->sendEvent()->associate($occurrenceSpecificationQ)
            ->receiveEvent()->associate($occurrenceSpecificationR)
            ->save();
         $occurrenceSpecificationS = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 16
            ])
            ->covered()
            ->associate($lifelineB),
            function ($occurrenceSpecificationS) {
                $occurrenceSpecificationS->save();
            }
        );

        $occurrenceSpecificationT = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 16
            ])
            ->covered()
            ->associate($lifelineC),
            function ($occurrenceSpecificationT) {
                $occurrenceSpecificationT->save();
            }
        );

        // Interaction Operand Messages
        factory(Message::class)->make([
            'name' => 'y()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($parI)
            ->sendEvent()->associate($occurrenceSpecificationT)
            ->receiveEvent()->associate($occurrenceSpecificationS)
            ->save();

         $par2IO1 = factory(InteractionOperand::class)->create([
            'constraint' => '',
        ]);
        $par2IO1F = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($par2IO1),
            function ($par2IO1F) {
                $par2IO1F->save();
            }
        );
        $par2IO1F->makeChildOf($parF);

        // Par interaction
        $par2I = factory(Interaction::class)->create();
        $par2IF = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($par2I),
            function ($par2IF) {
                $par2IF->save();
            }
        );
        $par2IF->makeChildOf($par2IO1F);
        $occurrenceSpecificationU = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 19
            ])
            ->covered()
            ->associate($lifelineB),
            function ($occurrenceSpecificationU) {
                $occurrenceSpecificationU->save();
            }
        );

        $occurrenceSpecificationV = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 19
            ])
            ->covered()
            ->associate($lifelineC),
            function ($occurrenceSpecificationV) {
                $occurrenceSpecificationV->save();
            }
        );

        // Interaction Operand Messages
        factory(Message::class)->make([
            'name' => 'z()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($par2I)
            ->sendEvent()->associate($occurrenceSpecificationU)
            ->receiveEvent()->associate($occurrenceSpecificationV)
            ->save();
    }
}
