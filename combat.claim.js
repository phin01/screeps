var __c = require('__constants');
var __f = require('__functions');



function spawnClaimer() {

    var claimerList = __f.listOfCreeps(__c.ROLE_CLAIMER, 0);
    var recommendedBody = [CLAIM, CLAIM, MOVE];

    if (claimerList.length < 1) {
        __f.spawnCreepOfType(__c.ROLE_CLAIMER, recommendedBody, 0);
    }
}


function claimController(X, Y, NEW_ROOM) {

    var claimerList = __f.listOfCreeps(__c.ROLE_CLAIMER, 0);
    
    if(claimerList.length > 0) {

        for (name in claimerList) {
            var claimer = claimerList[name];
            claimer.moveTo(new RoomPosition(X, Y, '' + NEW_ROOM +''));
            claimer.claimController(Game.rooms['' + NEW_ROOM +''].controller)
        }
    }
}


function spawnBuilder(NEW_ROOM) {

    var targets = Game.rooms['' + NEW_ROOM + ''].find(FIND_CONSTRUCTION_SITES);

    var spawnBuilerList = __f.listOfCreeps(__c.ROLE_SPAWN_BUILDER, 0);
    var recommendedBody = [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE];

    if(spawnBuilerList.length < 3) {
        // __f.spawnCreepOfType(__c.ROLE_SPAWN_BUILDER, recommendedBody, 0);
    }

    for (name in spawnBuilerList) {
        var creep = spawnBuilerList[name];


        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
        }

	    if(creep.memory.building) {
            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
		}
		// GATHER ENERGY FROM CONTAINERS
	    else {

            var sources = Game.rooms['' + NEW_ROOM +''].find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
            }

            // __f.gatherEnergy(creep);
            // __f.gatherEnergySource(creep);
	    }
    }
}




module.exports = { spawnBuilder, spawnClaimer, claimController };


