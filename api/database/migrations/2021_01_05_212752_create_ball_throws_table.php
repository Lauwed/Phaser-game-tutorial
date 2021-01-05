<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBallThrowsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ball_throws', function (Blueprint $table) {
            $table->id();
            $table->dateTime('Time')->nullable(false);
            $table->integer('Angle')->nullable(false);
            $table->integer('Power')->nullable(false);

            $table->integer('session_id')->unsigned()->nullable(false);

            $table->foreign('session_id')->references('id')->on('sessions');

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
