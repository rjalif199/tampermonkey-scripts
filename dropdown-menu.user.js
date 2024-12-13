// ==UserScript==
// @name         Dropdown Menu
// @namespace    jobayer
// @version      1.1
// @description  Combine buttons into a dropdown menu
// @match        *://*/*
// @exclude      //
// @grant        none
// ==/UserScript==

//This code adds a dropdown menu on the websites chosen. It kinda works like a easylink menu. You can modify the contents such that you have all daily used tools in a shortcut way. 



(function() {
    'use strict';

    // Create a dropdown menu
    const dropdown = document.createElement('select');
    dropdown.style.position = 'absolute';
    dropdown.style.top = '67%';
    dropdown.style.right = '38%';
    dropdown.style.zIndex = '1000';
    dropdown.style.backgroundColor = '#21618c';
    dropdown.style.padding = '5px';
    dropdown.style.border = 'none';
    dropdown.style.borderRadius = '3px';
    dropdown.style.fontSize = '14px';
    dropdown.style.color = '#fff';
    dropdown.style.fontFamily = 'BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Fira Sans, Droid Sans, Helvetica Neue, sans-serif';
    dropdown.style.fontWeight = 'bold';
    dropdown.style.textAlign = 'center';

    // Define options for the dropdown. Add more value-text pair to have more buttons and functionality.
    const options = [
        { value: '', text: 'Tools Menu' },
        { value: 'tool1', text: 'Tool 1' },
        { value: 'tool2', text: 'Tool 2' },
        { value: 'tool3', text: 'Tool 3' },
        { value: 'tool4', text: 'Tool 4' },
        { value: 'update', text: 'Check for Updates' }
    ];

    // Populate the dropdown. Add thes buttons to the dropdown menu
  
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.text;
        dropdown.appendChild(opt);
    });

    document.body.appendChild(dropdown);

    // Action on item selection. These are the actions related to the buttons in the dropdown. edit however you want use them.
  
    dropdown.addEventListener('change', function() {
        const value = this.value;
        switch (value) {
            case 'tool1':
                openNewTab(generateUrl('Tool 1 URL')); // Replace with the desired URL
                break;
            case 'tool2':
                openNewTab(generateUrl('Tool 2 URL')); // Replace with the desired URL
                break;
            case 'tool3':
                showModalWithInnerHTML(generateInnerHTMLContent()); // Once clicked it will open and the innerHTMLcontent in current page as a Pop-UP.
                break;
            case 'tool4':
                alert('Tool 4 action executed.'); // Shows a pop-up alert on the current window
                break;
            case 'update':
                openNewTab('https://example.com/updates'); // Replace with the update URL
                break;
            default:
                break;
        }
        this.value = '';
    });

    // Generate URL Functionality. Customize this function to collect some data from the current website and create an URL (provided the URL you are generating for the sever, has GET functionality)
    function generateUrl(base) {
        const param = getElementText('customFieldId'); // Replace with your element ID
        return `${base}?param=${encodeURIComponent(param)}`;
    }

    // Open URL in a new tab
    function openNewTab(url) {
        window.open(url, '_blank');
    }

    // Get text content of an element
    function getElementText(id) {
        const element = document.getElementById(id);
        return element ? element.textContent.trim() : '';
    }

    // Example Modal with InnerHTML
    function showModalWithInnerHTML(innerHTMLContent) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1001';

        const content = document.createElement('div');
        content.style.backgroundColor = '#fff';
        content.style.padding = '20px';
        content.style.borderRadius = '5px';
        content.style.width = '400px';
        content.style.textAlign = 'center';
        content.innerHTML = innerHTMLContent;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginTop = '10px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        content.appendChild(closeButton);
        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    // Generate InnerHTML Content for the the MODAL to show as Pop-up window in current site
    function generateInnerHTMLContent() {
        return `
            <h2>Tool 3 Example Modal</h2>
            <p>This modal demonstrates how to use innerHTML for dynamic content. You can include any valid HTML elements here, such as:</p>
            <ul>
                <li>Lists</li>
                <li>Images</li>
                <li>Links</li>
            </ul>
            <p><a href="https://example.com" target="_blank">Visit Example</a> for more details.</p>
        `;
    }
})();
