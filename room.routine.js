var spawnCreeps = require('spawn.routine');
var __f = require('__functions');
var __spawn = require('spawn.recommendation');
var __combat = require('combat.claim');



function runSP1(currentSpawn) {

    // ATTEMPT TO CAPTURE NEW ROOM!
    // __combat.spawnClaimer();
    // __combat.claimController(32, 2, 'W3S15');
    //__combat.spawnBuilder('W3S15');

    // RUN SPAWN RECOMMENDATION ROUTINE
    __spawn.spawnRecommendation(currentSpawn);


    // TRANSFER ENERGY FROM SOURCE LINK TO SPAWN LINK
    __f.linkTransfer(currentSpawn);

}


function runSP2(currentSpawn) {

    var spawnCreeps = require('SP2.spawn.routine');
    
    // RUN AUTOSPAWN ROUTINE
    // spawnCreeps.run(currentSpawn);
    __spawn.spawnRecommendation(currentSpawn);

}






module.exports = {runSP2, runSP1 };