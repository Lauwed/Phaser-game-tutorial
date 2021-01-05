<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class BallThrows extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ball_throws', function (Blueprint $table) {
            $table->id();
            $table->dateTime('time')->nullable(false);
            $table->integer('angle')->nullable(false);
            $table->integer('power')->nullable(false);

            $table->integer('session_id')->unsigned()->nullable(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ball_throws');
    }
}
