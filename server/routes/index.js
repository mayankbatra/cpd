var express = require('express');
var router = express.Router();
var config = require("../../configs/config").config;

var PlayerModel = require("../models/PlayerModel").PlayerModel;
var TeamModel = require("../models/TeamModel").TeamModel;


/* GET home page. */
router.get('/', function(req, res) {
    PlayerModel.findAll(function(err, players) {
        TeamModel.findBySession(req.sessionID, function(err, team) {
            console.log(team);
            res.render('index', {
                players: players,
                session: req.session,
                config: config,
                team: team
            });
        });
    })
});

/* GET home page. */
router.post('/', function(req, res) {
    console.log(req.body);
    team = req.body.team;
    team.session = req.sessionID;

    var id = team._id;
    delete team._id;

    if (id) {
        TeamModel.updateTeam(id, team, function(err, result) {
            console.log(err, result)
        });
    } else {
        TeamModel.createTeam(team, function(err, result) {
            console.log(err, result)
        });
    }
});

module.exports = router;