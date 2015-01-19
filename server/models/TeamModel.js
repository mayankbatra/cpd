var mongoose = require('mongoose');
var PlayerSchema = require('./PlayerModel');

var TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    players: [{
        type: mongoose.Schema.ObjectId,
        ref: 'PlayerSchema'
    }],
    createdOn: Date,
    modifiedOn: Date,
    session: {
        type: String,
        required: true
    }
});

var TeamModel = mongoose.model("Team", TeamSchema);

TeamSchema.pre('validate', function(next) {
    var self = this;
    if (this.isNew) {
        this.createdOn = Date.now();
    }
    this.modifiedOn = Date.now();
    next();
});

TeamModel.findBySession = function(session, callback) {
    TeamModel.findOne({
        session: session
    }, callback);
}

TeamModel.createTeam = function(team, callback) {
    //Add Server Side Validation
    TeamModel.create(team, callback);
}

TeamModel.updateTeam = function(id, team, callback) {
    // Add Server Side Validation
    TeamModel.update({
        _id: id
    }, team, {
        upsert: true
    }, callback);
}

exports.TeamModel = TeamModel;