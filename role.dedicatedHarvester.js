var __constants = require('__constants');
var __functions = require('__functions');
var TICKS_LEFT = __constants.TICKS_LEFT;


var roleDedicatedHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {

        
        // CHECK FOR SOURCES TO HARVEST (DEDICATED HARVESTER RECEIVES SOURCE ATTRIBUTE WHEN SPAWNED)
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[creep.memory.index]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.index], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }


        // DUMP THAT ENERGY AWAY FOR TRANSPORT
        else {

            // CHECK IF HARVESTER HAS A NEARBY LINK FOR TRANSPORT
            var nearbyLink = creep.pos.findInRange(FIND_STRUCTURES, 2, { filter: function(structure) { return (structure.structureType == STRUCTURE_LINK);}});
            
            if(nearbyLink.length > 0) {
                if(nearbyLink[0].energy < nearbyLink[0].energyCapacity) {
                    if(creep.transfer(nearbyLink[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(nearbyLink[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }

            // OTHERWISE, FILL CLOSEST CONTAINER
            else {
                var targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function(structure) {
                        return (structure.structureType == STRUCTURE_CONTAINER) /*&& structure.store[RESOURCE_ENERGY] < structure.storeCapacity*/;
                    }
                });
                
    
                if(targets) {
                    if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
    }
};

module.exports = roleDedicatedHarvester;

