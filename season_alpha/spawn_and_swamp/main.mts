import { getObjectsByPrototype } from 'game/utils';
import { ATTACK, CARRY, HEAL, MOVE, RANGED_ATTACK, TOUGH, WORK } from 'game/constants';
import { StructureSpawn, Creep, BodyPartType, SpawnCreepResult } from 'game/prototypes';
import { first } from 'lodash';

const HAULER: BodyPartType[] = [CARRY, CARRY, MOVE, MOVE]
const RANGED: BodyPartType[] = [MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK]

let mySpawn: StructureSpawn
let enemySpawn: StructureSpawn

let creeps: any[] = []
let firstTick = true

function setup() {
    firstTick = false
    let my = getObjectsByPrototype(StructureSpawn).find(i => i.my)
    let enemy = getObjectsByPrototype(StructureSpawn).find(i => !i.my)
    if(my !== undefined) { mySpawn = my }
    if(enemy !== undefined) { enemySpawn = enemy }
}

export function loop() {
    if(firstTick) {
        setup()
    }

    let bPrint = HAULER
    if (creeps.length >= 3) {
        bPrint = RANGED
    }

    let result: SpawnCreepResult = mySpawn.spawnCreep(bPrint)
    if (result.error === undefined && result.object !== undefined) {
        let c = result.object
        creeps.push(c)
    }

    creeps.forEach(c => { /* do stuff */ })
}
