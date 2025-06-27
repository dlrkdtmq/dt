import * as THREE from 'three';

export function GlowHighlightMaterial({
    mesh,
    glowColor = new THREE.Color(0x00ffff),
    highlightColor = new THREE.Color(0xc0a2f5),
    c = 1.0,
    p = 2.7,
    alpha = 0.4,
    xMin,
    xMax,
    yMin,
    yMax,
    softness
} = {}) {
    const material = new THREE.MeshStandardMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: 0xffffff
    });

    if (mesh && mesh.isSkinnedMesh) {
        material.skinning = true;
    }

    let boundsMinX = 0.0, boundsMaxX = 1.0;
    let boundsMinY = 0.0, boundsMaxY = 1.0;

    if (mesh && mesh.geometry) {
        mesh.geometry.computeBoundingBox();
        const bounds = mesh.geometry.boundingBox;
        if (bounds) {
            boundsMinX = bounds.min.x;
            boundsMaxX = bounds.max.x;
            boundsMinY = bounds.min.y;
            boundsMaxY = bounds.max.y;
        }
    }

    material.onBeforeCompile = (shader) => {
        shader.uniforms.glowColor = { value: glowColor };
        shader.uniforms.c = { value: c };
        shader.uniforms.p = { value: p };
        shader.uniforms.highlightBaseColor = { value: highlightColor };
        shader.uniforms.alpha = { value: alpha };
        shader.uniforms.highlightXMin = { value: xMin };
        shader.uniforms.highlightXMax = { value: xMax };
        shader.uniforms.highlightYMin = { value: yMin };
        shader.uniforms.highlightYMax = { value: yMax };
        shader.uniforms.highlightSoftness = { value: softness };
        shader.uniforms.boundsMinX = { value: boundsMinX };
        shader.uniforms.boundsMaxX = { value: boundsMaxX };
        shader.uniforms.boundsMinY = { value: boundsMinY };
        shader.uniforms.boundsMaxY = { value: boundsMaxY };

        shader.vertexShader = `
            varying float intensity;
            uniform float c;
            uniform float p;
            uniform float boundsMinX;
            uniform float boundsMaxX;
            uniform float boundsMinY;
            uniform float boundsMaxY;
            varying float vNormalizedX;
            varying float vNormalizedY;
        ` + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `#include <begin_vertex>
            vec3 viewNormal = normalize( normalMatrix * objectNormal );
            float dotView = abs(dot(viewNormal, vec3(0.0, 0.0, 1.0)));
            float clamped = clamp( c - dotView, 0.0, 1.0 );
            intensity = pow( clamped, p );
            vNormalizedX = (transformed.x - boundsMinX) / max(boundsMaxX - boundsMinX, 0.0001);
            vNormalizedY = (transformed.y - boundsMinY) / max(boundsMaxY - boundsMinY, 0.0001);
            `
        );

        shader.fragmentShader = `
            varying float intensity;
            uniform vec3 glowColor;
            uniform vec3 highlightBaseColor;
            uniform float alpha;
            uniform float highlightXMin;
            uniform float highlightXMax;
            uniform float highlightYMin;
            uniform float highlightYMax;
            uniform float highlightSoftness;
            varying float vNormalizedX;
            varying float vNormalizedY;
        ` + shader.fragmentShader;

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `#include <dithering_fragment>
            float currentSoftnessX = min(highlightSoftness, (highlightXMax - highlightXMin) * 0.5);
            float currentSoftnessY = min(highlightSoftness, (highlightYMax - highlightYMin) * 0.5);
            float tY = smoothstep(highlightYMin, highlightYMin + currentSoftnessY, vNormalizedY);
            tY *= 1.0 - smoothstep(highlightYMax - currentSoftnessY, highlightYMax, vNormalizedY);
            float tX = smoothstep(highlightXMin, highlightXMin + currentSoftnessX, vNormalizedX);
            tX *= 1.0 - smoothstep(highlightXMax - currentSoftnessX, highlightXMax, vNormalizedX);
            float highlightFactor = tX * tY;
            highlightFactor = clamp(highlightFactor, 0.0, 1.0);

            vec3 finalColor = glowColor * intensity + highlightBaseColor * highlightFactor;
            gl_FragColor = vec4(finalColor, alpha * max(intensity, highlightFactor));
            `
        );
    };

    return material;
}
