import { getObjectsByPrototype, findClosestByPath, findInRange, findClosestByRange, getTicks } from 'game/utils';
import { ATTACK, MOVE, CARRY, RANGED_ATTACK, TOUGH, ERR_NOT_IN_RANGE, RESOURCE_ENERGY } from 'game/constants';
import { StructureSpawn, StructureContainer, Creep } from 'game/prototypes';
import { searchPath } from 'game/path-finder';

const HAULER = [CARRY, CARRY, MOVE, MOVE]
const RANGED = [MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK]

let mySpawn
let enemySpawn

let creeps = []
let myi = true

export function loop() {
    if(!mySpawn) { mySpawn = getObjectsByPrototype(StructureSpawn).find(i => i.my) }
    if(!enemySpawn) { enemySpawn = getObjectsByPrototype(StructureSpawn).find(i => !i.my) }

    if (creeps.length < 3) {
        var h = mySpawn.spawnCreep(HAULER).object

        if (h) {
            h.name = "h" + creeps.length
            h.logic = haulerLogic
            creeps.unshift(h)
        }
    } else {
        var r = mySpawn.spawnCreep(RANGED).object

        if (r) {
            r.name = "r" + creeps.length
            r.logic = rangedLogic
            r.top = myi
            if (myi) { myi = false} else { myi = true}
            creeps.unshift(r)
        }
    }

    creeps.filter((c) => c.exists).forEach((c) => c.logic())
}

function rangedLogic() {
    let targets = getObjectsByPrototype(Creep).filter(c => !c.my);
    let targetsCloserThanAttackRange = findInRange(this, targets, 3);

    if (getTicks() < 250 && targetsCloserThanAttackRange.length == 0) {
        let dy = 20
        if (this.top) { dy *= -1 }
        this.moveTo(mySpawn.x, mySpawn.y + dy)
    } else {        
        if (targetsCloserThanAttackRange.length >= 1) {
            let t = findClosestByRange(this, targetsCloserThanAttackRange)
            this.rangedAttack(t)
            let result = searchPath(this, targetsCloserThanAttackRange.map(i => ({pos: i, range: 3})), {flee: true})
            this.moveTo(result.path[0])
        } else if (this.rangedAttack(enemySpawn) == ERR_NOT_IN_RANGE) {
            this.moveTo(enemySpawn)
        } else {
            console.log(this.id, "Wait, what?")
        }
    }
}

function haulerLogic() {
    var containers = getObjectsByPrototype(StructureContainer).filter((t) => t.store.getUsedCapacity() != 0)
    var target = findClosestByPath(this, containers)

    console.log(this.id, this.store[RESOURCE_ENERGY], this.store.getCapacity())
    if (this.store[RESOURCE_ENERGY] < this.store.getCapacity()) {
        let r = this.withdraw(target, RESOURCE_ENERGY, this.store.getFreeCapacity(RESOURCE_ENERGY))
        console.log(r)
        if (r == ERR_NOT_IN_RANGE) {
            this.moveTo(target)
        }
    } else {
        if (this.transfer(mySpawn, RESOURCE_ENERGY, this.store[RESOURCE_ENERGY]) == ERR_NOT_IN_RANGE) {
            this.moveTo(mySpawn)
        }
    }
}