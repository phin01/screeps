var __constants = require('__constants');
var __functions = require('__functions');
var TICKS_LEFT = __constants.TICKS_LEFT;


var roleDedicatedHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {


        // CHECK FOR SOURCES TO HARVEST
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[creep.memory.index]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.index], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }



        // DUMP THAT ENERGY AWAY FOR TRANSPORT
        else {

            // FAR AWAY HARVESTER, DUMP ENERGY INTO LINK (IF NOT FULL)
            var nearbyLink = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: function(structure) { return (structure.structureType == STRUCTURE_LINK);}});
            // && structure.energy < structure.energyCapacity
            
            // if(creep.memory.index == 1 && nearbyLink.energy < nearbyLink.energyCapacity) {
            if(1 < 0) {
                if(creep.transfer(nearbyLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearbyLink, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }

            // OTHERWISE, FILL CONTAINER
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

