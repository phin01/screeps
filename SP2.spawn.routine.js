var __constants = require('SP2__constants');
var __functions = require('__functions');
var spName = __constants.SP2_NAME;

  
  function listOfCreeps(creepType) {
        var creepTypeList = _.filter(Game.creeps, (creep) => creep.memory.role == creepType);
        return creepTypeList;
    }

    function spawnCreepOfType(creepType, creepLevel, i, currentRoom) {
        i = i || 0;
        var newName = currentRoom + '_' + creepType + '_' + Game.time;
            var result = Game.spawns['' + spName +''].spawnCreep(creepLevel, newName, {memory: { role: '' + creepType + '', tank: 'EMPTY', index: i, room: '' + currentRoom + '' }});
            if(result == 0) {
                console.log('Spawning new ' + creepType + ': ' + newName);    
            }
    }
 

var spawnRoutine = {
    
    run: function() {

        // GET LIST OF CURRENT CREEPS, BY TYPE
        var harvesterList = listOfCreeps('harvesterSP2');
        var dedHarv1List = listOfCreeps('dedicated_harv1SP2');
        var builderList = listOfCreeps('builderSP2');
        var upgraderList = listOfCreeps('upgraderSP2');
        var repairerList = listOfCreeps('repairerSP2');
        var transporterList = listOfCreeps('transporterSP2');

        // LIST ALL CREEPS AS REFERENCE
        console.log('SP2: ' + (harvesterList.length + dedHarv1List.length) +  ' harvesters | ' + builderList.length + ' builders | ' + upgraderList.length + ' upgraders | ' + repairerList.length + ' repairers | ' + transporterList.length + ' transporters --- ' + Game.spawns['' + spName +''].room.energyAvailable + ' room energy');

        // CHECK AMOUNT OF FULL EXTENSIONS
        var strExtensions = Game.spawns['' + spName +''].room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION && structure.energy == structure.energyCapacity);}});

        var creepLevel;
        var builderLevel;
        // DEFAULT CREEP, ONLY SPAWN ENERGY (300 ENERGY = 100 WORK, 50 CARRY, 50 MOVE)
        //creepLevel = [WORK, CARRY, CARRY, CARRY, MOVE];
        creepLevel = [WORK, CARRY, MOVE];
        // harvesterLevel = [WORK, WORK, WORK, CARRY, MOVE];
        harvesterLevel = [WORK, WORK, CARRY, MOVE];
        upgraderLevel = [WORK, CARRY, CARRY, MOVE];
        transporterLevel = [WORK, CARRY, CARRY, CARRY, CARRY, MOVE];
        builderLevel = [WORK, CARRY, CARRY, CARRY, MOVE];
    

        
        // AUTO SPAWN REPAIRERS (ACCORDING TO CREEP TYPE LIMIT AND EXISTENCE OF BROKEN STRUCTURES)
        if(repairerList.length < __constants.REPAIRER_LIMIT && __functions.brokenStructures()) {
            spawnCreepOfType('repairerSP2', creepLevel, 0, 'W3S15');
        }
        // AUTOSPAWN DEDICATED HARVESTER FOR SOURCE 1
        else if(dedHarv1List.length < __constants.DEDICATED_HARVESTER1_LIMIT) {
            spawnCreepOfType('dedicated_harv1SP2', harvesterLevel, 1, 'W3S15');
        }
        // AUTO SPAWN HARVESTERS (ACCORDING TO CREEP TYPE LIMIT)
        else if(harvesterList.length < __constants.HARVESTER_LIMIT) {
            spawnCreepOfType('harvesterSP2', creepLevel, 0, 'W3S15');
        }
        // TRANSPORTERS
        else if(transporterList.length < __constants.TRANSPORTER_LIMIT) {
            spawnCreepOfType('transporterSP2', transporterLevel, 0, 'W3S15');
            spawnCreepOfType('transporterSP2', creepLevel, 0, 'W3S15');
        }
        // AUTO SPAWN BUILDERS (ACCORDING TO CREEP TYPE LIMIT)
        else if(builderList.length < __constants.BUILDER_LIMIT) {
            spawnCreepOfType('builderSP2', builderLevel, 0, 'W3S15');
        }
        // AUTO SPAWN UPGRADERS (ACCORDING TO CREEP TYPE LIMIT)
        else if(upgraderList.length < __constants.UPGRADER_LIMIT) {
            spawnCreepOfType('upgraderSP2', upgraderLevel, 0, 'W3S15');
        }
        else { }
    
    }
}


module.exports = spawnRoutine;