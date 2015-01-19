
commonMethods ={};

commonMethods.validateTeam = function(team, players) {
    var valid = true;
    var currentStructure = _.groupBy(team.players, function(id) {
        return players[id].type;
    });

    if (team.players.length != 8) {
        valid = false;
    }

    for (type in currentStructure) {
        if (currentStructure[type] == undefined || currentStructure[type] == null || this.type.max[type] < currentStructure[type].length || currentStructure[type].length < this.type.max[type])
            valid = false;
    }

    return valid;
}