// ==UserScript==
// @name         Salah Time Notifier
// @namespace    jobayer_with_chatgpt
// @version      2.1
// @description  Automatically notify and display next Salah time
// @match        *://*/*
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      api.aladhan.com
// ==/UserScript==

(function () {
    'use strict';

    // Check if the current window is a popup or modal
    if (window.top !== window.self) {
        return; // Exit if in a popup
    }

    const latitude = 23.8041; // Dhaka,BD
    const longitude = 90.4152; // Dhaka,BD
    const method = 2; // Calculation method

    let salahTimings = []; // Store Salah timings

    // Create display for next Salah time
    const salahDisplay = document.createElement('div');
    salahDisplay.style.position = 'fixed';
    salahDisplay.style.bottom = '10px';
    salahDisplay.style.left = '10px';
    salahDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    salahDisplay.style.color = 'white';
    salahDisplay.style.padding = '10px';
    salahDisplay.style.borderRadius = '5px';
    salahDisplay.style.zIndex = '9999';
    salahDisplay.style.fontSize = '14px';
    salahDisplay.style.fontFamily = 'Arial, sans-serif';
    salahDisplay.textContent = 'Fetching next Salah time...';
    document.body.appendChild(salahDisplay);

    // Fetch Salah timings
    function fetchPrayerTimes() {
        const today = new Date();
        const url = `https://api.aladhan.com/v1/timings/${Math.floor(today.getTime() / 1000)}?latitude=${latitude}&longitude=${longitude}&method=${method}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    salahTimings = Object.entries(data.data.timings).map(([salah, time]) => ({ salah, time }));
                    updateNextSalah();
                } else {
                    console.error('Failed to fetch prayer times:', response.statusText);
                }
            },
        });
    }

    // Update next Salah display and set notification
    function updateNextSalah() {
        const now = new Date();
        let nextSalah = null;
        let nextSalahName = '';
        let nextSalahTime = '';

        salahTimings.forEach(({ salah, time }) => {
            const [hours, minutes] = time.split(':').map(Number);
            const salahTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

            if (salahTime > now && (!nextSalah || salahTime < nextSalah)) {
                nextSalah = salahTime;
                nextSalahName = salah;
                nextSalahTime = time;
            }
        });

        if (nextSalah) {
            salahDisplay.textContent = `Next Salah: ${nextSalahName} at ${nextSalahTime}`;
            const notificationTime = new Date(nextSalah.getTime() - 10 * 60 * 1000); // 10 minutes before Salah

            const delay = notificationTime - now;
            if (delay > 0) {
                setTimeout(() => flashNotification(nextSalahName, nextSalahTime), delay);
            } else {
                flashNotification(nextSalahName, nextSalahTime);
            }
        } else {
            salahDisplay.textContent = 'No more Salah times for today.';
        }
    }

    // Flash notification
    function flashNotification(salah, time) {
        const flashBox = document.createElement('div');
        flashBox.style.position = 'fixed';
        flashBox.style.bottom = '10px';
        flashBox.style.left = '10px';
        flashBox.style.backgroundColor = 'red';
        flashBox.style.color = 'white';
        flashBox.style.padding = '20px';
        flashBox.style.borderRadius = '5px';
        flashBox.style.zIndex = '10000';
        flashBox.style.fontSize = '16px';
        flashBox.style.textAlign = 'center';
        flashBox.textContent = `It's almost time for ${salah} (${time})!`;

        const dismissButton = document.createElement('button');
        dismissButton.textContent = 'Dismiss';
        dismissButton.style.marginTop = '10px';
        dismissButton.style.padding = '5px 10px';
        dismissButton.style.fontSize = '14px';
        dismissButton.style.cursor = 'pointer';
        dismissButton.onclick = () => flashBox.remove();

        flashBox.appendChild(dismissButton);
        document.body.appendChild(flashBox);

        const reminderInterval = setInterval(() => {
            flashBox.style.visibility = flashBox.style.visibility === 'hidden' ? 'visible' : 'hidden';
        }, 500);

        dismissButton.onclick = () => {
            clearInterval(reminderInterval);
            flashBox.remove();
        };
    }

    fetchPrayerTimes();
})();
