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
        $rootInteractionFragment = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($rootInteraction),
            function ($m) {
                $m->save();
            }
        );

        // Create interactions
        $interactionA = factory(Interaction::class)->create([
            'name' => 'Interaction A',
        ]);
        $interactionFragmentA = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($interactionA)
            ->parent()->associate($rootInteractionFragment),
            function ($m) {
                $m->save();
            }
        );

        $interactionB = factory(Interaction::class)->create([
            'name' => 'Interaction B',
        ]);
        $interactionFragmentB = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($interactionB)
            ->parent()->associate($rootInteractionFragment),
            function ($m) {
                $m->save();
            }
        );

        // Create lifelines
        $lifelineA = tap(
            factory(Lifeline::class)->states('resetOrder')->make([
                'name' => 'john: Person'
            ])
            ->interaction()->associate($interactionA),
            function ($m) {
                $m->save();
            }
        );

        $lifelineB = tap(
            factory(Lifeline::class)->make([
                'name' => 'anna: Person'
            ])
            ->interaction()->associate($interactionA),
            function ($m) {
                $m->save();
            }
        );

        $lifelineC = tap(
            factory(Lifeline::class)->states('resetOrder')->make([
                'name' => 'peter: Person'
            ])
            ->interaction()->associate($interactionB),
            function ($m) {
                $m->save();
            }
        );

        $lifelineD = tap(
            factory(Lifeline::class)->make([
                'name' => 'bill: Person'
            ])
            ->interaction()->associate($interactionB),
            function ($m) {
                $m->save();
            }
        );

        // Occurrence Specifications
        $occurrenceSpecificationA = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 1
            ])
            ->covered()->associate($lifelineA),
            function ($m) {
                $m->save();
            }
        );

        $occurrenceSpecificationB = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 1
            ])
            ->covered()->associate($lifelineB),
            function ($m) {
                $m->save();
            }
        );

        $occurrenceSpecificationC = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 2
            ])
            ->covered()->associate($lifelineC),
            function ($m) {
                $m->save();
            }
        );

        $occurrenceSpecificationD = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 2
            ])
            ->covered()->associate($lifelineD),
            function ($m) {
                $m->save();
            }
        );

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
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($opt)
            ->parent()->associate($interactionFragmentA),
            function ($m) {
                $m->save();
            }
        );

        // Interaction Operand
        $optIO1 = factory(InteractionOperand::class)->create([
            'constraint' => 'N > 0',
        ]);
        $optIO1F = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($optIO1)
            ->parent()->associate($optF),
            function ($m) {
                $m->save();
            }
        );

        // Opt interaction
        $optI = factory(Interaction::class)->create();
        $optIF = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($optI)
            ->parent()->associate($optIO1F),
            function ($m) {
                $m->save();
            }
        );

        // Interaction Operand Occurrence Specifications
        $occurrenceSpecificationX = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 3
            ])
            ->covered()->associate($lifelineA),
            function ($m) {
                $m->save();
            }
        );

        $occurrenceSpecificationY = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 3
            ])
            ->covered()->associate($lifelineB),
            function ($m) {
                $m->save();
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

        // Combined Fragment
        $opt2 = factory(CombinedFragment::class)->create([
            'operator' => 'alt',
        ]);
        $opt2F = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($opt2)
            ->parent()->associate($optIF),
            function ($m) {
                $m->save();
            }
        );

        // Interaction Operand
        $optIO12 = factory(InteractionOperand::class)->create([
            'constraint' => 'N > 0',
        ]);
        $optIO1F2 = tap(
            factory(InteractionFragment::class)->make()
            ->fragmentable()->associate($optIO12)
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
            ->parent()->associate($optIO1F2),
            function ($m) {
                $m->save();
            }
        );

        // Interaction Operand Occurrence Specifications
        $occurrenceSpecificationX2 = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 5
            ])
            ->covered()->associate($lifelineA),
            function ($m) {
                $m->save();
            }
        );

        $occurrenceSpecificationY2 = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 5
            ])
            ->covered()->associate($lifelineB),
            function ($m) {
                $m->save();
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
    }
}
