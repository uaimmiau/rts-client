import Config from "./Config";

export default class Keyboard {
    constructor(domElement) {
        this.domElement = domElement
        this.domElement.addEventListener('keydown', event => this.onKeyDown(event), false)
        this.domElement.addEventListener('keyup', event => this.onKeyUp(event), false)
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
                Config.moveForward = false
                break
            case 'KeyS':
                Config.moveBackward = false
                break
            case 'KeyA':
                Config.rotateLeft = false
                break
            case 'KeyD':
                Config.rotateRight = false
                break
        }
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'KeyW':
                Config.moveForward = true
                break
            case 'KeyS':
                Config.moveBackward = true
                break
            case 'KeyA':
                Config.rotateLeft = true
                break
            case 'KeyD':
                Config.rotateRight = true
                break
        }

    }


}