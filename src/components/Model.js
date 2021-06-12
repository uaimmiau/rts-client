import {
    MD2Loader
} from './MD2Loader'
import marioTex from "./assets/mario2.jpg"
import {
    Mesh,
    MeshPhongMaterial,
    Object3D,
    TextureLoader
} from 'three'

export default class Model extends Object3D {
    constructor(manager) {
        super()
        this.manager = manager
        this.mesh = null
        this.geometry = null
    }

    load(path) {
        new MD2Loader(this.manager).load(
            path,
            geometry => {
                this.geometry = geometry;
                this.mesh = new Mesh(geometry, new MeshPhongMaterial({
                    map: new TextureLoader().load(marioTex),
                    morphTargets: true
                }))
                this.add(this.mesh)
            },
        );
    }
}