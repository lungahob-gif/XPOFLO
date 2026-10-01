const form = document.getElementById('eventForm');
const eventName = document.getElementById('eventName');
const eventType = document.getElementById('eventType');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const venueName = document.getElementById('venueName');
const city = document.getElementById('city');
const country = document.getElementById('country');
const lengthInput = document.getElementById('length');
const widthInput = document.getElementById('width');
const expectedExhibitors = document.getElementById('expectedExhibitors');

const grossArea = document.getElementById('grossArea');
const previewName = document.getElementById('previewName');
const previewVenue = document.getElementById('previewVenue');
const previewType = document.getElementById('previewType');
const previewExhibitors = document.getElementById('previewExhibitors');
const previewArea = document.getElementById('previewArea');
const ratioWidth = document.getElementById('ratioWidth');
const ratioLength = document.getElementById('ratioLength');
const venueRoom = document.getElementById('venueRoom');
const toast = document.getElementById('toast');

function formatArea(value) {
  return `${new Intl.NumberFormat('en-KE', { maximumFractionDigits: 1 }).format(value)} m²`;
}

function updateAreaPreview() {
  const length = Number(lengthInput.value);
  const width = Number(widthInput.value);
  const area = length > 0 && width > 0 ? length * width : 0;

  grossArea.textContent = area ? formatArea(area) : '—';
  previewArea.textContent = area ? formatArea(area) : '—';
  ratioWidth.textContent = width > 0 ? `${width} m` : '—';
  ratioLength.textContent = length > 0 ? `${length} m` : '—';

  if (area) {
    // Keep the preview proportionate without letting very wide halls dominate the card.
    const ratio = Math.min(2.3, Math.max(.72, length / width));
    const roomWidth = Math.round(228 * Math.sqrt(ratio));
    const roomHeight = Math.round(roomWidth / ratio);
    venueRoom.style.width = `${Math.min(250, roomWidth)}px`;
    venueRoom.style.minHeight = `${Math.min(265, Math.max(185, roomHeight))}px`;
    venueRoom.style.justifySelf = 'center';
  } else {
    venueRoom.style.width = '';
    venueRoom.style.minHeight = '';
  }
}

function updateTextPreview() {
  previewName.textContent = eventName.value.trim() || 'Your event';
  previewVenue.textContent = venueName.value.trim() || 'Add venue dimensions';
  previewType.textContent = eventType.value || '—';
  previewExhibitors.textContent = expectedExhibitors.value ? Number(expectedExhibitors.value).toLocaleString('en-KE') : '—';
}

function saveDraft() {
  const draft = {
    eventName: eventName.value,
    eventType: eventType.value,
    eventStatus: document.getElementById('eventStatus').value,
    description: document.getElementById('description').value,
    startDate: startDate.value,
    endDate: endDate.value,
    venueName: venueName.value,
    city: city.value,
    country: country.value,
    length: lengthInput.value,
    width: widthInput.value,
    expectedExhibitors: expectedExhibitors.value,
  };
  localStorage.setItem('expoflow.eventDraft', JSON.stringify(draft));
}

function loadDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem('expoflow.eventDraft') || 'null');
    if (!saved) return;
    Object.entries(saved).forEach(([key, value]) => {
      const field = document.getElementById(key);
      if (field && value !== undefined && value !== null) field.value = value;
    });
    updateTextPreview();
    updateAreaPreview();
  } catch (error) {
    console.warn('Could not load ExpoFlow draft.', error);
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 3000);
}

[eventName, eventType, venueName, expectedExhibitors].forEach((field) => field.addEventListener('input', () => {
  updateTextPreview();
  saveDraft();
}));

[startDate, endDate, city, country, lengthInput, widthInput, document.getElementById('eventStatus'), document.getElementById('description')].forEach((field) => field.addEventListener('input', saveDraft));
[lengthInput, widthInput].forEach((field) => field.addEventListener('input', () => {
  updateAreaPreview();
  saveDraft();
}));

eventType.addEventListener('change', updateTextPreview);

startDate.addEventListener('change', () => {
  endDate.min = startDate.value;
  if (endDate.value && startDate.value && endDate.value < startDate.value) endDate.value = startDate.value;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  if (endDate.value < startDate.value) {
    showToast('End date must be on or after the start date.');
    endDate.focus();
    return;
  }

  const eventData = {
    ...JSON.parse(localStorage.getItem('expoflow.eventDraft') || '{}'),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem('expoflow.currentEvent', JSON.stringify(eventData));
  localStorage.removeItem('expoflow.eventDraft');

  showToast('Event created. Venue setup is the next step.');
  window.setTimeout(() => {
    window.location.href = 'event-dashboard.html';
  }, 700);
});

loadDraft();
updateTextPreview();
updateAreaPreview();
