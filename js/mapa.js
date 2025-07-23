const container = document.getElementById('mapa-catalunya-3d');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 10);
camera.position.set(0.486, 1.376, 0.154);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0.4863, -0.0065, 0.1186);

const lightTop = new THREE.DirectionalLight(0xffffff, 1);
lightTop.position.set(10, 10, 10);
scene.add(lightTop);

const lightBottom = new THREE.DirectionalLight(0xffffff, 1);
lightBottom.position.set(10, -10, 10);
scene.add(lightBottom);


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

// 🔍 Conversió lat/lon -> coordenades del model
function latLonToModelCoords(lat, lon, origen, escala = .631) {
    const x = (lon - origen.lon) * escala;
    const z = (lat - origen.lat) * -escala;
    const y = 0;
    return new THREE.Vector3(x, y, z);
}

const origen = { lat: 41.83754, lon: 1.53777 }; // Centre Catalunya
const marcadors = [];

function addGeoMarker(lat, lon, url) {
    const pos = latLonToModelCoords(lat, lon, origen);

    const marcador = new THREE.Mesh(
        new THREE.SphereGeometry(0.003),
        new THREE.MeshBasicMaterial({ color: 'red' })
    );
    marcador.position.copy(pos);
    marcador.userData = { url };
    scene.add(marcador);
    marcadors.push(marcador);
}

// Marcadors
addGeoMarker(42.01435353658641, 2.9114069153401667, 'https://medieval.cat/castell-de-juia/');
addGeoMarker(42.02201937692547, 2.8914027963094164, 'https://medieval.cat/castell-de-palagret/');
addGeoMarker(42.07245667218013, 2.9915938625163316, 'https://medieval.cat/esglesia-de-sant-roma-de-les-arenes/');
addGeoMarker(41.95742066344576, 3.091108830680333, 'https://medieval.cat/esglesia-de-santa-susanna-de-peralta/');
addGeoMarker(41.9486731197141, 2.9990968809692466, 'https://medieval.cat/esglesia-sant-joan-de-salelles/');
addGeoMarker(41.98199275288408, 3.0092646772786655, 'https://medieval.cat/ermita-de-santa-cristina-de-corca/');
addGeoMarker(41.92718916487491, 3.046511936328003, 'https://medieval.cat/esglesia-de-santa-llucia-de-larboc/');
addGeoMarker(41.861129775978554, 3.158444542329917, 'https://medieval.cat/poblat-iberic-del-castell-de-palamos/');
addGeoMarker(41.9917739910286, 3.015707457670084, 'https://medieval.cat/ermita-de-sant-sebastia/');
addGeoMarker(41.78022800300782, 3.01978136441752, 'https://medieval.cat/capella-sant-feliu-de-guixols/');


// 🔍 Raycaster per clicar
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(marcadors);

    if (intersects.length > 0) {
        const url = intersects[0].object.userData.url;
        if (url) window.open(url, '_blank');
    }
}

renderer.domElement.addEventListener('click', onClick);

function goToBaixEmporda() {
    console.log(camera.position)
    console.log(controls.target)

    camera.position.set(0.8783734971281725, 0.24499989443807202, -0.06743795722059194);
    controls.target.set(0.8783734971281725, 0.015399894438186788, -0.06743818682059194);
}

function goToGirona() {
    camera.position.set(0.7590954425336904, 0.22299989660585193, -0.059610343699391256);
    controls.target.set(0.7590954425336904, 0.015399896605955721, -0.059610551308618934);
}

function resetCamera() {
    camera.position.set(0.2146448830681916, 1.39783781879412, 0.12163311376936198 );
    controls.target.set(0.21464488306817425, 0.015399705556876055, 0.12163173133124874);
}

