// CodingWale 3D Engine - Display Terminal Texture Loader
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

  // Studio Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
  scene.add(ambientLight);

  const cyanLight = new THREE.DirectionalLight(0x00f2fe, 3.5);
  cyanLight.position.set(5, 5, 5);
  scene.add(cyanLight);

  const purpleLight = new THREE.DirectionalLight(0x7000ff, 2.0);
  purpleLight.position.set(-5, -5, -2);
  scene.add(purpleLight);

  // Load Custom Textures Uploaded to GitHub
  const textureLoader = new THREE.TextureLoader();
  
  // Exact filenames matching your uploaded GitHub files
  const diffuseMap = textureLoader.load('Display tesxtured from 3d coat_diffuse_1.png');
  const normalMap = textureLoader.load('Display tesxtured from 3d coat_normalmap_0.png');
  const metalnessMap = textureLoader.load('Display tesxtured from 3d coat_metalness-Disp.png');

  // Load Terminal GLB Model
  let terminalModel;
  const loader = new THREE.GLTFLoader();

  loader.load('laptop.glb', (gltf) => {
    terminalModel = gltf.scene;

    terminalModel.traverse((child) => {
      if (child.isMesh) {
        // Apply uploaded textures onto model materials
        child.material.map = diffuseMap;
        child.material.normalMap = normalMap;
        child.material.metalnessMap = metalnessMap;
        child.material.needsUpdate = true;
      }
    });

    terminalModel.scale.set(0.6, 0.6, 0.6);
    terminalModel.rotation.x = 0.2;
    
    if (window.innerWidth > 900) {
      terminalModel.position.set(2, 0, 0);
    } else {
      terminalModel.position.set(0, -0.5, 0);
    }

    scene.add(terminalModel);
  }, undefined, (error) => {
    console.error('Error loading terminal model:', error);
  });

  // Background Ambient Particles
  const particleCount = 50;
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

  // Mouse Parallax & Scroll Interaction
  let mouseX = 0;
  let mouseY = 0;
  let scrollY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    const elapsedTime = clock.getElapsedTime();

    if (terminalModel) {
      terminalModel.rotation.y = elapsedTime * 0.25 + (mouseX * 0.25);
      terminalModel.rotation.x = 0.15 + (mouseY * 0.15);
      terminalModel.position.y = Math.sin(elapsedTime * 1.5) * 0.08 - (scrollY * 0.001);
    }

    particleSystem.rotation.y = elapsedTime * 0.03;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  // Responsive Viewport Resizing
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (terminalModel) {
      if (window.innerWidth > 900) {
        terminalModel.position.x = 2;
      } else {
        terminalModel.position.x = 0;
      }
    }
  });
}
