import * as THREE from 'three';

export function ColorMaterial({ baseColor = new THREE.Color(0xff0000), baseAlpha = 1.0 }) {
	return new THREE.ShaderMaterial({
		uniforms: {
			baseColor: { value: baseColor },
			baseAlpha: { value: baseAlpha }
		},
		vertexShader: `
			void main() {
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		`,
		fragmentShader: `
			uniform vec3 baseColor;
			uniform float baseAlpha;
			void main() {
				gl_FragColor = vec4(baseColor, baseAlpha);
			}
		`,
		side: THREE.FrontSide,
		transparent: true,
		blending: THREE.NormalBlending,
		depthWrite: false
	});
}
