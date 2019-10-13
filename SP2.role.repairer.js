var __constants = require('SP2__constants');
var TICKS_LEFT = __constants.TICKS_LEFT;
var REPAIR_THRESHOLD = __constants.REPAIR_THRESHOLD;

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.carry.energy == creep.carryCapacity) { creep.memory.tank = 'FULL' };
        if (creep.carry.energy == 0) { creep.memory.tank = 'EMPTY'};

	    if(creep.memory.tank == 'EMPTY' && creep.ticksToLive > TICKS_LEFT) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        
        else {

            // LOOK FOR WALL ROADS BELOW REPAIR THRESHOLD
            var roads = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax * REPAIR_THRESHOLD && structure.hitsMax > 700000);}});
            roads.sort((a,b) => (a.hits - b.hits));
            
            if(roads.length > 0) {
                if(creep.repair(roads[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(roads[0]);
                }
            }

            // REPAIR REGULAR STRUCTURES
            else {

                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });
    
                //targets.sort((a,b) => a.hits - b.hits);
                targets.sort((a,b) => (a.hits - b.hits));
    
                if(targets.length > 0) {
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }

            }
            
        }
	}
};

module.exports = roleRepairer;