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
 * note: without execution specifiactions.
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
        $rootInteraction = factory(Interaction::class)->create([
            'name' => 'Complicated Sequence Diagram',
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
                'name' => 'a: A',
            ])
            ->interaction()->associate($interactionA),
            function ($m) {
                $m->save();
            }
        );

        $lifelineB = tap(
            factory(Lifeline::class)->make([
                'name' => 'b: B',
            ])
            ->interaction()->associate($interactionA),
            function ($m) {
                $m->save();
            }
        );

        $lifelineC = tap(
            factory(Lifeline::class)->make([
                'name' => 'c: C',
            ])
            ->interaction()->associate($interactionA),
            function ($m) {
                $m->save();
            }
        );
        $lifelineD = tap(
            factory(Lifeline::class)->make([
                'name' => 'd: D',
            ])
            ->interaction()->associate($interactionA),
            function ($m) {
                $m->save();
            }
        );

        // Lifeline A,B,C Occurrence Specifications

        //Lifeline A Occ
        $occurrenceSpecificationA1 = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 1,
            ])
            ->covered()->associate($lifelineA),
            function ($m) {
                $m->save();
            }
        );
        $occurrenceSpecificationA2 = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 5,
            ])
            ->covered()->associate($lifelineA),
            function ($m) {
                $m->save();
            }
        );
        $occurrenceSpecificationA3 = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 6,
            ])
            ->covered()->associate($lifelineA),
            function ($m) {
                $m->save();
            }
        );

        //Lifeline B Occ
         $occurrenceSpecificationB1 = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 1,
            ])
            ->covered()->associate($lifelineB),
            function ($m) {
                $m->save();
            }
        );
        $occurrenceSpecificationB2 = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 2,
            ])
            ->covered()->associate($lifelineB),
            function ($m) {
                $m->save();
            }
        );
        $occurrenceSpecificationB3 = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 4,
            ])
            ->covered()->associate($lifelineB),
            function ($m) {
                $m->save();
            }
        );

        //Lifeline C Occ
         $occurrenceSpecificationC1 = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 2,
            ])
            ->covered()->associate($lifelineC),
            function ($m) {
                $m->save();
            }
        );
        $occurrenceSpecificationC2 = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 3,
            ])
            ->covered()->associate($lifelineC),
            function ($m) {
                $m->save();
            }
        );
        $occurrenceSpecificationC3 = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 4,
            ])
            ->covered()->associate($lifelineC),
            function ($m) {
                $m->save();
            }
        );
        $occurrenceSpecificationC4 = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 5,
            ])
            ->covered()->associate($lifelineC),
            function ($m) {
                $m->save();
            }
        );
        // Lifeline D Occ
        $occurrenceSpecificationD1 = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 3,
            ])
            ->covered()->associate($lifelineD),
            function ($m) {
                $m->save();
            }
        );
        $occurrenceSpecificationD2 = tap(
            factory(OccurrenceSpecification::class)->make([
                'time' => 6,
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
            ->sendEvent()->associate($occurrenceSpecificationA1)
            ->receiveEvent()->associate($occurrenceSpecificationB1)
            ->save();

        factory(Message::class)->make([
            'name' => 'b()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($interactionA)
            ->sendEvent()->associate($occurrenceSpecificationB2)
            ->receiveEvent()->associate($occurrenceSpecificationC1)
            ->save();

        factory(Message::class)->make([
            'name' => 'c()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($interactionA)
            ->sendEvent()->associate($occurrenceSpecificationC3)
            ->receiveEvent()->associate($occurrenceSpecificationB3)
            ->save();

         factory(Message::class)->make([
            'name' => 'd()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($interactionA)
            ->sendEvent()->associate($occurrenceSpecificationC4)
            ->receiveEvent()->associate($occurrenceSpecificationA2)
            ->save();  

         factory(Message::class)->make([
            'name' => 'e()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($interactionA)
            ->sendEvent()->associate($occurrenceSpecificationC2)
            ->receiveEvent()->associate($occurrenceSpecificationD1)
            ->save();

         factory(Message::class)->make([
            'name' => 'f()',
            'sort' => 'synchCall'
        ])
            ->interaction()->associate($interactionA)
            ->sendEvent()->associate($occurrenceSpecificationA3)
            ->receiveEvent()->associate($occurrenceSpecificationD2)
            ->save();          
    }
}