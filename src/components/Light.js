import {
    Object3D,
    PointLight,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh
} from "three"

export default class Light extends Object3D {
    constructor() {
        super()
        this.light = new PointLight(0xffffff, 0.8, 500)
        this.light.position.set(0, 0, 0)
        this.light.castShadow = true
        this.add(this.light)

        this.geometry = new SphereGeometry(10, 3, 2)
        this.material = new MeshBasicMaterial({
            color: 0xffff00,
            wireframe: true
        })
        let mesh = new Mesh(this.geometry, this.material)
        this.add(mesh)
        this.castShadow = true
    }
}