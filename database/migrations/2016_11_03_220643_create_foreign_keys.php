<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateForeignKeys extends Migration
{
    public function up()
    {
        Schema::table('state_invariants', function (Blueprint $table) {
            $table->foreign('lifeline_id')->references('id')->on('lifelines')
                        ->onDelete('restrict')
                        ->onUpdate('restrict');
        });
        Schema::table('lifelines', function (Blueprint $table) {
            $table->foreign('interaction_id')->references('id')->on('interactions')
                        ->onDelete('restrict')
                        ->onUpdate('restrict');
        });
        Schema::table('execution_occurrence_specifications', function (Blueprint $table) {
            $table->foreign('lifeline_id')->references('id')->on('lifelines')
                        ->onDelete('restrict')
                        ->onUpdate('restrict');
        });
        Schema::table('messages', function (Blueprint $table) {
            $table->foreign('interaction_id')->references('id')->on('interactions')
                        ->onDelete('restrict')
                        ->onUpdate('restrict');
        });
        Schema::table('message_occurrence_specifications', function (Blueprint $table) {
            $table->foreign('lifeline_id')->references('id')->on('lifelines')
                        ->onDelete('restrict')
                        ->onUpdate('restrict');
        });
        Schema::table('lifelines_combined_fragments', function (Blueprint $table) {
            $table->foreign('combined_fragment_id')->references('id')->on('combined_fragments')
                        ->onDelete('restrict')
                        ->onUpdate('restrict');
        });
        Schema::table('lifelines_combined_fragments', function (Blueprint $table) {
            $table->foreign('lifeline_id')->references('id')->on('lifelines')
                        ->onDelete('restrict')
                        ->onUpdate('restrict');
        });
        Schema::table('lifelines_interaction_operands', function (Blueprint $table) {
            $table->foreign('lifeline_id')->references('id')->on('lifelines')
                        ->onDelete('restrict')
                        ->onUpdate('restrict');
        });
        Schema::table('lifelines_interaction_operands', function (Blueprint $table) {
            $table->foreign('interaction_operand_id')->references('id')->on('interaction_operands')
                        ->onDelete('restrict')
                        ->onUpdate('restrict');
        });
    }

    public function down()
    {
        Schema::table('state_invariants', function (Blueprint $table) {
            $table->dropForeign('state_invariants_lifeline_id_foreign');
        });
        Schema::table('lifelines', function (Blueprint $table) {
            $table->dropForeign('lifelines_interaction_id_foreign');
        });
        Schema::table('execution_occurrence_specifications', function (Blueprint $table) {
            $table->dropForeign('execution_occurrence_specifications_lifeline_id_foreign');
        });
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign('messages_interaction_id_foreign');
        });
        Schema::table('message_occurrence_specifications', function (Blueprint $table) {
            $table->dropForeign('message_occurrence_specifications_lifeline_id_foreign');
        });
        Schema::table('lifelines_combined_fragments', function (Blueprint $table) {
            $table->dropForeign('lifelines_combined_fragments_combined_fragment_id_foreign');
        });
        Schema::table('lifelines_combined_fragments', function (Blueprint $table) {
            $table->dropForeign('lifelines_combined_fragments_lifeline_id_foreign');
        });
        Schema::table('lifelines_interaction_operands', function (Blueprint $table) {
            $table->dropForeign('lifelines_interaction_operands_lifeline_id_foreign');
        });
        Schema::table('lifelines_interaction_operands', function (Blueprint $table) {
            $table->dropForeign('lifelines_interaction_operands_interaction_operand_id_foreign');
        });
    }
}
