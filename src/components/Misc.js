export default class Misc {
    constructor(scene, units) {
        this.scene = scene;
        this.units = units;
    }

    getDistanceToEnemies(unit) {
        let closest = {
            unit: null,
            distance: 10000
        }
        this.units.map((u) => u.unit).filter((u) => u.thisPlayerId != u.playerId).forEach((u) => {
            if (u.position.distanceTo(unit.position) < closest.distance) {
                closest = {
                    unit: u,
                    distance: u.position.distanceTo(unit.position)
                }
            }
        })
        return closest
    }
}