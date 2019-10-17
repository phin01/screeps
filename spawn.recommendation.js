var __c = require('__constants');
var __f = require('__functions');

function spawnRecommendation(SPAWN_NAME) {

    var ROOM_NAME = Game.spawns[SPAWN_NAME].room.name;


    /* ***************************************** */ 
    /* SPAWNING VARIABLES
    /* ***************************************** */ 

    // GET LIST OF CURRENT CREEPS, BY TYPE AND ROOM
    var harvesterList = __f.listOfCreeps(__c.ROLE_HARVESTER, 0, ROOM_NAME);
    var builderList = __f.listOfCreeps(__c.ROLE_BUILDER, 0, ROOM_NAME);
    var upgraderList = __f.listOfCreeps(__c.ROLE_UPGRADER, 0, ROOM_NAME);
    var wallRepairerList = __f.listOfCreeps(__c.ROLE_WALL_REPAIRER, 0, ROOM_NAME);
    var harvester0_List = __f.listOfCreeps(__c.ROLE_DEDICATED_HARVESTER, 0, ROOM_NAME);
    var harvester1_List = __f.listOfCreeps(__c.ROLE_DEDICATED_HARVESTER, 1, ROOM_NAME);
    var transporterList = __f.listOfCreeps(__c.ROLE_TRANSPORTER, 0, ROOM_NAME);

    var creepList = []

    // LIST OF TOTAL CREEPS PER ROOM
    var totalCreeps = 0; 
    var i = 0;
    for(var creep in Game.creeps) {
        if(Game.creeps[creep].memory.room == ROOM_NAME) {
            totalCreeps++;
        }
     };


    
    // CURRENT ENERGY LEVEL AVAILABLE FOR SPAWNING AND TOTAL ENERGY CAPACITY
    var actualEnergy = Game.spawns['' + SPAWN_NAME +''].room.energyAvailable;
    var possibleEnergy = Game.spawns['' + SPAWN_NAME +''].room.energyCapacityAvailable;

    // AMOUNT OF CONSTRUCTIONS SITES TO BE BUILT
    var constructionSites = Game.spawns['' + SPAWN_NAME +''].room.find(FIND_CONSTRUCTION_SITES);

    // STORAGE ITEMS
    // && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
    var storageList = Game.spawns['' + SPAWN_NAME +''].room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_STORAGE); }});
    var storageEnergy = 0;
    for(var storage in storageList) {
        storageEnergy = storageEnergy + storageList[storage].store[RESOURCE_ENERGY]
    }


    // VARIABLES FOR NEXT CREEP TYPE
    var recommendedRole;
    var recommendedIndex = 0;
    var creepAction;
    var baseBody = [WORK, CARRY, MOVE];
    var recommendedBody = baseBody;
    


     // SIMULATE A SPECIFIC KIND OF SPAWN RECOMMENDATION
     //harvester0_List = [];
     //transporterList = [];
    //  harvester1_List = [];

     // SIMULATE AN ENERGY LEVEL
     // actualEnergy = 280;



    /* ***************************************** */ 
    /* SPAWNING PRIORITY / LOGIC
    /* ***************************************** */ 

    // IF ALL HELL HAS BROKEN LOOSE AND THE BASE IS EMPTY, START FRESH WITH A HUMBLE HARVESTER
    if (totalCreeps == 0) {
        recommendedRole = __c.ROLE_HARVESTER;
        recommendedBody = baseBody;
    }
    
    // IF THINGS ARE GOING WELL, SPAWN THE BASIC, TOP PRIORITY CREEPS:
    //    - A DEDICATED HARVESTER
    //    - THREE TRANSPORTERS
    //    - A SECONDARY DEDICATED HARVESTER
    else {
        if(harvester0_List.length < 1) { 
            recommendedRole = __c.ROLE_DEDICATED_HARVESTER;
            creepAction = WORK;
        }
        else if(transporterList.length < 3) { 
            recommendedRole = __c.ROLE_TRANSPORTER;
            creepAction = CARRY;
        }
        else if (harvester1_List.length < 1){
            recommendedRole = __c.ROLE_DEDICATED_HARVESTER;
            recommendedIndex = 1;
            creepAction = WORK;
        }

        // AS FOR THE BODY TYPE, DEPENDS ON THE AVAILABLE ENERGY IN THE ROOM
        // IF THERE ARE NOT MANY EXTENSIONS, WORK WITH BASE BODY (ALREADY SET)
        // BUT IF THERE ARE EXTENSIONS...
        if(possibleEnergy >= 400) {

            // TOP HARVESTER = 6 WORK, 1 CARRY, 1 MOVE
            // ALWAYS TRY TO SPAWN THE HIGHEST DEDICATED HARVESTER
            // WORK BODY PARTS = 100 ENERGY
            if(recommendedRole == __c.ROLE_DEDICATED_HARVESTER) {
                var actionParts = Math.floor((actualEnergy - 400) / 100);
                if (actionParts > 5) { actionParts = 5}
                for (var i = 0; i < actionParts; i++) {
                    recommendedBody.push(creepAction);
                }
            }

            // TOP TRANSPORTER = 6 CARRY, 1 WORK, 1 MOVE
            // ALWAYS TRY TO SPAWN THE HIGHEST DEDICATED TRANSPORTER
            // CARRY BODY PARTS = 50 ENERGY
            else if (recommendedRole == __c.ROLE_TRANSPORTER) {
                var actionParts = Math.floor((actualEnergy - 400) / 50);
                if (actionParts > 8) { actionParts = 8}
                for (var i = 0; i < actionParts; i++) {
                    recommendedBody.push(creepAction);
                }
            }
        }
    } 


    // ONCE THE BASICS HAVE BEEN TAKEN CARE OF, LET'S WORK ON SOME ADDITIONAL CREEPS:
    // RECOMMENDED ROLE WILL STILL BE UNDEFINED IN THIS SCENARIO
    // IF DEDICATED HARVESTER IS ON THE BRINK OF DEATH, WAIT FOR IT TO RESPAWN
    // IF AVAILABLE ENERGY IN THE ROOM IS NOT ABOVE THE REQUIRED THRESHOLD, ALSO WAIT
    // FINALLY, ALSO SUSPEND SPAWNING WHILE ANY ATTACKS ARE UNDERWAY

    


    if(!recommendedRole && !__f.harvesterDying() && actualEnergy > possibleEnergy * __c.MINIMUM_ENERGY_RATIO && !__f.checkAttack(SPAWN_NAME)) {

        // DEFAULT ACTION FOR NEW CREEPS IS CARRY, ONLY UPGRADERS NEED WORK ACTIONS
        creepAction = CARRY;
        
        // IF THERE'S TOO MUCH ENERGY JUST SITTING AROUND IN HARVERSTER'S CONTAINERS, SPAWN A NEW TRANSPORTER
        if(containerSummary(SPAWN_NAME).energy > containerSummary(SPAWN_NAME).capacity * __c.CONTAINER_IDLE_THRESHOLD) {
            recommendedRole = __c.ROLE_TRANSPORTER;
        }

        // IF THERE ARE CONSTRUCTION SITES WAITING TO BE BUILT, FOCUS ON BUILDERS (BUT DO NOT EXCEED BUILDER RATIO FOR OVERALL CREEPS, EXCLUDING DEDICATED HARVESTERS)
        
        else if(constructionSites.length > 0 && builderList.length < (totalCreeps - 2) * __c.BUILDER_RATIO) {
            recommendedRole = __c.ROLE_BUILDER;
        }

        // IDEALLY, ALWAYS KEEP ONE WALL REPAIRER AT ALL TIMES
        else if (wallRepairerList.length < 1) {
            recommendedRole = __c.ROLE_WALL_REPAIRER;
        }

        // OTHERWISE, KEEP THOSE UPGRADERS COMING, AS LONG AS
        // THEY ALSO DON'T EXCEED THEIR RATIO 
        // AND ENERGY LEVELS ARE FULL
        // AND THERE'S ENERGY IN STORAGE FOR THEM TO WORK WITH
        else if (upgraderList.length < (totalCreeps - 2) * __c.UPGRADER_RATIO && storageEnergy >= upgraderList.length * __c.UPGRADER_STORAGE_ENERGY) {
            recommendedRole = __c.ROLE_UPGRADER;
            creepAction = WORK;
        }


        // NOW, FOR THE BODY TYPE (ONLY CALCULATE IF A ROLE HAS BEEN DECIDED)
        if(recommendedRole) {

            // UPGRADERS FOCUS ON WORK BODY PARTS, ALL OTHER TYPES FOCUS ON CARRY
            var actionCost = 50;
            if(recommendedRole == __c.ROLE_UPGRADER ) { actionCost = 100;}

            var actionParts = Math.floor((actualEnergy - 400) / actionCost);
            if (actionParts > 6) { actionParts = 6}
            for (var i = 0; i < actionParts; i++) {
                recommendedBody.push(creepAction);
            }
        }
    }


    // IF A CREEP IS NEEDED, SPAWN IT!
    if(recommendedRole) {
        __f.spawnCreepOfType(recommendedRole, recommendedBody, recommendedIndex, ROOM_NAME, SPAWN_NAME);
    }

    console.log('[' + Game.spawns[SPAWN_NAME].room.name + '|' + SPAWN_NAME + ']' +': ' + (harvester1_List.length + harvester0_List.length) + ' harvesters | ' + builderList.length + ' builders | ' + upgraderList.length + ' upgraders | ' + wallRepairerList.length + ' repairers | ' + transporterList.length + ' transporters --- ' + Game.spawns['' + SPAWN_NAME +''].room.energyAvailable + ' room energy - Next spawn: ' + recommendedRole);

}





module.exports = { spawnRecommendation };

function containerSummary(SPAWN_NAME) {

    var allContainers = Game.spawns['' + SPAWN_NAME +''].room.find(FIND_STRUCTURES, { filter: function (structure) { return (structure.structureType == STRUCTURE_CONTAINER); }});
    var currentEnergy = 0;
    var qtyContainers = 0;
    var storage = 0;

    for (var container in allContainers) {
        currentEnergy = currentEnergy + allContainers[container].store[RESOURCE_ENERGY];
        qtyContainers++;
        storage = storage + allContainers[container].storeCapacity;
    }
    return {energy: currentEnergy, qty: qtyContainers, capacity: storage};
}