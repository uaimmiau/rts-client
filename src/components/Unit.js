import {
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    MeshNormalMaterial,
    Object3D,
    OctahedronGeometry,
    Vector2
} from "three";
import GameEvents from "./communication/GameEvents";
import Config from "./Config";

export default class Unit extends Object3D {
    constructor(mesh, websocket, playerId, globalId, type) {
        super();
        this.mesh = mesh;
        this.websocket = websocket;
        this.playerId = playerId;
        this.globalId = globalId;
        this.type = type;
        this.destination = null;
        this.speed = 0.8;
        this.add(this.mesh)
        this.marker = new Mesh(new OctahedronGeometry(5), new MeshNormalMaterial({
            side: DoubleSide
        }));
        this.marker.position.y = 25;
        this.add(this.marker);
        this.selected = false;
        this.steps = 0
        this.stepV = null
        this.state = 'idle'
    }

    select() {
        this.marker.visible = true;
        Config.selected = this;
        this.selected = true;
    }

    deselect() {
        this.marker.visible = false;
        Config.selected = null;
        this.selected = false;
    }

    update() {
        this.marker.rotation.y += 0.01;
        this.state = 'idle'
        if (this.steps > 0) {
            this.state = 'moving'
            this.translateX(this.stepV.x);
            this.translateZ(this.stepV.y);
            this.steps--;
            this.websocket.sendData(GameEvents.MOVE_UNIT, {
                globalId: this.globalId,
                position: this.position,
                // destination: this.destination
            });
        }
    }

    calculatePath() {
        let posV2 = new Vector2(this.position.x, this.position.z)
        let desV2 = new Vector2(this.destination.x, this.destination.z)
        let distance = posV2.distanceTo(desV2)
        let subV2 = desV2.clone().sub(posV2.clone())
        let steps = distance / this.speed
        // stepujący wektor
        let stepV2 = subV2.divideScalar(steps)
        this.steps = steps
        this.stepV = stepV2
        this.mesh.rotation.y = (-stepV2.angle())
    }

    invertSelect() {
        if (this.selected) {
            this.deselect();
        } else {
            this.select();
        }
    }
}