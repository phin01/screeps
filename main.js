var __room = require('room.routine');
var __f = require('__functions');


module.exports.loop = function () {

    // CLEAR DEAD CREEPS FROM MEMORY
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


    // var roomList = Game.rooms;
    // for (room in roomList) {
    //     console.log(roomList[room])
    // }

    var spawnList = Game.spawns;
    for (spawn in spawnList) {

         // CHECK IF SPAWN IS UNDER ATTACK, OTHERWISE PUT THE TOWERS TO WORK ON REPAIRS
        if(!__f.checkAttack(spawn)) {
            __f.towerRepair(spawn);
        }

        // REPURPOSE BUILDERS IN SPAWN
        __f.repurposeBuilders(spawn);


        if (spawn == 'SP1') {
            __room.runSP1(spawn);
        }
        else if (spawn == 'SP2') {
            __room.runSP2(spawn);
        }
    }
};