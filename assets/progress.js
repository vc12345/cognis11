const TYPES = [
  { code: 'A1', name: 'Start Unknown', domain: 'Numerical' },
  { code: 'A2', name: 'Direct Operation', domain: 'Numerical' },
  { code: 'A3', name: 'Two-Step Sequential', domain: 'Numerical' },
  { code: 'A4', name: 'Hidden Comparison', domain: 'Numerical' },
  // ... all 52 types
];

function markDone(code) {
  localStorage.setItem('done_' + code, 'true');
  const btn = document.getElementById('doneBtn');
  btn.textContent = '✓ Done';
  btn.classList.add('done');
}

function getProgress() {
  return TYPES.filter(t => localStorage.getItem('done_' + t.code) === 'true').length;
}

function renderIndex() {
  const grid = document.getElementById('typeGrid');
  const domains = [...new Set(TYPES.map(t => t.domain))];
  
  domains.forEach(domain => {
    const section = document.createElement('section');
    section.innerHTML = `<h2>${domain}</h2>`;
    const cards = TYPES.filter(t => t.domain === domain);
    
    cards.forEach(t => {
      const done = localStorage.getItem('done_' + t.code) === 'true';
      const card = document.createElement('a');
      card.href = `/members/${t.code.toLowerCase()}-${t.name.toLowerCase().replace(/ /g,'-')}.html`;
      card.className = 'type-card' + (done ? ' done' : '');
      card.innerHTML = `
        <span class="type-code">${t.code}</span>
        <span class="type-name">${t.name}</span>
        ${done ? '<span class="tick">✓</span>' : ''}
      `;
      section.appendChild(card);
    });
    grid.appendChild(section);
  });

  const done = getProgress();
  document.getElementById('progressCount').textContent = 
    `${done} of ${TYPES.length} question types completed`;
}
