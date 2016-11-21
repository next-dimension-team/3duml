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
$factory->define(App\Models\User::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'password' => $password ?: $password = bcrypt('secret'),
        'remember_token' => str_random(10),
    ];
});

$factory->define(App\Models\CombinedFragment::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'operator' => $faker->randomElement(['alt', 'opt', 'par', 'loop', 'critical', 'neg', 'assert', 'strict', 'seq', 'ignore', 'consider']),
    ];
});

$factory->define(App\Models\ExecutionSpecification::class, function (Faker\Generator $faker) {
    return [
    ];
});

$factory->define(App\Models\Interaction::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
    ];
});
