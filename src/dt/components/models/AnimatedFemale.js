import * as THREE from 'three';
import { useMemo, useEffect } from 'react';
import { useGLTF, useAnimations } from "@react-three/drei"
import { GlowMaterial } from '../materials/GlowMaterial';
// import { ColorMaterial } from '../materials/ColorMaterial';
import { HighlightMaterial } from '../materials/HighlightMaterial';
import { useControls, folder, button } from 'leva'

export default function AnimatedFemale({ ref, ...props }) {
    const { nodes, scene, animations } = useGLTF(process.env.PUBLIC_URL + '/assets/models/female.glb');
    const { actions } = useAnimations(animations, scene);
    const glowMat = GlowMaterial({ glowColor: new THREE.Color(0xffffff), c: 0.8, p: 2 });

    const transparentMat = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#939393'),
        roughness: 1,
        clearcoat: 0,
        opacity: 0.2,
        iridescence: 1,
        flatShading: false,
        wireframe: false,
        depthWrite: true,
        depthTest: true,
        transparent: true,
        side: THREE.FrontSide,
    }), []);

    const heartMat = useMemo(() => new HighlightMaterial({
        mesh: nodes.body,
        baseColor: new THREE.Color('#ff3724'),
        xMin: 0.48,
        xMax: 0.69,
        yMin: 0.66,
        yMax: 0.87,
        softness: 0.08,
        alpha: 0.4,
    }), [nodes.body]);

    const stomachMat = useMemo(() => new HighlightMaterial({
        mesh: nodes.body,
        baseColor: new THREE.Color('#ad82ff'),
        xMin: 0.25,
        xMax: 0.75,
        yMin: 0.5,
        yMax: 0.73,
        softness: 0.12,
        alpha: 0.4,
    }), [nodes.body]);

    const [materialProps, setMaterialProps] = useControls(() => ({
        'Manual Controls': folder({
            color: '#939393',
            roughness: { value: 1, min: 0, max: 1.0 },
            opacity: { value: 0.3, min: 0, max: 1.0 },
            clearcoat: { value: 0, min: 0, max: 1.0 },
            flatShading: false,
            wireframe: false,
        }, { collapsed: false })
    }));

    useControls(() => ({
        'Material': folder({
            '투명': button(() => {
                setMaterialProps({
                    color: '#939393',
                    roughness: 1,
                    clearcoat: 0,
                    opacity: 0.2,
                });
            }),
            '반투명+유리': button(() => {
                setMaterialProps({
                    color: '#939393',
                    roughness: 0,
                    clearcoat: 1,
                    opacity: 0.5,
                });
            }),
            '불투명+유리': button(() => {
                setMaterialProps({
                    color: '#939393',
                    roughness: 0,
                    clearcoat: 1,
                    opacity: 1,
                });
            }),
        }, { collapsed: false }),
    }));

    useEffect(() => {
        if (transparentMat) {

            transparentMat.color.set(materialProps.color);
            transparentMat.roughness = materialProps.roughness;
            transparentMat.opacity = materialProps.opacity;
            transparentMat.clearcoat = materialProps.clearcoat;
            transparentMat.flatShading = materialProps.flatShading;
            transparentMat.wireframe = materialProps.wireframe;

            transparentMat.needsUpdate = true;
        }
    }, [materialProps, transparentMat]);

    useEffect(() => {
        console.log('1');
        actions['idle1']?.reset().setLoop(THREE.LoopRepeat).play();
    }, [actions]);

    useEffect(() => {
        if (!nodes || !nodes.body.parent) return;
        const mesh = nodes.body;
        const boneParent = mesh.parent;

        if (scene.getObjectByName('overlay_0')) return

        mesh.material = transparentMat;
        mesh.renderOrder = 0;

        const overlays = [glowMat, heartMat, stomachMat].map((mat, i) => {
            const overlay = new THREE.SkinnedMesh(mesh.geometry, mat);

            overlay.bind(mesh.skeleton, mesh.bindMatrix.clone());
            overlay.name = `overlay_${i}`;
            overlay.renderOrder = 1;

            return overlay;
        })

        overlays.forEach(overlay => boneParent.add(overlay));
    }, [nodes, scene, glowMat, heartMat, stomachMat, transparentMat])

    return (
        <group {...props} dispose={null}>
            <primitive castShadow receiveShadow object={scene} ref={ref} />
        </group>
    );
}