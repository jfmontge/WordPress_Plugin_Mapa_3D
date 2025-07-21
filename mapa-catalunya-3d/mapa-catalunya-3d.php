<?php
/**
 * Plugin Name: Mapa 3D Catalunya
 * Description: Mostra un model 3D de Catalunya utilitzant Three.js
 * Version: 1.0
 * Author: Jaume Feliu
 */

add_shortcode('mapa_catalunya_3d', 'mostrar_mapa_catalunya');

function mostrar_mapa_catalunya() {
    ob_start();
    ?>

    <div id="mapa-catalunya-3d" style="width: 100%; height: 500px;"></div>

    <!-- Incloure Three.js i OrbitControls i GLTFLoader com scripts globals -->
    <script src="https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.141.0/examples/js/controls/OrbitControls.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.141.0/examples/js/loaders/GLTFLoader.js"></script>
    
    <script src="wp-content/plugins/mapa-catalunya-3d/js/Three.js"></script>


    <script>
        // Aquí utilitzem les variables globals: THREE, THREE.OrbitControls, THREE.GLTFLoader

        const container = document.getElementById('mapa-catalunya-3d');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 1, .1);

        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        const loader = new THREE.GLTFLoader();
        loader.load('wp-content/plugins/mapa-catalunya-3d/models/catalunya.glb', function(gltf) {
            scene.add(gltf.scene);
        }, undefined, function(error) {
            console.error('Error carregant el model:', error);
        });

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(10, 10, 10);
        scene.add(light);

        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
    </script>

    <?php
    return ob_get_clean();
}
