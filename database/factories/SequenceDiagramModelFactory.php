<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

function autoIncrementGenerator()
{
    for ($i = 1; $i < PHP_INT_MAX; $i++) {
        yield $i;
    }
}

/** @var $factory \Illuminate\Database\Eloquent\Factory */
$factory->define(App\Models\CombinedFragment::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->word,
        'operator' => $faker->randomElement(['alt', 'opt', 'par', 'loop', 'critical', 'neg', 'assert', 'strict', 'seq', 'ignore', 'consider']),
    ];
});

$factory->define(App\Models\ExecutionSpecification::class, function (Faker\Generator $faker) {
    return [
        //
    ];
});

$factory->define(App\Models\Interaction::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->word,
    ];
});

$factory->define(App\Models\InteractionFragment::class, function (Faker\Generator $faker) {
    return [
        //
    ];
});

$factory->define(App\Models\InteractionOperand::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->word,
        'constraint' => $faker->lexify('? ').$faker->randomElement(['<', '<=', '==', '!=', '>=', '>']).$faker->bothify(' *'),
    ];
});

$lifelineAutoIncrement = autoIncrementGenerator();

$factory->define(App\Models\Lifeline::class, function (Faker\Generator $faker) use (&$lifelineAutoIncrement) {
    $lifelineAutoIncrement->next();

    return [
        'name' => $faker->name,
        'order' => $lifelineAutoIncrement->current(),
    ];
});

$factory->state(App\Models\Lifeline::class, 'resetOrder', function (Faker\Generator $faker) use (&$lifelineAutoIncrement) {
    $lifelineAutoIncrement = autoIncrementGenerator();

    return [
        'order' => $lifelineAutoIncrement->current(),
    ];
});

$factory->define(App\Models\Message::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->randomLetter.'()',
        'sort' => $faker->randomElement(['synchCall', 'asynchCall', 'asynchSignal', 'createMessage', 'deleteMessage', 'reply']),
    ];
});

$factory->define(App\Models\OccurrenceSpecification::class, function (Faker\Generator $faker) {
    return [
        'time' => $faker->numberBetween(1, 100),
    ];
});
