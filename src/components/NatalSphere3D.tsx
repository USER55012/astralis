import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { NatalChartData, PlanetPosition } from '../types/astrology';
import { ZODIAC_LIST, ZODIAC_SIGNS } from '../data/zodiacData';
import { playCosmicChime } from '../utils/sound';
import { RotateCw, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface NatalSphere3DProps {
  chart: NatalChartData;
}

export const NatalSphere3D: React.FC<NatalSphere3DProps> = ({ chart }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetPosition | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetPosition | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 26, 48);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Delicate Architectural Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf4f4f5, 1.2);
    keyLight.position.set(20, 30, 25);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc5a880, 0.8);
    rimLight.position.set(-20, -15, -20);
    scene.add(rimLight);

    const centerLight = new THREE.PointLight(0xfff7ed, 1.2, 50);
    centerLight.position.set(0, 0, 0);
    scene.add(centerLight);

    // 4. Central Celestial Astrolabe Core (Earth/Observer)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Concentric coordinate rings
    const createWireRing = (radius: number, color: number, opacity: number, dash = false) => {
      const geo = new THREE.RingGeometry(radius - 0.04, radius + 0.04, 96);
      const mat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity,
        wireframe: dash,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = Math.PI / 2;
      return mesh;
    };

    // Center focal point
    const observerGeo = new THREE.SphereGeometry(1.2, 24, 24);
    const observerMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.2,
      metalness: 0.9,
    });
    const observerMesh = new THREE.Mesh(observerGeo, observerMat);
    coreGroup.add(observerMesh);

    // Inner meridian rings
    const meridian1 = createWireRing(4.5, 0x71717a, 0.25);
    coreGroup.add(meridian1);

    const meridian2 = createWireRing(7.5, 0xc5a880, 0.2);
    coreGroup.add(meridian2);

    // 5. Armillary Zodiac Ecliptic Sphere (23.4° tilt)
    const eclipticGroup = new THREE.Group();
    eclipticGroup.rotation.x = THREE.MathUtils.degToRad(23.4);
    scene.add(eclipticGroup);

    const sphereRadius = 18;

    // Main Ecliptic Band
    const eclipticRing = new THREE.Mesh(
      new THREE.RingGeometry(sphereRadius - 0.2, sphereRadius + 0.2, 128),
      new THREE.MeshStandardMaterial({
        color: 0xc5a880,
        metalness: 0.8,
        roughness: 0.3,
        side: THREE.DoubleSide,
      })
    );
    eclipticRing.rotation.x = Math.PI / 2;
    eclipticGroup.add(eclipticRing);

    // Subtle outer halo ring
    const haloRing = createWireRing(sphereRadius + 1.2, 0xffffff, 0.08);
    eclipticGroup.add(haloRing);

    // 12 Constellation Sector Ticks & Roman Glyphs
    ZODIAC_LIST.forEach((signKey, i) => {
      const angle = THREE.MathUtils.degToRad(i * 30);
      const signInfo = ZODIAC_SIGNS[signKey];

      // Coordinate tick
      const tx = Math.cos(angle) * sphereRadius;
      const tz = Math.sin(angle) * sphereRadius;

      const tickGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8);
      const tickMat = new THREE.MeshBasicMaterial({ color: 0xc5a880 });
      const tick = new THREE.Mesh(tickGeo, tickMat);
      tick.position.set(tx, 0, tz);
      eclipticGroup.add(tick);

      // Canvas billboard sprite for sign symbol
      const spriteCanvas = document.createElement('canvas');
      spriteCanvas.width = 128;
      spriteCanvas.height = 128;
      const sCtx = spriteCanvas.getContext('2d');
      if (sCtx) {
        sCtx.fillStyle = 'rgba(0,0,0,0)';
        sCtx.fillRect(0, 0, 128, 128);
        sCtx.fillStyle = '#dfcaa7';
        sCtx.font = 'bold 54px serif';
        sCtx.textAlign = 'center';
        sCtx.textBaseline = 'middle';
        sCtx.fillText(signInfo.symbol, 64, 64);

        const tex = new THREE.CanvasTexture(spriteCanvas);
        const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.85 });
        const sprite = new THREE.Sprite(spriteMat);
        const midAngle = angle + THREE.MathUtils.degToRad(15);
        sprite.position.set(Math.cos(midAngle) * (sphereRadius + 2.4), 0, Math.sin(midAngle) * (sphereRadius + 2.4));
        sprite.scale.set(1.8, 1.8, 1);
        eclipticGroup.add(sprite);
      }
    });

    // 6. Refined Celestial Bodies (Minimalist Obsidian & Brass styling)
    const planetMeshes: { mesh: THREE.Mesh; planet: PlanetPosition }[] = [];

    // Distinct refined planet radii & materials
    const getPlanetMaterial = (planetName: string) => {
      if (planetName === 'Sun') {
        return new THREE.MeshStandardMaterial({
          color: 0xfffbeb,
          emissive: 0xdfcaa7,
          emissiveIntensity: 0.8,
          metalness: 0.2,
          roughness: 0.2,
        });
      }
      if (planetName === 'Moon') {
        return new THREE.MeshStandardMaterial({
          color: 0xe4e4e7,
          emissive: 0xa1a1aa,
          emissiveIntensity: 0.4,
          metalness: 0.3,
          roughness: 0.4,
        });
      }
      if (planetName === 'Ascendant') {
        return new THREE.MeshStandardMaterial({
          color: 0xc5a880,
          emissive: 0x7e6441,
          emissiveIntensity: 0.7,
          metalness: 0.8,
          roughness: 0.2,
        });
      }
      if (planetName === 'Venus') {
        return new THREE.MeshStandardMaterial({
          color: 0xfbcfe8,
          emissive: 0xbe185d,
          emissiveIntensity: 0.3,
          metalness: 0.4,
          roughness: 0.3,
        });
      }
      if (planetName === 'Mars') {
        return new THREE.MeshStandardMaterial({
          color: 0xfca5a5,
          emissive: 0xb91c1c,
          emissiveIntensity: 0.35,
          metalness: 0.3,
          roughness: 0.5,
        });
      }
      return new THREE.MeshStandardMaterial({
        color: 0xd4d4d8,
        emissive: 0x52525b,
        emissiveIntensity: 0.25,
        metalness: 0.5,
        roughness: 0.4,
      });
    };

    chart.planets.forEach((planet) => {
      const angle = THREE.MathUtils.degToRad(planet.degree);
      const px = Math.cos(angle) * sphereRadius;
      const pz = Math.sin(angle) * sphereRadius;

      const group = new THREE.Group();
      group.position.set(px, 0, pz);

      const radius = planet.name === 'Sun' ? 1.1 : planet.name === 'Ascendant' ? 0.7 : 0.85;
      const pGeo = new THREE.SphereGeometry(radius, 24, 24);
      const pMat = getPlanetMaterial(planet.name);
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.userData = { planet };
      group.add(pMesh);

      // Fine orbital hairline pointing to center
      const rayPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(px, 0, pz)];
      const rayGeo = new THREE.BufferGeometry().setFromPoints(rayPoints);
      const rayMat = new THREE.LineBasicMaterial({
        color: 0x71717a,
        transparent: true,
        opacity: 0.15,
      });
      const rayLine = new THREE.Line(rayGeo, rayMat);
      eclipticGroup.add(rayLine);

      // Saturn subtle rings
      if (planet.name === 'Saturn') {
        const satRingGeo = new THREE.RingGeometry(1.2, 1.9, 32);
        const satRingMat = new THREE.MeshBasicMaterial({
          color: 0xd4d4d8,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.4,
        });
        const satRing = new THREE.Mesh(satRingGeo, satRingMat);
        satRing.rotation.x = Math.PI / 2 + 0.35;
        group.add(satRing);
      }

      eclipticGroup.add(group);
      planetMeshes.push({ mesh: pMesh, planet });
    });

    // 7. Aspect Luminous Filaments (Architectural chords)
    chart.aspects.forEach((asp) => {
      const p1 = chart.planets.find((p) => p.name === asp.planet1);
      const p2 = chart.planets.find((p) => p.name === asp.planet2);
      if (!p1 || !p2) return;

      const a1 = THREE.MathUtils.degToRad(p1.degree);
      const a2 = THREE.MathUtils.degToRad(p2.degree);
      const v1 = new THREE.Vector3(Math.cos(a1) * sphereRadius, 0, Math.sin(a1) * sphereRadius);
      const v2 = new THREE.Vector3(Math.cos(a2) * sphereRadius, 0, Math.sin(a2) * sphereRadius);

      const aspGeo = new THREE.BufferGeometry().setFromPoints([v1, v2]);
      const lineColor = asp.nature === 'harmonious' ? 0xd4d4d8 : asp.nature === 'tense' ? 0xa1a1aa : 0xc5a880;
      const aspMat = new THREE.LineBasicMaterial({
        color: lineColor,
        transparent: true,
        opacity: asp.nature === 'harmonious' ? 0.35 : 0.2,
      });
      const aspLine = new THREE.Line(aspGeo, aspMat);
      eclipticGroup.add(aspLine);
    });

    // 8. Distant Precision Star Points (Monochrome)
    const starCount = 500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 180;
      starPositions[i + 1] = (Math.random() - 0.5) * 180;
      starPositions[i + 2] = (Math.random() - 0.5) * 180;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xf4f4f5,
      size: 0.6,
      transparent: true,
      opacity: 0.45,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // 9. Interactive Drag & Raycasting
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = planetMeshes.map((p) => p.mesh);
      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const planetData = hit.userData.planet as PlanetPosition;
        if (planetData) {
          setHoveredPlanet(planetData);
          container.style.cursor = 'pointer';
        }
      } else {
        setHoveredPlanet(null);
        container.style.cursor = isDragging ? 'grabbing' : 'grab';
      }

      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      scene.rotation.y += dx * 0.005;
      scene.rotation.x += dy * 0.005;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const meshes = planetMeshes.map((p) => p.mesh);
      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const planetData = hit.userData.planet as PlanetPosition;
        if (planetData) {
          playCosmicChime(1.1);
          setSelectedPlanet(planetData);
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(22, Math.min(75, camera.position.z + e.deltaY * 0.035));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('click', onClick);
    container.addEventListener('wheel', onWheel, { passive: false });

    // 10. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (autoRotate && !isDragging) {
        scene.rotation.y += 0.0018;
      }

      coreGroup.rotation.y += 0.003;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('click', onClick);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [chart, autoRotate]);

  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.max(22, Math.min(75, cameraRef.current.position.z + delta));
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !sceneRef.current) return;
    cameraRef.current.position.set(0, 26, 48);
    cameraRef.current.lookAt(0, 0, 0);
    sceneRef.current.rotation.set(0, 0, 0);
  };

  const activePlanet = hoveredPlanet || selectedPlanet;

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[560px] rounded-2xl overflow-hidden bg-[#09090c] border border-white/[0.08] select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Instrument Label */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-brass-400 animate-pulse" />
        <span className="text-white tracking-widest uppercase text-[10px]">SPHAERA COELESTIS 3D</span>
        <span className="text-neutral-500 text-[10px]">Ecliptic 23°26′</span>
      </div>

      {/* Control Buttons (Zoom, Rotate, Reset) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-mono backdrop-blur-md border transition-all flex items-center gap-1.5 cursor-pointer ${
            autoRotate
              ? 'bg-white/10 border-white/20 text-white'
              : 'bg-black/60 border-white/10 text-neutral-400'
          }`}
          title="Вращение сферы"
        >
          <RotateCw className="w-3 h-3" />
          <span className="hidden sm:inline">{autoRotate ? 'ROTATION ON' : 'PAUSED'}</span>
        </button>

        <button
          onClick={() => handleZoom(-6)}
          className="w-7 h-7 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer"
          title="Приблизить"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => handleZoom(6)}
          className="w-7 h-7 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer"
          title="Отдалить"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleResetCamera}
          className="w-7 h-7 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer"
          title="Сбросить ориентацию"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-4 left-4 z-20 text-xs font-mono tracking-wider text-neutral-300 bg-black/65 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10 pointer-events-none hidden sm:block">
        DRAG TO ROTATE · SCROLL TO ZOOM · CLICK TO INSPECT
      </div>

      {/* Floating Planet Tooltip */}
      {activePlanet && (
        <div className="absolute bottom-4 right-4 z-20 max-w-[310px] w-full bg-[#0d0d11]/95 backdrop-blur-md border border-brass-400/35 rounded-xl p-4 shadow-2xl text-left pointer-events-none animate-fade-in font-sans">
          <div className="flex items-center justify-between gap-2 mb-2 border-b border-white/[0.08] pb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-lg text-brass-300 font-serif">{activePlanet.symbol}</span>
              <span className="font-serif font-bold text-white text-base tracking-wide">{activePlanet.nameRu}</span>
            </div>
            <span className="text-xs text-neutral-300 font-mono">в {activePlanet.signRu}</span>
          </div>
          <div className="text-xs font-mono text-brass-300/95 mb-1.5">
            {activePlanet.degreeInSign}°{activePlanet.minuteInSign}′ • {activePlanet.house} Дом
          </div>
          <p className="text-sm text-neutral-200 leading-relaxed">{activePlanet.vibe}</p>
        </div>
      )}
    </div>
  );
};
