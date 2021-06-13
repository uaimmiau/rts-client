import {
    Vector2
} from "three"
import GameEvents from "./communication/GameEvents";

export default class Select {
    constructor(raycaster, camera, scene, units, websocket, plane) {
        this.raycaster = raycaster;
        this.camera = camera;
        this.scene = scene;
        this.units = units;
        this.websocket = websocket;
        this.plane = plane;
        let mouseVector = new Vector2();

        document.addEventListener('click', (e) => {
            mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1
            mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1
            this.raycaster.setFromCamera(mouseVector, this.camera)
            let intersects = this.raycaster.intersectObjects(this.scene.children, true)
            if (intersects.length > 0 && intersects[0].object.type == 'Mesh') {
                if (intersects[0].object == this.plane) {
                    // ground clicked
                    let point = intersects[0].point;
                    let destination = {
                        x: Math.round(point.x),
                        y: Math.round(point.y),
                        z: Math.round(point.z),
                    };
                    // Send order to the server
                    this.units.map((unit) => unit.unit).filter((unit) => unit.selected).forEach((selectedUnit) => {
                        this.websocket.sendData(GameEvents.MOVE_UNIT, {
                            globalId: selectedUnit.globalId,
                            destination
                        });
                    });
                } else {
                    const parent = intersects[0].object.parent;
                    const selected = parent.selected;
                    parent.select();
                    if (selected) parent.deselect();
                }

            }
        })
    }

    deselectAllUnits() {
        for (let unit of this.units) {
            unit.unit.deselect()
        }
    }
}