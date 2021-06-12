import {
    Vector2
} from "three"

export default class Select {
    constructor(raycaster, camera, scene, units) {
        this.raycaster = raycaster
        this.camera = camera
        this.scene = scene
        this.units = units
        let mouseVector = new Vector2()

        document.addEventListener('click', (e) => {
            mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1
            mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1
            this.raycaster.setFromCamera(mouseVector, this.camera)
            let intersects = this.raycaster.intersectObjects(this.scene.children, true)
            if (intersects.length > 0 && intersects[0].object.type == 'Mesh') {
                this.deselectAllUnits()
                intersects[0].object.parent.select()
            }
        })
    }

    deselectAllUnits() {
        for (let unit of this.units) {
            unit.unit.deselect()
        }
    }
}