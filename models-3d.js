// CodingWale 3D Engine with Animated Code Screen
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

  // Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
  scene.add(ambientLight);

  const cyanLight = new THREE.DirectionalLight(0x00f2fe, 3.5);
  cyanLight.position.set(5, 5, 5);
  scene.add(cyanLight);

  const purpleLight = new THREE.DirectionalLight(0x7000ff, 2.5);
  purpleLight.position.set(-5, -5, -2);
  scene.add(purpleLight);

  // Dynamic Dynamic Canvas Texture for Animated Code
  const codeCanvas = document.createElement('canvas');
  codeCanvas.width = 512;
  codeCanvas.height = 320;
  const ctx = codeCanvas.getContext('2d');
  const codeTexture = new THREE.CanvasTexture(codeCanvas);

  const codeLines = [
    'const codingWale = new Engine();',
    'await codingWale.initialize();',
    'function buildFuture() {',
    '  render3DCore({ status: "ACTIVE" });',
    '  deployPlatform("v2.0");',
    '}',
    '// System ready. Welcome learner.',
    'codingWale.start();'
  ];

  let lineOffset = 0;
  function updateScreenTexture() {
    ctx.fillStyle = '#030508';
    ctx.fillRect(0, 0, codeCanvas.width, codeCanvas.height);

    ctx.font = '18px monospace';
    ctx.fillStyle = '#00f2fe';
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 8;

    codeLines.forEach((line, index) => {
      const y = 40 + index * 32 - (lineOffset % 32);
      if (y > 0 && y < codeCanvas.height) {
        ctx.fillText(line, 20, y);
      }
    });

    lineOffset += 0.5;
    codeTexture.needsUpdate = true;
  }

  // Load the Laptop GLB Model
  let laptopModel;
  const loader = new THREE.GLTFLoader();

  loader.load('laptop.glb', (gltf) => {
    laptopModel = gltf.scene;

    // Apply code texture to screen material if detected
    laptopModel.traverse((child) => {
      if (child.isMesh && (child.name.toLowerCase().includes('screen') || child.name.toLowerCase().includes('display'))) {
        child.material = new THREE.MeshBasicMaterial({
          map: codeTexture
        });
      }
    });

    laptopModel.scale.set(0.6, 0.6, 0.6);
    laptopModel.rotation.x = 0.3;
    
    if (window.innerWidth > 900) {
      laptopModel.position.set(2, 0, 0);
    } else {
      laptopModel.position.set(0, 0, 0);
    }

    scene.add(laptopModel);
  }, undefined, (error) => {
    console.error('Error loading 3D model:', error);
  });

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

    updateScreenTexture();

    if (laptopModel) {
      laptopModel.rotation.y = elapsedTime * 0.3 + (mouseX * 0.3);
      laptopModel.rotation.x = 0.2 + (mouseY * 0.2);
      laptopModel.position.y = Math.sin(elapsedTime * 1.5) * 0.1 - (scrollY * 0.001);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  // Resize Listener
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
