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
        $this->call(MinimalSequenceDiagramSeeder::class);
        //$this->call(ComplexSequenceDiagramSeeder::class);
    }
}
