const State = {
    currentView: 'workspace',
    patientData: {
        id: null,
        notes: ""
    },
    
    // Simple Observer pattern to notify components of changes
    listeners: [],

    subscribe(callback) {
        this.listeners.push(callback);
    },

    notify() {
        this.listeners.forEach(cb => cb(this));
    },

    setCurrentView(viewName) {
        this.currentView = viewName;
        this.notify();
    },

    updateNote(text) {
        this.patientData.notes = text;
        // Auto-save logic could go here
    }
};

window.AtlasState = State;