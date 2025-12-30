(function() {
    // Avoid running if the script is already injected
    if (window.hasSacredSilence) return;
    window.hasSacredSilence = true;

    const overlayId = 'sacred-silence-overlay';

    // The style that applied the blur has been removed.

    // 1. Create the overlay with the "intention" button
    const overlay = document.createElement('div');
    overlay.id = overlayId;
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background-color: rgba(0, 0, 0, 0.5); /* This now dims the page instead of blurring */
        z-index: 999999;
        display: flex; justify-content: center; align-items: center;
        font-family: sans-serif;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background-color: white; padding: 2em; border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2); text-align: center;
    `;

    const message = document.createElement('p');
    message.textContent = "This time is for quiet reflection.";
    message.style.margin = "0 0 1em 0";

    const button = document.createElement('button');
    button.textContent = "Begin lightly.";
    button.style.cssText = `
        cursor: pointer; padding: 0.8em 1.2em; border-radius: 4px;
        border: 1px solid #ccc; background-color: #f0f0f0;
    `;

    dialog.appendChild(message);
    dialog.appendChild(button);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // 2. Handle the button click
    button.onclick = () => {
        // Inform the background script the user proceeded
        browser.runtime.sendMessage({ feedback: 'user_proceeded' });
        // Remove just the overlay
        document.body.removeChild(overlay);
        window.hasSacredSilence = false; // Allow re-injection if needed
    };
})();
