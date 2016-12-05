<?php

use Illuminate\Database\Seeder;
use App\Models\Interaction;
use App\Models\InteractionOperand;
use App\Models\Lifeline;
use App\Models\OccurrenceSpecification;
use App\Models\Message;
use App\Models\CombinedFragment;
use App\Models\InteractionFragment;

class Second extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $interaction = factory(Interaction::class)->create();
		$mainIF = factory (InteractionFragment::class)->create(['fragmentable_id' => $interaction->id,'fragmentable_type' => 'interaction']);

        /*$lifelines = factory(Lifeline::class, 3)
            ->create()
            ->each(function ($lifeline) {
                $lifeline->occurrenceSpecifications()->save(
                    factory(OccurrenceSpecification::class)->make()
                );
            });
*/
        $lifeline1 = factory(Lifeline::class)->create();
        $lifeline2 = factory(Lifeline::class)->create();
        $lifeline3 = factory(Lifeline::class)->create();

    /*    $occ1 = factory(OccurrenceSpecification::class)->create('lifeline_id' => $lifeline1->id]);
        $occ2 = factory(OccurrenceSpecification::class)->create('lifeline_id' => $lifeline2->id]);
        $occ3 = factory(OccurrenceSpecification::class)->create('lifeline_id' => $lifeline3->id]);*/

		$combinedFragment1 = factory(CombinedFragment::class)->create(['operator' => 'opt']);
		$interactionOperands1 = factory(InteractionOperand::class)->create(['constraint' => 'N>0']);
		$interactionFragment1 = factory(InteractionFragment::class)->create(['fragmentable_id' => $combinedFragment1->id,'fragmentable_type' => 'combined_fragment']);
		$interactionFragment2 = factory(InteractionFragment::class)->create(['fragmentable_id' => $interactionOperands1->id, 'parent_id' => $interactionFragment1->id,'fragmentable_type' => 'interaction_operand']);
		
		$combinedFragment2 = factory(CombinedFragment::class)->create(['operator' => 'loop']);
		$interactionOperands2 = factory(InteractionOperand::class)->create(['constraint' => 'i<N']);
		$interactionFragment3 = factory(InteractionFragment::class)->create(['fragmentable_id' => $combinedFragment2->id, 'parent_id' => $interactionFragment2->id ,'fragmentable_type' => 'combined_fragment']);
		$interactionFragment4 = factory(InteractionFragment::class)->create(['fragmentable_id' => $interactionOperands2->id, 'parent_id' => $interactionFragment3->id,'fragmentable_type' => 'interaction_operand']);
		
	
/*
        $combinedFragments = factory(CombinedFragment::class,5)
            ->create()
            ->each(function($combinedFragment) {
                $combinedFragment->interactionFragments()->save(
                    factory(InteracionFragment::class)->make(['operator' => 'opt',]));
            });*/

        $interaction2 = factory(Interaction::class)->create();
        $interactionFragment5 = factory(InteractionFragment::class)->create(['fragmentable_id' => $interaction2->id, 'fragmentable_type' => 'interaction','parent_id' => $interactionFragment4->id]);

        $interaction3 = factory(Interaction::class)->create();
        $interactionFragment6 = factory(InteractionFragment::class)->create(['fragmentable_id' => $interaction3->id, 'fragmentable_type' => 'interaction','parent_id' => $interactionFragment2->id]);

        

        $cf = factory(CombinedFragment::class)->create(['operator' => 'alt']);
        $io1 = factory(InteractionOperand::class)->create(['constraint' => 'N>0']);
        $if1 = factory(InteractionFragment::class)->create(['fragmentable_id' => $cf->id, 'fragmentable_type' => 'combined_fragment']);
        $if2 = factory(InteractionFragment::class)->create(['fragmentable_id' => $io1->id, 'fragmentable_type' => 'interaction_operand', 'parent_id' => $if1->id]);
        $int1 = factory(Interaction::class)->create();
        $if3 = factory(InteractionFragment::class)->create(['fragmentable_id' => $int1->id, 'fragmentable_type' => 'interaction','parent_id' => $if2->id]);

        $io2 = factory(InteractionOperand::class)->create(['constraint' => 'N<=0']);
        $if4 = factory(InteractionFragment::class)->create(['fragmentable_id' => $io2->id, 'fragmentable_type' => 'interaction_operand', 'parent_id' => $if1->id]);
        $int2 = factory(Interaction::class)->create();
        $if5 = factory(InteractionFragment::class)->create(['fragmentable_id' => $int2->id, 'fragmentable_type' => 'interaction','parent_id' => $if4->id]); 


        $cf1 = factory(CombinedFragment::class)->create(['operator' => 'par']);
        $io3 = factory(InteractionOperand::class)->create(['constraint' => '']);
        $if6 = factory(InteractionFragment::class)->create(['fragmentable_id' => $cf1->id, 'fragmentable_type' => 'combined_fragment', 'parent_id' => $if4->id]);
        $if7 = factory(InteractionFragment::class)->create(['fragmentable_id' => $io3->id, 'fragmentable_type' => 'interaction_operand', 'parent_id' => $if6->id]);
        $int3 = factory(Interaction::class)->create();
        $if8 = factory(InteractionFragment::class)->create(['fragmentable_id' => $int3->id, 'fragmentable_type' => 'interaction','parent_id' => $if7->id]);         

        $io4 = factory(InteractionOperand::class)->create(['constraint' => '']);
        $if9 = factory(InteractionFragment::class)->create(['fragmentable_id' => $io4->id, 'fragmentable_type' => 'interaction_operand', 'parent_id' => $if6->id]);
        $int4 = factory(Interaction::class)->create();
        $if10 = factory(InteractionFragment::class)->create(['fragmentable_id' => $int4->id, 'fragmentable_type' => 'interaction','parent_id' => $if9->id]);         



        $message1 = factory(Message::class)->make(['sort' => 'synchCall']);
        $occSpec1 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline2->id,'time' => '180']);//a()
        $occSpec2 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline3->id,'time' => '180']);
        $message1->interaction()->associate($interaction2);
        $message1->sendEvent()->associate($occSpec1->id);
        $message1->receiveEvent()->associate($occSpec2->id);
        $message1->save();

        $message2 = factory(Message::class)->make(['sort' => 'synchCall']);
        $occSpec3 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline2->id,'time' => '200']);//b()
        $occSpec4 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline3->id,'time' => '200']);
        $message2->interaction()->associate($interaction2);
        $message2->sendEvent()->associate($occSpec3->id);
        $message2->receiveEvent()->associate($occSpec4->id);
        $message2->save();

        $message3 = factory(Message::class)->make(['sort' => 'synchCall']);
        $occSpec5 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline1->id,'time' => '240']);//c()
        $occSpec6 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline3->id,'time' => '240']);
        $message3->interaction()->associate($interaction3);
        $message3->sendEvent()->associate($occSpec5->id);
        $message3->receiveEvent()->associate($occSpec6->id);
        $message3->save();

        $message4 = factory(Message::class)->make(['sort' => 'synchCall']);
        $occSpec7 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline1->id,'time' => '280']);//d()
        $occSpec8 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline2->id,'time' => '280']);
        $message4->interaction()->associate($interaction);
        $message4->sendEvent()->associate($occSpec7->id);
        $message4->receiveEvent()->associate($occSpec8->id);
        $message4->save();

        $message5 = factory(Message::class)->make(['sort' => 'synchCall']);
        $occSpec9 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline2->id,'time' => '300']);//e()
        $occSpec10 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline3->id,'time' => '300']);
        $message5->interaction()->associate($interaction);
        $message5->sendEvent()->associate($occSpec9->id);
        $message5->receiveEvent()->associate($occSpec10->id);
        $message5->save();

        $message6 = factory(Message::class)->make(['sort' => 'synchCall']);
        $occSpec11 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline2->id,'time' => '400']);//f()
        $occSpec12 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline3->id,'time' => '400']);
        $message6->interaction()->associate($int1);
        $message6->sendEvent()->associate($occSpec11->id);
        $message6->receiveEvent()->associate($occSpec12->id);
        $message6->save();

        $message7 = factory(Message::class)->make(['sort' => 'synchCall']);
        $occSpec13 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline1->id,'time' => '450']);//g()
        $occSpec14 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline2->id,'time' => '450']);
        $message7->interaction()->associate($int2);
        $message7->sendEvent()->associate($occSpec13->id);
        $message7->receiveEvent()->associate($occSpec14->id);
        $message7->save();

        $message8 = factory(Message::class)->make(['sort' => 'synchCall']);
        $occSpec15 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline1->id,'time' => '470']);//h()
        $occSpec16 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline3->id,'time' => '470']);
        $message8->interaction()->associate($int2);
        $message8->sendEvent()->associate($occSpec15->id);
        $message8->receiveEvent()->associate($occSpec16->id);
        $message8->save();

        $message9 = factory(Message::class)->make(['sort' => 'synchCall']);
        $occSpec17 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline2->id,'time' => '520']);//x()
        $occSpec18 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline3->id,'time' => '520']);
        $message9->interaction()->associate($int3);
        $message9->sendEvent()->associate($occSpec17->id);
        $message9->receiveEvent()->associate($occSpec18->id);
        $message9->save();

        $message10 = factory(Message::class)->make(['sort' => 'synchCall']);
        $occSpec19 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline2->id,'time' => '550']);//y()
        $occSpec20 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline3->id,'time' => '550']);
        $message10->interaction()->associate($int3);
        $message10->sendEvent()->associate($occSpec20->id);
        $message10->receiveEvent()->associate($occSpec19->id);
        $message10->save();

        $message11 = factory(Message::class)->make(['sort' => 'synchCall']);
        $occSpec21 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline2->id,'time' => '580']);//z()
        $occSpec22 = factory(OccurrenceSpecification::class)->create(['lifeline_id' => $lifeline3->id,'time' => '580']);
        $message11->interaction()->associate($int4);
        $message11->sendEvent()->associate($occSpec22->id);
        $message11->receiveEvent()->associate($occSpec21->id);
        $message11->save();
    }
}
