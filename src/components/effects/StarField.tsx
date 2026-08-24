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

interface PointerState extends PointerOffset {
  active: boolean;
}

interface StarFieldProps {
  className?: string;
  density?: number;
  intensity?: number;
  speed?: number;
  interactive?: boolean;
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

function getStarCount(width: number, height: number, isMobile: boolean, density: number) {
  const viewportArea = width * height;
  const count = Math.round((viewportArea / (isMobile ? 11800 : 9400)) * density);

  return clamp(isMobile ? 48 : 112, count, isMobile ? 92 : 208);
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
  cursor: PointerState,
  time: number,
  shouldMove: boolean,
  speedMultiplier = 1,
  intensity = 1,
  interactive = true
) {
  context.clearRect(0, 0, width, height);

  const centerX = width * 0.5;
  const centerY = height * 0.45;
  const cursorRadius = clamp(110, Math.min(width, height) * 0.18, 180);
  const canUseCursor = interactive && cursor.active;

  if (canUseCursor) {
    const cursorGlow = context.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, cursorRadius * 1.35);

    cursorGlow.addColorStop(0, `rgba(139, 92, 246, ${0.045 * intensity})`);
    cursorGlow.addColorStop(0.42, `rgba(139, 92, 246, ${0.018 * intensity})`);
    cursorGlow.addColorStop(1, "rgba(139, 92, 246, 0)");
    context.fillStyle = cursorGlow;
    context.fillRect(cursor.x - cursorRadius * 1.35, cursor.y - cursorRadius * 1.35, cursorRadius * 2.7, cursorRadius * 2.7);
  }

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
    let screenX = centerX + star.x * scale - pointer.x * parallaxStrength;
    let screenY = centerY + star.y * scale - pointer.y * parallaxStrength;
    let cursorInfluence = 0;

    if (canUseCursor) {
      const dx = screenX - cursor.x;
      const dy = screenY - cursor.y;
      const distance = Math.hypot(dx, dy);

      if (distance < cursorRadius) {
        cursorInfluence = 1 - distance / cursorRadius;

        if (distance > 0.1) {
          const repulsionStrength = star.layer === "far" ? 2.2 : star.layer === "mid" ? 4.8 : 7.2;
          const repulsion = cursorInfluence * cursorInfluence * repulsionStrength;

          screenX += (dx / distance) * repulsion;
          screenY += (dy / distance) * repulsion;
        }
      }
    }

    if (screenX < -20 || screenX > width + 20 || screenY < -20 || screenY > height + 20) {
      if (shouldMove && star.z < maxDepth * 0.96) {
        resetStar(star, width, height);
      }

      continue;
    }

    const purpleAtmosphere = clamp(0, 1 - screenX / (width * 0.55), 1);
    const readabilityMask = 1 - 0.3 * Math.exp(-(((screenX - centerX) / (width * 0.28)) ** 2 + ((screenY - centerY) / (height * 0.26)) ** 2));
    const twinkle = star.twinkle ? 0.72 + Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.13 : 1;
    const cursorBrightness = 1 + cursorInfluence * 0.34;
    const cursorScale = 1 + cursorInfluence * 0.18;
    const opacity = clamp(0.06, (star.baseBrightness + depthProgress * 0.22) * twinkle * readabilityMask * cursorBrightness * intensity, 0.78);
    const radius = clamp(0.36, star.baseSize * (0.76 + depthProgress * 1.24) * scale * 1.08 * cursorScale, 2.95);
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

export default function StarField({
  className = "",
  density = 1,
  intensity = 1,
  speed = 1,
  interactive = true
}: StarFieldProps) {
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
    let canUsePointer = interactive && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let resizeFrame = 0;
    let stars: Star[] = [];
    const targetPointer: PointerOffset = { x: 0, y: 0 };
    const currentPointer: PointerOffset = { x: 0, y: 0 };
    const targetCursor: PointerState = { x: width / 2, y: height / 2, active: false };
    const currentCursor: PointerState = { x: width / 2, y: height / 2, active: false };

    function resize() {
      const bounds = starCanvas.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));
      isMobile = window.matchMedia("(pointer: coarse), (max-width: 640px)").matches;
      canUsePointer = interactive && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 1.7);
      starCanvas.width = Math.round(width * dpr);
      starCanvas.height = Math.round(height * dpr);
      renderingContext.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!targetCursor.active) {
        targetCursor.x = width / 2;
        targetCursor.y = height / 2;
        currentCursor.x = width / 2;
        currentCursor.y = height / 2;
      }

      const nextCount = getStarCount(width, height, isMobile, density);

      if (stars.length === 0) {
        stars = Array.from({ length: nextCount }, () => createStar(width, height));
      } else if (stars.length < nextCount) {
        stars = stars.concat(Array.from({ length: nextCount - stars.length }, () => createStar(width, height)));
      } else if (stars.length > nextCount) {
        stars = stars.slice(0, nextCount);
      }

      drawStarField(renderingContext, stars, width, height, currentPointer, currentCursor, performance.now(), false, 1, intensity, canUsePointer);
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
        currentCursor.x += (targetCursor.x - currentCursor.x) * 0.055;
        currentCursor.y += (targetCursor.y - currentCursor.y) * 0.055;
        currentCursor.active = canUsePointer && targetCursor.active;
        drawStarField(renderingContext, stars, width, height, currentPointer, currentCursor, time, true, (isMobile ? 0.72 : 1) * speed, intensity, canUsePointer);
      }

      animationFrame = window.requestAnimationFrame(animate);
    }

    function handlePointerMove(event: PointerEvent) {
      if (isMobile || isReducedMotion || !canUsePointer) {
        return;
      }

      targetPointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      targetPointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
      targetCursor.x = event.clientX;
      targetCursor.y = event.clientY;
      targetCursor.active = true;
    }

    function handlePointerLeave() {
      targetPointer.x = 0;
      targetPointer.y = 0;
      targetCursor.active = false;
    }

    function handleVisibilityChange() {
      if (!document.hidden && isInView) {
        drawStarField(renderingContext, stars, width, height, currentPointer, currentCursor, performance.now(), false, 1, intensity, canUsePointer);
      }
    }

    function handleReducedMotionChange(event: MediaQueryListEvent) {
      isReducedMotion = event.matches;
      targetPointer.x = 0;
      targetPointer.y = 0;
      currentPointer.x = 0;
      currentPointer.y = 0;
      targetCursor.active = false;
      currentCursor.active = false;
      drawStarField(renderingContext, stars, width, height, currentPointer, currentCursor, performance.now(), false, 1, intensity, canUsePointer);
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      isInView = Boolean(entry?.isIntersecting);

      if (isInView) {
        drawStarField(renderingContext, stars, width, height, currentPointer, currentCursor, performance.now(), false, 1, intensity, canUsePointer);
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
  }, [density, intensity, interactive, speed]);

  return <canvas ref={canvasRef} className={`star-field ${className}`.trim()} aria-hidden="true" />;
}
