document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('mapa-catalunya-3d');

    if (!container) {
        console.error("No s'ha trobat l'element #mapa-catalunya-3d");
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 10);
    camera.position.set(0, 1.8, 0);
    camera.lookAt(0, 0, 0);


    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const lightTop = new THREE.DirectionalLight(0xffffff, 2);
    lightTop.position.set(10, 10, 10);
    scene.add(lightTop);

    const lightBottom = new THREE.DirectionalLight(0xffffff, 1);
    lightBottom.position.set(10, -10, 10);
    scene.add(lightBottom);

    const loader = new THREE.GLTFLoader();
    const urlModel = `${window.location.origin}/wordpress/wp-content/plugins/mapa-catalunya-3d/models/catalunya.glb`;

    loader.load(urlModel, function(gltf) {
        scene.add(gltf.scene);
    }, undefined, function(error) {
        console.error('Error carregant el model:', error);
    });

    const textCanvi = document.getElementById('text-info');
    const imatgeCanvi = document.getElementById('imatge-info');
    const descripcioCanvi = document.getElementById('desc-info');
    const botoEnllac = document.getElementById('boto-enllac');

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    // Conversió lat/lon -> coordenades del model
    function latLonToModelCoords(lat, lon, origen, escala = .535) {
        const x = (lon - origen.lon) * escala;
        const z = (lat - origen.lat) * -escala;
        const y = 0;
        return new THREE.Vector3(x, y, z);
    }

    const origen = { lat: 41.83754, lon: 1.53777 }; // Centre Catalunya
    const marcadors = [];

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onClick(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(marcadors);

        if (intersects.length > 0 && textCanvi && descripcioCanvi) {
            textCanvi.innerText = intersects[0].object.userData.nom;
         
        descripcioCanvi.innerText = intersects[0].object.userData.descripcio;

        if (intersects[0].object.userData.imatge) {
            // Assumeix que la imatge és jpeg (canvia si és png, gif, etc.)
            imatgeCanvi.src = `data:image/jpeg;base64,${intersects[0].object.userData.imatge}`;
            imatgeCanvi.style.display = 'block';
            } else {
                imatgeCanvi.style.display = 'none';
            }

            if (intersects[0].object.userData.enllac) {
                botoEnllac.innerText = 'Obrir enllaç';
                botoEnllac.style.display = 'inline-block';
                botoEnllac.onclick = () => {
                window.open(intersects[0].object.userData.enllac, '_blank');
            };
            } else {
                botoEnllac.style.display = 'none';
            }
        }
    }

    renderer.domElement.addEventListener('click', onClick);

    // Carrega marcadors des de get-marcadors.php
    const urlMarcador = `${window.location.origin}/wordpress/wp-content/plugins/mapa-catalunya-3d/get-marcadors.php`;

    fetch(urlMarcador)
        .then(res => {
            if (!res.ok) throw new Error('Error al carregar marcadors');
            return res.json();
        })
        .then(data => {
            data.forEach(marcador => {
                const pos = latLonToModelCoords(
                    parseFloat(marcador.lat_edificacio_historica),
                    parseFloat(marcador.long_edificacio_historica),
                    origen
                );

                const geometry = new THREE.SphereGeometry(0.005, 16, 16);
                const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
                const esfera = new THREE.Mesh(geometry, material);

                esfera.position.copy(pos);
                esfera.userData.nom = marcador.nom_edificacio_historica;
                esfera.userData.imatge = marcador.imatge_edificacio_historica;
                esfera.userData.enllac = marcador.enllac_edificacio_historica;

                // Límit de 120 caràcters per la descripció, per no ocupar tota el div
                if (marcador.descripcio_edificacio_historica.length > 120) {
                    esfera.userData.descripcio = marcador.descripcio_edificacio_historica.substring(0,120) + "...";
                } else {
                    esfera.userData.descripcio = marcador.descripcio_edificacio_historica;
                }

                scene.add(esfera);
                marcadors.push(esfera);
            });
        })
        .catch(err => {
            console.error('Error carregant dades:', err);
        });

    // Funcions extra de càmera
    window.goToBaixEmporda = () => {
        console.log(camera.position)
        camera.position.set(0.87837, 0.245, 0);
        camera.lookAt(0.87837, 0, -0.0674);
    };

    window.goToGirona = () => {
        camera.position.set(0.7591, 0.223, 0);
        camera.lookAt(0.7591, 0, -0.0596);
    };

    window.resetCamera = () => {
        camera.position.set(0, 1.8, 0);
        camera.lookAt(0, 0, 0);
    };
});