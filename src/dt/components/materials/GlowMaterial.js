import * as THREE from 'three';

export function GlowMaterial({ glowColor = new THREE.Color(0x00ffff), c = 1.0, p = 2.7 }) {
    const material = new THREE.MeshStandardMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    material.onBeforeCompile = (shader) => {
        shader.uniforms.glowColor = { value: glowColor };
        shader.uniforms.c = { value: c };
        shader.uniforms.p = { value: p };

        shader.vertexShader = `
            varying float intensity;
            uniform float c;
            uniform float p;
        ` + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(
            '#include <fog_vertex>',
            `
            #include <fog_vertex>
            vec3 viewNormal = normalize( normalMatrix * objectNormal );
            float dotView = abs(dot(viewNormal, vec3(0.0, 0.0, 1.0)));
            float clamped = clamp( c - dotView, 0.0, 1.0 );
            intensity = pow( clamped, p );
            `
        );
        
        shader.fragmentShader = `
            varying float intensity;
            uniform vec3 glowColor;
        ` + shader.fragmentShader;

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `
            #include <dithering_fragment>
            gl_FragColor = vec4( glowColor, intensity );
            `
        );
    };

    return material;
}