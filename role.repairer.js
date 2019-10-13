var __constants = require('__constants');
var __f = require('__functions');
var TICKS_LEFT = __constants.TICKS_LEFT;

var roleRepairer = {

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
            var allMountainRoads = __f.findStructure(creep, STRUCTURE_ROAD, 700000);
            var allRoads = __f.findStructure(creep, STRUCTURE_ROAD);


            // CHECK FOR EMERGENCY REPAIRS IN SPECIAL STRUCTURES
            if(allMountainRoads[0].length > 0) { __f.fixStructure(creep, allMountainRoads[0]); }
            else if(allRoads[0].length > 0) { __f.fixStructure(creep, allRoads[0]); }

            // CHECK FOR REGULAR REPAIRS FOR SPECIAL STRUCTURES
            else if(allMountainRoads[1].length > 0) { __f.fixStructure(creep, allMountainRoads[1].sort((a, b) => (a.hits - b.hits))); }
            else if(allRoads[1].length > 0) { __f.fixStructure(creep, allRoads[1]); }
            

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

module.exports = roleRepairer;




// RETURNS AN ARRAY OF STRUCTURES BASED ON STRUCTURE TYPE, REPAIR THRESHOLD AND MINIMUM AMOUNT OF MAX HITS
function findStructure(creep, structType, minHits) {
    minHits = minHits || 0;
    
    var doubleArray = [];
    doubleArray[0] = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return ((structure.structureType == structType) && structure.hits < structure.hitsMax * __constants.EMERGENCY_REPAIR_THRESHOLD && structure.hitsMax > minHits);}});
    doubleArray[1] = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return ((structure.structureType == structType) && structure.hits < structure.hitsMax * __constants.REPAIR_THRESHOLD && structure.hitsMax > minHits);}});
    
    return doubleArray;
}



// FIX STRUCTURE FROM ARRAY TYPE
function fixStructure(creep, structureArray) {
    if(creep.repair(structureArray[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(structureArray[0], {visualizePathStyle: {stroke: '#ffffff'}});
    }
}
