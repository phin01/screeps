var __constants = require('__constants');
var __functions = require('__functions');
var TICKS_LEFT = __constants.TICKS_LEFT;

var roleWallRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.carry.energy == creep.carryCapacity) { creep.memory.tank = 'FULL' };
        if (creep.carry.energy == 0) { creep.memory.tank = 'EMPTY'};

	    if(creep.memory.tank == 'EMPTY' && creep.ticksToLive > TICKS_LEFT) {

            var containers = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: function (structure) { return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0); }});
			if(containers) {
                if(creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
        
        else {

            // LOOK FOR SPECIAL STRUCTURES
            // RETURNS A DOUBLE ARRAY: array[0] = STRUCTURES UNDER THE EMERGENCY REPAIR THRESHOLD
            //                         array[1] = STRUCTURES UNDER THE REGULAR REPAIR THRESHOLD
            var allRamparts = __functions.findStructure(creep, STRUCTURE_RAMPART);
            var allWalls = __functions.findStructure(creep, STRUCTURE_WALL);



            // CHECK FOR EMERGENCY REPAIRS IN SPECIAL STRUCTURES
            // if(allWalls[0].length > 0) { __functions.fixStructure(creep, allWalls[0].sort((a, b) => (a.hits - b.hits))); }
            // else if(allRamparts[0].length > 0) { __functions.fixStructure(creep, allRamparts[0]); }

            if(allRamparts[0].length > 0) { __functions.fixStructure(creep, allRamparts[0]); }
            else if(allWalls[0].length > 0) { __functions.fixStructure(creep, allWalls[0].sort((a, b) => (a.hits - b.hits))); }
            

            // CHECK FOR REGULAR REPAIRS FOR SPECIAL STRUCTURES
            else if(allRamparts[1].length > 0) { __functions.fixStructure(creep, allRamparts[1].sort((a, b) => (a.hits - b.hits))); }
            else if(allWalls[1].length > 0) { __functions.fixStructure(creep, allWalls[1]).sort((a, b) => (a.hits - b.hits)); }
            


            // REPAIR OTHER STRUCTURES
            else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });

                if(targets.length > 0) {
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }

            }
            
        }
	}
};

module.exports = roleWallRepairer;

