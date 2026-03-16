/* eslint-disable react/no-unknown-property */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='440'><rect width='100%' height='100%' fill='%23242424'/></svg>";

export default function Lanyard({
  imageUrl = '/profile2.png',
  position = [0, 0, 20],
  gravity = [0, -30, 0],
  fov = 20,
  transparent = true,
  onReady,
}) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const resolvedImageUrl = useMemo(
    () => (typeof imageUrl === 'string' && imageUrl.trim().length > 0 ? imageUrl : PLACEHOLDER_IMAGE),
    [imageUrl]
  );

  useTexture.preload(resolvedImageUrl);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '220px',
        overflow: 'visible',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Canvas
        style={{ width: '100%', height: '100%' }}
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1 : 1.15]}
        gl={{ alpha: transparent, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={0.9} />
        <directionalLight intensity={1.1} position={[2, 4, 3]} />
        <Physics gravity={gravity} timeStep="vary">
          <Band isMobile={isMobile} imageUrl={resolvedImageUrl} onReady={onReady} />
        </Physics>
      </Canvas>
    </div>
  );
}

function Band({ maxSpeed = 28, minSpeed = 0, isMobile = false, imageUrl, onReady }) {
  const band = useRef(null);
  const fixed = useRef(null);
  const j1 = useRef(null);
  const j2 = useRef(null);
  const j3 = useRef(null);
  const card = useRef(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const cardTop = new THREE.Vector3();
  const topOffset = new THREE.Vector3(0, 1.12, 0);
  const cardQuat = new THREE.Quaternion();
  const restPos = new THREE.Vector3(0, -3.25, 0);
  const restRot = new THREE.Quaternion();
  const currentPos = new THREE.Vector3();
  const currentRot = new THREE.Quaternion();
  const blendedRot = new THREE.Quaternion();

  const [bandTexture, cardTexture] = useTexture([imageUrl, imageUrl]);

  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const hasNotifiedReady = useRef(false);

  useEffect(() => {
    if (hasNotifiedReady.current) return;
    if (!bandTexture || !cardTexture) return;

    hasNotifiedReady.current = true;
    if (typeof onReady === 'function') {
      onReady();
    }
  }, [bandTexture, cardTexture, onReady]);

  const segmentProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 6,
    linearDamping: 7,
  };

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.1, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
    return undefined;
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }

    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });

      const cardPos = card.current.translation();
      const cardRot = card.current.rotation();
      cardQuat.set(cardRot.x, cardRot.y, cardRot.z, cardRot.w);
      cardTop.copy(topOffset).applyQuaternion(cardQuat).add(cardPos);

      // Keep the strap slightly behind the card surface so it doesn't overlap the face.
      curve.points[0].set(cardTop.x, cardTop.y, cardTop.z - 0.08);
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());

      if (band.current?.geometry) {
        band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      }

      if (!dragged) {
        const settle = 1 - Math.exp(-delta * 1.6);
        currentPos.copy(cardPos);
        currentPos.lerp(restPos, settle);
        card.current.setTranslation({ x: currentPos.x, y: currentPos.y, z: currentPos.z }, true);

        const r = card.current.rotation();
        currentRot.set(r.x, r.y, r.z, r.w);
        blendedRot.copy(currentRot).slerp(restRot, settle * 0.9);
        card.current.setRotation(
          { x: blendedRot.x, y: blendedRot.y, z: blendedRot.z, w: blendedRot.w },
          true
        );
      }

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({
        x: THREE.MathUtils.clamp(ang.x * 0.8, -2.5, 2.5),
        y: THREE.MathUtils.clamp((ang.y - rot.y * 0.14) * 0.8, -2.5, 2.5),
        z: THREE.MathUtils.clamp(ang.z * 0.8, -2.5, 2.5),
      });
    }
  });

  curve.curveType = 'chordal';
  bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping;
  cardTexture.flipY = true;
  cardTexture.needsUpdate = true;

  return (
    <>
      <group position={[0, 5.2, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0, -0.8, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -1.6, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -2.4, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[0, -3.25, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.95, 1.15, 0.04]} />
          <group
            scale={2}
            position={[0, -1.15, -0.02]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh renderOrder={2} position={[0, 0, 0.012]}>
              <planeGeometry args={[1.6, 2.2]} />
              <meshPhysicalMaterial
                map={cardTexture}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.7}
                metalness={0.2}
                side={THREE.FrontSide}
              />
            </mesh>
            <mesh renderOrder={2} position={[0, 0, -0.012]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[1.6, 2.2]} />
              <meshPhysicalMaterial
                map={cardTexture}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.7}
                metalness={0.2}
                side={THREE.FrontSide}
              />
            </mesh>
            <mesh position={[0, 1.25, 0.03]}>
              <boxGeometry args={[0.18, 0.18, 0.08]} />
              <meshStandardMaterial color="#bbbbbb" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        </RigidBody>
      </group>

      <mesh ref={band} renderOrder={1}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest
          resolution={isMobile ? [900, 1600] : [1200, 1000]}
          useMap
          map={bandTexture}
          repeat={[-2, 1]}
          lineWidth={0.75}
        />
      </mesh>
    </>
  );
}

