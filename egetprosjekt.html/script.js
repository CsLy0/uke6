let healthBarInterval;
let prayerBarInterval;
let prayerPotionUsed = false;
let currentPrayerWidth = 99;
let prayerPotionInUse = false;

function startAutoAttack() {
    if (healthBarInterval) return;
    healthBarInterval = setInterval(decreaseHealth, 1000);
}

function decreaseHealth() {
    var healthBar = document.getElementById("health-bar");
    var healthText = document.getElementById("health-bar-text");
    var currentWidth = parseInt(getComputedStyle(healthBar).width);
    var parentWidth = parseInt(getComputedStyle(healthBar.parentNode).width);
    var newWidth = currentWidth - (parentWidth * 0.1); // decrease health by 10%
    if (newWidth < 0) newWidth = 0;

    healthBar.style.width = newWidth + "px";

    if (newWidth === 0) {
        healthText.textContent = "YOU DIED!";
        healthBar.style.minWidth = "275px";
        healthBar.style.backgroundColor = "red";
        clearInterval(healthBarInterval);
        healthBarInterval = null;
    } else {
        healthText.textContent = Math.round((newWidth / parentWidth) * 100) + "%";
    }

    if ((newWidth / parentWidth) < 0.2) {
        useAnglerfish();
    }
}

function activatePrayer() {
    if (prayerBarInterval) return;

    prayerBarInterval = setInterval(() => {
        if (currentPrayerWidth <= 0) {
            clearInterval(prayerBarInterval);
            prayerBarInterval = null;
             var iconContainer = document.getElementById("icon-container");
                  if (iconContainer) {
                      iconContainer.style.display = 'none';
                  }
                  var prayerText = document.getElementById("prayer-bar-text");
                  prayerText.textContent = "Out Of Prayer";

            return;
        }
        currentPrayerWidth -= 3;
        if (currentPrayerWidth < 0) currentPrayerWidth = 0;
        var prayerBar = document.getElementById("prayer-bar");
        var prayerText = document.getElementById("prayer-bar-text");
        prayerBar.style.width = (currentPrayerWidth / 99) * 100 + "%";
        prayerText.textContent = currentPrayerWidth;

        // Call usePrayerPotion if currentPrayerWidth is under 20%
        if ((currentPrayerWidth / 99) < 0.2 && !prayerPotionUsed) {
            usePrayerPotion();
        }
    }, 1000);
}

function setupInventoryClickHandlers() {
    const inventorySlots = document.querySelectorAll('.inventory-slot');
    inventorySlots.forEach(slot => {
        slot.addEventListener('click', () => {
            const itemType = slot.getAttribute('data-item');
            if (itemType === 'anglerfish') {
                useAnglerfish(slot);
            } else if (itemType === 'prayer-potion') {
                usePrayerPotion(slot);
            }
        });
    });
}

function useAnglerfish(slot) {
    const inventorySlots = document.querySelectorAll('.inventory-slot[data-item="anglerfish"]');
    if (inventorySlots.length === 0) {
        console.log("No more anglerfish left in inventory.");
        return;
    }

    var healthBar = document.getElementById("health-bar");
    var healthText = document.getElementById("health-bar-text");
    var parentWidth = parseInt(getComputedStyle(healthBar.parentNode).width);
    var currentWidth = parseInt(getComputedStyle(healthBar).width);
    var newWidth = currentWidth + (parentWidth * 0.22);
    if (newWidth > parentWidth) newWidth = parentWidth;
    healthBar.style.width = newWidth + "px";
    healthText.textContent = Math.round((newWidth / parentWidth) * 100) + "%";

    if (slot) {
        slot.remove();
    } else {
        inventorySlots[0].remove();
    }
}

function usePrayerPotion(slot) {
    if (prayerPotionInUse) return; // prevent multiple uses in a short time
    const inventorySlots = document.querySelectorAll('.inventory-slot[data-item="prayer-potion"]');
    if (inventorySlots.length === 0) {
        console.log("No more prayer-potions left in inventory.");
        return;
    }

    if (currentPrayerWidth < 20) {
        currentPrayerWidth = Math.min(currentPrayerWidth + 20, 99);

        var prayerBar = document.getElementById("prayer-bar");
        var prayerText = document.getElementById("prayer-bar-text");
        prayerBar.style.width = (currentPrayerWidth / 99) * 100 + "%";
        prayerText.textContent = currentPrayerWidth;

        if (slot) {
            slot.remove();
        } else {
            inventorySlots[0].remove();
        }

        prayerPotionInUse = true;
        setTimeout(() => {
            prayerPotionInUse = false;
        }, 1000);
    }

    // Start prayer bar draining if prayer bar is filled
    if (currentPrayerWidth === 99) {
        activatePrayer();
    }
}

function initializePrayerBar() {
    var prayerBar = document.getElementById("prayer-bar");
    var prayerText = document.getElementById("prayer-bar-text");
    prayerBar.style.width = "100%";
    prayerText.textContent = 99;
}

document.addEventListener("DOMContentLoaded", () => {
    replaceNumbersWithText();
    setupInventoryClickHandlers();
    initializePrayerBar();
});

function replaceNumbersWithText() {
    const textMapping = {
        1: "Helm",
        2: "Cape",
        3: "Amulet",
        4: "Arrows",
        5: "Weapon",
        6: "Body",
        7: "Shield",
        8: "Legs",
        9: "Gloves",
        10: "Boots",
        11: "Ring",
    };

    const slots = document.querySelectorAll(".grid-container .slot");

    slots.forEach(slot => {
        const number = parseInt(slot.textContent);
        if (textMapping[number]) {
            slot.textContent = textMapping[number];
        }
    });
}