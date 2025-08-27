// Utility to generate a random line equation: y = mx + b
function randomLine() {
    const m = (Math.random() * 4 - 2).toFixed(2); // slope between -2 and 2
    const b = (Math.random() * 10 - 5).toFixed(2); // intercept between -5 and 5
    return { m: parseFloat(m), b: parseFloat(b) };
}

// Utility to generate a random point, sometimes on the line, sometimes not
function randomPoint(line) {
    const onLine = Math.random() < 0.5;
    const x = Math.floor(Math.random() * 16 - 8); // x between -8 and 8
    let y;
    if (onLine) {
        y = line.m * x + line.b;
        y = parseFloat(y.toFixed(2));
    } else {
        y = line.m * x + line.b + (Math.random() * 4 + 1) * (Math.random() < 0.5 ? 1 : -1); // off by 1-5
        y = parseFloat(y.toFixed(2));
    }
    return { x, y, onLine };
}

// Render LaTeX using MathJax
function renderLatex(id, latex) {
    const el = document.getElementById(id);
    el.textContent = '';
    el.innerHTML = `$$${latex}$$`;
    if (window.MathJax) {
        MathJax.typesetPromise([el]);
    }
}

// Draw the graph
function drawGraph(line, point, isCorrect) {
    const canvas = document.getElementById('graph');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Axes
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(200, 0); ctx.lineTo(200, 400); // y-axis
    ctx.moveTo(0, 200); ctx.lineTo(400, 200); // x-axis
    ctx.stroke();

    // Line: y = mx + b
    ctx.strokeStyle = '#0078d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= 400; px++) {
        const x = (px - 200) / 20; // scale: 20px = 1 unit
        const y = line.m * x + line.b;
        const py = 200 - y * 20;
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Point
    const px = 200 + point.x * 20;
    const py = 200 - point.y * 20;
    ctx.beginPath();
    ctx.arc(px, py, 7, 0, 2 * Math.PI);
    ctx.fillStyle = isCorrect ? '#2ecc40' : '#e74c3c';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.stroke();
}

// Main logic
let currentLine, currentPoint;
function newQuestion() {
    currentLine = randomLine();
    currentPoint = randomPoint(currentLine);
    renderLatex('equation-latex', `y = ${currentLine.m}x + ${currentLine.b}`);
    document.getElementById('coordinate').textContent = `(${currentPoint.x}, ${currentPoint.y})`;
    document.getElementById('expander').classList.add('hidden');
}

function checkAnswer(answer) {
    const isCorrect = (answer === 'yes' && currentPoint.onLine) || (answer === 'no' && !currentPoint.onLine);
    document.getElementById('feedback').textContent = isCorrect ? 'Correct!' : 'Incorrect.';
    drawGraph(currentLine, currentPoint, isCorrect);
    // Removed details-latex rendering as requested
    document.getElementById('expander').classList.remove('hidden');
}

document.getElementById('yes-btn').onclick = () => checkAnswer('yes');
document.getElementById('no-btn').onclick = () => checkAnswer('no');
document.getElementById('close-expander').onclick = () => {
    newQuestion();
};

// Initial question
window.onload = newQuestion;
