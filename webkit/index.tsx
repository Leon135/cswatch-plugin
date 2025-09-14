type Millennium = {
	callServerMethod: (methodName: string, kwargs?: any) => Promise<any>;
	findElement: (privateDocument: Document, querySelector: string, timeOut?: number) => Promise<NodeListOf<Element>>;
};

declare const Millennium: Millennium;

export default async function WebkitMain() {
	try {
		if (typeof Millennium === 'undefined') {
			console.error('cswatch: Millennium API not available in webkit context');
			return;
		}

		const styles = `
        .cswatch-btn {
            display: flex;
            width: 100%;
            height: 3rem;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: #FFF;
            font-weight: 800;
            transition: all 0.5s cubic-bezier(.23, 1, .32, 1);
            background-color: #1a1a1a;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            border: none;
            outline: none;
        }

        .cswatch-btn:hover {
            background-color: #2d3748;
            text-decoration: none !important;
        }

        .cswatch-logo {
            height: 20px;
            width: auto;
        }`;

		const styleSheet = document.createElement('style');
		styleSheet.innerText = styles;
		document.head.appendChild(styleSheet);

		const rightCol = await Millennium.findElement(document, '.profile_rightcol');

		if (rightCol.length > 0) {
			const parser = new DOMParser();
			const profileUrl = `${window.location.href}/?xml=1`;

			const profileResponse = await fetch(profileUrl);
			if (!profileResponse.ok) {
				console.error(`cswatch: Failed to fetch profile data: ${profileResponse.status} ${profileResponse.statusText}`);
				return;
			}

			const profileXmlText = await profileResponse.text();
			const profileXmlDoc = parser.parseFromString(profileXmlText, 'application/xml');

			const steamID64 = profileXmlDoc.querySelector('steamID64')?.textContent || '0';

			if (!steamID64 || steamID64 === '0') {
				console.error('cswatch: Could not parse steamID64 from URL.');
				return;
			}

			const statsContainer = document.createElement('div');
			statsContainer.className = 'account-row';

			const button = document.createElement('div');
			button.className = 'cswatch-btn';
			button.textContent = 'CSWAT.CH';
			button.onclick = () => {
				window.open(`https://cswat.ch/stats/${steamID64}`, '_self', 'noopener,noreferrer');
			};

			statsContainer.appendChild(button);
			rightCol[0].insertBefore(statsContainer, rightCol[0].children[1]);
		} else {
			console.error('cswatch: Parent container ".profile_rightcol" not found');
		}
	} catch (error) {
		console.error('cswatch: Error in WebkitMain:', error);
		console.error('cswatch: Stack trace:', error.stack);
	}
}
