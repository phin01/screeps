var __constants = require('__constants');
var TICKS_LEFT = __constants.TICKS_LEFT;


var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {

        // CHECK FOR SOURCES TO LOAD CREEPS
        if(creep.carry.energy < creep.carryCapacity && creep.ticksToLive > TICKS_LEFT) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {

            // CHECK IF TOWERS ARE AVAILABLE AND IN NEED OF ENERGY (HIGH PRIORITY!)
            var towers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => { return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity; }});

            if (towers.length > 0) {
                if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(towers[0], {visualizePathStyle: {stroke: '#ffffff'}});} 
            }

            // CHECK IF OTHER STRUCTURES ARE IN NEED OF ENERGY
            else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
                });

                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }

            }
            
        }
    }
	
};

module.exports = roleHarvester;

