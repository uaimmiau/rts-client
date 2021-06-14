import {
    Scene,
    LoadingManager,
    Clock,
    Vector3,
    GridHelper,
    PointLight,
    Raycaster,
    Ray,
    PlaneGeometry,
    MeshBasicMaterial,
    DoubleSide,
    Mesh,
    MeshPhongMaterial
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
import Animation from './Animation'
import Unit from './Unit'
import Select from './Select'
import ClientSocket from './communication/ClientSocket'
import GameEvents from './communication/GameEvents'
import Cookies from 'js-cookie'

export default class Main {
    constructor(container) {
        this.container = container
        this.scene = new Scene()
        this.renderer = new Renderer(container)
        this.camera = new Camera(75, window.innerWidth, window.innerHeight)
        this.camera.position.set(100, 100, 100)
        this.camera.lookAt(new Vector3(0, 0, 0))
        this.grid = new GridHelper(1000, 10)
        // this.scene.add(this.grid)

        let geometry = new PlaneGeometry(1000, 1000);
        let material = new MeshPhongMaterial({
            color: 0x65C9EA,
            side: DoubleSide,
            shininess: 10
        });

        let plane = new Mesh(geometry, material);
        this.plane = plane;
        this.scene.add(this.plane);
        this.plane.position.y = -1;
        this.plane.rotateX(Math.PI / 2);

        this.keybord = new Keyboard(window);
        this.raycaster = new Raycaster();
        this.connectionData = {};

        // C(l)ock
        this.clock = new Clock()

        // Load unit model/s
        this.units = []
        this.manager = new LoadingManager()
        this.model = new Model(this.manager)
        this.model.load(marioMD2)
        this.manager.onLoad = () => {


            // Websocket
            this.websocket = new ClientSocket(`ws://localhost:5000/socket`); // local development
            // this.websocket = new ClientSocket(`wss://${location.hostname}:${location.port}/socket`); // heroku deploy

            // Get nickname from server
            this.websocket.addEventListener(GameEvents.PLAYER_HANDSHAKE, ({
                nickname,
                playerId,
                sessionId,
                sessIdCookieName,
            }) => {
                this.connectionData.nickname = nickname;
                this.connectionData.playerId = playerId;
                this.connectionData.sessionId = sessionId;
                this.connectionData.sessIdCookieName = sessIdCookieName;
                console.log(`Assigned nickname: ${nickname}`);
                Cookies.set(sessIdCookieName, sessionId);
                console.log(`Assigned sessionId: ${sessionId}`);
            });

            this.websocket.addEventListener(GameEvents.SPAWN_UNIT, ({
                playerId,
                globalId,
                type,
                position,
                destination,
            }) => {
                let unit = new Unit(this.model.mesh.clone(), this.model.mesh.material.clone(), this.websocket, playerId, globalId, type, this.connectionData.playerId);
                unit.deselect();
                let anim = new Animation(unit.mesh);
                unit.position.set(position.x, position.y, position.z);
                this.scene.add(unit);
                this.units.push({
                    unit: unit,
                    anim: anim,
                    state: 'idle'
                });
            });

            this.websocket.addEventListener(GameEvents.MOVE_UNIT, ({
                globalId,
                position,
                destination
            }) => {
                let unitToMove = this.units.find(({
                    unit
                }) => unit.globalId === globalId);
                if (unitToMove) {
                    if (destination) {
                        unitToMove.unit.destination = new Vector3(destination.x, destination.y, destination.z);
                        unitToMove.unit.calculatePath();
                    }
                    if (unitToMove.unit.playerId !== this.connectionData.playerId) {
                        unitToMove.unit.position.set(position.x, position.y, position.z);
                    }
                }
            })

            new Select(this.raycaster, this.camera, this.scene, this.units, this.websocket, this.plane, this.connectionData);
        }

        // adding some light to see the models
        for (let i = -5; i < 5; i++) {
            for (let j = -5; j < 5; j++) {
                if (Math.random() > 0.9) {

                    let l = new Light()
                    l.position.set(i * 100, 100, j * 100)
                    this.scene.add(l)
                }
            }
        }


        let check = document.querySelector('#c1')
        check.addEventListener('click', () => {
            Config.autoDeselect = check.checked
        })

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls = new MapControls(this.camera, this.renderer.domElement)

        this.render();
    }

    render() {
        let delta = this.clock.getDelta()
        for (let unit of this.units) {
            unit.unit.update()
            if (unit.anim) {
                unit.anim.update(delta)
                if (unit.unit.state == 'idle' && unit.anim.animName != 'crstand') unit.anim.playAnim('crstand')
                if (unit.unit.state == 'moving' && unit.anim.animName != 'crwalk') unit.anim.playAnim('crwalk')
            }
        }


        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}