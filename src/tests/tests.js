﻿module("Tic-Tac-Toe ViewModel Instantiation", {
    setup: function () { init(); }
})

test("test viewmodel observable can be set", function () {
    var expectedName = "Newton";
    viewModel.playerName = ko.observable(expectedName);
    equal(viewModel.playerName(), expectedName);
});

module("Tic-Tac-Toe ViewModel New Game", {
    setup: function () { init(); }
})

test("test new game clears tiles", function () {
    updateTile(0, playerIcon);
    equal(tile(0), playerIcon);

    newGame();
    equal(tile(0), emptyTile);
});

test("test new game maintains player name", function () {
    var expectedName = "Newton";
    viewModel.playerName = ko.observable(expectedName);
    equal(viewModel.playerName(), expectedName);
    newGame();
    equal(viewModel.playerName(), expectedName);
});

module("Tic-Tac-Toe Text", {
    setup: function () { init(); }
})

test("test display name on blank player name", function () {
    var expectedName = "You";
    var blankName = "";
    var playerName = ko.observable(blankName);
    var actual = getDisplayName(playerName);
    equal(actual, expectedName);
});

test("test display name is equal to input name", function () {
    var expectedName = "Newton";
    var playerName = ko.observable(expectedName);
    var actual = getDisplayName(playerName);
    equal(actual, expectedName);
});

test("test notification, player won, without name", function () {
    var expected = "You won!";
    var playerName = ko.observable();
    winner = player;
    gameOver = true;
    var actual = getNotificationMessage(playerName);
    equal(actual, expected);
});

test("test notification, player won, with name", function () {
    var expected = "Newton won!";
    var name = "Newton";
    var playerName = ko.observable(name);
    winner = player;
    gameOver = true;
    var actual = getNotificationMessage(playerName);
    equal(actual, expected);
});

module("Tic-Tac-Toe Board", {
    setup: function () { init(); }
})

test("test update tile number value", function () {
    var tileNumber = 8;
    var expected = 111;

    updateTile(tileNumber, expected);
    var actual = viewModel.tiles()[tileNumber];
    equal(actual, expected);
});

test("test update won't update when gameOver", function () {
    gameOver = true;
    var number = 0;
    updateTile(number, playerIcon);
    var actual = viewModel.tiles()[number];
    var expected = emptyTile;
    equal(actual, expected);
});

test("test update tile string value", function () {
    var tileNumber = 2;
    var expected = "X";

    updateTile(tileNumber, expected);
    var actual = viewModel.tiles()[tileNumber];
    equal(actual, expected);
});

test("test player move does not occur on computer turn", function () {
    playerTurn = false;

    var beforeTile = viewModel.tiles()[2];
    equal(beforeTile, emptyTile);

    playerMove(2, playerIcon);

    var afterTile = viewModel.tiles()[2];
    equal(afterTile, emptyTile);
});

test("test player on player turn move updates tile", function () {
    playerTurn = true;

    var beforeTile = viewModel.tiles()[2];
    equal(beforeTile, emptyTile);

    playerMove(2, playerIcon);

    var afterTile = viewModel.tiles()[2];
    equal(afterTile, playerIcon);
});

asyncTest("test execute round calls playerMove and computerMove", function () {
    var playerBeforeTile = viewModel.tiles()[0];
    equal(playerBeforeTile, emptyTile);

    equal(viewModel.tiles.indexOf(computerIcon) == -1, true);

    executeRound(0);

    var playerAfterTile = viewModel.tiles()[0];
    equal(playerAfterTile, playerIcon);    

    //asynctest and timeout are necessary here to match runtime timeout, else test asserts too early
    setTimeout(function () {
        equal(viewModel.tiles.indexOf(computerIcon) >= 0, true);
        QUnit.start();        
    }, 500);
});

module("Tic-Tac-Toe Win Conditions", {
    setup: function () { init(); }
})

test("test computer can win", function () {
    updateTile(0, computerIcon);
    updateTile(1, computerIcon);
    updateTile(2, computerIcon);
    checkForWinner();
    equal(winner, computer);
});

test("test winner finds 3 horizontal first row", function () {
    updateTile(0, playerIcon);
    updateTile(1, playerIcon);
    updateTile(2, playerIcon);
    checkForWinner();
    equal(winner, player);
});

test("test winner finds 3 horizontal second row", function () {
    updateTile(3, playerIcon);
    updateTile(4, playerIcon);
    updateTile(5, playerIcon);
    checkForWinner();
    equal(winner, player);
});

test("test winner finds 3 horizontal third row", function () {
    updateTile(6, playerIcon);
    updateTile(7, playerIcon);
    updateTile(8, playerIcon);
    checkForWinner();
    equal(winner, player);
});

test("test winner finds 3 vertical first row", function () {
    updateTile(0, playerIcon);
    updateTile(3, playerIcon);
    updateTile(6, playerIcon);
    checkForWinner();
    equal(winner, player);
});

test("test winner finds 3 vertical second row", function () {
    updateTile(1, playerIcon);
    updateTile(4, playerIcon);
    updateTile(7, playerIcon);
    checkForWinner();
    equal(winner, player);
});

test("test will not do premature draw", function () {
    updateTile(0, playerIcon);
    updateTile(1, computerIcon);
    updateTile(8, playerIcon);
    checkForWinner();
    equal(winner, "");
});

module("Tic-Tac-Toe Computer Moves", {
    setup: function () { init(); }
})

test("test computer first move with player at corner tile", function () {
    updateTile(0, playerIcon);
    var move = determineComputerMove();
    equal(move, 4);
});

test("test computer first move with player at center tile", function () {
    updateTile(4, playerIcon);
    var move = determineComputerMove();
    equal(move, 0);
});

test("test computer first move with player at top middle tile", function () {
    updateTile(1, playerIcon);
    var move = determineComputerMove();
    equal(move, 0);
});

test("test computer first move with player middle left tile", function () {
    updateTile(3, playerIcon);
    var move = determineComputerMove();
    equal(move, 0);
});

test("test computer capitalizes on two in a row horizontal", function () {
    updateTile(0, playerIcon);
    updateTile(6, computerIcon);
    updateTile(3, playerIcon);
    updateTile(7, computerIcon);
    updateTile(5, playerIcon);
    var move = determineComputerMove();
    equal(move, 8);
});

test("test computer capitalizes on two in a row vertical", function () {
    updateTile(0, playerIcon);
    updateTile(1, computerIcon);
    updateTile(5, playerIcon);
    updateTile(4, computerIcon);
    updateTile(6, playerIcon);
    var move = determineComputerMove();
    equal(move, 7);
});

test("test computer  capitalizes on two in a row diagonal", function () {
    updateTile(1, playerIcon);
    updateTile(4, computerIcon);
    updateTile(5, playerIcon);
    updateTile(0, computerIcon);
    updateTile(7, playerIcon);
    var move = determineComputerMove();
    equal(move, 8);
});

test("test computer stops player two in a row horizontal", function () {
    updateTile(0, playerIcon);
    updateTile(4, computerIcon);
    updateTile(1, playerIcon);
    var move = determineComputerMove();
    equal(move, 2);
});

test("test computer stops player two in a row vertical", function () {
    updateTile(0, playerIcon);
    updateTile(4, computerIcon);
    updateTile(3, playerIcon);
    var move = determineComputerMove();
    equal(move, 6);
});

test("test computer stops player two in a row diagonal", function () {
    updateTile(4, playerIcon);
    updateTile(0, computerIcon);
    updateTile(2, playerIcon);
    var move = determineComputerMove();
    equal(move, 6);
});

test("test computer next move prevents forking", function () {
    updateTile(0, playerIcon);
    updateTile(4, computerIcon);
    updateTile(7, playerIcon);
    var move = determineComputerMove();
    equal(move, 3);
});