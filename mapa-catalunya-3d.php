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
    <div class="grid-father">
        <div class="sidebar-buttons">
            <button onclick="resetCamera()">Mapa complet</button>
            <button onclick="goToBaixEmporda()">Baix Empordà</button>
            <button onclick="goToGirona()">Gironès</button>
            <!--<button>Alt Camp</button>
            <button>Alt Empordà</button>
            <button>Alt Penedès</button>
            <button>Alt Urgell</button>
            <button>Alta Ribagorça</button>
            <button>Anoia</button>
            <button>Aran</button>
            <button>Bages</button>
            <button>Baix Camp</button>
            <button>Baix Ebre</button>
            <button>Baix Llobregat</button>
            <button>Baix Penedès</button>
            <button>Barcelonès</button>
            <button>Berguedà</button>
            <button>Cerdanya</button>
            <button>Conca de Barberà</button>
            <button>Garraf</button>
            <button>Garrigues</button>
            <button>Garrotxa</button>
            <button>Lluçanès</button>
            <button>Maresme</button>
            <button>Moianès</button>
            <button>Montsià</button>
            <button>Noguera</button>
            <button>Osona</button>
            <button>Pallars Jussà</button>
            <button>Pallars Sobirà</button>
            <button>Pla d'Urgell</button>
            <button>Pla de l'Estany</button>
            <button>Priorat</button>
            <button>Ribera d'Ebre</button>
            <button>Ripollès</button>
            <button>Segarra</button>
            <button>Segrià</button>
            <button>Selva</button>
            <button>Solsonès</button>
            <button>Tarragonès</button>
            <button>Terra Alta</button>
            <button>Urgell</button>
            <button>Vallès Occidental</button>
            <button>Vallès Oriental</button>-->
        </div>

        <div id="mapa-catalunya-3d"></div>

        <div class="sidebar-info">
            <p id="text-info">Fes clic a un marcador</p>
            <img id="imatge-info" src="" alt="Imatge edificació"></img>
            <p id="desc-info"></p>
            <button id="boto-enllac"></button> 
        </div>
    </div>

    <!-- Incloure Three.js i OrbitControls i GLTFLoader com scripts globals -->
    <script src="https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.min.js"></script>
    <!--<script src="https://cdn.jsdelivr.net/npm/three@0.141.0/examples/js/controls/OrbitControls.js"></script>-->
    <script src="https://cdn.jsdelivr.net/npm/three@0.141.0/examples/js/loaders/GLTFLoader.js"></script>

    <!-- Definim una variable global per a la URL dels marcadors -->
    <script>
        const URL_GET_MARCADORS = '<?php echo plugins_url('get-marcadors.php', __FILE__); ?>';
        const MODEL_URL = '<?php echo plugins_url('models/catalunya.glb', __FILE__); ?>';
    </script>

    <!-- JavaScript principal del mapa -->
    <script src="<?php echo plugins_url('js/mapa.js', __FILE__); ?>"></script>

    <script>
        const urlModel = "<?php echo plugins_url('models/catalunya.glb', __FILE__); ?>";
    </script>


    <?php
    return ob_get_clean();
}

// Encolar estils
function mapa_catalunya_enqueue_styles() {
    wp_enqueue_style('mapa-catalunya-style', plugins_url('styles.css', __FILE__));
}
add_action('wp_enqueue_scripts', 'mapa_catalunya_enqueue_styles');
?>
