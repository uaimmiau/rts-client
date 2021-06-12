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
import Light from './Light'
// import Keyboard from "./Keyboard"
import Config from './Config'
import Player from './Player'
import {
    MapControls,
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import Keyboard from './Keyboard'
import Box from './Box'
import Model from './Model'
import marioMD2 from "./assets/mario.md2"

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

        // this.player = new Player()
        // this.player.position.set(0, 10, 0)
        // this.scene.add(this.player)

        this.keybord = new Keyboard(window)

        // Load unit model/s
        this.units = []
        this.manager = new LoadingManager()
        this.model = new Model(this.manager)
        this.model.load(marioMD2)
        this.manager.onLoad = () => {
            for (let i = 0; i < 3; i++) {
                let unit = this.model.clone()
                unit.position.set(50 * i, 25, 0)
                this.scene.add(unit)
                this.units.push(unit)
            }
        }

        // adding some light to see the models
        let l = new Light()
        l.position.set(0, 100, 0)
        this.scene.add(l)

        // this.raycaster = new Raycaster()

        this.div = document.querySelector('#num')
        this.prev = document.querySelector('#prev')

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls = new MapControls(this.camera, this.renderer.domElement)

        this.render();
    }

    render() {

        // if (Config.moveForward) this.player.translateZ(2)
        // if (Config.moveBackward) this.player.translateZ(-2)
        // if (Config.rotateRight) this.player.rotation.y -= 0.01
        // if (Config.rotateLeft) this.player.rotation.y += 0.01


        // Have camera follow player and set orbit controls target
        if (Config.moveForward || Config.moveBackward || Config.rotateLeft || Config.rotateRight) {
            // const camVect = new Vector3(0, Config.camHeight, -Config.camDistance)
            // const camPos = camVect.applyMatrix4(this.player.matrixWorld);
            // this.camera.position.x = camPos.x
            // this.camera.position.y = camPos.y
            // this.camera.position.z = camPos.z
            // this.camera.lookAt(this.player.position)
            // this.camera.updateProjectionMatrix()
            // this.camera.rotateZ(this.controls.getPolarAngle())
            // this.camera.rotateY(this.controls.getAzimuthalAngle())
        }
        // this.controls.target = this.player.position
        // console.log(this.camera.position)




        // let ray = new Ray(this.player.position, this.player.getWorldDirection(new Vector3()))
        // this.raycaster.ray = ray
        // let intersects = this.raycaster.intersectObjects(this.boxes)
        // this.div.innerHTML = `Trafionych celów: ${intersects.length}`
        // this.prev.innerHTML = ''
        // if (intersects.length != 0) {
        //     for (let inter of intersects) {
        //         inter.object.changeColor()
        //         let obj = {
        //             distance: inter.distance,
        //             point: inter.point
        //         }
        //         this.prev.innerHTML += JSON.stringify(obj, null, 4)
        //     }
        // }

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}