<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;
use App\Models\CombinedFragment;
use App\Models\InteractionOperand;
use App\Models\ExecutionSpecification;
use App\Models\Interaction;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Relation::morphMap([
            'combnined_fragment' => CombinedFragment::class,
            'interaction_operand' => InteractionOperand::class,
            'interaction' => Interaction::class,
            'execution_specification' => ExecutionSpecification::class,
        ]);
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
