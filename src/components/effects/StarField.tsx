import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  baseSize: number;
  baseBrightness: number;
  speed: number;
  layer: "far" | "mid" | "near";
  twinkle: boolean;
  twinklePhase: number;
  twinkleSpeed: number;
}

interface PointerOffset {
  x: number;
  y: number;
}

const minDepth = 96;
const maxDepth = 1120;
const focalLength = 460;

function clamp(min: number, value: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function getLayer(z: number): Star["layer"] {
  if (z > 760) {
    return "far";
  }

  if (z > 360) {
    return "mid";
  }

  return "near";
}

function getStarCount(width: number, height: number, isMobile: boolean) {
  const density = width * height;
  const count = Math.round(density / (isMobile ? 13000 : 11200));

  return clamp(isMobile ? 42 : 92, count, isMobile ? 78 : 154);
}

function createStar(width: number, height: number, z = randomBetween(minDepth, maxDepth)): Star {
  const layer = getLayer(z);
  const spreadX = width * 1.05;
  const spreadY = height * 1.02;
  const baseSize = layer === "far" ? randomBetween(0.48, 0.86) : layer === "mid" ? randomBetween(0.78, 1.24) : randomBetween(1.08, 1.72);
  const speed = layer === "far" ? randomBetween(0.055, 0.13) : layer === "mid" ? randomBetween(0.14, 0.26) : randomBetween(0.24, 0.44);

  return {
    x: randomBetween(-spreadX, spreadX),
    y: randomBetween(-spreadY, spreadY),
    z,
    baseSize,
    baseBrightness: layer === "far" ? randomBetween(0.18, 0.38) : layer === "mid" ? randomBetween(0.3, 0.58) : randomBetween(0.42, 0.7),
    speed,
    layer,
    twinkle: Math.random() < 0.08,
    twinklePhase: randomBetween(0, Math.PI * 2),
    twinkleSpeed: randomBetween(0.00028, 0.00046)
  };
}

function resetStar(star: Star, width: number, height: number) {
  const next = createStar(width, height, maxDepth);

  star.x = next.x;
  star.y = next.y;
  star.z = next.z;
  star.baseSize = next.baseSize;
  star.baseBrightness = next.baseBrightness;
  star.speed = next.speed;
  star.layer = next.layer;
  star.twinkle = next.twinkle;
  star.twinklePhase = next.twinklePhase;
  star.twinkleSpeed = next.twinkleSpeed;
}

function drawStarField(
  context: CanvasRenderingContext2D,
  stars: Star[],
  width: number,
  height: number,
  pointer: PointerOffset,
  time: number,
  shouldMove: boolean,
  speedMultiplier = 1
) {
  context.clearRect(0, 0, width, height);

  const centerX = width * 0.5;
  const centerY = height * 0.45;

  for (const star of stars) {
    if (shouldMove) {
      star.z -= star.speed * speedMultiplier;

      if (star.z < minDepth) {
        resetStar(star, width, height);
      }
    }

    const depthProgress = 1 - (star.z - minDepth) / (maxDepth - minDepth);
    const scale = focalLength / star.z;
    const parallaxStrength = star.layer === "far" ? 1.6 : star.layer === "mid" ? 4.4 : 8;
    const screenX = centerX + star.x * scale - pointer.x * parallaxStrength;
    const screenY = centerY + star.y * scale - pointer.y * parallaxStrength;

    if (screenX < -20 || screenX > width + 20 || screenY < -20 || screenY > height + 20) {
      if (shouldMove && star.z < maxDepth * 0.96) {
        resetStar(star, width, height);
      }

      continue;
    }

    const purpleAtmosphere = clamp(0, 1 - screenX / (width * 0.55), 1);
    const readabilityMask = 1 - 0.3 * Math.exp(-(((screenX - centerX) / (width * 0.28)) ** 2 + ((screenY - centerY) / (height * 0.26)) ** 2));
    const twinkle = star.twinkle ? 0.72 + Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.13 : 1;
    const opacity = clamp(0.06, (star.baseBrightness + depthProgress * 0.22) * twinkle * readabilityMask, 0.76);
    const radius = clamp(0.36, star.baseSize * (0.76 + depthProgress * 1.24) * scale * 1.08, 2.85);
    const red = Math.round(228 + purpleAtmosphere * 18);
    const green = Math.round(234 - purpleAtmosphere * 16);
    const blue = 255;

    context.beginPath();
    context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;

    if (star.layer === "near" && radius > 1.8) {
      const elongation = radius * (1 + depthProgress * 0.55);
      context.ellipse(screenX, screenY, elongation, radius * 0.72, Math.atan2(screenY - centerY, screenX - centerX), 0, Math.PI * 2);
    } else {
      context.arc(screenX, screenY, radius, 0, Math.PI * 2);
    }

    context.fill();
  }
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      return undefined;
    }

    const starCanvas = canvas;
    const renderingContext = context;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrame = 0;
    let isInView = true;
    let isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let isMobile = window.matchMedia("(pointer: coarse), (max-width: 640px)").matches;
    let resizeFrame = 0;
    let stars: Star[] = [];
    const targetPointer: PointerOffset = { x: 0, y: 0 };
    const currentPointer: PointerOffset = { x: 0, y: 0 };

    function resize() {
      const bounds = starCanvas.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));
      isMobile = window.matchMedia("(pointer: coarse), (max-width: 640px)").matches;
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 1.7);
      starCanvas.width = Math.round(width * dpr);
      starCanvas.height = Math.round(height * dpr);
      renderingContext.setTransform(dpr, 0, 0, dpr, 0, 0);

      const nextCount = getStarCount(width, height, isMobile);

      if (stars.length === 0) {
        stars = Array.from({ length: nextCount }, () => createStar(width, height));
      } else if (stars.length < nextCount) {
        stars = stars.concat(Array.from({ length: nextCount - stars.length }, () => createStar(width, height)));
      } else if (stars.length > nextCount) {
        stars = stars.slice(0, nextCount);
      }

      drawStarField(renderingContext, stars, width, height, currentPointer, performance.now(), false);
    }

    function requestResize() {
      if (resizeFrame) {
        return;
      }

      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        resize();
      });
    }

    function animate(time: number) {
      if (!document.hidden && isInView && !isReducedMotion) {
        currentPointer.x += (targetPointer.x - currentPointer.x) * 0.045;
        currentPointer.y += (targetPointer.y - currentPointer.y) * 0.045;
        drawStarField(renderingContext, stars, width, height, currentPointer, time, true, isMobile ? 0.72 : 1);
      }

      animationFrame = window.requestAnimationFrame(animate);
    }

    function handlePointerMove(event: PointerEvent) {
      if (isMobile || isReducedMotion) {
        return;
      }

      targetPointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      targetPointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    }

    function handlePointerLeave() {
      targetPointer.x = 0;
      targetPointer.y = 0;
    }

    function handleVisibilityChange() {
      if (!document.hidden && isInView) {
        drawStarField(renderingContext, stars, width, height, currentPointer, performance.now(), false);
      }
    }

    function handleReducedMotionChange(event: MediaQueryListEvent) {
      isReducedMotion = event.matches;
      targetPointer.x = 0;
      targetPointer.y = 0;
      currentPointer.x = 0;
      currentPointer.y = 0;
      drawStarField(renderingContext, stars, width, height, currentPointer, performance.now(), false);
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      isInView = Boolean(entry?.isIntersecting);

      if (isInView) {
        drawStarField(renderingContext, stars, width, height, currentPointer, performance.now(), false);
      }
    });

    observer.observe(starCanvas);
    resize();
    animationFrame = window.requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(starCanvas);
    window.addEventListener("resize", requestResize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionQuery.addEventListener("change", handleReducedMotionChange);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      observer.disconnect();
      window.removeEventListener("resize", requestResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionQuery.removeEventListener("change", handleReducedMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="star-field" aria-hidden="true" />;
}
