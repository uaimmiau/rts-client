import {
    WebGLRenderer
} from 'three';

export default class Renderer extends WebGLRenderer {
    constructor(container) {
        super({
            antialias: true,
            alpha: true
        })

        this.container = container

        this.container.appendChild(this.domElement);

        // resize
        this.updateSize();
        document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
        window.addEventListener('resize', () => this.updateSize(), false);
    }

    updateSize() {
        this.setSize(window.innerWidth, window.innerHeight);
    }
}