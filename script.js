// ---------- ১. ক্যানভাস এবং ফিজিক্স সেটআপ ----------
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

// ক্যানভাস স্টাইলিং (সাইবারপাংক লুক)
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '-2'; // পোর্টফোলিওর ব্যাকগ্রাউন্ড হিসেবেও চালানো যাবে
canvas.style.pointerEvents = 'none';

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ---------- ২. ত্রিকোণমিতি (Trigonometry) ম্যাথ লজিক ----------
let time = 0;
const waveNodes = 12; // লজিক নোডের সংখ্যা
const points = [];

// স্ক্রিনের মাঝখানে ম্যাথ ওয়েভ জেনারেট করার লজিক
for (let i = 0; i < waveNodes; i++) {
    points.push({
        x: (window.innerWidth / (waveNodes - 1)) * i,
        y: window.innerHeight / 2,
        baseY: window.innerHeight / 2,
        // প্রতিটা নোডের জন্য আলাদা সাইন (Sin) এবং কস (Cos) অ্যাঙ্গেল
        angle: (Math.PI * 2 / waveNodes) * i,
        speed: 0.04 + (i * 0.002)
    });
}

// ---------- ৩. অ্যানিমেশন ও রেন্ডারিং লুপ ----------
function animateMathEngine() {
    // স্ক্রিন হালকা ব্লার ইফেক্ট দিয়ে ক্লিয়ার করা (Motion Trail)
    ctx.fillStyle = 'rgba(13, 13, 19, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    time += 0.02;

    // ক্যানভাস ব্যাকগ্রাউন্ড গ্রিড রি-ড্র করা
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.015)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // ত্রিকোণমিতিক সাইন ওয়েভ (Sin Wave) ফিজিক্স হিসাব
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffff';

    points.forEach((p, index) => {
        // 🔮 ম্যাথ লজিক: সাইন ও কস তরঙ্গের সমন্বয়ে ডাইনামিক মোশন তৈরি
        p.angle += p.speed;
        p.y = p.baseY + Math.sin(p.angle + time) * 80 * Math.cos(time * 0.5);

        if (index === 0) {
            ctx.moveTo(p.x, p.y);
        } else {
            // নোডগুলোর মধ্যে মসৃণ কার্ভ (Bezier/Quadratic Curve) তৈরি করা
            const prev = points[index - 1];
            const xc = (prev.x + p.x) / 2;
            const yc = (prev.y + p.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, xc, yc);
        }
    });
    ctx.stroke();
    ctx.closePath();
    ctx.shadowBlur = 0; // গ্লো রিসেট

    // নোড পয়েন্টগুলোতে উজ্জ্বল গ্লোয়িং কোণা (Core Matrix Nodes) আঁকা
    points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ff0055';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff0055';
        ctx.fill();
        ctx.closePath();
    });
    ctx.shadowBlur = 0;

    requestAnimationFrame(animateMathEngine);
}

// ম্যাথ ক্যানভাস ইঞ্জিন চালু করা
animateMathEngine();
// ---------- ---------- ৪. হ্যাকার ম্যাথ সলভার কোড ইঞ্জিন ---------- ----------
const calcDisplay = document.getElementById('calc-display');

// ডিসপ্লেতে ইনপুট বোতাম পুশ করার লজিক
function pressCalc(value) {
    if (calcDisplay.value === "ERROR //" || calcDisplay.value === "NaN") {
        calcDisplay.value = "";
    }
    calcDisplay.value += value;
}

// ডিসপ্লে ক্লিয়ার করার লজিক
function clearCalc() {
    calcDisplay.value = "";
}

// 🔮 অ্যাডভান্সড লজিক: স্ট্রিং ইকুয়েশনকে আসল ম্যাথ ফিজিক্সে রূপান্তর করা
function solveEquation() {
    let expression = calcDisplay.value;

    if (!expression) return;

    try {
        // ১. পাই (π) এর মান কনভার্ট করার লজিক
        expression = expression.replace(/π/g, 'Math.PI');

        // ২. স্কয়ার রুট (√) এর জন্য লজিক
        expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');

        // ৩. স্কয়ার (x²) এর জন্য লজিক - sqr(5) লিখলে 5*5 বা 5^2 হবে
        expression = expression.replace(/sqr\(/g, 'Math.pow(');
        // যদি ব্র্যাকেট ছাড়া শুধু সংখ্যা স্কয়ার করতে চান, তবে নিচে কমা দিয়ে ২ যোগ করার ফিজিক্স রয়েছে
        expression = expression.replace(/sqr\(([^)]+)\)/g, 'Math.pow(\$1,2)');

        // ৪. নিখুঁত ত্রিকোণমিতিক এক্যুরেসি ফিক্স (Degree to Radian Fix)
        // আমরা সরাসরি ম্যাথমেটিক্যাল প্রিসিশন হ্যান্ডেল করছি যাতে sin(30) হুবহু 0.5 আসে
        expression = expression.replace(/sin\(([^)]+)\)/g, function(match, angle) {
            let rad = eval(angle) * (Math.PI / 180);
            return `Math.sin(${rad})`;
        });
        expression = expression.replace(/cos\(([^)]+)\)/g, function(match, angle) {
            let rad = eval(angle) * (Math.PI / 180);
            return `Math.cos(${rad})`;
        });
        expression = expression.replace(/tan\(([^)]+)\)/g, function(match, angle) {
            let rad = eval(angle) * (Math.PI / 180);
            return `Math.tan(${rad})`;
        });

        // ফাইনাল এক্সিকিউশন
        let result = eval(expression);

        // ফ্লোটিং পয়েন্ট জ্যাম এড়াতে রাউন্ডিং লজিক
        // যেমন: ০.৪৯৯৯৯৯৯৯ কে সরাসরি ০.৫ করে দেবে
        if (Number(result) && !Number.isInteger(result)) {
            result = Math.round(result * 1e10) / 1e10; // ১০ দশমিক ঘর পর্যন্ত নিখুঁত প্রিসিশন
            if (result.toString().includes('.') && result.toString().split('.')[1].length > 4) {
                result = parseFloat(result.toFixed(4));
            }
        }

        calcDisplay.value = result;
    } catch (error) {
        calcDisplay.value = "ERROR //";
    }
}