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

// SPAWN ROUTINE SPLIT BY ROOM
var __room = require('room.routine');


module.exports.loop = function () {

    // CLEAR DEAD CREEPS FROM MEMORY
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    /* ***************************************************** */
    /*
    /* SPAWN / ROOM ROUTINES
    /*
    /* ***************************************************** */

    var spawnList = Game.spawns;
    for (spawn in spawnList) {

         // CHECK IF SPAWN IS UNDER ATTACK, OTHERWISE PUT THE TOWERS TO WORK ON REPAIRS
        if(!__f.checkAttack(spawn)) { __f.towerRepair(spawn); }

        // REPURPOSE BUILDERS IN SPAWN'S ROOM
        __f.repurposeBuilders(spawn);

        // SPAWN LOGIC SPLIT BY ROOM
        if (spawn == 'SP1') {
            __room.runSP1(spawn);
        }
        else if (spawn == 'SP2') {
            __room.runSP2(spawn);
        }
    }


    /* ***************************************************** */
    /*
    /* CREEP WORK ROUTINES
    /*
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

    console.log('---------------------------------------------------------------------------------------------------------------------------------------');







};