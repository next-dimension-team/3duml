<?php

use App\Lifeline;
use Illuminate\Database\Seeder;

class LifelinesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 0; $i < 10; $i++)
        {
            Lifeline::create([]);
        }
    }
}
