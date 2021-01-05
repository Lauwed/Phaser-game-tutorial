<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TypeStatus;

class TypeStatusTableFeeder extends Seeder
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
            TypeStatus::create([
                'Litteral' => $faker->name
            ]);
        }
    }
}
