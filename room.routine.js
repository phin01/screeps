var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wall_repairer');
var roleTransporter = require('role.transporter');
var roleDedicatedHarvester = require('role.dedicatedHarvester');
var spawnCreeps = require('spawn.routine');
var __functions = require('__functions');
var __spawn = require('spawn.recommendation');
var __c = require('__constants');
var __combat = require('combat.claim');



function runSP1(currentSpawn) {

    // ATTEMPT TO CAPTURE NEW ROOM!
    // __combat.spawnClaimer();
    // __combat.claimController(32, 2, 'W3S15');
    //__combat.spawnBuilder('W3S15');


    // RUN AUTOSPAWN ROUTINE
    // spawnCreeps.run();
    
    // RUN SPAWN RECOMMENDATION ROUTINE
    __spawn.spawnRecommendation(currentSpawn, 'W2S15');


    // REPURPOSE BUILDERS IN CASE NO MORE CONSTRUCTION SITES ARE IN NEED OF BUILDING
    __functions.repurposeBuilders(currentSpawn);


    // TRANSFER ENERGY FROM SOURCE LINK TO SPAWN LINK
    __functions.linkTransfer(currentSpawn);


    // PUT THOSE CREEPS TO WORK!
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        // CHECK IF ANY HOSTILES ARE NEARBY - IF SO, RUN TO BASE!
        if(!__functions.checkNearbyHostile(creep)) {

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
}


function runSP2(currentSpawn) {

    var roleHarvester = require('SP2.role.harvester');
    // var roleUpgrader = require('SP2.role.upgrader');
    var roleBuilder = require('SP2.role.builder');
    var roleRepairer = require('SP2.role.repairer');
    var spawnCreeps = require('SP2.spawn.routine');
    var roleTransporter = require('SP2.role.transporter');
    var roleDedicatedHarvester = require('SP2.role.dedicatedHarvester');
    
    var __constants = require('SP2__constants');
    // var __functions = require('__functions');


    // RUN AUTOSPAWN ROUTINE
    spawnCreeps.run();

    // PUT THOSE CREEPS TO WORK!
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        // CHECK IF ANY HOSTILES ARE NEARBY - IF SO, RUN TO BASE!
        if(__functions.checkNearbyHostile(creep) == false) {
            //dedicated_harv1SP2
            if(creep.memory.role == 'harvesterSP2') { roleHarvester.run(creep); }
            if(creep.memory.role == 'dedicated_harv1SP2') { roleDedicatedHarvester.run(creep); }
            if(creep.memory.role == 'upgraderSP2') { roleUpgrader.run(creep); }
            if(creep.memory.role == 'upgrader') { roleUpgrader.run(creep); }
            if(creep.memory.role == 'builderSP2') { roleBuilder.run(creep); }
            if(creep.memory.role == 'repairerSP2') { roleRepairer.run(creep); }
            if(creep.memory.role == 'transporterSP2') { roleTransporter.run(creep); }
        }
    }
}






module.exports = {runSP2, runSP1 };