window.AtlasDice = {
    init: function() {
        console.log("Dice Module Initialized");
        const btn = document.getElementById('roll-dice-btn');
        const result = document.getElementById('dice-result');
        
        if(btn && result) {
            btn.addEventListener('click', () => {
                const roll = Math.floor(Math.random() * 20) + 1;
                result.innerText = `Roll: ${roll}`;
            });
        }
    }
};