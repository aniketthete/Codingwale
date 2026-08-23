document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Global Cursor Mouse Physics
  let targetX = 0, targetY = 0;
  let mouseX = 0, mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Glowing Floating Particle Dust Field
  const particleCount = 120;
  const particleGeo = new THREE.BufferGeometry();
  const particleCoords = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particleCoords[i] = (Math.random() - 0.5) * 20;
    particleCoords[i + 1] = (Math.random() - 0.5) * 15;
    particleCoords[i + 2] = (Math.random() - 0.5) * 10;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particleCoords, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.04,
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Dynamic Scene Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x00f2fe, 3, 20);
  cyanLight.position.set(4, 4, 4);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0x7000ff, 3, 20);
  purpleLight.position.set(-4, -4, 2);
  scene.add(purpleLight);

  // Route Detection
  const path = window.location.pathname.toLowerCase();
  const isHome = path === '/' || path.endsWith('/index.html') || path.endsWith('/index');

  if (isHome) {
    camera.position.set(0, 0, 5);

    // Glowing Holographic Wireframe Core
    const matrixGeo = new THREE.IcosahedronGeometry(1.4, 3);
    const matrixMat = new THREE.MeshBasicMaterial({ 
      color: 0x00f2fe, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.25 
    });
    const backgroundMatrix = new THREE.Mesh(matrixGeo, matrixMat);
    backgroundMatrix.position.set(-2.0, 0.1, -1);
    scene.add(backgroundMatrix);

    // Inner Glowing Core
    const innerGeo = new THREE.IcosahedronGeometry(0.8, 2);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x7000ff, wireframe: true, transparent: true, opacity: 0.4 });
    const innerMatrix = new THREE.Mesh(innerGeo, innerMat);
    backgroundMatrix.add(innerMatrix);

    let terminalModel = null;
    if (typeof THREE.GLTFLoader !== 'undefined') {
      const loader = new THREE.GLTFLoader();
      loader.load('laptop.glb', (gltf) => {
        terminalModel = gltf.scene;
        terminalModel.scale.set(0.75, 0.75, 0.75);
        terminalModel.position.set(2.0, -0.3, 0);
        scene.add(terminalModel);
      });
    }

    const clock = new THREE.Clock();
    function animateHome() {
      const elapsed = clock.getElapsedTime();

      // Smooth Mouse Easing
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      backgroundMatrix.rotation.y = elapsed * 0.2 + (mouseX * 0.4);
      backgroundMatrix.rotation.x = elapsed * 0.1 + (mouseY * 0.4);
      innerMatrix.rotation.y = -elapsed * 0.3;

      particleSystem.rotation.y = elapsed * 0.02;

      if (terminalModel) {
        terminalModel.rotation.y = mouseX * 0.5;
        terminalModel.rotation.x = 0.1 + (mouseY * 0.3);
        terminalModel.position.y = -0.3 + Math.sin(elapsed * 1.8) * 0.05;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animateHome);
    }
    animateHome();

  } else {
    // Inner Page Floating Geometric Nodes
    camera.position.set(0, 0, 7);

    const group = new THREE.Group();
    const geometry = new THREE.TorusGeometry(0.3, 0.12, 16, 32);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x00f2fe, 
      metalness: 0.8, 
      roughness: 0.2, 
      wireframe: true 
    });

    for (let i = 0; i < 22; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6 - 1);
      mesh.rotation.x = Math.random() * Math.PI;
      group.add(mesh);
    }
    scene.add(group);

    const clock = new THREE.Clock();
    function animateInner() {
      const elapsed = clock.getElapsedTime();

      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      group.children.forEach((mesh, idx) => {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        mesh.position.y += Math.sin(elapsed + idx) * 0.003;
      });

      group.rotation.y = mouseX * 0.5;
      group.rotation.x = mouseY * 0.3;
      particleSystem.rotation.y = elapsed * 0.03;

      renderer.render(scene, camera);
      requestAnimationFrame(animateInner);
    }
    animateInner();
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
