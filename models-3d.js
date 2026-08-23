// CodingWale 3D Model Loader
const canvas = document.getElementById('webgl-canvas');

if (canvas) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Studio Lighting setup for realistic 3D materials
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  const cyanLight = new THREE.DirectionalLight(0x00f2fe, 3);
  cyanLight.position.set(5, 5, 5);
  scene.add(cyanLight);

  const purpleLight = new THREE.DirectionalLight(0x7000ff, 2);
  purpleLight.position.set(-5, -5, -2);
  scene.add(purpleLight);

  // Load the Custom GLB Model
  let laptopModel;
  const loader = new THREE.GLTFLoader();

  // Make sure the filename below matches your uploaded file name exactly!
  loader.load('laptop.glb', (gltf) => {
    laptopModel = gltf.scene;

    // Adjust scale and position to fit the hero layout
    laptopModel.scale.set(1.5, 1.5, 1.5);
    laptopModel.rotation.x = 0.3; // Tilt slightly forward
    
    if (window.innerWidth > 900) {
      laptopModel.position.set(2, -0.5, 0);
    } else {
      laptopModel.position.set(0, -1, 0);
    }

    scene.add(laptopModel);
  }, undefined, (error) => {
    console.error('Error loading 3D model:', error);
  });

  // Mouse Parallax Effect
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Scroll Position
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    const elapsedTime = clock.getElapsedTime();

    if (laptopModel) {
      // Gentle floating motion + hover response
      laptopModel.rotation.y = elapsedTime * 0.3 + (mouseX * 0.3);
      laptopModel.rotation.x = 0.2 + (mouseY * 0.2);
      laptopModel.position.y = Math.sin(elapsedTime * 1.5) * 0.1 - (scrollY * 0.001);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  // Window Resize Handling
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (laptopModel) {
      if (window.innerWidth > 900) {
        laptopModel.position.x = 2;
      } else {
        laptopModel.position.x = 0;
      }
    }
  });
}
