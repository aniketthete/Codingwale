// CodingWale 3D Engine - Handles Home Page & Courses Page automatically
const canvas = document.getElementById('webgl-canvas');

if (canvas) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;

  // Check if current page is courses page
  const isCoursesPage = window.location.pathname.includes('courses.html');

  if (isCoursesPage) {
    // ==========================================
    // COURSES PAGE: Floating Skill Cubes
    // ==========================================
    camera.position.set(0, 0, 7);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 3, 20);
    cyanLight.position.set(4, 4, 4);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x7000ff, 3, 20);
    purpleLight.position.set(-4, -4, 2);
    scene.add(purpleLight);

    const cubesGroup = new THREE.Group();
    const cubeGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);

    const materials = [
      new THREE.MeshStandardMaterial({ color: 0x00f2fe, wireframe: true }),
      new THREE.MeshStandardMaterial({ color: 0x7000ff, wireframe: true }),
      new THREE.MeshStandardMaterial({ color: 0x00ff88, wireframe: true })
    ];

    for (let i = 0; i < 25; i++) {
      const material = materials[i % materials.length];
      const cube = new THREE.Mesh(cubeGeometry, material);

      cube.position.x = (Math.random() - 0.5) * 12;
      cube.position.y = (Math.random() - 0.5) * 8;
      cube.position.z = (Math.random() - 0.5) * 6 - 2;

      cube.rotation.x = Math.random() * Math.PI;
      cube.rotation.y = Math.random() * Math.PI;

      cubesGroup.add(cube);
    }
    scene.add(cubesGroup);

    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 1.5;
      targetY = (e.clientY / window.innerHeight - 0.5) * 1.5;
    });

    const clock = new THREE.Clock();

    function animateCourses() {
      const elapsedTime = clock.getElapsedTime();

      cubesGroup.children.forEach((cube, idx) => {
        cube.rotation.x += 0.005 * (idx % 2 === 0 ? 1 : -1);
        cube.rotation.y += 0.008 * (idx % 3 === 0 ? 1 : -1);
        cube.position.y += Math.sin(elapsedTime + idx) * 0.002;
      });

      cubesGroup.rotation.y = targetX * 0.5;
      cubesGroup.rotation.x = targetY * 0.3;

      renderer.render(scene, camera);
      requestAnimationFrame(animateCourses);
    }

    animateCourses();

  } else {
    // ==========================================
    // HOME PAGE: 3D Terminal + Background Matrix
    // ==========================================
    camera.position.set(0, 0, 5);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const cyanLight = new THREE.DirectionalLight(0x00f2fe, 2.0);
    cyanLight.position.set(5, 5, 5);
    scene.add(cyanLight);

    const purpleLight = new THREE.DirectionalLight(0x7000ff, 1.5);
    purpleLight.position.set(-5, -5, -2);
    scene.add(purpleLight);

    // Background Geometric Matrix
    const outerMatrixGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const outerMatrixMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.15
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

    if (window.innerWidth > 900) {
      backgroundMatrix.position.set(-2.2, 0.2, -1.5);
    } else {
      backgroundMatrix.position.set(0, 1, -1.5);
    }
    scene.add(backgroundMatrix);

    // 3D Terminal Model
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
    });

    // Background Particles
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

    const clock = new THREE.Clock();

    function animateHome() {
      const elapsedTime = clock.getElapsedTime();

      backgroundMatrix.rotation.y = elapsedTime * 0.1;
      backgroundMatrix.rotation.x = elapsedTime * 0.05;

      if (terminalModel) {
        terminalModel.rotation.y = targetX * 0.8;
        terminalModel.rotation.x = 0.2 + (targetY * 0.4);
        terminalModel.position.y = Math.sin(elapsedTime * 1.5) * 0.05 - (scrollY * 0.001);
      }

      particleSystem.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
      requestAnimationFrame(animateHome);
    }

    animateHome();
  }

  // Window Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}
