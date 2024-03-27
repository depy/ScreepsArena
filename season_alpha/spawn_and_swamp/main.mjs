import { getObjectsByPrototype } from 'game/utils';
import { CARRY, MOVE, RANGED_ATTACK } from 'game/constants';
import { StructureSpawn } from 'game/prototypes';
const HAULER = [CARRY, CARRY, MOVE, MOVE];
const RANGED = [MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK];
let mySpawn;
let enemySpawn;
let creeps = [];
let firstTick = true;
function setup() {
    firstTick = false;
    let my = getObjectsByPrototype(StructureSpawn).find(i => i.my);
    let enemy = getObjectsByPrototype(StructureSpawn).find(i => !i.my);
    if (my !== undefined) {
        mySpawn = my;
    }
    if (enemy !== undefined) {
        enemySpawn = enemy;
    }
}
export function loop() {
    if (firstTick) {
        setup();
    }
    let bPrint = HAULER;
    if (creeps.length >= 3) {
        bPrint = RANGED;
    }
    let result = mySpawn.spawnCreep(bPrint);
    if (result.error === undefined && result.object !== undefined) {
        let c = result.object;
        creeps.push(c);
    }
    creeps.forEach(c => { });
}
