// CodingWale 3D Engine - Dual Scene: Blurred Background Matrix + Terminal Model
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

  renderer.outputEncoding = THREE.sRGBEncoding;

  // Balanced Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const cyanLight = new THREE.DirectionalLight(0x00f2fe, 2.0);
  cyanLight.position.set(5, 5, 5);
  scene.add(cyanLight);

  const purpleLight = new THREE.DirectionalLight(0x7000ff, 1.5);
  purpleLight.position.set(-5, -5, -2);
  scene.add(purpleLight);

  // 1. Background Geometric Wireframe Matrix (Left Side Behind Text)
  const outerMatrixGeo = new THREE.IcosahedronGeometry(1.6, 2);
  const outerMatrixMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    wireframe: true,
    transparent: true,
    opacity: 0.15 // Faded/blurred aesthetic
  });
  const backgroundMatrix = new THREE.Mesh(outerMatrixGeo, outerMatrixMat);

  const innerMatrixGeo = new THREE.IcosahedronGeometry(0.9, 1);
  const innerMatrixMat = new THREE.MeshBasicMaterial({
    color: 0x7000ff,
    wireframe: true,
    transparent: true,
    opacity: 0.2
  });
  const innerMatrix = new THREE.Mesh(innerMatrixGeo, innerMatrixMat);
  backgroundMatrix.add(innerMatrix);

  // Position Matrix behind the Hero Headline on Desktop
  if (window.innerWidth > 900) {
    backgroundMatrix.position.set(-2.2, 0.2, -1.5);
  } else {
    backgroundMatrix.position.set(0, 1, -1.5);
  }
  scene.add(backgroundMatrix);

  // 2. Main Terminal GLB Model (Right Side)
  let terminalModel;
  const loader = new THREE.GLTFLoader();

  loader.load('laptop.glb', (gltf) => {
    terminalModel = gltf.scene;

    terminalModel.traverse((child) => {
      if (child.isMesh) {
        child.material.depthWrite = true;
        child.material.transparent = false;
      }
    });

    terminalModel.scale.set(0.85, 0.85, 0.85);
    terminalModel.rotation.x = 0.2;
    
    if (window.innerWidth > 900) {
      terminalModel.position.set(2, -0.2, 0);
    } else {
      terminalModel.position.set(0, -0.5, 0);
    }

    scene.add(terminalModel);
  }, undefined, (error) => {
    console.error('Error loading model:', error);
  });

  // Background Ambient Particles
  const particleCount = 60;
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x00f2fe,
    size: 0.04,
    transparent: true,
    opacity: 0.5
  });
  const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particleSystem);

  // Mouse Pointer Tracking
  let targetX = 0;
  let targetY = 0;
  let scrollY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // Render Loop
  const clock = new THREE.Clock();

  function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate matrix slowly in the background
    backgroundMatrix.rotation.y = elapsedTime * 0.1;
    backgroundMatrix.rotation.x = elapsedTime * 0.05;

    // Terminal rotates only with mouse interaction
    if (terminalModel) {
      terminalModel.rotation.y = targetX * 0.8;
      terminalModel.rotation.x = 0.2 + (targetY * 0.4);
      terminalModel.position.y = Math.sin(elapsedTime * 1.5) * 0.05 - (scrollY * 0.001);
    }

    particleSystem.rotation.y = elapsedTime * 0.02;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  // Responsive Layout Adjustment
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (window.innerWidth > 900) {
      backgroundMatrix.position.set(-2.2, 0.2, -1.5);
      if (terminalModel) terminalModel.position.x = 2;
    } else {
      backgroundMatrix.position.set(0, 1, -1.5);
      if (terminalModel) terminalModel.position.x = 0;
    }
  });
}
