<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateForeignKeys extends Migration
{
    public function up()
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->foreign('interaction_id')
                ->references('id')
                ->on('interactions')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            $table->foreign('send_event_id')
                ->references('id')
                ->on('occurrence_specifications')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            $table->foreign('receive_event_id')
                ->references('id')
                ->on('occurrence_specifications')
                ->onDelete('restrict')
                ->onUpdate('restrict');
        });

        Schema::table('interaction_fragments', function (Blueprint $table) {
            $table->foreign('parent_id')
                ->references('id')
                ->on('interaction_fragments')
                ->onDelete('restrict')
                ->onUpdate('restrict');
        });

        Schema::table('execution_specifications', function (Blueprint $table) {
            $table->foreign('start_occurrence_specification_id')
                ->references('id')
                ->on('occurrence_specifications')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            $table->foreign('finish_occurrence_specification_id')
                ->references('id')
                ->on('occurrence_specifications')
                ->onDelete('restrict')
                ->onUpdate('restrict');
        });

        Schema::table('occurrence_specifications', function (Blueprint $table) {
            $table->foreign('lifeline_id')
                ->references('id')
                ->on('lifelines')
                ->onDelete('restrict')
                ->onUpdate('restrict');
        });

        Schema::table('lifelines', function (Blueprint $table) {
            $table->foreign('layer_id')
                ->references('id')
                ->on('layers')
                ->onDelete('restrict')
                ->onUpdate('restrict');
        });
    }

    public function down()
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['interaction_id']);
            $table->dropForeign(['send_event_id']);
            $table->dropForeign(['receive_event_id']);
        });

        Schema::table('interaction_fragments', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
        });

        Schema::table('execution_specifications', function (Blueprint $table) {
            $table->dropForeign(['start_occurrence_specification_id']);
            $table->dropForeign(['finish_occurrence_specification_id']);
        });

        Schema::table('occurrence_specifications', function (Blueprint $table) {
            $table->dropForeign(['lifeline_id']);
        });

        Schema::table('lifelines', function (Blueprint $table) {
            $table->dropForeign(['layer_id']);
        });
    }
}