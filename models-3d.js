document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Global Cursor Movement Tracking
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Explicit Route Detection
  const path = window.location.pathname.toLowerCase();
  const isHome = path === '/' || path.endsWith('/index.html') || path.endsWith('/index');

  if (isHome) {
    // HOME PAGE SCENE
    camera.position.set(0, 0, 5);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const cyanLight = new THREE.DirectionalLight(0x00f2fe, 2.0);
    cyanLight.position.set(5, 5, 5);
    scene.add(cyanLight);

    const matrixGeo = new THREE.IcosahedronGeometry(1.3, 2);
    const matrixMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true, transparent: true, opacity: 0.2 });
    const backgroundMatrix = new THREE.Mesh(matrixGeo, matrixMat);
    
    // Position matrix on left, leaving space for hero text
    backgroundMatrix.position.set(-1.8, 0, -1);
    scene.add(backgroundMatrix);

    let terminalModel = null;
    if (typeof THREE.GLTFLoader !== 'undefined') {
      const loader = new THREE.GLTFLoader();
      loader.load('laptop.glb', (gltf) => {
        terminalModel = gltf.scene;
        terminalModel.scale.set(0.7, 0.7, 0.7);
        terminalModel.position.set(1.8, -0.4, 0);
        scene.add(terminalModel);
      });
    }

    const clock = new THREE.Clock();
    function animateHome() {
      const elapsed = clock.getElapsedTime();
      backgroundMatrix.rotation.y = elapsed * 0.15 + (mouseX * 0.3);
      backgroundMatrix.rotation.x = elapsed * 0.08 + (mouseY * 0.3);

      if (terminalModel) {
        terminalModel.rotation.y = mouseX * 0.4;
        terminalModel.rotation.x = mouseY * 0.2;
        terminalModel.position.y = -0.4 + Math.sin(elapsed * 1.5) * 0.04;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animateHome);
    }
    animateHome();

  } else {
    // INNER PAGES SCENE (Floating Cyber-Nodes)
    camera.position.set(0, 0, 7);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f2fe, 2, 20);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const group = new THREE.Group();
    const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const material = new THREE.MeshStandardMaterial({ color: 0x00f2fe, wireframe: true });

    for (let i = 0; i < 20; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4 - 1);
      group.add(mesh);
    }
    scene.add(group);

    function animateInner() {
      group.rotation.y = mouseX * 0.3;
      group.rotation.x = mouseY * 0.2;
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
