import {
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    MeshNormalMaterial,
    Object3D,
    OctahedronGeometry
} from "three";
import Config from "./Config";

export default class Unit extends Object3D {
    constructor(mesh, globalId, type) {
        super();
        this.mesh = mesh;
        this.globalId = globalId;
        this.type = type;
        this.destination = null;
        this.add(this.mesh)
        this.marker = new Mesh(new OctahedronGeometry(5), new MeshNormalMaterial({
            side: DoubleSide
        }));
        this.marker.position.y = 25;
        this.add(this.marker);
        this.selected = false;
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
    }

    invertSelect() {
        if (this.selected) {
            this.deselect();
        } else {
            this.select();
        }
    }
}