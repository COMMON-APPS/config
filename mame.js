javascript:(function() {
    // Replace specific text content
    const replaceText = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.match(/duckduckgo|Duck\.ai|Quack/gi)) {
                node.textContent = node.textContent
                    .replace(/duckduckgo/gi, 'mame')
                    .replace(/Duck\.ai/gi, 'MaMe.ai')
                    .replace(/Quack/gi, 'Yes');
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const child of node.childNodes) {
                replaceText(child);
            }
        }
    };

    // Replace document title
    const replaceTitle = () => {
        if (document.title.match(/duckduckgo|Duck\.ai/gi)) {
            document.title = document.title
                .replace(/duckduckgo/gi, 'mame')
                .replace(/Duck\.ai/gi, 'MaMe.ai')
                .replace(/Quack/gi, 'Yes');
        }
    };

    // Remove known elements
    const removeElements = () => {
        // 1. Side menu button
        const sideMenuButton = document.getElementById('aichat-side-menu-button');
        if (sideMenuButton) sideMenuButton.remove();

        // 2. Help Pages + Privacy block
        const helpLinks = document.querySelectorAll('a[href*="duckduckgo.com/duckduckgo-help-pages/duckai"]');
        for (const helpLink of helpLinks) {
            const parent = helpLink.closest('div');
            if (!parent) continue;
            const privacyLink = parent.querySelector('a[href*="duckduckgo.com/duckai/privacy-terms"]');
            if (privacyLink) {
                parent.remove();
            }
        }

        // 3. Standalone "See Terms and Privacy Policy" block
        const standalonePrivacyLinks = document.querySelectorAll('a[href*="duckduckgo.com/duckai/privacy-terms"]');
        for (const link of standalonePrivacyLinks) {
            const parent = link.closest('div');
            if (parent && link.textContent.includes("See Terms and Privacy Policy")) {
                parent.remove();
            }
        }

        // 4. "Help Us Improve" Survey block
        const surveyParagraphs = Array.from(document.querySelectorAll('p')).filter(p =>
            p.textContent.includes("Help Us Improve") ||
            p.textContent.includes("Take this anonymous survey")
        );
        for (const p of surveyParagraphs) {
            const block = p.closest('div');
            if (block) block.remove();
        }
        
        // 5. "Try the app" banner (Targeted via href)
        try {
            const appLink = document.querySelector('a[href*="com.duckduckgo.mobile.android"]');
            if (appLink) {
                const banner = appLink.closest('div');
                if (banner) {
                    banner.remove();
                } else {
                    appLink.parentElement.remove();
                }
            }
        } catch (e) {
            // Fail silently
        }
    };

    // Replace specific images
    const replaceImages = () => {
        try {
            // Find all images that are base64 SVGs inside an <i> tag.
            // This is more robust for catching dynamically added icons.
            const iconImages = document.querySelectorAll('i > img[src^="data:image/svg+xml;base64,"]');
            
            if (iconImages.length > 0) {
                const targetBase64 = "PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgOTYgOTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CsKgIDxwYXRoIGZpbGw9IiMzOTlGMjkiIGQ9Ik03My4zMjcgNTFjMS41NiAwIDMuMDA3LS44OTcgMy41MDItMi4zNzZBMjIuNTY2IDIyLjU2NiAwIDAgMCA3OCA0MS40NDRDNzggMjcuMzkyIDY1LjAxNiAxNiA0OSAxNmgtNHYuMjRjLTE0LjEyMyAxLjcxLTI1IDEyLjM0Mi0yNSAyNS4yMDQgMCA4LjMzIDQuNTYzIDE1LjcyNiAxMS42MTcgMjAuMzY4Ljg0NS41NTYgMS4xNCAxLjY3Mi42MTUgMi41MzNMMjguMTY5IDcxSDI1LjV2M2g0Yy4xMzEtLjAwMi4yNjYtLjAxOC40MDQtLjA1IDQuNi0xLjA3IDEyLjM0Mi0yLjk1MyAxOS40MzItNS4wNTcgMS4xMjMtLjMzNCAxLjkyLTEuMzA2IDIuMTg1LTIuNDQ3QzUzLjU4MiA1Ny41OTQgNjEuNTIgNTEgNzEgNTFoMi4zMjdaIi8+CsKgIDxwYXRoIGZpbGw9IiM2M0M4NTMiIGQ9Ik03MS44ODUgNTFBMjIuNjg0IDIyLjY4NCAwIDAgMCA3NCA0MS40NDRDNzQgMjcuMzkyIDYxLjAxNiAxNiA0NSAxNlMxNiAyNy4zOTIgMTYgNDEuNDQ0YzAgOC4zMyA0LjU2MyAxNS43MjYgMTEuNjE3IDIwLjM2OC44NDUuNTU2IDEuMTQgMS42NzIuNjE1IDIuNTMzbC00LjI0OCA2Ljk1N2MtLjgyNCAxLjM1LjM3IDMuMDA5IDEuOTIgMi42NDggNS44NDMtMS4zNiAxNi43NTgtNC4wMyAyNC45NjQtNi44MDIuMzM1LS4xMTMuNTgxLS4zOTcuNjYyLS43NDJDNTMuNjA2IDU3LjU3NSA2MS41MzUgNTEgNzEgNTFoLjg4NVoiLz4KwqAgPHBhdGggZmlsbD0iI0NDQyIgZD0iTTkyLjUwMSA1OWMuMjk4IDAgLjU5NS4xMi44MjMuMzU0LjQ1NC40NjguNDU0IDEuMjMgMCAxLjY5OGwtMi4zMzMgMi40YTEuMTQ1IDEuMTQ1IDAgMCAxLTEuNjUgMCAxLjIyNyAxLjIyNyAwIDAgMSAwLTEuNjk4bDIuMzMzLTIuNGMuMjI3LS4yMzQuNTI0LS4zNTQuODIyLS4zNTRoLjAwNVptLTEuMTY2IDEwLjc5OGgzLjQ5OWMuNjQxIDAgMS4xNjYuNTQgMS4xNjYgMS4yIDAgLjY2LS41MjUgMS4yLTEuMTY2IDEuMmgtMy40OTljLS42NDEgMC0xLjE2Ni0uNTQtMS4xNjYtMS4yIDAtLjY2LjUyNS0xLjIgMS4xNjYtMS4yWm0tMS45ODIgOC43NTRjLjIyNy0uMjM0LjUyNS0uMzU0LjgyMi0uMzU0aC4wMDZjLjI5NyAwIC41OTUuMTIuODIyLjM1NGwyLjMzMiAyLjRjLjQ1NS40NjcuNDU1IDEuMjMgMCAxLjY5N2ExLjE0NSAxLjE0NSAwIDAgMS0xLjY1IDBsLTIuMzMyLTIuNGExLjIyNyAxLjIyNyAwIDAgMSAwLTEuNjk3WiIvPgrCoCA8cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJubGU9ImV2ZW5vZGQiIGQ9Ik0zMSA0NmE1IDUgMCAxIDAgMC0xMCA1IDUgMCAwIDAgMCAxMFptMTktNWE1IDUgMCAxIDEtMTAgMCA1IDUgMCAwIDEgMTAgMFptMTQgMGE1IDUgMCAxIDEtMTAgMCA1IDUgMCAwIDEgMTAgMFoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgo8L3N2Zz4=";
                const newSrc = `data:image/svg+xml;base64,${'$'}{targetBase64}`;
                
                for (const img of iconImages) {
                    if (img.src !== newSrc) {
                        img.src = newSrc;
                    }
                }
            }
        } catch(e) {
            // Fail silently
        }
    };

    // Initial run
    replaceText(document.body);
    replaceTitle();
    removeElements();
    replaceImages();

    // Observe DOM changes to catch elements that load later
    const observer = new MutationObserver(() => {
        replaceTitle();
        removeElements();
        replaceImages();
        replaceText(document.body);
    });

    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();
