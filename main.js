// OVERALL FUNCTIONS
var __f = require('__functions');

// CREEP ROLES
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wall_repairer');
var roleTransporter = require('role.transporter');
var roleDedicatedHarvester = require('role.dedicatedHarvester');

// SPAWN ROUTINE
var __spawn = require('spawn.recommendation');


module.exports.loop = function () {

    // CLEAR DEAD CREEPS FROM MEMORY
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    /* ***************************************************** */
    /* EXPANSION ROUTINES
    /* ***************************************************** */

    // ATTEMPT TO CAPTURE NEW ROOM!
    // __combat.spawnClaimer();
    // __combat.claimController(32, 2, 'W3S15');
    //__combat.spawnBuilder('W3S15');



    /* ***************************************************** */
    /* SPAWN ROOM ROUTINES
    /* ***************************************************** */

    var spawnList = Game.spawns;
    for (spawn in spawnList) {

         // CHECK IF SPAWN IS UNDER ATTACK, OTHERWISE PUT THE TOWERS TO WORK ON REPAIRS
        if(!__f.checkAttack(spawn)) { __f.towerRepair(spawn); }

        // REPURPOSE BUILDERS IN SPAWN'S ROOM
        __f.repurposeBuilders(spawn);

        // CREEP SPAWN RECOMMENDATION FOR CURRENT SPAWN'S ROOM
        __spawn.spawnRecommendation(spawn)

        // IF AVAILABLE, TRANSFER ENERGY BETWEEN LINKS IN SPAWN'S ROOM
        __f.linkTransfer(spawn);
       
    }


    /* ***************************************************** */
    /* CREEP WORK ROUTINES
    /* ***************************************************** */

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        // CHECK IF ANY HOSTILES ARE NEARBY - IF SO, RUN TO BASE!
        if(!__f.checkNearbyHostile(creep)) {

            if(creep.memory.role == 'harvester') { roleHarvester.run(creep); }
            if(creep.memory.role == 'dedicatedHarvester') { roleDedicatedHarvester.run(creep); }
            if(creep.memory.role == 'upgrader') { roleUpgrader.run(creep); }
            if(creep.memory.role == 'builder') { roleBuilder.run(creep); }
            if(creep.memory.role == 'repairer') { roleRepairer.run(creep); }
            if(creep.memory.role == 'wall_repairer') { roleWallRepairer.run(creep); }
        }

        // TRANSPORTERS MUST STILL DO THEIR THING, TO POSSIBLY RELOAD THE TOWERS (YOUR SACRIFICE SHALL BE REMEMBERED *salute*)
        if(creep.memory.role == 'transporter') { roleTransporter.run(creep); }
    }



    // END OF CONSOLE MESSAGES
    console.log('--------------------------------------------------------------------------------------------------------------------------------------- Game Time: ' + Game.time);

};