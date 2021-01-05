<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Session;

class SessionTableFeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = \Faker\Factory::create();

        for($i = 0; $i < 50; $i++) {
            Session::create([
                'Name' => $faker->name,
                'CountryCode' => $faker->stateAbbr,
                'BallImage' => $faker->imageUrl(300, 300),
                'Score' => $faker->randomDigit
            ]);
        }
    }
}
