import * as THREE from 'three';

export function HighlightMaterial({ mesh, baseColor = new THREE.Color(0xc0a2f5), alpha = 0.4, xMin, xMax, yMin, yMax, softness } = {}) {
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.NormalBlending,
    });

    if (mesh && mesh.isSkinnedMesh) {
        material.skinning = true;
    }

    let boundsMinX = 0.0;
    let boundsMaxX = 1.0;
    let boundsMinY = 0.0;
    let boundsMaxY = 1.0;

    if (mesh && mesh.isMesh && mesh.geometry) {
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
        shader.uniforms.highlightBaseColor = { value: baseColor };
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
            uniform float boundsMinX;
            uniform float boundsMaxX;
            uniform float boundsMinY;
            uniform float boundsMaxY;
            varying float vNormalizedX;
            varying float vNormalizedY;
            ${shader.vertexShader}
            `;

        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            #include <begin_vertex>
            vNormalizedX = (transformed.x - boundsMinX) / max(boundsMaxX - boundsMinX, 0.0001);
            vNormalizedY = (transformed.y - boundsMinY) / max(boundsMaxY - boundsMinY, 0.0001);
            `
        );

        shader.fragmentShader = `
            uniform vec3 highlightBaseColor;
            uniform float alpha;
            uniform float highlightXMin;
            uniform float highlightXMax;
            uniform float highlightYMin;
            uniform float highlightYMax;
            uniform float highlightSoftness;
            varying float vNormalizedX;
            varying float vNormalizedY;
            ${shader.fragmentShader}
            `;

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `
            #include <dithering_fragment>

            float currentSoftnessX = min(highlightSoftness, (highlightXMax - highlightXMin) * 0.5);
            float currentSoftnessY = min(highlightSoftness, (highlightYMax - highlightYMin) * 0.5);
            float tY = smoothstep(highlightYMin, highlightYMin + currentSoftnessY, vNormalizedY);

            tY *= 1.0 - smoothstep(highlightYMax - currentSoftnessY, highlightYMax, vNormalizedY);
            float tX = smoothstep(highlightXMin, highlightXMin + currentSoftnessX, vNormalizedX);
            tX *= 1.0 - smoothstep(highlightXMax - currentSoftnessX, highlightXMax, vNormalizedX);
            float highlightFactor = tX * tY;

            highlightFactor = clamp(highlightFactor, 0.0, 1.0);
            
            gl_FragColor = vec4(highlightBaseColor, alpha * highlightFactor);
            `
        );
    };

    return material;
}