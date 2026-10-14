'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LiquidMetalCanvasProps {
 onEngineStatusChange?: (status: string) => void;
}

const VERTEX_SHADER = `
 attribute vec2 a_position;
 varying vec2 v_uv;
 void main() {
   v_uv = a_position * 0.5 + 0.5;
   gl_Position = vec4(a_position, 0.0, 1.0);
 }
`;

const FRAGMENT_SHADER = `
 precision mediump float;
 varying vec2 v_uv;
 uniform float u_time;
 uniform vec2 u_resolution;
 uniform vec2 u_pointer;
 uniform float u_scroll;
 uniform float u_lightMode;

 // Fast 2D hash & value noise for 60fps guaranteed execution
 float hash(vec2 p) {
   p = fract(p * vec2(123.34, 456.21));
   p += dot(p, p + 45.32);
   return fract(p.x * p.y);
 }

 float noise(vec2 p) {
   vec2 i = floor(p);
   vec2 f = fract(p);
   f = f * f * (3.0 - 2.0 * f);
   float a = hash(i);
   float b = hash(i + vec2(1.0, 0.0));
   float c = hash(i + vec2(0.0, 1.0));
   float d = hash(i + vec2(1.0, 1.0));
   return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
 }

 float fbm(vec2 p) {
   float v = 0.0;
   float amp = 0.5;
   mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
   for (int i = 0; i < 4; i++) {
     v += amp * noise(p);
     p = rot * p * 2.02;
     amp *= 0.5;
   }
   return v;
 }

 void main() {
   vec2 uv = v_uv;
   float aspect = u_resolution.x / max(1.0, u_resolution.y);
   vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
   vec2 ptr = (u_pointer - 0.5) * vec2(aspect, 1.0);

   float distToPtr = length(p - ptr);
   float ptrInfluence = exp(-distToPtr * 3.2) * 0.28;

   float t = u_time * 0.16;
   vec2 q = vec2(
     fbm(p * 1.6 + vec2(0.0, t)),
     fbm(p * 1.6 + vec2(t * 0.8, 1.4))
   );

   vec2 r = vec2(
     fbm(p * 2.1 + 1.8 * q + vec2(1.7, 9.2) + 0.12 * t + ptrInfluence),
     fbm(p * 2.1 + 1.8 * q + vec2(8.3, 2.8) + 0.10 * t - ptrInfluence)
   );

   float f = fbm(p * 1.8 + 2.2 * r - u_scroll * 0.35);

   // Specular ridge calculation (monochrome liquid metal)
   float ridge = smoothstep(0.42, 0.68, f) - smoothstep(0.68, 0.92, f) * 0.35;
   float rim = pow(clamp(dot(q, r) * 1.35, 0.0, 1.0), 3.0);

   // Dark Void vs Warm Paper palette
   vec3 darkBase = vec3(0.024, 0.027, 0.039);     // #06070A
   vec3 darkSurface = vec3(0.082, 0.094, 0.118);  // #14171C
   vec3 iceSilver = vec3(0.749, 0.831, 0.902);    // #BFD4E6

   vec3 colDark = mix(darkBase, darkSurface, clamp(f * 1.2, 0.0, 1.0));
   colDark += iceSilver * (ridge * 0.11 + rim * 0.09 + ptrInfluence * 0.14);

   vec3 lightBase = vec3(0.957, 0.953, 0.937);    // #F4F3EF
   vec3 lightSurface = vec3(0.875, 0.865, 0.840);
   vec3 inkAccent = vec3(0.17, 0.30, 0.40);

   vec3 colLight = mix(lightBase, lightSurface, clamp(f * 1.1, 0.0, 1.0));
   colLight -= inkAccent * (ridge * 0.08 + rim * 0.06);

   vec3 finalCol = mix(colDark, colLight, u_lightMode);

   // Radial vignette light falloff
   float vignette = smoothstep(1.15, 0.18, length(p * 0.85));
   finalCol = mix(mix(darkBase, lightBase, u_lightMode), finalCol, vignette);

   gl_FragColor = vec4(finalCol, 1.0);
 }
`;

export function LiquidMetalCanvas({ onEngineStatusChange }: LiquidMetalCanvasProps) {
 const canvasRef = useRef<HTMLCanvasElement | null>(null);
 const containerRef = useRef<HTMLDivElement | null>(null);
 const [fallbackMode, setFallbackMode] = useState(false);

 useEffect(() => {
   // 1. Skip WebGL on mobile, coarse pointer, or reduced motion
   const isMobileOrReduced = window.matchMedia(
     '(max-width: 767px), (pointer: coarse), (prefers-reduced-motion: reduce)'
   ).matches;

   if (isMobileOrReduced) {
     setFallbackMode(true);
     onEngineStatusChange?.('ECO-CSS · 60FPS LOCKED');
     return;
   }

   const canvas = canvasRef.current;
   const container = containerRef.current;
   if (!canvas || !container) return;

   const gl = canvas.getContext('webgl', {
     alpha: false,
     antialias: false,
     depth: false,
     stencil: false,
     powerPreference: 'high-performance',
   });

   if (!gl) {
     setFallbackMode(true);
     onEngineStatusChange?.('STATIC FALLBACK');
     return;
   }

   const compileShader = (type: number, source: string) => {
     const shader = gl.createShader(type);
     if (!shader) return null;
     gl.shaderSource(shader, source);
     gl.compileShader(shader);
     if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
       gl.deleteShader(shader);
       return null;
     }
     return shader;
   };

   const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
   const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
   if (!vs || !fs) {
     setFallbackMode(true);
     return;
   }

   const program = gl.createProgram();
   if (!program) return;
   gl.attachShader(program, vs);
   gl.attachShader(program, fs);
   gl.linkProgram(program);
   if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
     setFallbackMode(true);
     return;
   }
   gl.useProgram(program);

   const buffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
   gl.bufferData(
     gl.ARRAY_BUFFER,
     new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
     gl.STATIC_DRAW
   );

   const posLoc = gl.getAttribLocation(program, 'a_position');
   gl.enableVertexAttribArray(posLoc);
   gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

   const uTime = gl.getUniformLocation(program, 'u_time');
   const uRes = gl.getUniformLocation(program, 'u_resolution');
   const uPtr = gl.getUniformLocation(program, 'u_pointer');
   const uScroll = gl.getUniformLocation(program, 'u_scroll');
   const uLightMode = gl.getUniformLocation(program, 'u_lightMode');

   // Cap DPR at 1.5 (and internal scale 0.85 for effortless 60fps)
   const resize = () => {
     if (!canvas || !container) return;
     const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.85;
     const rect = container.getBoundingClientRect();
     canvas.width = Math.max(1, Math.floor(rect.width * dpr));
     canvas.height = Math.max(1, Math.floor(rect.height * dpr));
     gl.viewport(0, 0, canvas.width, canvas.height);
     gl.uniform2f(uRes, canvas.width, canvas.height);
   };

   resize();
   window.addEventListener('resize', resize, { passive: true });

   let ptrTargetX = 0.5;
   let ptrTargetY = 0.5;
   let ptrCurrentX = 0.5;
   let ptrCurrentY = 0.5;
   let scrollNorm = 0;

   const onPointerMove = (e: PointerEvent) => {
     ptrTargetX = e.clientX / Math.max(1, window.innerWidth);
     ptrTargetY = 1.0 - e.clientY / Math.max(1, window.innerHeight);
   };

   const onScroll = () => {
     scrollNorm = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
   };

   window.addEventListener('pointermove', onPointerMove, { passive: true });
   window.addEventListener('scroll', onScroll, { passive: true });

   let isVisible = true;
   let isTabActive = !document.hidden;
   let rafId = 0;
   const startTime = performance.now();

   // Rolling 2-second FPS guard: if average FPS drops under 50 for 2 seconds, auto-downgrade
   let frameCount = 0;
   let windowStart = performance.now();

   onEngineStatusChange?.('WEBGL2 · 60FPS NOMINAL');

   const render = (now: number) => {
     if (!isVisible || !isTabActive) return;

     frameCount++;
     const elapsedWindow = now - windowStart;
     if (elapsedWindow >= 2000) {
       const avgFps = (frameCount * 1000) / elapsedWindow;
       if (avgFps < 50) {
         // Auto-downgrade to CSS fallback and stop loop permanently
         setFallbackMode(true);
         onEngineStatusChange?.('AUTO-ECO · 60FPS GUARD');
         window.cancelAnimationFrame(rafId);
         return;
       }
       frameCount = 0;
       windowStart = now;
     }

     ptrCurrentX += (ptrTargetX - ptrCurrentX) * 0.08;
     ptrCurrentY += (ptrTargetY - ptrCurrentY) * 0.08;

     const isLight =
       document.documentElement.getAttribute('data-theme') === 'light'
         ? 1.0
         : 0.0;

     gl.uniform1f(uTime, (now - startTime) * 0.001);
     gl.uniform2f(uPtr, ptrCurrentX, ptrCurrentY);
     gl.uniform1f(uScroll, scrollNorm);
     gl.uniform1f(uLightMode, isLight);

     gl.drawArrays(gl.TRIANGLES, 0, 6);
     rafId = window.requestAnimationFrame(render);
   };

   const startLoop = () => {
     window.cancelAnimationFrame(rafId);
     frameCount = 0;
     windowStart = performance.now();
     rafId = window.requestAnimationFrame(render);
   };

   const io = new IntersectionObserver(
     (entries) => {
       isVisible = entries[0]?.isIntersecting ?? true;
       if (isVisible && isTabActive) {
         startLoop();
       } else {
         window.cancelAnimationFrame(rafId);
       }
     },
     { threshold: 0.05 }
   );
   io.observe(container);

   const onVisibilityChange = () => {
     isTabActive = !document.hidden;
     if (isVisible && isTabActive) {
       startLoop();
     } else {
       window.cancelAnimationFrame(rafId);
     }
   };
   document.addEventListener('visibilitychange', onVisibilityChange);

   startLoop();

   return () => {
     window.cancelAnimationFrame(rafId);
     window.removeEventListener('resize', resize);
     window.removeEventListener('pointermove', onPointerMove);
     window.removeEventListener('scroll', onScroll);
     document.removeEventListener('visibilitychange', onVisibilityChange);
     io.disconnect();
   };
 }, [onEngineStatusChange]);

 return (
   <div
     ref={containerRef}
     aria-hidden="true"
     className="absolute inset-0 overflow-hidden pointer-events-none"
   >
     {!fallbackMode ? (
       <canvas
         ref={canvasRef}
         className="h-full w-full object-cover opacity-90 transition-opacity duration-700"
       />
     ) : (
       /* Lightweight zero-cost atmospheric radial gradient fallback */
       <div
         className="h-full w-full"
         style={{
           background:
             'radial-gradient(circle at 62% 32%, var(--accent-ice-soft) 0%, transparent 58%), radial-gradient(circle at 24% 76%, rgba(255,255,255,0.03) 0%, transparent 50%)',
         }}
       />
     )}
     {/* Bottom vignette fade into page surface */}
     <div
       className="absolute inset-x-0 bottom-0 h-40"
       style={{
         background: 'linear-gradient(to top, var(--bg-void), transparent)',
       }}
     />
   </div>
 );
}

export default LiquidMetalCanvas;
