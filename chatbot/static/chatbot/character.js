
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(50, (window.innerWidth/4) / (window.innerHeight*0.8), 0.1, 1000);

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

let mixer;

let clock = new THREE.Clock();

camera.position.set(0, 0.2, 1);

//Instantiate a loader for the .gltf file
new GLTFLoader()
    .load(model, function ( gltf ) {
      //If the file is loaded, add it to the scene  

      object = gltf.scene.children[0];
      object.position.set(0,-1.4,0);

      mixer = new THREE.AnimationMixer( object );
      mixer.clipAction(THREE.AnimationUtils.subclip( gltf.animations[ 0 ], 'idle', 0, 207)).setDuration( 6.9 ).play();//0
      mixer._actions[0].enabled = true;

      scene.add(object);

      const head = object.getObjectByName("UnionAvatars_Head001");
      console.log(object);
			const influences = head.morphTargetInfluences;

      console.log(head.morphTargetDictionary);
      console.log(influences);

      

    },
    function (xhr) {
      //While it is loading, log the progress
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      //If there is an error, log it
      console.error(error);
    }
  );

  new RGBELoader()
					.load( hdri, function ( texture ) {

						texture.mapping = THREE.EquirectangularReflectionMapping;

						scene.background = texture;
						scene.environment = texture;
          } );

  //Instantiate a new renderer 
const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true}); //Alpha: true allows for the transparent background
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

let characterWindow;

//Add the renderer to the DOM
document.addEventListener('DOMContentLoaded', function() {
    characterWindow = document.querySelector(".character-view");
    console.log(characterWindow.innerWidth + ' ' + characterWindow.innerHeight);
    renderer.setSize((window.innerWidth/4) , (window.innerHeight*0.8));
    characterWindow.appendChild(renderer.domElement);
    
});

//Add lights to the scene, so we can actually see the 3D model

controls = new OrbitControls(camera, renderer.domElement);

//Render the scene
renderer.setAnimationLoop( animate );

function animate() {

  const clockDelta = clock.getDelta();
  if ( mixer ){mixer.update( clockDelta );}
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
