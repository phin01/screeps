var __c = require('SP2__constants');


var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.carry.energy == creep.carryCapacity) { creep.memory.tank = 'FULL' };
        if (creep.carry.energy == 0) { creep.memory.tank = 'EMPTY'};

	    if(creep.memory.tank == 'EMPTY' && creep.ticksToLive > __c.TICKS_LEFT) {

            var containers = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: function (structure) { return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] > 0); }});
			if(containers) {
                if(creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }


            // var sources = creep.room.find(FIND_SOURCES);
            // if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffffff'}});
            // }
        }
        
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};

module.exports = roleUpgrader;