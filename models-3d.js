/* =========================================================
   CodingWale — models-3d.js (Redesigned Cyber System)
   Hero Model: 3D Developer Monitor System
   ========================================================= */

(function () {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || !window.THREE || !window.WebGLRenderingContext) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmall = window.innerWidth < 720;

  // Extract CSS Tokens
  const css = getComputedStyle(document.documentElement);
  const hex = (name, fallback) => css.getPropertyValue(name).trim() || fallback;
  
  const COLOR = {
    amber: hex('--amber', '#FF8A3D'),
    teal: hex('--teal', '#46D8B8'),
    violet: hex('--violet', '#8C7CFF'),
    dim: '#1E232A',
    dark: '#0A0D12'
  };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  scene.add(new THREE.AmbientLight(0xffffff, 1.2));

  const pointLight1 = new THREE.PointLight(new THREE.Color(COLOR.amber), 3, 20);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(new THREE.Color(COLOR.teal), 3, 20);
  pointLight2.position.set(-5, -5, 3);
  scene.add(pointLight2);

  /* ---------------------------------------------------------
     Layer 1 — Interactive Constellation Field
     --------------------------------------------------------- */

  const NODE_COUNT = isSmall ? 35 : 70;
  const FIELD = { x: 12, y: 7, z: 5 };
  const LINK_DIST = isSmall ? 2.5 : 2.8;

  const nodePositions = [];
  const nodeVelocities = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    nodePositions.push(new THREE.Vector3(
      (Math.random() - 0.5) * FIELD.x * 2,
      (Math.random() - 0.5) * FIELD.y * 2,
      (Math.random() - 0.5) * FIELD.z * 2 - 2
    ));
    nodeVelocities.push(new THREE.Vector3(
      (Math.random() - 0.5) * 0.003,
      (Math.random() - 0.5) * 0.003,
      (Math.random() - 0.5) * 0.0015
    ));
  }

  const pointsGeo = new THREE.BufferGeometry();
  const pointsArr = new Float32Array(NODE_COUNT * 3);
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(pointsArr, 3));
  const pointsMat = new THREE.PointsMaterial({
    color: new THREE.Color(COLOR.teal),
    size: isSmall ? 0.05 : 0.065,
    transparent: true,
    opacity: 0.8
  });
  const points = new THREE.Points(pointsGeo, pointsMat);
  scene.add(points);

  const MAX_LINE_SEGMENTS = NODE_COUNT * 6;
  const lineGeo = new THREE.BufferGeometry();
  const lineArr = new Float32Array(MAX_LINE_SEGMENTS * 2 * 3);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(lineArr, 3));
  lineGeo.setDrawRange(0, 0);
  const lineMat = new THREE.LineBasicMaterial({
    color: new THREE.Color(COLOR.dim),
    transparent: true,
    opacity: 0.35
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  function updateNetwork() {
    for (let i = 0; i < NODE_COUNT; i++) {
      const p = nodePositions[i];
      const v = nodeVelocities[i];
      p.add(v);
      if (Math.abs(p.x) > FIELD.x) v.x *= -1;
      if (Math.abs(p.y) > FIELD.y) v.y *= -1;
      if (Math.abs(p.z + 2) > FIELD.z) v.z *= -1;
      pointsArr[i * 3] = p.x;
      pointsArr[i * 3 + 1] = p.y;
      pointsArr[i * 3 + 2] = p.z;
    }
    pointsGeo.attributes.position.needsUpdate = true;

    let segIdx = 0;
    for (let i = 0; i < NODE_COUNT && segIdx < MAX_LINE_SEGMENTS; i++) {
      for (let j = i + 1; j < NODE_COUNT && segIdx < MAX_LINE_SEGMENTS; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < LINK_DIST) {
          const a = nodePositions[i], b = nodePositions[j];
          const base = segIdx * 6;
          lineArr[base] = a.x; lineArr[base + 1] = a.y; lineArr[base + 2] = a.z;
          lineArr[base + 3] = b.x; lineArr[base + 4] = b.y; lineArr[base + 5] = b.z;
          segIdx++;
        }
      }
    }
    lineGeo.setDrawRange(0, segIdx * 2);
    lineGeo.attributes.position.needsUpdate = true;
  }

  /* ---------------------------------------------------------
     Layer 2 — Section Models
     --------------------------------------------------------- */

  const focal = new THREE.Group();
  focal.position.set(isSmall ? 0 : 2.2, isSmall ? -1.6 : 0, 0);
  scene.add(focal);

  function wireMat(color, opacity = 1) {
    return new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity });
  }

  /* =========================================================
     Dynamic IDE / Cyber Screen Canvas Texture
     ========================================================= */
  let screenCanvas, screenCtx, screenTexture;

  function initScreenCanvas() {
    screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 640;
    screenCtx = screenCanvas.getContext('2d');
    screenTexture = new THREE.CanvasTexture(screenCanvas);
    drawScreenContent(0);
    return screenTexture;
  }

  function drawScreenContent(time) {
    if (!screenCtx) return;
    const ctx = screenCtx;
    const w = 1024, h = 640;

    // Background Dark IDE
    ctx.fillStyle = '#0B0F17';
    ctx.fillRect(0, 0, w, h);

    // Top Window Controls Bar
    ctx.fillStyle = '#161C26';
    ctx.fillRect(0, 0, w, 42);
    const dots = ['#FF5F56', '#FFBD2E', '#27C93F'];
    dots.forEach((color, idx) => {
      ctx.beginPath();
      ctx.arc(24 + idx * 22, 21, 6, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    // Editor Tab
    ctx.fillStyle = '#0B0F17';
    ctx.fillRect(100, 8, 180, 34);
    ctx.fillStyle = COLOR.teal;
    ctx.font = '600 15px "Fira Code", monospace';
    ctx.fillText('CodingWale.js', 125, 30);

    // Sidebar line
    ctx.strokeStyle = '#1E2638';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 42); ctx.lineTo(50, h);
    ctx.stroke();

    // Line numbers
    ctx.fillStyle = '#3A4863';
    ctx.font = '14px "Fira Code", monospace';
    for (let i = 1; i <= 14; i++) {
      ctx.fillText(i < 10 ? ' ' + i : '' + i, 16, 60 + i * 32);
    }

    // Code Lines
    const lines = [
      { text: "import { Platform } from '@codingwale/core';", col: COLOR.violet },
      { text: "", col: "#fff" },
      { text: "// Initialize Cybernetic Dev System", col: "#4A5B78" },
      { text: "const app = new Platform({", col: COLOR.amber },
      { text: "  learningMode: 'interactive',", col: '#E0E6ED' },
      { text: "  mentorSupport: true,", col: '#E0E6ED' },
      { text: "  realWorldProjects: 100+", col: COLOR.teal },
      { text: "});", col: COLOR.amber },
      { text: "", col: "#fff" },
      { text: "await app.launchCareer();", col: COLOR.teal }
    ];

    lines.forEach((line, idx) => {
      ctx.fillStyle = line.col;
      ctx.font = '600 20px "Fira Code", monospace';
      ctx.fillText(line.text, 80, 95 + idx * 32);
    });

    // Blinking Cursor
    if (Math.sin(time * 6) > 0) {
      ctx.fillStyle = COLOR.teal;
      ctx.fillRect(365, 365, 12, 22);
    }

    // Floating CW Logo Watermark (Right side of screen)
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = COLOR.amber;
    ctx.font = '900 180px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CW', 780, 380);
    ctx.restore();

    // Bottom Terminal Bar
    ctx.fillStyle = '#121722';
    ctx.fillRect(50, h - 110, w - 50, 110);
    ctx.strokeStyle = COLOR.teal;
    ctx.strokeRect(50, h - 110, w - 50, 1);

    ctx.fillStyle = COLOR.teal;
    ctx.font = '16px "Fira Code", monospace';
    ctx.fillText('> TERMINAL: Status Ready | System Online', 75, h - 70);
    ctx.fillStyle = COLOR.amber;
    ctx.fillText('> codingwale --build successful [200 OK]', 75, h - 35);

    if (screenTexture) screenTexture.needsUpdate = true;
  }

  /* ---------------------------------------------------------
     1. HERO MODEL — 3D Cyber Monitor
     --------------------------------------------------------- */
  const heroModel = new THREE.Group();

  // Monitor Display Frame
  const frameGeo = new THREE.BoxGeometry(3.6, 2.3, 0.12);
  const frameMat = new THREE.MeshBasicMaterial({ color: '#161B22' });
  const monitorFrame = new THREE.Mesh(frameGeo, frameMat);

  // Outer Neon Bezel Border
  const bezelGeo = new THREE.BoxGeometry(3.68, 2.38, 0.08);
  const bezelMat = wireMat(COLOR.teal, 0.8);
  const bezel = new THREE.Mesh(bezelGeo, bezelMat);

  // Monitor Screen (Canvas Texture Surface)
  const screenGeo = new THREE.PlaneGeometry(3.4, 2.1);
  const screenMat = new THREE.MeshBasicMaterial({
    map: initScreenCanvas(),
    side: THREE.DoubleSide
  });
  const monitorScreen = new THREE.Mesh(screenGeo, screenMat);
  monitorScreen.position.z = 0.07;

  // Stand Neck
  const neckGeo = new THREE.CylinderGeometry(0.08, 0.12, 1.1, 16);
  const neckMat = new THREE.MeshBasicMaterial({ color: '#21262D' });
  const neck = new THREE.Mesh(neckGeo, neckMat);
  neck.position.set(0, -1.3, -0.2);
  neck.rotation.x = 0.15;

  // Stand Base
  const baseGeo = new THREE.CylinderGeometry(0.9, 1.1, 0.06, 6);
  const baseMat = wireMat(COLOR.amber, 0.9);
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.set(0, -1.8, -0.1);

  // Glowing Backdrop Ambient Ring behind Monitor
  const haloGeo = new THREE.TorusGeometry(1.9, 0.02, 16, 100);
  const haloMat = wireMat(COLOR.amber, 0.6);
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.position.z = -0.3;

  // Floating Cyber Code Brackets floating in front
  const bracketGroup = new THREE.Group();
  const bLeft = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.03, 8, 24, Math.PI), wireMat(COLOR.teal, 0.9));
  bLeft.position.set(-2.2, 0, 0.5);
  bLeft.rotation.z = Math.PI / 2;

  const bRight = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.03, 8, 24, Math.PI), wireMat(COLOR.amber, 0.9));
  bRight.position.set(2.2, 0, 0.5);
  bRight.rotation.z = -Math.PI / 2;

  bracketGroup.add(bLeft, bRight);

  heroModel.add(monitorFrame, bezel, monitorScreen, neck, base, halo, bracketGroup);

  /* ---------------------------------------------------------
     2. COURSES — Stacked Server Blocks
     --------------------------------------------------------- */
  const coursesModel = new THREE.Group();
  const moduleColors = [COLOR.amber, COLOR.teal, COLOR.violet, COLOR.teal, COLOR.amber];
  for (let i = 0; i < 5; i++) {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.38, 1.6),
      wireMat(moduleColors[i], 0.85)
    );
    box.position.y = -1.1 + i * 0.55;
    box.rotation.y = i * 0.25;
    coursesModel.add(box);
  }

  /* ---------------------------------------------------------
     3. DASHBOARD — Telemetry Rings
     --------------------------------------------------------- */
  const dashboardModel = new THREE.Group();
  const ringOuter = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.02, 8, 64), wireMat(COLOR.teal));
  const ringInner = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.015, 8, 48), wireMat(COLOR.amber));
  ringInner.rotation.x = Math.PI / 2.4;
  ringOuter.rotation.x = Math.PI / 2.4;
  const hub = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 0), wireMat(COLOR.violet));
  dashboardModel.add(ringOuter, ringInner, hub);

  /* ---------------------------------------------------------
     4. STORIES — Ribbon Trajectory
     --------------------------------------------------------- */
  const storiesCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.6, -1.4, 0),
    new THREE.Vector3(-0.6, -0.3, 0.6),
    new THREE.Vector3(0.3, 0.6, -0.4),
    new THREE.Vector3(1.2, 1.5, 0.3)
  ]);
  const storiesModel = new THREE.Mesh(
    new THREE.TubeGeometry(storiesCurve, 64, 0.06, 8, false),
    wireMat(COLOR.amber, 0.8)
  );
  [0, 0.33, 0.66, 1].forEach((t) => {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshBasicMaterial({ color: COLOR.teal }));
    dot.position.copy(storiesCurve.getPoint(t));
    storiesModel.add(dot);
  });

  /* ---------------------------------------------------------
     5. ABOUT — Lattice Network
     --------------------------------------------------------- */
  const aboutModel = new THREE.Group();
  const latticeGeo = new THREE.BufferGeometry();
  const latticePts = [];
  for (let i = 0; i < 5; i++) {
    const y = -1.4 + i * 0.7;
    latticePts.push(-1.6, y, 0, 1.6, y, 0);
    if (i < 4) latticePts.push(1.6, y, 0, -1.6, y + 0.7, 0);
  }
  latticeGeo.setAttribute('position', new THREE.Float32BufferAttribute(latticePts, 3));
  aboutModel.add(new THREE.LineSegments(latticeGeo, new THREE.LineBasicMaterial({ color: COLOR.violet, transparent: true, opacity: 0.8 })));

  /* ---------------------------------------------------------
     6. CONTACT — Signal Beacon
     --------------------------------------------------------- */
  const contactModel = new THREE.Group();
  const beaconCore = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), wireMat(COLOR.amber));
  contactModel.add(beaconCore);
  const beaconRings = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.5 + i * 0.5, 0.52 + i * 0.5, 48),
      new THREE.MeshBasicMaterial({ color: COLOR.teal, transparent: true, opacity: 0.5 - i * 0.12, side: THREE.DoubleSide })
    );
    beaconRings.push(ring);
    contactModel.add(ring);
  }

  const scenesByKey = {
    hero: heroModel,
    courses: coursesModel,
    dashboard: dashboardModel,
    stories: storiesModel,
    about: aboutModel,
    contact: contactModel
  };

  Object.values(scenesByKey).forEach((m) => {
    m.scale.setScalar(0.001);
    focal.add(m);
  });

  let activeKey = 'hero';
  heroModel.scale.setScalar(1);

  function setActiveSection(key) {
    if (!scenesByKey[key] || key === activeKey) return;
    activeKey = key;
  }

  // Section Tracking via IntersectionObserver
  const sectionEls = Array.from(document.querySelectorAll('.scroll-section[id]'));
  if ('IntersectionObserver' in window && sectionEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { threshold: 0.4 });
    sectionEls.forEach((el) => io.observe(el));
  }

  // Parallax Tilt Lerp
  let targetRotX = 0, targetRotY = 0;
  if (!isSmall) {
    window.addEventListener('pointermove', (e) => {
      targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.35;
      targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.25;
    }, { passive: true });
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    focal.position.set(window.innerWidth < 720 ? 0 : 2.2, window.innerWidth < 720 ? -1.6 : 0, 0);
  });

  /* ---------------------------------------------------------
     Render Loop
     --------------------------------------------------------- */

  let frame = 0;
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    frame++;
    const t = clock.getElapsedTime();

    if (frame % 2 === 0) updateNetwork();

    points.rotation.y += 0.0005;
    lines.rotation.y += 0.0005;

    // Crossfade section models
    Object.entries(scenesByKey).forEach(([key, mesh]) => {
      const target = key === activeKey ? 1 : 0;
      const current = mesh.scale.x;
      const next = THREE.MathUtils.lerp(current, Math.max(target, 0.001), 0.06);
      mesh.scale.setScalar(next);
      mesh.visible = next > 0.02;
    });

    // 1. Hero Monitor Animations
    drawScreenContent(t);
    heroModel.position.y = Math.sin(t * 1.5) * 0.08; // Levitation
    halo.rotation.z = t * 0.15;
    bLeft.position.y = Math.sin(t * 2) * 0.05;
    bRight.position.y = -Math.sin(t * 2) * 0.05;

    // Other section model animations
    coursesModel.rotation.y = t * 0.2;
    coursesModel.children.forEach((box, i) => { box.position.y = -1.1 + i * 0.55 + Math.sin(t * 1.5 + i) * 0.03; });

    dashboardModel.rotation.z = t * 0.25;
    dashboardModel.children[0].rotation.z = -t * 0.35;

    storiesModel.rotation.y = t * 0.18;
    aboutModel.rotation.y = Math.sin(t * 0.3) * 0.25;

    contactModel.rotation.z = t * 0.1;
    beaconRings.forEach((ring, i) => {
      const s = 1 + ((t * 0.6 + i * 0.5) % 1.6);
      ring.scale.setScalar(s);
      ring.material.opacity = Math.max(0, 0.5 - i * 0.12 - (s - 1) * 0.25);
    });

    focal.rotation.y += (targetRotY - focal.rotation.y) * 0.05;
    focal.rotation.x += (targetRotX - focal.rotation.x) * 0.05;

    renderer.render(scene, camera);
  }

  if (prefersReducedMotion) {
    renderer.render(scene, camera);
  } else {
    animate();
  }
})();
