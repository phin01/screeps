var __constants = require('SP2__constants');
var __f = require('__functions');
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
    
    run: function(currentSpawn) {

        var ROOM_NAME = Game.spawns[currentSpawn].room.name;

        // GET LIST OF CURRENT CREEPS, BY TYPE
        var harvesterList = __f.listOfCreeps('harvester', 0, ROOM_NAME);
        var dedHarv1List = __f.listOfCreeps('dedicatedHarvester', 1, ROOM_NAME);
        var builderList = __f.listOfCreeps('builder', 0, ROOM_NAME);
        var upgraderList = __f.listOfCreeps('upgrader', 0, ROOM_NAME);
        var repairerList = __f.listOfCreeps('repairer', 0, ROOM_NAME);
        var transporterList = __f.listOfCreeps('transporter', 0, ROOM_NAME);

        // LIST ALL CREEPS AS REFERENCE
        console.log('SP2: ' + (harvesterList.length + dedHarv1List.length) +  ' harvesters | ' + builderList.length + ' builders | ' + upgraderList.length + ' upgraders | ' + repairerList.length + ' repairers | ' + transporterList.length + ' transporters --- ' + Game.spawns['' + spName +''].room.energyAvailable + ' room energy');

        // CHECK AMOUNT OF FULL EXTENSIONS
        var strExtensions = Game.spawns['' + spName +''].room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION && structure.energy == structure.energyCapacity);}});

        var creepLevel;
        var builderLevel;
        // DEFAULT CREEP, ONLY SPAWN ENERGY (300 ENERGY = 100 WORK, 50 CARRY, 50 MOVE)
        //creepLevel = [WORK, CARRY, CARRY, CARRY, MOVE];
        creepLevel = [WORK, CARRY, MOVE];
        harvesterLevel = [WORK, WORK, WORK, WORK, CARRY, MOVE];
        // harvesterLevel = [WORK, WORK, CARRY, MOVE];
        upgraderLevel = [WORK, CARRY, CARRY, MOVE];
        transporterLevel = [WORK, CARRY, CARRY, CARRY, CARRY, MOVE];
        builderLevel = [WORK, CARRY, CARRY, CARRY, MOVE];
    

        
        // AUTO SPAWN REPAIRERS (ACCORDING TO CREEP TYPE LIMIT AND EXISTENCE OF BROKEN STRUCTURES)
        if(repairerList.length < __constants.REPAIRER_LIMIT && __f.brokenStructures()) {
            spawnCreepOfType('repairer', creepLevel, 0, ROOM_NAME);
        }
        // AUTOSPAWN DEDICATED HARVESTER FOR SOURCE 1
        else if(dedHarv1List.length< __constants.DEDICATED_HARVESTER1_LIMIT) {
            spawnCreepOfType('dedicatedHarvester', harvesterLevel, 1, ROOM_NAME);
        }
        // AUTO SPAWN HARVESTERS (ACCORDING TO CREEP TYPE LIMIT)
        else if(harvesterList.length < __constants.HARVESTER_LIMIT) {
            spawnCreepOfType('harvester', creepLevel, 0, ROOM_NAME);
        }
        // TRANSPORTERS
        else if(transporterList.length < __constants.TRANSPORTER_LIMIT) {
            spawnCreepOfType('transporter', transporterLevel, 0, ROOM_NAME);
            spawnCreepOfType('transporter', creepLevel, 0, ROOM_NAME);
        }
        // AUTO SPAWN BUILDERS (ACCORDING TO CREEP TYPE LIMIT)
        else if(builderList.length < __constants.BUILDER_LIMIT) {
            spawnCreepOfType('builder', builderLevel, 0, ROOM_NAME);
        }
        // AUTO SPAWN UPGRADERS (ACCORDING TO CREEP TYPE LIMIT)
        else if(upgraderList.length < __constants.UPGRADER_LIMIT) {
            spawnCreepOfType('upgrader', upgraderLevel, 0, ROOM_NAME);
        }
        else { }
    
    }
}


module.exports = spawnRoutine;