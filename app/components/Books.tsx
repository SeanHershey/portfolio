"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";

export default function Books({ heroContent }: {
  heroContent?: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cssRendererRef = useRef<CSS3DRenderer | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const numPositions = 7;
  const anglePerPosition = (Math.PI * 2) / numPositions;
  const startRotation = -Math.PI / 2;
  const stateRef = useRef({
    currentIndex: 0,
    targetRotation: startRotation,
    currentRotation: startRotation,
    isAnimating: false,
  });
  const boxGroupRef = useRef<THREE.Group | null>(null);

  const rotateToBook = useCallback((direction: "left" | "right") => {
    const state = stateRef.current;
    
    if (direction === "right") {
      state.currentIndex = (state.currentIndex + 1) % numPositions;
      state.targetRotation -= anglePerPosition;
    } else {
      state.currentIndex = (state.currentIndex - 1 + numPositions) % numPositions;
      state.targetRotation += anglePerPosition;
    }
  }, [anglePerPosition]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;

    const scene = new THREE.Scene();
    
    scene.fog = new THREE.Fog(0x0a0a0a, 1800, 4500);

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 500, 2650);
    camera.lookAt(0, 500, 0);

    const cssRenderer = new CSS3DRenderer();
    cssRendererRef.current = cssRenderer;
    cssRenderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = '0';
    cssRenderer.domElement.style.left = '0';
    cssRenderer.domElement.style.pointerEvents = 'none';
    cssRenderer.domElement.style.zIndex = '2';
    containerRef.current.appendChild(cssRenderer.domElement);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x0a0a0a, 0);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '1';
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(500, 1000, 500);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0x8fa0fe, 0.3);
    rimLight.position.set(-500, 500, -500);
    scene.add(rimLight);

    const boxes: THREE.Mesh[] = [];
    const boxGroup = new THREE.Group();
    boxGroupRef.current = boxGroup;
    const radius = 1500;
    const boxWidth = 700;
    const boxHeight = 1000;
    const boxDepth = 100;

    const bookData: (null | { color: number; spine: string })[] = [
      null,
      { color: 0x151515, spine: '/books/2001.png' },           // 2001: A Space Odyssey
      { color: 0xFBBA27, spine: '/books/onceandfuture.png' }, // The Once and Future King
      { color: 0x025BAB, spine: '/books/lefthand.png' }, // Left Hand of Darkness
      { color: 0x2C1916, spine: '/books/dune.png' },           // Dune
      { color: 0xB0160D, spine: '/books/stranger.png' }, // Stranger in a Strange Land
      { color: 0x25723F, spine: '/books/neuromancer.png' },    // Neuromancer
    ];

    const textureLoader = new THREE.TextureLoader();

    const createBookTexture = (baseColor: number) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      
      const r = (baseColor >> 16) & 255;
      const g = (baseColor >> 8) & 255;
      const b = baseColor & 255;
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, 0, 512, 512);

      for (let i = 0; i < 15000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 2 + 0.5;
        const brightness = Math.random() * 30 - 15;
        const nr = Math.min(255, Math.max(0, r + brightness));
        const ng = Math.min(255, Math.max(0, g + brightness));
        const nb = Math.min(255, Math.max(0, b + brightness));
        ctx.fillStyle = `rgba(${nr}, ${ng}, ${nb}, ${Math.random() * 0.3 + 0.1})`;
        ctx.fillRect(x, y, size, size);
      }
      
      ctx.strokeStyle = `rgba(0, 0, 0, 0.1)`;
      ctx.lineWidth = 1;
      for (let y = 0; y < 512; y += 8) {
        ctx.beginPath();
        ctx.moveTo(0, y + Math.random() * 2);
        ctx.lineTo(512, y + Math.random() * 2);
        ctx.stroke();
      }
      
      const gradient = ctx.createRadialGradient(256, 256, 100, 256, 256, 350);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    const createBumpMap = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 256, 256);
      
      for (let i = 0; i < 8000; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const brightness = Math.random() * 60 + 98;
        ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
        ctx.fillRect(x, y, Math.random() * 2 + 1, Math.random() * 2 + 1);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    const bumpMap = createBumpMap();

    if (heroRef.current) {
      const heroElement = heroRef.current;
      const cssObject = new CSS3DObject(heroElement);
      
      const heroAngle = 0;
      cssObject.position.x = Math.cos(heroAngle) * radius;
      cssObject.position.z = Math.sin(heroAngle) * radius;
      cssObject.position.y = boxHeight / 2;
      
      cssObject.lookAt(0, boxHeight / 2, 0);
      cssObject.rotateY(Math.PI);
      
      cssObject.scale.set(1.8, 1.8, 1.8);
      
      boxGroup.add(cssObject);
    }

    for (let i = 0; i < numPositions; i++) {
      // Skip hero slot (position 0)
      const book = bookData[i];
      if (book === null) continue;
      
      const angle = (i / numPositions) * Math.PI * 2;
      
      const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
      
      const { color, spine } = book;
      const bookTexture = createBookTexture(color);
      
      const spineTexture = textureLoader.load(spine);
      spineTexture.colorSpace = THREE.SRGBColorSpace;
      spineTexture.repeat.set(0.92, 0.96);
      spineTexture.offset.set(0.04, 0.02);

      const coverMaterial = new THREE.MeshStandardMaterial({
        map: bookTexture,
        bumpMap: bumpMap,
        bumpScale: 2,
        roughness: 0.85,
        metalness: 0.05,
      });
      
      const spineMaterial = new THREE.MeshStandardMaterial({
        map: spineTexture,
        bumpMap: bumpMap,
        bumpScale: 1,
        roughness: 0.7,
        metalness: 0.05,
      });
      
      const materials = [
        spineMaterial,
        spineMaterial,
        coverMaterial,
        coverMaterial,
        coverMaterial,
        coverMaterial,
      ];

      const box = new THREE.Mesh(geometry, materials);
      
      box.position.x = Math.cos(angle) * radius;
      box.position.z = Math.sin(angle) * radius;
      box.position.y = boxHeight / 2;

      box.lookAt(0, boxHeight / 2, 0);

      box.castShadow = true;
      box.receiveShadow = true;
      
      boxes.push(box);
      boxGroup.add(box);
    }

    boxes.forEach((box) => {
      const edges = new THREE.EdgesGeometry(box.geometry);
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x555555,
        transparent: true,
        opacity: 0.5,
      });
      const wireframe = new THREE.LineSegments(edges, lineMaterial);
      box.add(wireframe);
    });

    scene.add(boxGroup);

    let animationId: number;
    const state = stateRef.current;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const diff = state.targetRotation - state.currentRotation;
      if (Math.abs(diff) > 0.001) {
        state.currentRotation += diff * 0.08;
      } else {
        state.currentRotation = state.targetRotation;
      }
      
      boxGroup.rotation.y = state.currentRotation;
      
      const heroInFront = state.currentIndex === 0;
      cssRenderer.domElement.style.zIndex = heroInFront ? '2' : '0';
      
      renderer.render(scene, camera);
      cssRenderer.render(scene, camera);
    };

    animate();

    requestAnimationFrame(() => {
      setIsLoaded(true);
    });

    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      cssRenderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (container) {
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
        if (cssRenderer.domElement.parentNode === container) {
          container.removeChild(cssRenderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div 
      className="relative w-full h-full"
      style={{ background: '#0a0a0a' }}
    >
      <div 
        ref={heroRef}
        className="pointer-events-auto"
        style={{ 
          width: '500px',
          background: 'transparent',
          padding: '20px',
        }}
      >
        {heroContent}
      </div>
      
      <div 
        ref={containerRef} 
        className="w-full h-full transition-opacity duration-700"
        style={{ 
          background: '#0a0a0a',
          opacity: isLoaded ? 1 : 0,
        }}
      />
      
      <button
        onClick={() => rotateToBook("left")}
        className="absolute left-0 top-0 w-1/3 h-full cursor-w-resize opacity-0 hover:opacity-100 transition-opacity pointer-events-auto z-50"
        aria-label="Previous book"
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </button>
      
      <button
        onClick={() => rotateToBook("right")}
        className="absolute right-0 top-0 w-1/3 h-full cursor-e-resize opacity-0 hover:opacity-100 transition-opacity pointer-events-auto z-50"
        aria-label="Next book"
      >
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    </div>
  );
}
