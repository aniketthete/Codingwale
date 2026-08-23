// CodingWale 3D Engine - Universal Texture Assignment
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
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
  scene.add(ambientLight);

  const cyanLight = new THREE.DirectionalLight(0x00f2fe, 3);
  cyanLight.position.set(5, 5, 5);
  scene.add(cyanLight);

  // Dynamic Canvas Texture for Code Display
  const codeCanvas = document.createElement('canvas');
  codeCanvas.width = 512;
  codeCanvas.height = 512;
  const ctx = codeCanvas.getContext('2d');
  const codeTexture = new THREE.CanvasTexture(codeCanvas);

  const codeLines = [
    '// CodingWale Matrix System',
    'const app = new Terminal();',
    'await app.loadModules();',
    'function startEngine() {',
    '  console.log("3D Active");',
    '}',
    'app.run();'
  ];

  let lineOffset = 0;
  function updateScreenTexture() {
    ctx.fillStyle = '#0a0f1a';
    ctx.fillRect(0, 0, codeCanvas.width, codeCanvas.height);

    ctx.font = 'bold 22px monospace';
    ctx.fillStyle = '#00f2fe';

    codeLines.forEach((line, index) => {
      const y = 60 + index * 40 - (lineOffset % 40);
      if (y > 0 && y < codeCanvas.height) {
        ctx.fillText(line, 30, y);
      }
    });

    lineOffset += 0.8;
    codeTexture.needsUpdate = true;
  }

  // Load the Laptop GLB Model
  let laptopModel;
  const loader = new THREE.GLTFLoader();

  loader.load('laptop.glb', (gltf) => {
    laptopModel = gltf.scene;

    laptopModel.traverse((child) => {
      if (child.isMesh) {
        // Log child names to browser console for verification
        console.log("Found GLB mesh:", child.name);

        // Apply animated code material directly to meshes
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
    console.error('Error loading GLB:', error);
  });

  // Mouse Parallax & Scroll Events
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

  // Responsive Resizing
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
