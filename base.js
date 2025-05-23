document.addEventListener('DOMContentLoaded', function() {
    // Переменные для элементов интерфейса
    const themeToggle = document.getElementById('theme-toggle');
    const registrationForm = document.getElementById('registration-form');
    const searchInput = document.getElementById('search-input');
    const filterTeam = document.getElementById('filter-team');
    const filterBuilding = document.getElementById('filter-building');
    const clearAllBtn = document.getElementById('clear-all');
    const eventSelect = document.getElementById('event-select');
    const participantSelect = document.getElementById('participant-select');
    const assignEventBtn = document.getElementById('assign-event');
    const addEventBtn = document.getElementById('add-event-btn');
    const addEventModal = document.getElementById('add-event-modal');
    const closeModal = document.querySelector('.close-modal');
    const newEventForm = document.getElementById('new-event-form');

    // В начале файла добавьте проверку на мобильное устройство
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// В функции setupEventListeners добавьте обработчики для мобильных
function setupEventListeners() {
    // ... существующие обработчики ...
    
    // Оптимизация для мобильных устройств
    if (isMobile) {
        // Увеличиваем область клика для кнопок
        document.querySelectorAll('button').forEach(btn => {
            btn.style.minHeight = '44px';
            btn.style.minWidth = '44px';
        });
        
        // Улучшаем работу select
        document.querySelectorAll('select').forEach(select => {
            select.style.fontSize = '16px'; // Предотвращает масштабирование в iOS
        });
    }
    
    // Обработка свайпов для мобильных
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        if (Math.abs(touchEndX - touchStartX) < 50) return;
        
        if (touchEndX < touchStartX) {
            // Свайп влево - можно добавить навигацию
        } else {
            // Свайп вправо
        }
    }
}
    
    // Статистика
    const juniorCount = document.getElementById('junior-count');
    const middleCount = document.getElementById('middle-count');
    const seniorCount = document.getElementById('senior-count');
    const totalCount = document.getElementById('total-count');
    
    // Списки участников
    const juniorList = document.getElementById('junior-list');
    const middleList = document.getElementById('middle-list');
    const seniorList = document.getElementById('senior-list');
    
    // Данные приложения
    let participants = JSON.parse(localStorage.getItem('campParticipants')) || [];
    let events = [
        { id: 'football', name: 'Футбол', minAge: 10, maxAge: 16, type: 'sport' },
        { id: 'painting', name: 'Рисование', minAge: 10, maxAge: 14, type: 'art' },
        { id: 'chess', name: 'Шахматы', minAge: 12, maxAge: 16, type: 'intellectual' },
        { id: 'dance', name: 'Танцы', minAge: 10, maxAge: 16, type: 'art' },
        { id: 'quiz', name: 'Викторина', minAge: 13, maxAge: 16, type: 'intellectual' }
    ];
    
    // Инициализация приложения
    initApp();
    const heroImage = new Image();
    heroImage.src = '8f2f5238-ef9a-4745-9664-7eb207cc7659.png';
    
    // Функции
    
    function initApp() {
        // Загрузка темы
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
        
        // Отрисовка участников
        renderParticipants();
        updateStats();
        populateParticipantSelect();
        populateEventSelect();
        
        // Назначение обработчиков событий
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // Переключение темы
        themeToggle.addEventListener('click', toggleTheme);
        
        // Форма регистрации
        registrationForm.addEventListener('submit', handleRegistration);
        
        // Поиск и фильтрация
        searchInput.addEventListener('input', filterParticipants);
        filterTeam.addEventListener('change', filterParticipants);
        filterBuilding.addEventListener('change', filterParticipants);
        
        // Кнопка очистки
        clearAllBtn.addEventListener('click', clearAllParticipants);
        
        // Назначение мероприятий
        assignEventBtn.addEventListener('click', assignEvent);
        
        // Модальное окно добавления мероприятия
        addEventBtn.addEventListener('click', () => addEventModal.style.display = 'flex');
        closeModal.addEventListener('click', () => addEventModal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === addEventModal) {
                addEventModal.style.display = 'none';
            }
        });
        
        // Форма добавления мероприятия
        newEventForm.addEventListener('submit', addNewEvent);
        
        // Вкладки корпусов
        document.querySelectorAll('.building-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const teamCard = this.closest('.team-card');
                const tabs = teamCard.querySelectorAll('.building-tab');
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const team = teamCard.classList.contains('junior-team') ? 'junior' : 
                              teamCard.classList.contains('middle-team') ? 'middle' : 'senior';
                const building = this.dataset.building;
                filterParticipantsByBuilding(team, building);
            });
        });
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }
    
    function updateThemeIcon(theme) {
        const icon = theme === 'light' ? 'fa-moon' : 'fa-sun';
        themeToggle.innerHTML = `<i class="fas ${icon}"></i>`;
    }
    
    function handleRegistration(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const age = parseInt(document.getElementById('age').value);
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const interests = Array.from(document.getElementById('interests').selectedOptions)
                              .map(option => option.value);
        
        if (!name || isNaN(age)) {
            alert('Пожалуйста, заполните все поля корректно');
            return;
        }
        
        // Определение отряда
        let team;
        if (age >= 10 && age <= 12) team = 'junior';
        else if (age >= 13 && age <= 14) team = 'middle';
        else if (age >= 15 && age <= 16) team = 'senior';
        
        // Определение корпуса
        const building = gender === 'male' ? 'A' : 'B';
        
        // Создание участника
        const participant = {
            id: generateId(),
            name,
            age,
            gender,
            interests,
            team,
            building,
            events: []
        };
        
        // Добавление участника
        participants.push(participant);
        saveParticipants();
        renderParticipants();
        updateStats();
        populateParticipantSelect();
        
        // Очистка формы
        registrationForm.reset();
        
        // Уведомление
        alert(`${name} успешно зарегистрирован(а) в ${getTeamName(team)} отряд, корпус ${building}!`);
    }
    
    function generateId() {
        return 'id-' + Math.random().toString(36).substr(2, 9);
    }
    
    function getTeamName(team) {
        switch(team) {
            case 'junior': return 'Младший';
            case 'middle': return 'Средний';
            case 'senior': return 'Старший';
            default: return '';
        }
    }
    
    function renderParticipants() {
        // Очистка списков
        juniorList.innerHTML = '';
        middleList.innerHTML = '';
        seniorList.innerHTML = '';
        
        // Фильтрация по поиску и фильтрам
        const searchTerm = searchInput.value.toLowerCase();
        const teamFilter = filterTeam.value;
        const buildingFilter = filterBuilding.value;
        
        const filteredParticipants = participants.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm);
            const matchesTeam = teamFilter === 'all' || p.team === teamFilter;
            const matchesBuilding = buildingFilter === 'all' || p.building === buildingFilter;
            return matchesSearch && matchesTeam && matchesBuilding;
        });
        
        // Группировка по отрядам
        const juniorParticipants = filteredParticipants.filter(p => p.team === 'junior');
        const middleParticipants = filteredParticipants.filter(p => p.team === 'middle');
        const seniorParticipants = filteredParticipants.filter(p => p.team === 'senior');
        
        // Отрисовка
        renderTeamList(juniorParticipants, juniorList);
        renderTeamList(middleParticipants, middleList);
        renderTeamList(seniorParticipants, seniorList);
    }
    
    function renderTeamList(participants, container) {
        if (participants.length === 0) {
            container.innerHTML = '<p class="no-participants">Нет участников</p>';
            return;
        }
        
        participants.forEach(participant => {
            const participantCard = document.createElement('div');
            participantCard.className = `participant-card building-${participant.building}`;
            
            const interests = participant.interests.map(i => {
                switch(i) {
                    case 'sport': return '🏀';
                    case 'art': return '🎨';
                    case 'science': return '🔬';
                    case 'music': return '🎵';
                    case 'dance': return '💃';
                    default: return '';
                }
            }).join(' ');
            
            const eventsList = participant.events.length > 0 ? 
                participant.events.map(e => {
                    const event = events.find(ev => ev.id === e);
                    return event ? event.name : '';
                }).join(', ') : 'Нет мероприятий';
            
            participantCard.innerHTML = `
                <div class="participant-info">
                    <div class="participant-name">${participant.name}</div>
                    <div class="participant-details">
                        <span>${participant.age} лет</span>
                        <span>Корпус ${participant.building}</span>
                        <span>${interests}</span>
                    </div>
                    <div class="participant-events">Мероприятия: ${eventsList}</div>
                </div>
                <div class="participant-actions">
                    <button class="delete-btn" data-id="${participant.id}" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            container.appendChild(participantCard);
        });
        
        // Назначение обработчиков для кнопок удаления
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteParticipant(id);
            });
        });
    }
    
    function filterParticipants() {
        renderParticipants();
    }
    
    function filterParticipantsByBuilding(team, building) {
        const searchTerm = searchInput.value.toLowerCase();
        const teamFilter = filterTeam.value;
        const buildingFilter = filterBuilding.value;
        
        let filteredParticipants = participants.filter(p => p.team === team);
        
        if (building !== 'all') {
            filteredParticipants = filteredParticipants.filter(p => p.building === building);
        }
        
        if (searchTerm) {
            filteredParticipants = filteredParticipants.filter(p => 
                p.name.toLowerCase().includes(searchTerm));
        }
        
        if (teamFilter !== 'all' && teamFilter !== team) {
            filteredParticipants = [];
        }
        
        if (buildingFilter !== 'all' && buildingFilter !== building) {
            filteredParticipants = [];
        }
        
        const container = team === 'junior' ? juniorList : 
                         team === 'middle' ? middleList : seniorList;
        container.innerHTML = '';
        
        if (filteredParticipants.length === 0) {
            container.innerHTML = '<p class="no-participants">Нет участников</p>';
            return;
        }
        
        renderTeamList(filteredParticipants, container);
    }
    
    function updateStats() {
        const junior = participants.filter(p => p.team === 'junior').length;
        const middle = participants.filter(p => p.team === 'middle').length;
        const senior = participants.filter(p => p.team === 'senior').length;
        
        juniorCount.textContent = junior;
        middleCount.textContent = middle;
        seniorCount.textContent = senior;
        totalCount.textContent = participants.length;
    }
    
    function populateParticipantSelect() {
        participantSelect.innerHTML = '<option value="">Выберите участника</option>';
        
        participants.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = `${p.name} (${getTeamName(p.team)} отряд, ${p.age} лет)`;
            participantSelect.appendChild(option);
        });
    }
    
    function populateEventSelect() {
        eventSelect.innerHTML = '<option value="">Выберите мероприятие</option>';
        
        events.forEach(e => {
            const option = document.createElement('option');
            option.value = e.id;
            option.textContent = `${e.name} (${e.minAge}-${e.maxAge} лет)`;
            eventSelect.appendChild(option);
        });
    }
    
    function assignEvent() {
        const eventId = eventSelect.value;
        const participantId = participantSelect.value;
        
        if (!eventId || !participantId) {
            alert('Пожалуйста, выберите мероприятие и участника');
            return;
        }
        
        const participant = participants.find(p => p.id === participantId);
        const event = events.find(e => e.id === eventId);
        
        if (participant.events.includes(eventId)) {
            alert('Этот участник уже записан на данное мероприятие');
            return;
        }
        
        if (participant.age < event.minAge || participant.age > event.maxAge) {
            alert(`Участник не подходит по возрасту. Мероприятие "${event.name}" доступно для ${event.minAge}-${event.maxAge} лет`);
            return;
        }
        
        participant.events.push(eventId);
        saveParticipants();
        renderParticipants();
        alert(`${participant.name} успешно записан(а) на мероприятие "${event.name}"`);
    }
    
    function addNewEvent(e) {
        e.preventDefault();
        
        const name = document.getElementById('event-name').value.trim();
        const minAge = parseInt(document.getElementById('event-min-age').value);
        const maxAge = parseInt(document.getElementById('event-max-age').value);
        const type = document.getElementById('event-type').value;
        
        if (!name || isNaN(minAge) || isNaN(maxAge) || minAge > maxAge) {
            alert('Пожалуйста, заполните все поля корректно');
            return;
        }
        
        if (minAge < 10 || maxAge > 16) {
            alert('Возрастные ограничения должны быть в диапазоне 10-16 лет');
            return;
        }
        
        const id = name.toLowerCase().replace(/\s+/g, '-');
        
        events.push({
            id,
            name,
            minAge,
            maxAge,
            type
        });
        
        populateEventSelect();
        newEventForm.reset();
        addEventModal.style.display = 'none';
        alert(`Мероприятие "${name}" успешно добавлено!`);
    }
    
    function deleteParticipant(id) {
        if (confirm('Вы уверены, что хотите удалить этого участника?')) {
            participants = participants.filter(p => p.id !== id);
            saveParticipants();
            renderParticipants();
            updateStats();
            populateParticipantSelect();
        }
    }
    
    function clearAllParticipants() {
        if (participants.length === 0) {
            alert('Нет участников для удаления');
            return;
        }
        
        if (confirm('Вы уверены, что хотите удалить ВСЕХ участников? Это действие нельзя отменить.')) {
            participants = [];
            saveParticipants();
            renderParticipants();
            updateStats();
            populateParticipantSelect();
        }
    }
    
    function saveParticipants() {
        localStorage.setItem('campParticipants', JSON.stringify(participants));
    }
});