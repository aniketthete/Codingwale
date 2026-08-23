// CodingWale Three.js 3D Engine Architecture
const canvas = document.getElementById('webgl-canvas');

if (canvas) {
  // Scene Setup
  const scene = new THREE.Scene();

  // Camera Setup
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 7;

  // Renderer Setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Outer Wireframe Icosahedron (The Core Matrix)
  const coreGeometry = new THREE.IcosahedronGeometry(2.5, 2);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  scene.add(coreMesh);

  // Inner Glowing Nucleus
  const innerGeometry = new THREE.IcosahedronGeometry(1.2, 1);
  const innerMaterial = new THREE.MeshBasicMaterial({
    color: 0x7000ff,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });
  const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
  scene.add(innerMesh);

  // Orbiting Particle Nodes
  const particleCount = 120;
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 12;
    positions[i + 1] = (Math.random() - 0.5) * 12;
    positions[i + 2] = (Math.random() - 0.5) * 12;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x00f2fe,
    size: 0.05,
    transparent: true,
    opacity: 0.8
  });

  const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particleSystem);

  // Repositioning 3D object for hero layout on desktop
  if (window.innerWidth > 900) {
    coreMesh.position.x = 2;
    innerMesh.position.x = 2;
  }

  // Mouse Parallax Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Scroll Interaction
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    const elapsedTime = clock.getElapsedTime();

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Smooth Rotations
    coreMesh.rotation.y = elapsedTime * 0.15 + targetX * 0.5;
    coreMesh.rotation.x = elapsedTime * 0.10 + targetY * 0.5;

    innerMesh.rotation.y = -elapsedTime * 0.25;
    innerMesh.rotation.x = -elapsedTime * 0.20;

    particleSystem.rotation.y = elapsedTime * 0.05;

    // Subtle position shift based on scroll
    coreMesh.position.y = -scrollY * 0.001;
    innerMesh.position.y = -scrollY * 0.001;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  // Window Resize Listener
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (window.innerWidth > 900) {
      coreMesh.position.x = 2;
      innerMesh.position.x = 2;
    } else {
      coreMesh.position.x = 0;
      innerMesh.position.x = 0;
    }
  });
}
