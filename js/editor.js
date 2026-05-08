window.AtlasEditor = {
    init: function() {
        console.log("Editor Module Initialized");
        const textarea = document.getElementById('medical-notes');
        if(textarea) {
            // Load saved state
            textarea.value = window.AtlasState.patientData.notes;
            
            textarea.addEventListener('input', (e) => {
                window.AtlasState.updateNote(e.target.value);
            });
        }
    }
};