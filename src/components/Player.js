import {
    AxesHelper,
    BoxGeometry,
    DoubleSide,
    Mesh,
    MeshNormalMaterial,
    Object3D
} from "three";

export default class Player extends Object3D {
    constructor() {
        super()
        this.axes = new AxesHelper(100)
        const geometry = new BoxGeometry(20, 20, 20)
        const material = new MeshNormalMaterial({
            side: DoubleSide
        })
        this.mesh = new Mesh(geometry, material)
        this.add(this.axes)
        this.add(this.mesh)
        console.log(this)
    }
}