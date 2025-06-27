import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Stage({ children, padding = 1.5 }) {
	const groupRef = useRef();
	const { camera } = useThree();
	const applied = useRef(false);

	useEffect(() => {
		if (!groupRef.current || applied.current) return;

		const box = new THREE.Box3().setFromObject(groupRef.current);
		const size = new THREE.Vector3();
		const center = new THREE.Vector3();
		box.getSize(size);
		box.getCenter(center);

		const maxDim = Math.max(size.x, size.y, size.z);
		const fov = THREE.MathUtils.degToRad(camera.fov);
		const dist = (maxDim * padding) / (2 * Math.tan(fov / 2));

		camera.position.set(center.x, center.y, center.z + dist);
		camera.lookAt(center);
		camera.updateProjectionMatrix();

		applied.current = true;
	}, [camera, padding]);

	return <group ref={groupRef}>{children}</group>;
}
