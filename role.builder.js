var __constants = require('__constants');
var __functions = require('__functions');
	
	
	var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
		}
		// GATHER ENERGY FROM CONTAINERS
	    else {
			__functions.gatherEnergy(creep);
			
			
			/*var containers = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: function (structure) { return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] > 0); }});
			if(containers) {
                if(creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
			}
			*/

	    }
	}
};

module.exports = roleBuilder;

