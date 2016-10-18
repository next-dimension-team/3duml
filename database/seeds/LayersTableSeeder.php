<?php

use Illuminate\Database\Seeder;

class LayersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($depth = 0; $depth < 5; $depth++)
        {
            App\Layer::create(['depth' => $depth]);
        }
    }
}
