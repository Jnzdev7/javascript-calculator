const displayEl = document.getElementById('display');

if (!displayEl) {}

let expression = '';

function updateDisplay() {
  if (displayEl) displayEl.textContent = expression || '0';
}

function pressed(char) {
  const last = expression.slice(-1);
  const operators = '+-*/';

  if (operators.includes(char)) {
    if (expression === '' && char !== '-') return;
    if (operators.includes(last)) {
      expression = expression.slice(0, -1) + char;
      updateDisplay();
      return;
    }
  }

  expression += char;
  updateDisplay();
}

function clearAll() {
  expression = '';
  updateDisplay();
}

function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function sanitizeExpression(expr) {
  const allowed = /^[0-9+\-*/().\s]+$/;
  return allowed.test(expr);
}

function calculate() {
  if (!expression) return;

  if (!sanitizeExpression(expression)) {
    expression = 'Erro';
    updateDisplay();
    return;
  }

  try {
    const result = eval(expression);

    if (typeof result === 'number' && isFinite(result)) {
      expression = String(result);
    } else {
      expression = 'Erro';
    }
  } catch (e) {
    expression = 'Erro';
  }

  updateDisplay();
}

updateDisplay();

const keyMap = {
  '0': '0','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9',
  '+': '+','-':'-','*':'*','/':'/','.':'.',
  'Enter': 'equals','=': 'equals',
  'Backspace': 'backspace','Delete': 'clear'
};

const held = new Set();

function findButtonByLabel(label){
  if(label === 'equals') return document.querySelector('button[aria-label="Equals"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === '=');
  if(label === 'backspace') return document.querySelector('button[aria-label="Backspace"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === '<');
  if(label === 'clear') return document.querySelector('button[aria-label="Clear"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'C');

  const all = Array.from(document.querySelectorAll('.btn'));
  return all.find(b => b.textContent.trim() === label);
}

function activateButtonVisual(btn){
  if (!btn) return;
  btn.classList.add('led-on');
}

function deactivateButtonVisual(btn){
  if (!btn) return;
  btn.classList.remove('led-on');
}

window.addEventListener('keydown', (e) => {
  const k = e.key;
  const action = keyMap[k];
  if (!action) return;

  if (held.has(k)) return;
  held.add(k);

  const btn = findButtonByLabel(action);
  activateButtonVisual(btn);

  if (action === 'equals') {
    calculate();
  } else if (action === 'backspace') {
    backspace();
  } else if (action === 'clear') {
    clearAll();
  } else {
    pressed(action);
  }

  if (k === 'Enter') e.preventDefault();
});

window.addEventListener('keyup', (e) => {
  const k = e.key;
  const action = keyMap[k];
  if (!action) return;

  held.delete(k);

  const btn = findButtonByLabel(action);
  deactivateButtonVisual(btn);
});

document.querySelectorAll('.btn').forEach(b => {
  b.addEventListener('mousedown', () => b.classList.add('led-on'));
  b.addEventListener('mouseup', () => b.classList.remove('led-on'));
  b.addEventListener('mouseleave', () => b.classList.remove('led-on'));
});
