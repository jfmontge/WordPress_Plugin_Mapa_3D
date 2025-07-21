// Array per guardar marcadors i els seus enllaços
const marcadors = [];

// Funció per crear un marcador
function crearMarcador(posicio, url) {
    // Pots usar una esfera petita o un sprite
    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
    const material = new THREE.MeshBasicMaterial({color: 0xff0000});
    const marcador = new THREE.Mesh(geometry, material);
    marcador.position.copy(posicio);

    // Guardem la URL en el mateix objecte per accedir després
    marcador.userData.url = url;

    scene.add(marcador);
    marcadors.push(marcador);
}

// Exemple: crear un marcador a la posició (1, 0, 0)
crearMarcador(new THREE.Vector3(1, 0, 0), 'https://exemple.com');

// Raycaster i vector de ratolí
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    // Calcular la posició normalitzada del ratolí [-1, 1]
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Llançar el raig des de la càmera
    raycaster.setFromCamera(mouse, camera);

    // Detectar interseccions amb marcadors
    const intersects = raycaster.intersectObjects(marcadors);

    if (intersects.length > 0) {
        const clickedMarker = intersects[0].object;
        const url = clickedMarker.userData.url;
        if (url) {
            window.open(url, '_blank'); // Obrir en una nova pestanya
        }
    }
}

// Afegir event listener per clic del ratolí
window.addEventListener('click', onMouseClick, false);
