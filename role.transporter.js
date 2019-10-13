var __constants = require('__constants');
var TICKS_LEFT = __constants.TICKS_LEFT;


var roleTransporter = {
    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.carry.energy == creep.carryCapacity) { creep.memory.tank = 'FULL' };
        if (creep.carry.energy == 0) { creep.memory.tank = 'EMPTY'};

        var currentSpawn = creep.room.find(FIND_MY_SPAWNS)[0];


        // CHECK FOR CONTAINERS WITH ENERGY REMAINING
        if(creep.memory.tank == 'EMPTY' && creep.ticksToLive > TICKS_LEFT) {

            // LIST OF CONTAINERS ABOVE THE MINIMUM THRESHOLD (CLEAR THEM SO HARVESTERS CAN KEEP WORKING!)
            var fullContainers = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: function (structure) { return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > structure.storeCapacity * __constants.CONTAINER_THRESHOLD; }});
            // LIST OF CONTAINERS AT A LOWER LEVEL (THESE WILL DO, I SUPPOSE...)
            var regularContainers = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: function (structure) { return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0; }});
            // LINK CLOSEST TO SPAWN (THE ONE THAT SHOULD BE HARVESTED)
            // var spawnLink = Game.spawns['' + currentSpawn + ''].pos.findClosestByRange(FIND_STRUCTURES, { filter: function(link) { return link.structureType == STRUCTURE_LINK}});
            var spawnLink = currentSpawn.pos.findClosestByRange(FIND_STRUCTURES, { filter: function(link) { return link.structureType == STRUCTURE_LINK}});
            //containers.sort((a,b) => (a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]));
            //containers.reverse();
            
            if(spawnLink.energy > spawnLink.energyCapacity * __constants.CONTAINER_THRESHOLD) {
                if(creep.withdraw(spawnLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawnLink, {visualizePathStyle: {stroke: '#ffffff'}});
                } 
            }
            if(fullContainers) {
                if(creep.withdraw(fullContainers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(fullContainers, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else if(spawnLink.energy > 0) {
                if(creep.withdraw(spawnLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawnLink, {visualizePathStyle: {stroke: '#ffffff'}});
                } 
            }
            else if (regularContainers) {
                if(creep.withdraw(regularContainers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(regularContainers, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else { 
                // ANYTHING ELSE..?
            }

        }

        else {
            // CHECK IF TOWERS ARE AVAILABLE AND IN NEED OF ENERGY (HIGH PRIORITY!)
            var towers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => { return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity; }});

            towers.sort((a, b) => (a.energy - b.energy));

            if (towers.length > 0) {
                if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(towers[0], {visualizePathStyle: {stroke: '#ffffff'}});} 
            }

            // CHECK IF SPAWNING STRUCTURES ARE IN NEED OF ENERGY (EXTENSIONS OR SPAWN)
            else {
                var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function (structure) {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity; }});

                if(storage) {
                    if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }

                // OTHERWISE, STORE IT IN STORAGE
                else {

                    var spawn = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity; }});
    
                    if(spawn.length > 0) {
                        if(creep.transfer(spawn[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(spawn[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }

                }

            }
            
        }
    }
	
};

module.exports = roleTransporter;

