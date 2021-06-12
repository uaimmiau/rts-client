import {
    Scene,
    LoadingManager,
    Clock,
    Vector3,
    GridHelper,
    PointLight,
    Raycaster,
    Ray
} from 'three'
import Renderer from './Renderer'
import Camera from './Camera'
// import Keyboard from "./Keyboard"
import Config from './Config'
import Player from './Player'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import Keyboard from './Keyboard'
import Box from './Box'


export default class Main {
    constructor(container) {
        this.container = container
        this.scene = new Scene()
        this.renderer = new Renderer(container)
        this.camera = new Camera(75, window.innerWidth, window.innerHeight)
        this.camera.position.set(100, 100, 100)
        this.camera.lookAt(new Vector3(0, 0, 0))
        this.grid = new GridHelper(1000, 10)
        this.scene.add(this.grid)

        this.player = new Player()
        this.player.position.set(0, 10, 0)
        this.scene.add(this.player)

        this.keybord = new Keyboard(window)

        this.boxes = []
        for (let i = 0; i < 20; i++) {
            let box = new Box(this.player)
            box.position.set(Math.random() * 400 - 200, 13, Math.random() * 400 - 200)
            this.scene.add(box)
            this.boxes.push(box)
        }

        this.raycaster = new Raycaster()

        this.div = document.querySelector('#num')
        this.prev = document.querySelector('#prev')

        const controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.render();
    }

    render() {

        if (Config.moveForward) this.player.translateZ(2)
        if (Config.moveBackward) this.player.translateZ(-2)
        if (Config.rotateRight) this.player.rotation.y -= 0.01
        if (Config.rotateLeft) this.player.rotation.y += 0.01

        for (let box of this.boxes) box.update(this.player)



        let ray = new Ray(this.player.position, this.player.getWorldDirection(new Vector3()))
        this.raycaster.ray = ray
        let intersects = this.raycaster.intersectObjects(this.boxes)
        this.div.innerHTML = `Trafionych celów: ${intersects.length}`
        this.prev.innerHTML = ''
        if (intersects.length != 0) {
            for (let inter of intersects) {
                inter.object.changeColor()
                let obj = {
                    distance: inter.distance,
                    point: inter.point
                }
                this.prev.innerHTML += JSON.stringify(obj, null, 4)
            }
        }

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}