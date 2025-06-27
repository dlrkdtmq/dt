import React from 'react';
import './TestUI.css';

export default function TestUI() {
	return (
		<div className="test-ui-container">
			<p className="test-ui-title">Results are compared to Withings users like you.</p>
			<div className="test-ui-bar">
				<div className="test-ui-box color-1"></div>
				<div className="test-ui-box color-2"></div>
				<div className="test-ui-box color-3"></div>
				<div className="test-ui-box color-4"></div>
				<div className="test-ui-box color-5"></div>
			</div>
			<div className="test-ui-labels">
				<span>Lowest</span>
				<span>Low</span>
				<span>Middle</span>
				<span>High</span>
				<span>Highest</span>
			</div>
		</div>
	);
}
