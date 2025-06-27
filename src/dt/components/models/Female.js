import * as THREE from 'three';
import { useMemo, useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from "@react-three/drei"
import { GlowMaterial } from '../materials/GlowMaterial';
// import { ColorMaterial } from '../materials/ColorMaterial';
import { HighlightMaterial } from '../materials/HighlightMaterial';
import { useControls, folder, button } from 'leva'

export default function Female({ ref, ...props }) {
	const { nodes } = useGLTF(process.env.PUBLIC_URL + '/assets/models/female Idle 01.glb')
	const glowMat = GlowMaterial({ glowColor: new THREE.Color(0xffffff), c: 0.8, p: 2 });
	//const colorMat = ColorMaterial({ baseColor: new THREE.Color(0xff0000), baseAlpha: 0.12 });

	useControls({
		'Material': folder({
			'반투명': button(() => {
				transparentMat.transparent = true;
				transparentMat.depthWrite = false;
				transparentMat.depthTest = false;
				transparentMat.clearcoat = 0;
				transparentMat.needsUpdate = true;
			}),
			'투명+유리': button(() => {
				transparentMat.transparent = true;
				transparentMat.depthWrite = false;
				transparentMat.depthTest = false;
				transparentMat.clearcoat = 1;
				transparentMat.needsUpdate = true;
			}),
			'불투명+유리': button(() => {
				transparentMat.transparent = false;
				transparentMat.depthWrite = true;
				transparentMat.depthTest = true;
				transparentMat.clearcoat = 1;
				transparentMat.needsUpdate = true;
			}),

		}, { collapsed: false }),
	});


	const highlightMat = HighlightMaterial({
		mesh: nodes.body,
		yMin: 0.5,
		yMax: 1,
		softness: 0.4,
		baseAlpha: 0.9
	});

	const transparentMat = useMemo(() => new THREE.MeshPhysicalMaterial({
		color: new THREE.Color('#bb86a1'),
		iridescence: 1,
		roughness: 1,
		opacity: 0.5,
		clearcoat: 0,
		depthWrite: false,
		depthTest: false,
		transparent: true,
		side: THREE.FrontSide,
	}), []);


	const heartMat = HighlightMaterial({
		mesh: nodes.body,
		baseColor: new THREE.Color(0xff3724),
		xMin: 0.48,
		xMax: 0.69,
		yMin: 0.66,
		yMax: 0.87,
		softness: 0.08,
		baseAlpha: 0.4
	});

	const stomachMat = HighlightMaterial({
		mesh: nodes.body,
		baseColor: new THREE.Color(0xad82ff),
		xMin: 0.25,
		xMax: 0.75,
		yMin: 0.5,
		yMax: 0.73,
		softness: 0.12,
		baseAlpha: 0.7,
	});

	return (
		<group ref={ref} {...props}>
			<mesh geometry={nodes.body.geometry} material={transparentMat} />
			<mesh geometry={nodes.body.geometry} material={glowMat} />
			{/* <mesh geometry={nodes.body.geometry} material={highlightMat} /> */}
			<mesh geometry={nodes.body.geometry} material={heartMat} />
			<mesh geometry={nodes.body.geometry} material={stomachMat} />
		</group>
	);
}