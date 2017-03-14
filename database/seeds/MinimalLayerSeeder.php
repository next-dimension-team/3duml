<?php

use Illuminate\Database\Seeder;
use App\Models\Message;
use App\Models\Lifeline;
use App\Models\Interaction;
use App\Models\CombinedFragment;
use App\Models\InteractionOperand;
use App\Models\InteractionFragment;
use App\Models\OccurrenceSpecification;

class MinimalLayerSeeder extends Seeder
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
            'name' => 'Minimal Layers Diagram',
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

        $interactionB = factory(Interaction::class)->create([
            'name' => 'Interaction B',
        ]);
        $interactionFragmentB = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($interactionB),
            function ($interactionFragmentB) {
                $interactionFragmentB->save();
            }
        );
        $interactionFragmentB->makeChildOf($rootInteractionFragment);

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
                'name' => 'peter: Person',
                'order' => 1
            ])
            ->interaction()
            ->associate($interactionB),
            function ($lifeline) {
            $lifeline->save();
        });

        $lifelineD = tap(
            factory(Lifeline::class)->make([
                'name' => 'bill: Person',
                'order' => 2
            ])
            ->interaction()
            ->associate($interactionB),
            function ($lifeline) {
            $lifeline->save();
        });

        // Occurrence Specifications
        $occurrenceSpecificationA = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 1
            ])
            ->covered()
            ->associate($lifelineA),
            function ($occurrenceSpecificationA) {
            $occurrenceSpecificationA->save();
        });

        $occurrenceSpecificationB = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 1
            ])
            ->covered()
            ->associate($lifelineB),
            function ($occurrenceSpecificationB) {
            $occurrenceSpecificationB->save();
        });

        $occurrenceSpecificationC = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 2
            ])
            ->covered()
            ->associate($lifelineC),
            function ($occurrenceSpecificationC) {
            $occurrenceSpecificationC->save();
        });

        $occurrenceSpecificationD = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 2
            ])
            ->covered()
            ->associate($lifelineD),
            function ($occurrenceSpecificationD) {
            $occurrenceSpecificationD->save();
        });

        // Messages
        factory(Message::class)->make([
            'name' => 'a()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($interactionA)
            ->sendEvent()->associate($occurrenceSpecificationA)
            ->receiveEvent()->associate($occurrenceSpecificationB)
            ->save();

        factory(Message::class)->make([
            'name' => 'b()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($interactionB)
            ->sendEvent()->associate($occurrenceSpecificationC)
            ->receiveEvent()->associate($occurrenceSpecificationD)
            ->save();

        // Combined Fragment
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

        // Interaction Operand Occurrence Specifications
        $occurrenceSpecificationX = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 3
            ])
            ->covered()
            ->associate($lifelineA),
            function ($occurrenceSpecificationX) {
                $occurrenceSpecificationX->save();
            }
        );

        $occurrenceSpecificationY = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 3
            ])
            ->covered()
            ->associate($lifelineB),
            function ($occurrenceSpecificationY) {
                $occurrenceSpecificationY->save();
            }
        );

        // Interaction Operand Messages
        factory(Message::class)->make([
            'name' => 'c()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($optI)
            ->sendEvent()->associate($occurrenceSpecificationX)
            ->receiveEvent()->associate($occurrenceSpecificationY)
            ->save();

        




        if (true):

        // Combined Fragment
        $opt2 = factory(CombinedFragment::class)->create([
            'operator' => 'alt',
        ]);
        $opt2F = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($opt2),
            function ($opt2F) {
                $opt2F->save();
            }
        );
        $opt2F->makeChildOf($optIF);

        // Interaction Operand
        $optIO12 = factory(InteractionOperand::class)->create([
            'constraint' => 'N > 0',
        ]);
        $optIO1F2 = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($optIO12),
            function ($optIO1F2) {
                $optIO1F2->save();
            }
        );
        $optIO1F2->makeChildOf($opt2F);

        // Opt interaction
        $optI2 = factory(Interaction::class)->create();
        $optIF2 = tap(
            factory(InteractionFragment::class)
            ->make()
            ->fragmentable()
            ->associate($optI2),
            function ($optIF2) {
                $optIF2->save();
            }
        );
        $optIF2->makeChildOf($optIO1F2);

        // Interaction Operand Occurrence Specifications
        $occurrenceSpecificationX2 = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 5
            ])
            ->covered()
            ->associate($lifelineA),
            function ($occurrenceSpecificationX2) {
                $occurrenceSpecificationX2->save();
            }
        );

        $occurrenceSpecificationY2 = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 5
            ])
            ->covered()
            ->associate($lifelineB),
            function ($occurrenceSpecificationY2) {
                $occurrenceSpecificationY2->save();
            }
        );

        // Interaction Operand Messages
        factory(Message::class)->make([
            'name' => 'd()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($optI2)
            ->sendEvent()->associate($occurrenceSpecificationX2)
            ->receiveEvent()->associate($occurrenceSpecificationY2)
            ->save();

        endif;
    }
}
