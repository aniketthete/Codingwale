document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Scene Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x00f2fe, 3, 20);
  cyanLight.position.set(4, 4, 4);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0x7000ff, 3, 20);
  purpleLight.position.set(-4, -4, 2);
  scene.add(purpleLight);

  // Y-offsets for each section along the scroll path
  const Y_OFFSET = 12;

  // ==========================================
  // 1. HERO: MULTI-TIERED HOLOGRAPHIC CORE
  // ==========================================
  const heroGroup = new THREE.Group();
  heroGroup.position.set(3.2, 0, 0);

  const sphereGeo = new THREE.SphereGeometry(1.0, 24, 24);
  const sphereMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true, transparent: true, opacity: 0.35 });
  
  const topSphere = new THREE.Mesh(sphereGeo, sphereMat);
  topSphere.position.y = 0.6;
  heroGroup.add(topSphere);

  const bottomSphere = new THREE.Mesh(sphereGeo, sphereMat);
  bottomSphere.position.y = -0.6;
  heroGroup.add(bottomSphere);

  const cylGeo = new THREE.CylinderGeometry(1.3, 1.3, 1.0, 32, 8, true);
  const cylMat = new THREE.MeshBasicMaterial({ color: 0x7000ff, wireframe: true, transparent: true, opacity: 0.5 });
  const midCylinder = new THREE.Mesh(cylGeo, cylMat);
  heroGroup.add(midCylinder);

  const ringGeo1 = new THREE.TorusGeometry(2.0, 0.02, 16, 100);
  const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.6 });
  const outerRing1 = new THREE.Mesh(ringGeo1, ringMat1);
  outerRing1.rotation.x = Math.PI / 2.3;
  heroGroup.add(outerRing1);

  const panelGeo = new THREE.PlaneGeometry(0.6, 0.8);
  const panelMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
  const panels = [];
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(Math.cos(angle) * 2.6, 0, Math.sin(angle) * 2.6);
    panel.rotation.y = -angle + Math.PI / 2;
    heroGroup.add(panel);
    panels.push({ mesh: panel, angle: angle });
  }
  scene.add(heroGroup);

  // ==========================================
  // 2. COURSES: 3D LCD MONITOR (BINARY CODE)
  // ==========================================
  const coursesGroup = new THREE.Group();
  coursesGroup.position.set(3.2, -Y_OFFSET, 0);

  // Monitor Frame & Stand
  const frameGeo = new THREE.BoxGeometry(3.2, 2.0, 0.15);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
  const monitorFrame = new THREE.Mesh(frameGeo, frameMat);
  coursesGroup.add(monitorFrame);

  const standGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.8, 16);
  const stand = new THREE.Mesh(standGeo, frameMat);
  stand.position.set(0, -1.2, 0);
  coursesGroup.add(stand);

  const baseGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.08, 32);
  const base = new THREE.Mesh(baseGeo, frameMat);
  base.position.set(0, -1.6, 0);
  coursesGroup.add(base);

  // Matrix Canvas Screen Texture
  const codeCanvas = document.createElement('canvas');
  codeCanvas.width = 512;
  codeCanvas.height = 320;
  const ctx = codeCanvas.getContext('2d');
  const codeTexture = new THREE.CanvasTexture(codeCanvas);

  const screenGeo = new THREE.PlaneGeometry(3.0, 1.8);
  const screenMat = new THREE.MeshBasicMaterial({ map: codeTexture });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.z = 0.09;
  coursesGroup.add(screenMesh);
  scene.add(coursesGroup);

  const columns = Array(32).fill(0);

  function drawMatrixCode() {
    ctx.fillStyle = 'rgba(3, 7, 18, 0.2)';
    ctx.fillRect(0, 0, codeCanvas.width, codeCanvas.height);
    ctx.fillStyle = '#00f2fe';
    ctx.font = '14px monospace';

    columns.forEach((y, index) => {
      const text = Math.random() > 0.5 ? '1' : '0';
      const x = index * 16;
      ctx.fillText(text, x, y);
      if (y > 320 + Math.random() * 10000) columns[index] = 0;
      else columns[index] = y + 16;
    });
    codeTexture.needsUpdate = true;
  }

  // ==========================================
  // 3. DASHBOARD: 3D LIVE GRAPH ANIMATION
  // ==========================================
  const dashboardGroup = new THREE.Group();
  dashboardGroup.position.set(3.2, -Y_OFFSET * 2, 0);

  const barCount = 7;
  const bars = [];
  for (let i = 0; i < barCount; i++) {
    const barGeo = new THREE.BoxGeometry(0.3, 1, 0.3);
    const barMat = new THREE.MeshStandardMaterial({ 
      color: i % 2 === 0 ? 0x00f2fe : 0x7000ff, 
      roughness: 0.3, 
      metalness: 0.7 
    });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.x = (i - barCount / 2) * 0.55;
    dashboardGroup.add(bar);
    bars.push(bar);
  }
  scene.add(dashboardGroup);

  // ==========================================
  // 4. STORIES: VECTOR LINE NETWORK GRID
  // ==========================================
  const storiesGroup = new THREE.Group();
  storiesGroup.position.set(3.2, -Y_OFFSET * 3, 0);

  const gridGeo = new THREE.WireframeGeometry(new THREE.PlaneGeometry(5, 4, 12, 10));
  const gridMat = new THREE.LineBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.6 });
  const vectorGrid = new THREE.LineSegments(gridGeo, gridMat);
  storiesGroup.add(vectorGrid);
  scene.add(storiesGroup);

  // ==========================================
  // 5. ABOUT: CYBERNETIC 3D EYE
  // ==========================================
  const aboutGroup = new THREE.Group();
  aboutGroup.position.set(3.2, -Y_OFFSET * 4, 0);

  // Sclera Wireframe Sphere
  const eyeSphereGeo = new THREE.SphereGeometry(1.5, 20, 20);
  const eyeSphereMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true, transparent: true, opacity: 0.4 });
  const eyeSphere = new THREE.Mesh(eyeSphereGeo, eyeSphereMat);
  aboutGroup.add(eyeSphere);

  // Iris & Pupil Concentric Rings
  const irisGeo = new THREE.RingGeometry(0.2, 0.8, 32);
  const irisMat = new THREE.MeshBasicMaterial({ color: 0x7000ff, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
  const iris = new THREE.Mesh(irisGeo, irisMat);
  iris.position.z = 1.35;
  aboutGroup.add(iris);

  const pupilGeo = new THREE.CircleGeometry(0.3, 32);
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
  const pupil = new THREE.Mesh(pupilGeo, pupilMat);
  pupil.position.z = 1.38;
  aboutGroup.add(pupil);
  scene.add(aboutGroup);

  // ==========================================
  // 6. CONTACT: 3D CHAT BUBBLE / PHONE ICON
  // ==========================================
  const contactGroup = new THREE.Group();
  contactGroup.position.set(3.2, -Y_OFFSET * 5, 0);

  const bubbleGeo = new THREE.SphereGeometry(1.4, 32, 32);
  bubbleGeo.scale(1.2, 1.0, 0.8);
  const bubbleMat = new THREE.MeshStandardMaterial({ color: 0x00f2fe, roughness: 0.2, metalness: 0.5 });
  const chatBubble = new THREE.Mesh(bubbleGeo, bubbleMat);
  contactGroup.add(chatBubble);

  const tailGeo = new THREE.ConeGeometry(0.5, 0.8, 3);
  const tail = new THREE.Mesh(tailGeo, bubbleMat);
  tail.position.set(-1.0, -1.0, 0);
  tail.rotation.z = Math.PI / 4;
  contactGroup.add(tail);
  scene.add(contactGroup);

  // ==========================================
  // SCROLL & RENDER ANIMATION LOOP
  // ==========================================
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY / window.innerHeight;
  });

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();

  function animate() {
    const elapsed = clock.getElapsedTime();

    // Smoothly update camera scroll position
    camera.position.y = -scrollY * Y_OFFSET;

    // 1. Hero Animations
    topSphere.rotation.y = elapsed * 0.3;
    bottomSphere.rotation.y = -elapsed * 0.3;
    midCylinder.rotation.y = elapsed * 0.15;
    outerRing1.rotation.z = elapsed * 0.2;
    panels.forEach((p) => {
      p.angle += 0.005;
      p.mesh.position.x = Math.cos(p.angle) * 2.6;
      p.mesh.position.z = Math.sin(p.angle) * 2.6;
      p.mesh.rotation.y = -p.angle + Math.PI / 2;
    });

    // 2. Courses Animations
    drawMatrixCode();
    coursesGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.15;

    // 3. Dashboard Animations (Dynamic Bar Heights)
    bars.forEach((bar, index) => {
      const scale = Math.sin(elapsed * 2 + index) * 0.8 + 1.2;
      bar.scale.y = scale;
      bar.position.y = scale / 2 - 0.5;
    });

    // 4. Stories Animations
    vectorGrid.rotation.z = elapsed * 0.1;

    // 5. About Eye Tracking Mouse
    aboutGroup.rotation.y = mouseX * 0.4;
    aboutGroup.rotation.x = -mouseY * 0.3;

    // 6. Contact Icon Floating
    contactGroup.position.y = -Y_OFFSET * 5 + Math.sin(elapsed * 2) * 0.2;
    contactGroup.rotation.y = elapsed * 0.5;

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
