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

$factory->define(App\Models\Lifeline::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
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
        'time' => $faker->numberBetween(0, 100),
    ];
});

$factory->define(App\Models\Layer::class, function (Faker\Generator $faker) {
    return [
        'depth' => $faker->numberBetween(0, 100),
    ];
});
