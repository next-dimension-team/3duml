<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);
        die("\nERROR: Please choose concrete database seeder with command\n$ php artisan db:seed --class SEEDER_NAME\n\n");
    }
}
