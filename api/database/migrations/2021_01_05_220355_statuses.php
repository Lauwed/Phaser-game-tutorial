<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Statuses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('statuses', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('session_id')->unsigned()->nullable(false);
            $table->bigInteger('type_status_id')->unsigned()->nullable(false);

            $table->foreign('type_status_id')->references('id')->on('type_statuses');
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
        Schema::dropIfExists('statuses');
    }
}
