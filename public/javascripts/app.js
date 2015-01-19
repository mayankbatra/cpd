'use strict';

var IplApp = angular.module('IplApp', []);


IplApp.controller('TeamController', function($scope, $http, $window) {

    $scope.players = _.object(_.map(players, function(player) {
        return [player._id, player]
    }));
    $scope.types = _.chain(players).pluck('type').unique().value();
    $scope.types.push("");

    if (team == null || team.length == 0) {
        $scope.remainingCash = config.startingCash;
        $scope.team = {};
        $scope.team.players = [];
    } else {
        $scope.remainingCash = config.startingCash - _.reduce(team.players, function(sum, player) {
            return sum + $scope.players[player]['price'];
        }, 0);
        $scope.team = team;
        _.each($scope.team.players, function(player) {
            $scope.players[player]['visible'] = false
        });
    }




    $scope.addPlayer = function(player) {
        //Disable the player so that it can't be added again to this team
        var currentTeam = _.groupBy($scope.team.players, function(id) {
            return $scope.players[id].type;
        });
        var teamSize = $scope.team.players.length;
        if ($scope.team.players.length < 8) {
            if (currentTeam[player.type] == undefined || currentTeam[player.type] == null || config.type.max[player.type] > currentTeam[player.type].length) {
                if ($scope.remainingCash - $scope.players[player._id]['price'] >= 0) {
                    $scope.players[player._id]['visible'] = false;
                    $scope.remainingCash = $scope.remainingCash - $scope.players[player._id]['price'];
                    $scope.team.players.push(player._id);
                } else {
                    $scope.err = "Err: You do not have sufficient cash to purchase this player";
                }
            } else {
                $scope.err ="Err: Number of " + player.type + " more than " + config.type.max[player.type], currentTeam[player.type].length;
            }
        } else {
            $scope.err ="Err: Size of Team more than max";
        }

    }

    $scope.removePlayer = function(player) {
        //Disable the player so that it can't be added again to this team
        $scope.players[player]['visible'] = true;
        $scope.remainingCash = $scope.remainingCash + $scope.players[player]['price'];
        var index = $scope.team.players.indexOf(player);
        if (index > -1) {
            $scope.team.players.splice(index, 1);
        }
    }

    $scope.saveTeam = function() {

        var valid = validateTeam($scope.team, $scope.players);

        if (valid === true) {
            $scope.err = "";
            $http.post('/', {
                team: $scope.team
            }).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        } else
            $scope.err = valid;
    }

    function validateTeam(team, players) {
        var valid = true;
        var currentStructure = _.groupBy(team.players, function(id) {
            return players[id].type;
        });

        if(team.name == null || team.name == undefined || team.name =="")
            valid = "Please enter a name for the Team."

        if (team.players.length != 8) {
            valid = "Team size has to be 8 players.";
        }

        for (var type in currentStructure) {
            if (currentStructure[type] == undefined || currentStructure[type] == null || currentStructure[type].length > config.type.max[type] || currentStructure[type].length < config.type.min[type])
                valid = "Number of " + type + " has to be between " + config.type.min[type] + " and " + config.type.max[type];
        }

        return valid;
    }

});