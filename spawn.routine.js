
/* *************************************************************** */
/* 
/*                D E P R E C A T E D !
/* 
/* *************************************************************** 





var __constants = require('__constants');
var __functions = require('__functions');
var spName = __constants.SP_NAME;


var spawnRoutine = {
    
    run: function() {

        // GET LIST OF CURRENT CREEPS, BY TYPE
        var harvesterList = __functions.listOfCreeps('harvester', 0);
        var builderList = __functions.listOfCreeps('builder', 0);
        var upgraderList = __functions.listOfCreeps('upgrader', 0);
        var repairerList = __functions.listOfCreeps('repairer', 0);
        var wallRepairerList = __functions.listOfCreeps('wall_repairer', 0);
        var harvester0_List = __functions.listOfCreeps('dedicatedHarvester', 0);
        var harvester1_List = __functions.listOfCreeps('dedicatedHarvester', 1);
        var transporterList = __functions.listOfCreeps('transporter', 0);


        // LIST ALL CREEPS AS REFERENCE
        console.log((harvester1_List.length + harvester0_List.length) + ' harvesters | ' + builderList.length + ' builders | ' + upgraderList.length + ' upgraders | ' + (repairerList.length + wallRepairerList.length) + ' repairers | ' + transporterList.length + ' transporters --- ' + Game.spawns['' + __constants.SP_NAME +''].room.energyAvailable + ' room energy');

        // CHECK AMOUNT OF FULL EXTENSIONS
        // var strExtensions = Game.spawns['' + spName +''].room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION && structure.energy == structure.energyCapacity);}});

        // DETERMINE CREEP LEVEL FOR DIFFERENT ROLES
        var creepLevel = [WORK, CARRY, MOVE];
        var builderLevel = [WORK, CARRY, CARRY, CARRY, CARRY, MOVE];
        var repairerLevel = [WORK, CARRY, CARRY, CARRY, CARRY, MOVE];
        var harvesterLevel = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE];
        var upgraderLevel = [WORK, WORK, WORK, CARRY, MOVE];
        var transporterLevel = [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE];



        // CHECK IF ROOM HAS ENOUGH ENERGY TO SPAWN A NEW CREEP AND NO HARVESTERS ARE ON THE BRINK OF DEATH (SUSTAINABILITY, YO!)
        if(__functions.enoughEnergy()) {

            // TOP PRIORITY: SPAWN HARVESTERS AND AT LEAST ONE TRANSPORTER
            if(harvester0_List.length < 1 || harvester1_List.length < 1 || transporterList.length < 1) {

                if(harvester0_List.length < 1 && __functions.roomEnergy() > __functions.harvesterCost(harvesterLevel)) {
                    __functions.spawnCreepOfType('dedicatedHarvester', harvesterLevel, 0);
                }
                // AUTO SPAWN HARVESTER FOR SOURCE 2 (ONLY ONE NEEDED)
                else if(harvester1_List.length < 1 && __functions.roomEnergy() > __functions.harvesterCost(harvesterLevel)) {
                    __functions.spawnCreepOfType('dedicatedHarvester', harvesterLevel, 1);
                }
                else if(transporterList.length < 1) {
                    __functions.spawnCreepOfType('transporter', transporterLevel);
                }
            }


            // ELSE, CHECK FOR OTHER CREEP TYPES IN NEED OF SPAWNING
            else {

                // SECOND PRIORITY: REPAIRERS
                // AUTO SPAWN REPAIRERS (ACCORDING TO CREEP TYPE LIMIT AND EXISTENCE OF BROKEN STRUCTURES)
                if(repairerList.length < __constants.REPAIRER_LIMIT && __functions.brokenStructures()) {
                    __functions.spawnCreepOfType('repairer', repairerLevel);
                }
                // AUTO SPAWN WALL REPAIRER
                else if(wallRepairerList.length < __constants.WALL_REPAIRER_LIMIT && __functions.brokenStructures()) {
                    __functions.spawnCreepOfType('wall_repairer', repairerLevel);
                }
    

                // THIRD PRIORITY: EVERYTHING ELSE
                // AUTO SPAWN ADDITIONAL TRANSPORTERS
                else if(transporterList.length < __constants.TRANSPORTER_LIMIT) {
                    __functions.spawnCreepOfType('transporter', transporterLevel);
                }
                // AUTO SPAWN HARVESTERS (ACCORDING TO CREEP TYPE LIMIT)
                else if(harvesterList.length < __constants.HARVESTER_LIMIT) {
                    __functions.spawnCreepOfType('harvester', creepLevel);
                }
                // AUTO SPAWN BUILDERS (ACCORDING TO CREEP TYPE LIMIT)
                else if(builderList.length < __constants.BUILDER_LIMIT) {
                    __functions.spawnCreepOfType('builder', builderLevel);
                }
                // AUTO SPAWN UPGRADERS (ACCORDING TO CREEP TYPE LIMIT)
                else if(upgraderList.length < __constants.UPGRADER_LIMIT) {
                    __functions.spawnCreepOfType('upgrader', upgraderLevel);
                }
                else { }

            }
            


            
            

    }
    
    }
}


module.exports = spawnRoutine;

*/