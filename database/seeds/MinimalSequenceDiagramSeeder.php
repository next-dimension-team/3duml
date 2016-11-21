<?php

use Illuminate\Database\Seeder;

class MinimalSequenceDiagramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sequenceDiagramInteraction = factory(\App\Models\Interaction::class)->create();

        $lifelineA = factory(\App\Models\Lifeline::class)->create();
        $lifelineB = factory(\App\Models\Lifeline::class)->create();

        $occurenceSpecificationA = factory(\App\Models\OccurenceSpecification::class)->create([
            'lifeline_id' => $lifelineA->id,
        ]);

        $occurenceSpecificationB = factory(\App\Models\OccurenceSpecification::class)->create([
            'lifeline_id' => $lifelineB->id,
        ]);

        $message = factory(\App\Models\Message::class)->create([
            'interaction_id' => $sequenceDiagramInteraction->id,
            'send_event_id' => $lifelineA->id,
            'receive_event_id' => $lifelineB->id,
        ]);
    }
}
