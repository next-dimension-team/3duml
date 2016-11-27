<?php

use Illuminate\Database\Seeder;
use App\Models\Interaction;
use App\Models\Lifeline;
use App\Models\OccurrenceSpecification;
use App\Models\Message;

class MinimalSequenceDiagramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $interaction = factory(Interaction::class)->create();

        $lifelines = factory(Lifeline::class, 2)
            ->create()
            ->each(function($lifeline) {
                $lifeline->occurrenceSpecifications()->save(
                    factory(OccurrenceSpecification::class)->make()
                );
            });

        $message = factory(Message::class)->make();
        $message->interaction()->associate($interaction);
        $message->sendEvent()->associate($lifelines->first());
        $message->receiveEvent()->associate($lifelines->last());

        $message->save();
    }
}
