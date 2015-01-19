var mongoose = require('mongoose');

var PlayerSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    type: {
        type: String,
        enum: ['Batsman', 'Bowler', 'WicketKeeper', "AllRounder"],
        require: true
    }
});

var PlayerModel = mongoose.model("Player", PlayerSchema);

PlayerModel.findAll = function(callback) {
    PlayerModel.find({}, callback);
}

exports.PlayerModel = PlayerModel;