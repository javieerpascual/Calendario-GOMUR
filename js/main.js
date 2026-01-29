// ========================================
// DATA & STATE
// ========================================
let racesData = [];
let activeFilters = new Set();
let allTournaments = [];

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    await loadRaces();
    initializeFilters();
    renderCalendar();
    setupEventListeners();
});

// ========================================
// DATA LOADING
// ========================================
async function loadRaces() {
    try {
        const response = await fetch('./data/races.json');
        const data = await response.json();
        racesData = data.races;

        // Extract unique tournaments
        const tournamentsSet = new Set();
        racesData.forEach(race => {
            tournamentsSet.add(JSON.stringify({
                id: race.tournament,
                label: race.tournamentLabel,
                color: race.color
            }));
        });

        allTournaments = Array.from(tournamentsSet).map(t => JSON.parse(t));

        // Initialize all filters as active
        allTournaments.forEach(tournament => {
            activeFilters.add(tournament.id);
        });
    } catch (error) {
        console.error('Error loading races:', error);
        showError();
    }
}

// ========================================
// FILTERS
// ========================================
function initializeFilters() {
    const checkboxList = document.getElementById('checkboxList');
    const chipsContainer = document.getElementById('chipsContainer');

    // Create checkboxes
    allTournaments.forEach(tournament => {
        const checkboxItem = createCheckboxItem(tournament);
        checkboxList.appendChild(checkboxItem);
    });

    // Create initial chips
    updateChips();
}

function createCheckboxItem(tournament) {
    const label = document.createElement('label');
    label.className = 'checkbox-item';
    label.dataset.tournament = tournament.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `filter-${tournament.id}`;
    checkbox.checked = true;
    checkbox.addEventListener('change', () => handleFilterChange(tournament.id));

    const span = document.createElement('span');
    span.className = 'checkbox-label';
    span.textContent = tournament.label;

    const colorDot = document.createElement('span');
    colorDot.style.cssText = `
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: ${tournament.color};
        margin-left: auto;
    `;

    label.appendChild(checkbox);
    label.appendChild(span);
    label.appendChild(colorDot);

    return label;
}

function handleFilterChange(tournamentId) {
    const checkbox = document.getElementById(`filter-${tournamentId}`);

    if (checkbox.checked) {
        activeFilters.add(tournamentId);
    } else {
        activeFilters.delete(tournamentId);
    }

    updateChips();
    renderCalendar();
}

function updateChips() {
    const chipsContainer = document.getElementById('chipsContainer');
    chipsContainer.innerHTML = '';

    allTournaments.forEach(tournament => {
        if (activeFilters.has(tournament.id)) {
            const chip = createChip(tournament);
            chipsContainer.appendChild(chip);
        }
    });
}

function createChip(tournament) {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.style.background = tournament.color;

    const label = document.createElement('span');
    label.textContent = tournament.label;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'chip-close';
    closeBtn.innerHTML = '✕';
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFilter(tournament.id);
    });

    chip.appendChild(label);
    chip.appendChild(closeBtn);

    return chip;
}

function removeFilter(tournamentId) {
    activeFilters.delete(tournamentId);
    const checkbox = document.getElementById(`filter-${tournamentId}`);
    if (checkbox) checkbox.checked = false;
    updateChips();
    renderCalendar();
}

// ========================================
// CALENDAR RENDERING
// ========================================
function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';

    // Filter races based on active filters
    const filteredRaces = racesData.filter(race =>
        activeFilters.has(race.tournament)
    );

    // Sort races by date
    filteredRaces.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (filteredRaces.length === 0) {
        showEmptyState(calendarGrid);
        return;
    }

    // Render race cards
    filteredRaces.forEach((race, index) => {
        const card = createRaceCard(race, index);
        calendarGrid.appendChild(card);
    });
}

function createRaceCard(race, index) {
    const card = document.createElement('div');
    card.className = 'race-card';
    card.style.animationDelay = `${index * 0.05}s`;

    const date = new Date(race.date);
    const day = date.getDate();
    const month = date.toLocaleDateString('es-ES', { month: 'long' });
    const year = date.getFullYear();
    const dayOfWeek = date.toLocaleDateString('es-ES', { weekday: 'long' });

    card.innerHTML = `
        <div class="race-date">
            <div class="date-badge">${day}</div>
            <div class="date-info">
                <div class="month-year">${month} ${year}</div>
            </div>
        </div>
        
        <h3 class="race-title">${race.title}</h3>
        
        <div class="race-details">
            <div class="detail-item">
                <span class="detail-icon">📍</span>
                <span>${race.location}</span>
            </div>
            <div class="detail-item">
                <span class="detail-icon">🏢</span>
                <span>${race.organizer}</span>
            </div>
            <div class="detail-item">
                <span class="detail-icon">📅</span>
                <span>${capitalizeFirst(dayOfWeek)}</span>
            </div>
        </div>
        
        <div class="race-tags">
            <span class="tag" style="background: ${race.color}">
                ${race.tournamentLabel}
            </span>
        </div>
    `;

    return card;
}

function showEmptyState(container) {
    container.innerHTML = `
        <div style="
            grid-column: 1 / -1;
            text-align: center;
            padding: 4rem 2rem;
            color: var(--text-secondary);
        ">
            <div style="font-size: 4rem; margin-bottom: 1rem;">🚴</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">No hay carreras para mostrar</h3>
            <p>Selecciona al menos un torneo en los filtros</p>
        </div>
    `;
}

function showError() {
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = `
        <div style="
            grid-column: 1 / -1;
            text-align: center;
            padding: 4rem 2rem;
            color: var(--text-secondary);
        ">
            <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Error al cargar el calendario</h3>
            <p>Por favor, recarga la página</p>
        </div>
    `;
}

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
    const chipsWrapper = document.getElementById('chipsWrapper');
    const dropdown = document.getElementById('dropdown');
    const searchInput = document.getElementById('searchInput');
    const selectAllCheckbox = document.getElementById('selectAll');

    // Toggle dropdown
    chipsWrapper.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            const isOpening = !dropdown.classList.contains('active');
            dropdown.classList.toggle('active');

            // Toggle calendar margin to prevent overlap
            const calendarContainer = document.querySelector('.calendar-container');
            if (isOpening) {
                calendarContainer.classList.add('dropdown-open');
            } else {
                calendarContainer.classList.remove('dropdown-open');
            }
        }
    });

    // Prevent dropdown close when clicking inside
    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!chipsWrapper.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
            const calendarContainer = document.querySelector('.calendar-container');
            calendarContainer.classList.remove('dropdown-open');
        }
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const checkboxItems = document.querySelectorAll('.checkbox-item:not(.select-all)');

        checkboxItems.forEach(item => {
            const label = item.querySelector('.checkbox-label').textContent.toLowerCase();
            if (label.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Select all functionality
    selectAllCheckbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;

        allTournaments.forEach(tournament => {
            const checkbox = document.getElementById(`filter-${tournament.id}`);
            if (checkbox) {
                checkbox.checked = isChecked;
                if (isChecked) {
                    activeFilters.add(tournament.id);
                } else {
                    activeFilters.delete(tournament.id);
                }
            }
        });

        updateChips();
        renderCalendar();
    });
}

// ========================================
// UTILITIES
// ========================================
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
