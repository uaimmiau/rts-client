import {
    BoxGeometry,
    Color,
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    Vector3
} from "three";

export default class Box extends Mesh {
    constructor() {
        super(new BoxGeometry(25, 26, 25), new MeshBasicMaterial({
            wireframe: false,
            color: 0x0033ff,
            transparent: true,
            opacity: 0.8
        }))
    }

    update(player) {
        this.lookAt(player.getWorldPosition(new Vector3()))
        this.material.color = new Color(0x0033ff)
    }

    changeColor() {
        this.material.color = new Color(0xffff00)
    }
}