var LeaderBoard = function() {};

LeaderBoard.prototype = {
    preload: function() {
        // Hide inputs
        inputAngle.style.display = 'none';
        inputPower.style.display = 'none';
    },
    create: function() {
        // Clear time record
        clearInterval(game.timeRecords);

        // looks like we have to create a style for or menu option
        var optionStyle = { font: '60pt PixelLife', fill: 'white', align: 'left' };
        // the text for Congratulations
        var txt = game.add.text(game.width/2, 100, 'Congratulations !', optionStyle);
        txt.anchor.setTo(0.5);

        // The score
        var scoreTxt = game.add.text(game.width/2, 150, 'Your score: ' + score, { font: '30pt PixelLife', fill: 'white', align: 'left' });
        scoreTxt.anchor.setTo(0.5);

        // The leaderboard score
        // title
        var leaderBoardTxt = game.add.text(game.width/2, game.height/2, 'Leader Board', { font: '45pt PixelLife', fill: 'white', align: 'left' });
        leaderBoardTxt.anchor.setTo(0.5);
        // Show table
        // Fetch API
        // Get the top 5
        fetch(leaderBoardGameUrl)
        .then(response => response.json())
        .then(function(result) {
            var sessions = (Object.values(result)).sort((a, b) => (a.score < b.score) ? 1 : -1); // Get all the sessions

            // Get only the game won
            var index = 0;
            for(var i = 0; i <= sessions.length; i++) {
                if(sessions[i].score == null) {
                    index = i-1; // Get index of the last won game
                    break;
                }
            }

            var leaderBoard = index >= 5 ? sessions.slice(0, 5) : sessions.slice(0, index+1); // Get the top 5

            var isTop5 = leaderBoard.filter(function(session) {
                if(session.id == game.session.id) return true;
            }).length >= 1; // If the current session is in the top 5

            // Display the table
            leaderBoardTable.style.display = 'block';
            // Center the table
            leaderBoardTable.style.top = game.height / 2;
            leaderBoardTable.style.left = game.width / 2;
            // Build the table
            this.buildTable(leaderBoard, isTop5);
        }.bind(this))
        .catch(error => console.log('error', error));

        // the text for restart
        var restart = game.add.text(game.width/2, game.height - 100, 'Restart', { font: '30pt PixelLife', fill: 'white', align: 'left' });
        restart.anchor.setTo(0.5);
        restart.inputEnabled = true;
        restart.events.onInputUp.add(function () { 
            this.resetGame();
            game.state.start('GameMenu');
        }.bind(this));
        // Hover event
        restart.events.onInputOver.add(function (target) {
            target.fill = "green";
            target.setShadow(3, 3, 'rgba(0,0,0,0.7)', 5);
        });
        restart.events.onInputOut.add(function (target) {
            target.fill = "white";
            target.setShadow(3, 3, 'rgba(0,0,0,0.2)', 5);
        });
    },
    resetGame: function() {
        score = 0;
        ascendingRange = true;
        isShoot = false; // When the force and angle has been choosen
        isAngle = false; // When the force has been choosen
        isThrown = false;
        angle = 180;
        force = 0;
        ascending = false;
        currentSpeed = 0;
        isUp = true;

        console.log(game)

        clearInterval(game.angleVariation);
        clearInterval(game.forceVariation);

        inputPower.value = force;
        inputAngle.value = angle;
    },
    buildTable: function(leaderBoard, isTop5) {
        leaderBoardTable.innerHTML = '';

        leaderBoard.forEach(function(session, index) {
            if(isTop5 && session.id == game.session.id) leaderBoardTable.innerHTML += `<tr class="leader__row leader__row--${index+1} leader__row--current"><td><!-- img --></td><td>${session.Name}</td><td>${session.score}</td></tr>`;
            else leaderBoardTable.innerHTML += `<tr class="leader__row leader__row--${index+1}"><td><!-- img --></td><td>${session.Name}</td><td>${session.score}</td></tr>`;
        });

        if(!isTop5) leaderBoardTable.innerHTML += `<tr class="leader__row leader__row--current"><td><!-- img --></td><td>${game.session.Name}</td><td>${game.session.score}</td></tr>`;
    }
};