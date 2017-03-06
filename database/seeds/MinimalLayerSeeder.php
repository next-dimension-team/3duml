<?php

use Illuminate\Database\Seeder;
use App\Models\Interaction;
use App\Models\InteractionFragment;
use App\Models\Lifeline;
use App\Models\OccurrenceSpecification;
use App\Models\Message;
use App\Models\Layer;

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

        // Create layers
        $layerA = factory(Layer::class)->create([
            'depth' => 0,
        ]);

        $layerB = factory(Layer::class)->create([
            'depth' => 1,
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
                'name' => 'john: Person'
            ])
            ->layer()
            ->associate($layerA),
            function ($lifeline) {
            $lifeline->save();
        });

        $lifelineB = tap(
            factory(Lifeline::class)->make([
                'name' => 'anna: Person'
            ])
            ->layer()
            ->associate($layerA),
            function ($lifeline) {
            $lifeline->save();
        });

        $lifelineC = tap(
            factory(Lifeline::class)->make([
                'name' => 'peter: Person'
            ])
            ->layer()
            ->associate($layerB),
            function ($lifeline) {
            $lifeline->save();
        });

        $lifelineD = tap(
            factory(Lifeline::class)->make([
                'name' => 'bill: Person'
            ])
            ->layer()
            ->associate($layerB),
            function ($lifeline) {
            $lifeline->save();
        });

        // Occurrence Specifications
        $occurrenceSpecificationA = tap(
            factory(OccurrenceSpecification::class)->make()
            ->covered()
            ->associate($lifelineA),
            function ($occurrenceSpecificationA) {
            $occurrenceSpecificationA->save();
        });

        $occurrenceSpecificationB = tap(
            factory(OccurrenceSpecification::class)->make()
            ->covered()
            ->associate($lifelineB),
            function ($occurrenceSpecificationB) {
            $occurrenceSpecificationB->save();
        });

        $occurrenceSpecificationC = tap(
            factory(OccurrenceSpecification::class)->make()
            ->covered()
            ->associate($lifelineC),
            function ($occurrenceSpecificationC) {
            $occurrenceSpecificationC->save();
        });

        $occurrenceSpecificationD = tap(
            factory(OccurrenceSpecification::class)->make()
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
    }
}
