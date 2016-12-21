<?php

use Illuminate\Database\Seeder;
use App\Models\Interaction;
use App\Models\Lifeline;
use App\Models\OccurrenceSpecification;
use App\Models\Message;
use App\Models\Layer;

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
        $interaction->name = 'Sequence Diagram '.$interaction->id;
        $interaction->save();

        $layer = factory(Layer::class)->create([
            'depth' => 1,
        ]);

        $lifelines = factory(Lifeline::class, 2)
            ->make()
            ->each(function ($lifeline) use ($layer) {
                $lifeline->layer()->associate($layer);

                $lifeline->save();

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
