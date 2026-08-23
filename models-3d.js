document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x00f2fe, 3, 20);
  cyanLight.position.set(4, 4, 4);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0x7000ff, 3, 20);
  purpleLight.position.set(-4, -4, 2);
  scene.add(purpleLight);

  // 1. Matrix Globe (Hero Section)
  const matrixGeo = new THREE.IcosahedronGeometry(1.3, 3);
  const matrixMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true, transparent: true, opacity: 0.3 });
  const matrixGlobe = new THREE.Mesh(matrixGeo, matrixMat);
  matrixGlobe.position.set(2.0, 0, 0);
  scene.add(matrixGlobe);

  // 2. Computer Laptop Model (Courses Section)
  let computerModel = null;
  if (typeof THREE.GLTFLoader !== 'undefined') {
    const loader = new THREE.GLTFLoader();
    loader.load('laptop.glb', (gltf) => {
      computerModel = gltf.scene;
      computerModel.scale.set(0.75, 0.75, 0.75);
      computerModel.position.set(2.0, -8, 0); // Positioned lower along the scroll path
      scene.add(computerModel);
    });
  }

  // 3. Floating Node Ring (Dashboard/Stories Sections)
  const ringGeo = new THREE.TorusGeometry(1.2, 0.1, 16, 100);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x7000ff, wireframe: true });
  const ringNode = new THREE.Mesh(ringGeo, ringMat);
  ringNode.position.set(-2.0, -16, 0);
  scene.add(ringNode);

  // Scroll Position Tracking
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY / window.innerHeight;
  });

  // Mouse Tracking
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();

  function animate() {
    const elapsed = clock.getElapsedTime();

    // Camera transitions vertically with page scroll
    camera.position.y = -scrollY * 8;

    // Model Animations
    matrixGlobe.rotation.y = elapsed * 0.2 + (mouseX * 0.3);
    matrixGlobe.rotation.x = elapsed * 0.1 + (mouseY * 0.3);

    if (computerModel) {
      computerModel.rotation.y = elapsed * 0.3 + (mouseX * 0.4);
      computerModel.rotation.x = mouseY * 0.2;
    }

    ringNode.rotation.x = elapsed * 0.4;
    ringNode.rotation.y = elapsed * 0.2 + (mouseX * 0.3);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
