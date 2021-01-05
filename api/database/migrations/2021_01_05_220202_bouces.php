<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Bouces extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bounces', function (Blueprint $table) {
            $table->id();
            $table->integer('distance')->nullable(false);
            
            $table->bigInteger('session_id')->unsigned()->nullable(false);

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
        Schema::dropIfExists('bounces');
    }
}
