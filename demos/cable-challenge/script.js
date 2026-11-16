// i18n Translations Object
const translations = {
    en: {
        languageAria: 'Language',
        demoKicker: 'Interactive demo',
        backToJourney: '← Back to the demos',
        workspaceTitle: 'Manipulation workspace',
        liveSimulation: 'Quasi-static equilibrium',
        controlPanelTitle: 'Robot joints',
        resetPoseBtn: 'Reset pose',
        hintBtn: 'Hint',
        autopilotBtn: 'Show solution',
        interactionGuide: 'Interaction',
        rodModelLabel: 'Discrete Kirchhoff rod',
        flexibleState: 'Equilibrium',
        straightLimitState: 'Straight limit',
        title: 'Two-robot cable task',
        controllerTitle: 'Shape a flexible cable with the four joints of two robots. A small motion of one joint changes the shape of the entire cable.',
        howToPlay: 'How it works',
        goal: 'Objective:',
        goalDesc: 'Adjust the joints until the cable follows the dashed target.',
        controls: 'Controls:',
        controlsDesc: 'Each slider rotates one joint. Both robots hold the same cable, so every joint motion changes the whole shape.',
        feedback: 'Feedback:',
        feedbackDesc: 'The current error and its history indicate whether a change reduced the error.',
        whyMatters: 'Research context',
        matterText1: 'Manipulation of cables, cloth and other flexible objects is required in domestic, agricultural and manufacturing applications.',
        note: 'Limit:',
        matterText2: 'Some targets are unreachable because of material, grasp and robot constraints. Characterising the set of reachable shapes is an open problem.',
        leftRobot: 'Left robot (blue)',
        rightRobot: 'Right robot (brown)',
        joint1: 'Joint 1',
        joint2: 'Joint 2',
        newTargetBtn: 'New target',
        errorPlotLabel: 'Alignment error after each move',
        cableAlignmentError: 'Current alignment error',
        movesLabel: 'Moves',
        progressLabel: 'Improvement',
        coachStartTitle: 'Change one joint at a time',
        coachStartDesc: 'Make a small move and use the error to decide whether to continue or reverse it.',
        coachImprovingTitle: 'Error decreased',
        coachImprovingDesc: 'Continue in this direction with small steps, or test another joint.',
        coachWrongTitle: 'Error increased',
        coachWrongDesc: 'Reverse this movement, then test a different joint or direction.',
        coachCloseTitle: 'Close to the target',
        coachCloseDesc: 'Use small joint movements to reduce the remaining error.',
        coachSuccessTitle: 'Target reached',
        coachSuccessDesc: 'You found a robot pose for which the cable follows the target.',
        coachHintTitle: 'Strategy: run a controlled experiment',
        coachHintDesc: 'Move one slider by one or two steps and keep the change only if the error decreases.',
        coachSolutionTitle: 'A feasible solution pose',
        coachSolutionDesc: 'The target was generated from this pose. A real controller has no access to it and must reach the target through feedback.',
        takeawayLabel: 'Takeaway',
        takeawayTitle: 'In a flexible object, each joint motion affects the whole shape.',
        takeawayDesc: 'You used visual feedback and trial and error. An autonomous controller has to estimate the same relation between joint motion and shape change, and update it as the object deforms.',
        nextDemoBtn: 'Next: shape similarity →',
        legendTargetShape: 'Target shape',
        legendCurrentShape: 'Current shape',
        workspaceAria: 'Cable manipulation workspace',
        feedbackAria: 'Performance feedback',
        canvasAria: 'Two robot arms manipulating a cable toward a dashed target shape',
        plotAria: 'History of cable alignment error after each move; lower values mean better alignment',
        errorAxisLabel: 'Alignment error (px)',
        movesAxisLabel: 'Moves'
    },
    es: {
        languageAria: 'Idioma',
        demoKicker: 'Demostración interactiva',
        backToJourney: '← Volver a las demos',
        workspaceTitle: 'Espacio de manipulación',
        liveSimulation: 'Equilibrio cuasiestático',
        controlPanelTitle: 'Articulaciones de los robots',
        resetPoseBtn: 'Restablecer postura',
        hintBtn: 'Pista',
        autopilotBtn: 'Mostrar solución',
        interactionGuide: 'Interacción',
        rodModelLabel: 'Varilla discreta de Kirchhoff',
        flexibleState: 'Equilibrio',
        straightLimitState: 'Límite recto',
        title: 'Tarea del cable con dos robots',
        controllerTitle: 'Da forma a un cable flexible con las cuatro articulaciones de dos robots. Un pequeño movimiento de una articulación cambia la forma de todo el cable.',
        howToPlay: 'Cómo funciona',
        goal: 'Objetivo:',
        goalDesc: 'Ajusta las articulaciones hasta que el cable siga el objetivo discontinuo.',
        controls: 'Controles:',
        controlsDesc: 'Cada deslizador gira una articulación. Ambos robots sujetan el mismo cable, así que cada movimiento de una articulación cambia toda la forma.',
        feedback: 'Realimentación:',
        feedbackDesc: 'El error actual y su historial indican si un cambio ha reducido el error.',
        whyMatters: 'Contexto de investigación',
        matterText1: 'La manipulación de cables, tejidos y otros objetos flexibles es necesaria en aplicaciones domésticas, agrícolas y de fabricación.',
        note: 'Límite:',
        matterText2: 'Algunos objetivos son inalcanzables por las restricciones del material, el agarre y los robots. Caracterizar el conjunto de formas alcanzables es un problema abierto.',
        leftRobot: 'Robot izquierdo (azul)',
        rightRobot: 'Robot derecho (marrón)',
        joint1: 'Articulación 1',
        joint2: 'Articulación 2',
        newTargetBtn: 'Nuevo objetivo',
        errorPlotLabel: 'Error de alineación después de cada movimiento',
        cableAlignmentError: 'Error de alineación actual',
        movesLabel: 'Movimientos',
        progressLabel: 'Mejora',
        coachStartTitle: 'Cambia una articulación cada vez',
        coachStartDesc: 'Haz un movimiento pequeño y utiliza el error para decidir si debes continuar o invertirlo.',
        coachImprovingTitle: 'El error ha disminuido',
        coachImprovingDesc: 'Continúa en esta dirección con pasos pequeños o prueba otra articulación.',
        coachWrongTitle: 'El error ha aumentado',
        coachWrongDesc: 'Invierte este movimiento y prueba otra articulación o dirección.',
        coachCloseTitle: 'Cerca del objetivo',
        coachCloseDesc: 'Usa movimientos pequeños de las articulaciones para reducir el error restante.',
        coachSuccessTitle: 'Objetivo alcanzado',
        coachSuccessDesc: 'Has encontrado una postura con la que el cable sigue el objetivo.',
        coachHintTitle: 'Estrategia: realiza un experimento controlado',
        coachHintDesc: 'Mueve un deslizador uno o dos pasos y conserva el cambio solo si el error disminuye.',
        coachSolutionTitle: 'Una postura solución factible',
        coachSolutionDesc: 'El objetivo se generó a partir de esta postura. Un controlador real no tiene acceso a ella y debe alcanzar el objetivo mediante realimentación.',
        takeawayLabel: 'Idea clave',
        takeawayTitle: 'En un objeto flexible, cada movimiento de una articulación afecta a toda la forma.',
        takeawayDesc: 'Has usado realimentación visual y ensayo y error. Un controlador autónomo tiene que estimar la misma relación entre el movimiento de las articulaciones y el cambio de forma, y actualizarla a medida que el objeto se deforma.',
        nextDemoBtn: 'Siguiente: similitud de forma →',
        legendTargetShape: 'Forma objetivo',
        legendCurrentShape: 'Forma actual',
        workspaceAria: 'Espacio de manipulación del cable',
        feedbackAria: 'Información sobre el rendimiento',
        canvasAria: 'Dos brazos robóticos manipulan un cable hacia una forma objetivo discontinua',
        plotAria: 'Historial del error de alineación tras cada movimiento; los valores bajos indican mejor alineación',
        errorAxisLabel: 'Error de alineación (px)',
        movesAxisLabel: 'Movimientos'
    }
};

// Language, theme and parent-page integration
let currentLanguage = localStorage.getItem('language') || 'en';
const isEmbedded = window.self !== window.top;

function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    applyTranslations();
    updateLanguageButtons();
    if (cable.length) {
        render();
        renderErrorPlot();
    }
    requestAnimationFrame(reportHeight);
}

function applyTranslations() {
    const t = translations[currentLanguage];
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            element.textContent = t[key];
        }
    });
    document.documentElement.lang = currentLanguage;
    document.querySelector('.language-switcher').setAttribute('aria-label', t.languageAria);
    document.querySelector('.workspace').setAttribute('aria-label', t.workspaceAria);
    document.querySelector('.metrics-column').setAttribute('aria-label', t.feedbackAria);
    document.getElementById('roboticsCanvas').setAttribute('aria-label', t.canvasAria);
    document.getElementById('errorPlot').setAttribute('aria-label', t.plotAria);
    updateConstraintStatus();
    renderCoach();
}

function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const isActive = btn.getAttribute('data-lang') === currentLanguage;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
    });
}

function setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') return;
    document.documentElement.dataset.theme = theme;
    if (!isEmbedded) localStorage.setItem('theme', theme);
    if (cable.length) {
        render();
        renderErrorPlot();
    }
    requestAnimationFrame(reportHeight);
}

let lastReportedHeight = 0;

function reportHeight() {
    if (!isEmbedded) return;
    const height = Math.ceil(document.querySelector('.demo-shell').getBoundingClientRect().height);
    if (Math.abs(height - lastReportedHeight) < 2) return;
    lastReportedHeight = height;
    window.parent.postMessage({
        type: 'demoHeight',
        demo: 'robotics',
        height
    }, window.location.protocol === 'file:' ? '*' : window.location.origin);
}

// Initialize i18n on page load
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    updateLanguageButtons();

    // Attach language button listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.getAttribute('data-lang'));
        });
    });
    const resizeObserver = new ResizeObserver(() => reportHeight());
    resizeObserver.observe(document.querySelector('.demo-shell'));
    reportHeight();
});

// Keep embedded preferences aligned with the portfolio page.
window.addEventListener('load', reportHeight);
// hidden panels get no rendering lifecycle, so poll for the moment
// this demo is finally laid out; reportHeight() ignores no-op changes
setInterval(reportHeight, 500);

window.addEventListener('message', (event) => {
    if (window.location.protocol !== 'file:' && event.origin !== window.location.origin) return;
    if (event.data?.type === 'setPreferences') {
        setLanguage(event.data.language);
        setTheme(event.data.theme);
    } else if (event.data?.type === 'setLanguage') {
        setLanguage(event.data.language);
    }
});

// Polyfill for rounded rectangles (for older browsers)
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
    };
}

const config = {
    numPoints: 19,
    segmentLength: 15,
    equilibriumIterations: 48,
    bendingStiffness: 1,
    link1Length: 90,
    link2Length: 90
};

// DOM elements
const canvas = document.getElementById('roboticsCanvas');
const ctx = canvas.getContext('2d');
const errorPlot = document.getElementById('errorPlot');
const errorPlotCtx = errorPlot.getContext('2d');
const errorDisplay = document.getElementById('errorDisplay');
const newTargetBtn = document.getElementById('newTargetBtn');
const movesDisplay = document.getElementById('movesDisplay');
const progressDisplay = document.getElementById('progressDisplay');
const coachStrip = document.getElementById('coachStrip');
const coachTitle = document.getElementById('coachTitle');
const coachText = document.getElementById('coachText');

// Error history for plotting
let errorHistory = [];
let errorSampleCount = 0;
let errorAxisMax = 100;
const maxHistoryLength = 240;
const errorPlotWindow = 40;

// State
let cable = [];
let rodAngles = [];
let target = [];

// Left robot
let robotBase = [150, 250];  // Robot base position (adjusted for 600px canvas)
let theta1 = -1.6;  // First link angle
let theta2 = 1;  // Second link angle

// Right robot
let robot2Base = [450, 250];  // Right robot base position (adjusted for 600px canvas)
let theta3 = 4.1;  // First link angle (pointing left)
let theta4 = -0.7;  // Second link angle

// Ghost robots (for target generation)
let theta1_ghost = -1.6;
let theta2_ghost = 1;
let theta3_ghost = 4.1;
let theta4_ghost = -0.7;

let rmsError = 0;
let rodAtLimit = false;
let activeJointIndex = -1;
let moveCount = 0;
let initialError = null;
let previousError = null;
let bestError = Infinity;
let coachTitleKey = 'coachStartTitle';
let coachTextKey = 'coachStartDesc';
let coachState = 'start';
let coachMark = '↗';
const SUCCESS_ERROR = 28;
const CLOSE_ERROR = 55;

function formatAngle(value) {
    return `${Math.round(value * 180 / Math.PI)}°`;
}

function renderCoach() {
    const words = translations[currentLanguage];
    coachStrip.dataset.state = coachState;
    coachStrip.querySelector('.coach-mark').textContent = coachMark;
    coachTitle.textContent = words[coachTitleKey];
    coachText.textContent = words[coachTextKey];
}

function setCoach(titleKey, textKey, state = 'start', mark = '↗') {
    coachTitleKey = titleKey;
    coachTextKey = textKey;
    coachState = state;
    coachMark = mark;
    renderCoach();
}

function resetChallengeStats() {
    moveCount = 0;
    initialError = null;
    previousError = null;
    bestError = Infinity;
    movesDisplay.textContent = '0';
    progressDisplay.textContent = '0%';
    setCoach('coachStartTitle', 'coachStartDesc');
}

function updateChallengeFeedback(fromUser) {
    if (!Number.isFinite(initialError)) initialError = Math.max(rmsError, 1);
    const before = previousError;
    if (fromUser) moveCount += 1;
    bestError = Math.min(bestError, rmsError);
    const progress = Math.max(0, Math.min(100, (initialError - rmsError) / initialError * 100));
    movesDisplay.textContent = String(moveCount);
    progressDisplay.textContent = `${Math.round(progress)}%`;

    if (rmsError <= SUCCESS_ERROR) {
        setCoach('coachSuccessTitle', 'coachSuccessDesc', 'success', '✓');
    } else if (rmsError <= CLOSE_ERROR) {
        setCoach('coachCloseTitle', 'coachCloseDesc', 'improving', '◎');
    } else if (fromUser && Number.isFinite(before) && rmsError < before - 0.2) {
        setCoach('coachImprovingTitle', 'coachImprovingDesc', 'improving', '↓');
    } else if (fromUser && Number.isFinite(before) && rmsError > before + 0.2) {
        setCoach('coachWrongTitle', 'coachWrongDesc', 'wrong', '↶');
    }
    previousError = rmsError;
}

function armPose(base, angle1, angle2) {
    const joint = [
        base[0] + config.link1Length * Math.cos(angle1),
        base[1] + config.link1Length * Math.sin(angle1)
    ];
    const end = [
        joint[0] + config.link2Length * Math.cos(angle1 + angle2),
        joint[1] + config.link2Length * Math.sin(angle1 + angle2)
    ];
    return { j0: [...base], j1: joint, j2: end };
}

function distanceBetween(a, b) {
    return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

function rodPoseFeasible(a1 = theta1, a2 = theta2, a3 = theta3, a4 = theta4) {
    const left = armPose(robotBase, a1, a2);
    const right = armPose(robot2Base, a3, a4);
    const tangentLeft = a1 + a2;
    const tangentRight = a3 + a4;
    const innerLeft = [
        left.j2[0] + config.segmentLength * Math.cos(tangentLeft),
        left.j2[1] + config.segmentLength * Math.sin(tangentLeft)
    ];
    const innerRight = [
        right.j2[0] - config.segmentLength * Math.cos(tangentRight),
        right.j2[1] - config.segmentLength * Math.sin(tangentRight)
    ];
    const totalLength = config.segmentLength * (config.numPoints - 1);
    const freeLength = config.segmentLength * (config.numPoints - 3);
    return distanceBetween(left.j2, right.j2) <= totalLength + 1e-6 &&
        distanceBetween(innerLeft, innerRight) <= freeLength + 1e-6;
}

function wrapAngle(angle) {
    return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function integrateRod(leftEnd, angles) {
    const points = [[leftEnd[0], leftEnd[1]]];
    for (const angle of angles) {
        const previous = points[points.length - 1];
        points.push([
            previous[0] + config.segmentLength * Math.cos(angle),
            previous[1] + config.segmentLength * Math.sin(angle)
        ]);
    }
    return points;
}

function bendingEnergy(angles) {
    let energy = 0;
    for (let i = 1; i < angles.length; i++) {
        const curvature = wrapAngle(angles[i] - angles[i - 1]);
        energy += 0.5 * config.bendingStiffness * curvature * curvature;
    }
    return energy;
}

function solveDenseSystem(matrix, rhs) {
    const size = rhs.length;
    const a = matrix.map((row, index) => [...row, rhs[index]]);

    for (let column = 0; column < size; column++) {
        let pivot = column;
        for (let row = column + 1; row < size; row++) {
            if (Math.abs(a[row][column]) > Math.abs(a[pivot][column])) pivot = row;
        }
        if (Math.abs(a[pivot][column]) < 1e-10) return null;
        [a[column], a[pivot]] = [a[pivot], a[column]];

        const inversePivot = 1 / a[column][column];
        for (let entry = column; entry <= size; entry++) a[column][entry] *= inversePivot;
        for (let row = 0; row < size; row++) {
            if (row === column) continue;
            const factor = a[row][column];
            if (Math.abs(factor) < 1e-14) continue;
            for (let entry = column; entry <= size; entry++) {
                a[row][entry] -= factor * a[column][entry];
            }
        }
    }
    return a.map(row => row[size]);
}

function initialRodAngles(leftEnd, rightEnd, leftAngle, rightAngle, bendDirection = 1) {
    const segmentCount = config.numPoints - 1;
    const internalCount = segmentCount - 2;
    const innerLeft = [
        leftEnd[0] + config.segmentLength * Math.cos(leftAngle),
        leftEnd[1] + config.segmentLength * Math.sin(leftAngle)
    ];
    const innerRight = [
        rightEnd[0] - config.segmentLength * Math.cos(rightAngle),
        rightEnd[1] - config.segmentLength * Math.sin(rightAngle)
    ];
    const chordAngle = Math.atan2(
        innerRight[1] - innerLeft[1],
        innerRight[0] - innerLeft[0]
    );
    const chord = distanceBetween(innerLeft, innerRight);
    const pairedCount = internalCount - internalCount % 2;
    const centreSegments = internalCount - pairedCount;
    const cosine = Math.max(-1, Math.min(1,
        (chord / config.segmentLength - centreSegments) / pairedCount));
    const opening = Math.acos(cosine);
    const angles = Array(segmentCount).fill(chordAngle);
    const half = pairedCount / 2;
    for (let index = 0; index < half; index++) {
        angles[index + 1] = chordAngle + bendDirection * opening;
    }
    for (let index = 0; index < half; index++) {
        angles[index + 1 + half + centreSegments] =
            chordAngle - bendDirection * opening;
    }
    angles[0] = leftAngle;
    angles[segmentCount - 1] = rightAngle;
    return angles;
}

function projectEndpointConstraint(angles, leftEnd, rightEnd, maxIterations = 8) {
    const last = angles.length - 1;
    for (let iteration = 0; iteration < maxIterations; iteration++) {
        const points = integrateRod(leftEnd, angles);
        const end = points[points.length - 1];
        const error = [end[0] - rightEnd[0], end[1] - rightEnd[1]];
        if (Math.hypot(...error) < 1e-7) return true;

        let xx = 0;
        let xy = 0;
        let yy = 0;
        const columns = [];
        for (let index = 1; index < last; index++) {
            const column = [
                -config.segmentLength * Math.sin(angles[index]),
                config.segmentLength * Math.cos(angles[index])
            ];
            columns.push(column);
            xx += column[0] * column[0];
            xy += column[0] * column[1];
            yy += column[1] * column[1];
        }
        const regularization = 1e-8;
        xx += regularization;
        yy += regularization;
        const determinant = xx * yy - xy * xy;
        if (Math.abs(determinant) < 1e-10) return false;
        const multiplierX = (yy * error[0] - xy * error[1]) / determinant;
        const multiplierY = (-xy * error[0] + xx * error[1]) / determinant;
        const correction = columns.map(column =>
            -(column[0] * multiplierX + column[1] * multiplierY));
        const largestCorrection = Math.max(...correction.map(Math.abs), 1e-9);
        const scale = Math.min(1, 0.45 / largestCorrection);
        for (let variable = 0; variable < correction.length; variable++) {
            angles[variable + 1] += scale * correction[variable];
        }
    }
    const points = integrateRod(leftEnd, angles);
    return distanceBetween(points[points.length - 1], rightEnd) < 1e-4;
}

// Quasi-static discrete Kirchhoff rod in SE(2). Each segment is a rigid
// transform of fixed translation length; the SQP step minimizes bending
// energy while enforcing the two endpoint-position constraints exactly.
function solveRodEquilibrium(
    leftEnd,
    rightEnd,
    leftAngle,
    rightAngle,
    warmStart = null,
    bendDirection = 1
) {
    const segmentCount = config.numPoints - 1;
    const variableCount = segmentCount - 2;
    const angles = warmStart?.length === segmentCount
        ? [...warmStart]
        : initialRodAngles(leftEnd, rightEnd, leftAngle, rightAngle, bendDirection);
    angles[0] = leftAngle;
    angles[segmentCount - 1] = rightAngle;
    projectEndpointConstraint(angles, leftEnd, rightEnd);

    let iterations = 0;
    for (; iterations < config.equilibriumIterations; iterations++) {
        const points = integrateRod(leftEnd, angles);
        const end = points[points.length - 1];
        const constraint = [end[0] - rightEnd[0], end[1] - rightEnd[1]];
        const residual = Math.hypot(...constraint);

        const gradient = Array(variableCount).fill(0);
        const hessian = Array.from({ length: variableCount }, () =>
            Array(variableCount).fill(0));
        const jacobian = [Array(variableCount).fill(0), Array(variableCount).fill(0)];

        for (let variable = 0; variable < variableCount; variable++) {
            const index = variable + 1;
            const previousCurvature = wrapAngle(angles[index] - angles[index - 1]);
            const nextCurvature = wrapAngle(angles[index + 1] - angles[index]);
            gradient[variable] = config.bendingStiffness *
                (previousCurvature - nextCurvature);
            hessian[variable][variable] = 2 * config.bendingStiffness + 1e-5;
            if (variable > 0) hessian[variable][variable - 1] = -config.bendingStiffness;
            if (variable < variableCount - 1) {
                hessian[variable][variable + 1] = -config.bendingStiffness;
            }
            jacobian[0][variable] = -config.segmentLength * Math.sin(angles[index]);
            jacobian[1][variable] = config.segmentLength * Math.cos(angles[index]);
        }

        if (residual < 1e-4 && Math.max(...gradient.map(Math.abs)) < 1e-4) break;

        const systemSize = variableCount + 2;
        const kkt = Array.from({ length: systemSize }, () => Array(systemSize).fill(0));
        const rhs = Array(systemSize).fill(0);
        for (let row = 0; row < variableCount; row++) {
            rhs[row] = -gradient[row];
            for (let column = 0; column < variableCount; column++) {
                kkt[row][column] = hessian[row][column];
            }
            kkt[row][variableCount] = jacobian[0][row];
            kkt[row][variableCount + 1] = jacobian[1][row];
            kkt[variableCount][row] = jacobian[0][row];
            kkt[variableCount + 1][row] = jacobian[1][row];
        }
        // Small compliance keeps the KKT solve well conditioned at the
        // fully straight, rank-deficient limiting configuration.
        kkt[variableCount][variableCount] = -1e-8;
        kkt[variableCount + 1][variableCount + 1] = -1e-8;
        rhs[variableCount] = -constraint[0];
        rhs[variableCount + 1] = -constraint[1];

        const solution = solveDenseSystem(kkt, rhs);
        if (!solution) break;
        const direction = solution.slice(0, variableCount);
        const largestStep = Math.max(...direction.map(Math.abs), 1e-9);
        if (residual < 1e-4 && largestStep < 1e-5) break;
        const stepLimit = Math.min(1, 0.65 / largestStep);
        const endpointPenalty = 4;
        const oldMerit = bendingEnergy(angles) + endpointPenalty * residual * residual;
        let accepted = false;

        for (let lineSearch = 0; lineSearch < 9; lineSearch++) {
            const scale = stepLimit * 0.5 ** lineSearch;
            const candidate = [...angles];
            for (let variable = 0; variable < variableCount; variable++) {
                candidate[variable + 1] += scale * direction[variable];
            }
            projectEndpointConstraint(candidate, leftEnd, rightEnd, 6);
            const candidatePoints = integrateRod(leftEnd, candidate);
            const candidateEnd = candidatePoints[candidatePoints.length - 1];
            const candidateResidual = distanceBetween(candidateEnd, rightEnd);
            const candidateMerit = bendingEnergy(candidate) +
                endpointPenalty * candidateResidual * candidateResidual;
            const closesEndpoint = residual > 1e-3 &&
                candidateResidual < residual * (1 - 0.04 * scale);
            if (candidateMerit < oldMerit || closesEndpoint || candidateResidual < 1e-5) {
                for (let i = 1; i < segmentCount - 1; i++) angles[i] = candidate[i];
                accepted = true;
                break;
            }
        }
        if (!accepted) break;
    };

    projectEndpointConstraint(angles, leftEnd, rightEnd, 10);
    const points = integrateRod(leftEnd, angles);
    const residual = distanceBetween(points[points.length - 1], rightEnd);
    return { points, angles, residual, iterations };
}

function solveStableRodEquilibrium(leftEnd, rightEnd, leftAngle, rightAngle, warmStart = null) {
    const candidates = [solveRodEquilibrium(
        leftEnd,
        rightEnd,
        leftAngle,
        rightAngle,
        warmStart
    )];
    if (candidates[0].residual <= 0.02) return candidates[0];

    if (warmStart) {
        candidates.push(solveRodEquilibrium(
            leftEnd,
            rightEnd,
            leftAngle,
            rightAngle,
            null,
            1
        ));
    }
    candidates.push(solveRodEquilibrium(
        leftEnd,
        rightEnd,
        leftAngle,
        rightAngle,
        null,
        -1
    ));
    return candidates.reduce((best, candidate) =>
        candidate.residual < best.residual ? candidate : best);
}

// Initialize the rod from the current clamped gripper poses.
function initCable() {
    const ee1 = getEndEffector();
    const ee2 = getEndEffector2();
    const equilibrium = solveStableRodEquilibrium(
        ee1.j2,
        ee2.j2,
        theta1 + theta2,
        theta3 + theta4
    );
    cable = equilibrium.points;
    rodAngles = equilibrium.angles;
}


// Get end effector position from joint angles
function getEndEffector() {
    return armPose(robotBase, theta1, theta2);
}

// Get end effector position for right robot
function getEndEffector2() {
    return armPose(robot2Base, theta3, theta4);
}

// Get ghost end effectors (for target generation)
function getGhostEndEffector1() {
    return armPose(robotBase, theta1_ghost, theta2_ghost).j2;
}

function getGhostEndEffector2() {
    return armPose(robot2Base, theta3_ghost, theta4_ghost).j2;
}

// Generate a target from a physically feasible clamped-rod pose.
function generateTarget() {
    let feasible = false;
    for (let attempt = 0; attempt < 80 && !feasible; attempt++) {
        theta1_ghost = -Math.random() * Math.PI / 2;
        theta2_ghost = -Math.PI / 2 + Math.random() * Math.PI;
        theta3_ghost = Math.PI + Math.random() * (4.45 - Math.PI);
        theta4_ghost = -Math.PI / 2 + Math.random() * Math.PI;
        feasible = rodPoseFeasible(theta1_ghost, theta2_ghost, theta3_ghost, theta4_ghost);
    }

    if (!feasible) {
        theta1_ghost = theta1;
        theta2_ghost = theta2;
        theta3_ghost = theta3;
        theta4_ghost = theta4;
    }

    const ghostEe1 = getGhostEndEffector1();
    const ghostEe2 = getGhostEndEffector2();
    const targetEquilibrium = solveStableRodEquilibrium(
        ghostEe1,
        ghostEe2,
        theta1_ghost + theta2_ghost,
        theta3_ghost + theta4_ghost
    );
    target = targetEquilibrium.points.map(point => [...point]);
}

// Recompute one static equilibrium. There is deliberately no time integrator:
// the rod cannot oscillate or accumulate numerical velocity between inputs.
function solveCable() {
    const ee1 = getEndEffector();
    const ee2 = getEndEffector2();
    const equilibrium = solveStableRodEquilibrium(
        ee1.j2,
        ee2.j2,
        theta1 + theta2,
        theta3 + theta4,
        rodAngles
    );
    cable = equilibrium.points;
    rodAngles = equilibrium.angles;
    return equilibrium;
}

// Calculate RMS error as averaged point-to-point error
function computeRmsError() {
    if (target.length === 0) return 0;
    let sumError = 0;
    for (let i = 0; i < cable.length; i++) {
        const dx = cable[i][0] - target[i][0];
        const dy = cable[i][1] - target[i][1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        sumError += dist;
    }
    return sumError / cable.length;  // Average point-to-point error
}

function canvasPalette() {
    const dark = document.documentElement.dataset.theme === 'dark';
    return dark ? {
        background: '#1a1d20',
        grid: '#2c3136',
        text: '#b2bac2',
        cable: '#7da4c3',
        target: '#8eb29a',
        error: '#d28b86'
    } : {
        background: '#fafbfb',
        grid: '#e9ecee',
        text: '#555e67',
        cable: '#4e789d',
        target: '#638b72',
        error: '#b5635e'
    };
}

// Render main robotics demo
function render() {
    const palette = canvasPalette();
    ctx.fillStyle = palette.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw target cable (bright green - clearly visible)
    if (target.length > 0) {
        ctx.strokeStyle = palette.target;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash([10, 8]);  // Dashed line with more spacing
        ctx.beginPath();
        ctx.moveTo(target[0][0], target[0][1]);
        for (let i = 1; i < target.length; i++) {
            ctx.lineTo(target[i][0], target[i][1]);
        }
        ctx.stroke();
        ctx.setLineDash([]);  // Reset line dash
    }

    // Draw actual cable (bold blue)
    ctx.strokeStyle = palette.cable;
    ctx.lineWidth = 8;  // Larger cable
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(cable[0][0], cable[0][1]);
    for (let i = 1; i < cable.length; i++) {
        ctx.lineTo(cable[i][0], cable[i][1]);
    }
    ctx.stroke();

    // Draw cable points (small dots - less visible)
    ctx.fillStyle = palette.cable;
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < cable.length; i++) {
        ctx.beginPath();
        ctx.arc(cable[i][0], cable[i][1], 2, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Draw left robot arm
    const ee1 = getEndEffector();

    // Draw robot base with gradient
    const baseGradient1 = ctx.createLinearGradient(ee1.j0[0] - 25, ee1.j0[1] - 8, ee1.j0[0] - 25, ee1.j0[1] + 8);
    baseGradient1.addColorStop(0, '#2a2a2a');
    baseGradient1.addColorStop(0.5, '#1a1a1a');
    baseGradient1.addColorStop(1, '#0f0f0f');
    ctx.fillStyle = baseGradient1;
    ctx.fillRect(ee1.j0[0] - 25, ee1.j0[1] - 8, 50, 16);

    // Base outline
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.strokeRect(ee1.j0[0] - 25, ee1.j0[1] - 8, 50, 16);

    // Draw links with metallic gradient effect
    for (let i = 0; i < 2; i++) {
        const start = i === 0 ? ee1.j0 : ee1.j1;
        const end = i === 0 ? ee1.j1 : ee1.j2;

        // Shadow
        ctx.strokeStyle = 'rgba(44, 62, 80, 0.15)';
        ctx.lineWidth = 18;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(start[0] + 2, start[1] + 2);
        ctx.lineTo(end[0] + 2, end[1] + 2);
        ctx.stroke();

        // Gradient for metallic look
        const linkGradient = ctx.createLinearGradient(
            start[0], start[1] - 8,
            start[0], start[1] + 8
        );
        linkGradient.addColorStop(0, '#3d5a6b');
        linkGradient.addColorStop(0.5, '#2c3e50');
        linkGradient.addColorStop(1, '#1a252e');
        ctx.strokeStyle = linkGradient;
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
    }

    // Draw joints with radial gradient (3D effect)
    for (let j of [ee1.j0, ee1.j1]) {
        // Outer shadow
        const shadowGradient = ctx.createRadialGradient(j[0], j[1], 0, j[0], j[1], 12);
        shadowGradient.addColorStop(0, 'rgba(52, 73, 94, 0)');
        shadowGradient.addColorStop(0.8, 'rgba(52, 73, 94, 0)');
        shadowGradient.addColorStop(1, 'rgba(52, 73, 94, 0.3)');
        ctx.fillStyle = shadowGradient;
        ctx.beginPath();
        ctx.arc(j[0], j[1], 12, 0, Math.PI * 2);
        ctx.fill();

        // Joint with radial gradient
        const jointGradient = ctx.createRadialGradient(j[0] - 2, j[1] - 2, 0, j[0], j[1], 10);
        jointGradient.addColorStop(0, '#4a6278');
        jointGradient.addColorStop(0.7, '#34495e');
        jointGradient.addColorStop(1, '#2c3e50');
        ctx.fillStyle = jointGradient;
        ctx.beginPath();
        ctx.arc(j[0], j[1], 10, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(j[0] - 2, j[1] - 2, 3, 0, Math.PI * 2);
        ctx.fill();

        // Center bolt
        ctx.fillStyle = '#1a252e';
        ctx.beginPath();
        ctx.arc(j[0], j[1], 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw parallel jaw gripper (more realistic)
    const gripperAngle = theta1 + theta2;
    const gripperWidth = 18;
    const jawLength = 12;
    const jawWidth = 4;

    // Gripper base (small connecting piece)
    ctx.fillStyle = '#34495e';
    ctx.beginPath();
    ctx.arc(ee1.j2[0], ee1.j2[1], 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw two parallel jaws
    for (let side of [-1, 1]) {
        const perpAngle = gripperAngle + Math.PI / 2;
        const jawBaseX = ee1.j2[0] + side * (gripperWidth / 2) * Math.cos(perpAngle);
        const jawBaseY = ee1.j2[1] + side * (gripperWidth / 2) * Math.sin(perpAngle);

        // Jaw with gradient
        const jawGradient = ctx.createLinearGradient(
            jawBaseX, jawBaseY - jawWidth / 2,
            jawBaseX, jawBaseY + jawWidth / 2
        );
        jawGradient.addColorStop(0, '#4a6278');
        jawGradient.addColorStop(0.5, '#34495e');
        jawGradient.addColorStop(1, '#2c3e50');

        ctx.save();
        ctx.translate(jawBaseX, jawBaseY);
        ctx.rotate(gripperAngle);
        ctx.fillStyle = jawGradient;
        ctx.fillRect(0, -jawWidth / 2, jawLength, jawWidth);
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, -jawWidth / 2, jawLength, jawWidth);
        ctx.restore();
    }

    // Draw right robot arm (mirror)
    const ee2 = getEndEffector2();

    // Draw robot base with gradient
    const baseGradient2 = ctx.createLinearGradient(ee2.j0[0] - 25, ee2.j0[1] - 8, ee2.j0[0] - 25, ee2.j0[1] + 8);
    baseGradient2.addColorStop(0, '#2a2a2a');
    baseGradient2.addColorStop(0.5, '#1a1a1a');
    baseGradient2.addColorStop(1, '#0f0f0f');
    ctx.fillStyle = baseGradient2;
    ctx.fillRect(ee2.j0[0] - 25, ee2.j0[1] - 8, 50, 16);

    // Base outline
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 2;
    ctx.strokeRect(ee2.j0[0] - 25, ee2.j0[1] - 8, 50, 16);

    // Draw links with metallic gradient effect
    for (let i = 0; i < 2; i++) {
        const start = i === 0 ? ee2.j0 : ee2.j1;
        const end = i === 0 ? ee2.j1 : ee2.j2;

        // Shadow
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.15)';
        ctx.lineWidth = 18;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(start[0] + 2, start[1] + 2);
        ctx.lineTo(end[0] + 2, end[1] + 2);
        ctx.stroke();

        // Gradient for metallic look
        const linkGradient = ctx.createLinearGradient(
            start[0], start[1] - 8,
            start[0], start[1] + 8
        );
        linkGradient.addColorStop(0, '#a0653a');
        linkGradient.addColorStop(0.5, '#8b4513');
        linkGradient.addColorStop(1, '#6b3410');
        ctx.strokeStyle = linkGradient;
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
    }

    // Draw joints with radial gradient (3D effect)
    for (let j of [ee2.j0, ee2.j1]) {
        // Outer shadow
        const shadowGradient = ctx.createRadialGradient(j[0], j[1], 0, j[0], j[1], 12);
        shadowGradient.addColorStop(0, 'rgba(101, 67, 33, 0)');
        shadowGradient.addColorStop(0.8, 'rgba(101, 67, 33, 0)');
        shadowGradient.addColorStop(1, 'rgba(101, 67, 33, 0.3)');
        ctx.fillStyle = shadowGradient;
        ctx.beginPath();
        ctx.arc(j[0], j[1], 12, 0, Math.PI * 2);
        ctx.fill();

        // Joint with radial gradient
        const jointGradient = ctx.createRadialGradient(j[0] - 2, j[1] - 2, 0, j[0], j[1], 10);
        jointGradient.addColorStop(0, '#8b6239');
        jointGradient.addColorStop(0.7, '#654321');
        jointGradient.addColorStop(1, '#4a2f18');
        ctx.fillStyle = jointGradient;
        ctx.beginPath();
        ctx.arc(j[0], j[1], 10, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(j[0] - 2, j[1] - 2, 3, 0, Math.PI * 2);
        ctx.fill();

        // Center bolt
        ctx.fillStyle = '#3a2410';
        ctx.beginPath();
        ctx.arc(j[0], j[1], 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw parallel jaw gripper (more realistic)
    const gripperAngle2 = theta3 + theta4;
    const gripperWidth2 = 18;
    const jawLength2 = 12;
    const jawWidth2 = 4;

    // Gripper base (small connecting piece)
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.arc(ee2.j2[0], ee2.j2[1], 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw two parallel jaws
    for (let side of [-1, 1]) {
        const perpAngle = gripperAngle2 + Math.PI / 2;
        const jawBaseX = ee2.j2[0] + side * (gripperWidth2 / 2) * Math.cos(perpAngle);
        const jawBaseY = ee2.j2[1] + side * (gripperWidth2 / 2) * Math.sin(perpAngle);

        // Jaw with gradient
        const jawGradient = ctx.createLinearGradient(
            jawBaseX, jawBaseY - jawWidth2 / 2,
            jawBaseX, jawBaseY + jawWidth2 / 2
        );
        jawGradient.addColorStop(0, '#8b6239');
        jawGradient.addColorStop(0.5, '#654321');
        jawGradient.addColorStop(1, '#4a2f18');

        ctx.save();
        ctx.translate(jawBaseX, jawBaseY);
        ctx.rotate(gripperAngle2);
        ctx.fillStyle = jawGradient;
        ctx.fillRect(0, -jawWidth2 / 2, jawLength2, jawWidth2);
        ctx.strokeStyle = '#4a2f18';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, -jawWidth2 / 2, jawLength2, jawWidth2);
        ctx.restore();
    }

    if (activeJointIndex >= 0) {
        const activePoints = [ee1.j0, ee1.j1, ee2.j0, ee2.j1];
        const activePoint = activePoints[activeJointIndex];
        ctx.save();
        ctx.strokeStyle = palette.target;
        ctx.fillStyle = palette.target;
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.arc(activePoint[0], activePoint[1], 18, 0, Math.PI * 2);
        ctx.globalAlpha = 0.12;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.stroke();
        ctx.restore();
    }

    // Draw legend in top-left corner
    const legendX = 10;
    const legendY = 10;
    const lineLength = 30;
    const lineSpacing = 20;

    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // Green dashed line (target shape)
    ctx.strokeStyle = palette.target;
    ctx.lineWidth = 4;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(legendX, legendY);
    ctx.lineTo(legendX + lineLength, legendY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = palette.text;
    ctx.fillText(translations[currentLanguage].legendTargetShape, legendX + lineLength + 8, legendY);

    // Blue solid line (current shape)
    ctx.strokeStyle = palette.cable;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(legendX, legendY + lineSpacing);
    ctx.lineTo(legendX + lineLength, legendY + lineSpacing);
    ctx.stroke();
    ctx.fillStyle = palette.text;
    ctx.fillText(translations[currentLanguage].legendCurrentShape, legendX + lineLength + 8, legendY + lineSpacing);
}

// Render error plot
function renderErrorPlot() {
    const palette = canvasPalette();
    const plotWidth = errorPlot.width;
    const plotHeight = errorPlot.height;
    const words = translations[currentLanguage];
    const pad = { left: 58, right: 12, top: 12, bottom: 40 };
    const graphWidth = plotWidth - pad.left - pad.right;
    const graphHeight = plotHeight - pad.top - pad.bottom;
    const xEnd = Math.max(errorPlotWindow - 1, errorSampleCount - 1);
    const xStart = xEnd - (errorPlotWindow - 1);
    const firstStoredMove = errorSampleCount - errorHistory.length;
    const xOf = (move) => pad.left + (move - xStart) / (xEnd - xStart) * graphWidth;
    const yOf = (error) => pad.top + graphHeight - Math.min(error, errorAxisMax) / errorAxisMax * graphHeight;

    // Clear plot
    errorPlotCtx.fillStyle = palette.background;
    errorPlotCtx.fillRect(0, 0, plotWidth, plotHeight);

    // Draw grid lines
    errorPlotCtx.strokeStyle = palette.grid;
    errorPlotCtx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = pad.top + (graphHeight / 5) * i;
        errorPlotCtx.beginPath();
        errorPlotCtx.moveTo(pad.left, y);
        errorPlotCtx.lineTo(pad.left + graphWidth, y);
        errorPlotCtx.stroke();
    }

    // Draw error line
    if (errorHistory.length > 1) {
        errorPlotCtx.strokeStyle = palette.error;
        errorPlotCtx.lineWidth = 2;
        errorPlotCtx.lineCap = 'round';
        errorPlotCtx.lineJoin = 'round';

        errorPlotCtx.save();
        errorPlotCtx.beginPath();
        errorPlotCtx.rect(pad.left, pad.top, graphWidth, graphHeight);
        errorPlotCtx.clip();
        errorPlotCtx.beginPath();
        let started = false;
        for (let i = 0; i < errorHistory.length; i++) {
            const move = firstStoredMove + i;
            if (move < xStart) continue;
            const x = xOf(move);
            const y = yOf(errorHistory[i]);
            if (!started) {
                errorPlotCtx.moveTo(x, y);
                started = true;
            } else {
                errorPlotCtx.lineTo(x, y);
            }
        }
        errorPlotCtx.stroke();
        errorPlotCtx.restore();
    }

    // Draw axis labels
    errorPlotCtx.fillStyle = palette.text;
    errorPlotCtx.font = '11px sans-serif';

    // Y-axis scale values
    errorPlotCtx.font = '9px sans-serif';
    errorPlotCtx.textAlign = 'right';
    errorPlotCtx.textBaseline = 'middle';
    for (let i = 0; i <= 5; i++) {
        const y = pad.top + (graphHeight / 5) * i;
        const value = errorAxisMax - (errorAxisMax / 5) * i;
        errorPlotCtx.fillText(value.toFixed(0), pad.left - 6, y);
    }

    errorPlotCtx.textBaseline = 'top';
    for (let i = 0; i <= 2; i++) {
        const ratio = i / 2;
        errorPlotCtx.textAlign = i === 0 ? 'left' : i === 2 ? 'right' : 'center';
        errorPlotCtx.fillText(String(Math.round(xStart + ratio * (xEnd - xStart))), pad.left + ratio * graphWidth, pad.top + graphHeight + 5);
    }

    errorPlotCtx.font = '600 10px sans-serif';
    errorPlotCtx.textAlign = 'center';
    errorPlotCtx.fillText(words.movesAxisLabel, pad.left + graphWidth / 2, plotHeight - 13);
    errorPlotCtx.save();
    errorPlotCtx.translate(11, pad.top + graphHeight / 2);
    errorPlotCtx.rotate(-Math.PI / 2);
    errorPlotCtx.fillText(words.errorAxisLabel, 0, 0);
    errorPlotCtx.restore();
}

function updateSimulation({ record = true, fromUser = false } = {}) {
    const equilibrium = solveCable();
    rmsError = computeRmsError();
    if (record) {
        if (errorHistory.length === 0) {
            errorAxisMax = Math.ceil(Math.max(rmsError * 1.25, 50) / 25) * 25;
        } else if (rmsError > errorAxisMax) {
            errorAxisMax = Math.ceil(rmsError * 1.1 / 25) * 25;
        }
        errorHistory.push(rmsError);
        errorSampleCount += 1;
        if (errorHistory.length > maxHistoryLength) errorHistory.shift();
    }
    errorDisplay.textContent = rmsError.toFixed(2);
    updateChallengeFeedback(fromUser);
    render();
    renderErrorPlot();
    return equilibrium;
}

// Slider controls
const theta1Slider = document.getElementById('theta1Slider');
const theta2Slider = document.getElementById('theta2Slider');
const theta3Slider = document.getElementById('theta3Slider');
const theta4Slider = document.getElementById('theta4Slider');

const theta1Value = document.getElementById('theta1Value');
const theta2Value = document.getElementById('theta2Value');
const theta3Value = document.getElementById('theta3Value');
const theta4Value = document.getElementById('theta4Value');
const constraintState = document.getElementById('constraintState');
const constraintStatus = document.getElementById('constraintStatus');
let batchUpdating = false;

const jointControls = [
    { slider: theta1Slider, output: theta1Value, read: () => theta1, update: value => { theta1 = value; } },
    { slider: theta2Slider, output: theta2Value, read: () => theta2, update: value => { theta2 = value; } },
    { slider: theta3Slider, output: theta3Value, read: () => theta3, update: value => { theta3 = value; } },
    { slider: theta4Slider, output: theta4Value, read: () => theta4, update: value => { theta4 = value; } }
];

function updateConstraintStatus() {
    if (!constraintState || !constraintStatus) return;
    const key = rodAtLimit ? 'straightLimitState' : 'flexibleState';
    constraintState.dataset.limit = String(rodAtLimit);
    constraintStatus.dataset.i18n = key;
    constraintStatus.textContent = translations[currentLanguage][key];
}

jointControls.forEach(({ slider, output, read, update }, index) => {
    slider.addEventListener('focus', () => {
        activeJointIndex = index;
        slider.closest('.slider-row')?.classList.add('active');
        render();
    });
    slider.addEventListener('blur', () => {
        activeJointIndex = -1;
        slider.closest('.slider-row')?.classList.remove('active');
        render();
    });
    slider.addEventListener('input', () => {
        const requested = Number.parseFloat(slider.value);
        const previous = read();
        update(requested);

        let accepted = requested;
        rodAtLimit = !rodPoseFeasible();
        if (rodAtLimit) {
            update(previous);
            let feasibleFraction = 0;
            let blockedFraction = 1;
            for (let iteration = 0; iteration < 20; iteration++) {
                const fraction = (feasibleFraction + blockedFraction) * 0.5;
                const candidate = previous + (requested - previous) * fraction;
                update(candidate);
                if (rodPoseFeasible()) {
                    accepted = candidate;
                    feasibleFraction = fraction;
                } else {
                    blockedFraction = fraction;
                }
            }
            update(accepted);
        }

        slider.value = accepted;
        output.value = formatAngle(accepted);
        updateConstraintStatus();
        if (!batchUpdating) updateSimulation({ fromUser: true });
    });
});

function resetPose() {
    const initialValues = [-1.6, 1, 4.1, -0.7];
    batchUpdating = true;
    jointControls.forEach(({ slider }, index) => {
        slider.value = initialValues[index];
        slider.dispatchEvent(new Event('input', { bubbles: true }));
    });
    batchUpdating = false;
    rodAtLimit = false;
    updateConstraintStatus();
    errorHistory.length = 0;
    errorSampleCount = 0;
    resetChallengeStats();
    updateSimulation();
}

document.getElementById('resetPoseBtn').addEventListener('click', resetPose);
newTargetBtn.addEventListener('click', () => {
    generateTarget();
    errorHistory.length = 0;
    errorSampleCount = 0;
    resetChallengeStats();
    updateSimulation();
});

document.getElementById('hintBtn').addEventListener('click', () => {
    setCoach('coachHintTitle', 'coachHintDesc', 'start', '↔');
    theta1Slider.focus();
});

document.getElementById('autopilotBtn').addEventListener('click', () => {
    const button = document.getElementById('autopilotBtn');
    const start = jointControls.map(({ read }) => read());
    const goal = [theta1_ghost, theta2_ghost, theta3_ghost, theta4_ghost];
    const startedAt = performance.now();
    const duration = 900;
    button.disabled = true;
    batchUpdating = true;

    function animateSolution(now) {
        const linear = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - linear, 3);
        jointControls.forEach(({ slider, output, update }, index) => {
            const value = start[index] + (goal[index] - start[index]) * eased;
            update(value);
            slider.value = value;
            output.value = formatAngle(value);
        });
        rodAtLimit = false;
        updateConstraintStatus();
        updateSimulation({ record: false });
        if (linear < 1) {
            requestAnimationFrame(animateSolution);
            return;
        }
        batchUpdating = false;
        button.disabled = false;
        errorHistory.push(rmsError);
        renderErrorPlot();
        setCoach('coachSolutionTitle', 'coachSolutionDesc', 'success', '✓');
    }

    requestAnimationFrame(animateSolution);
});

document.getElementById('nextDemoBtn').addEventListener('click', () => {
    if (isEmbedded) {
        window.parent.postMessage(
            { type: 'demoNavigate', target: 'demo-shape-compare' },
            window.location.protocol === 'file:' ? '*' : window.location.origin
        );
    } else {
        window.location.href = '../../games/shape-comparison/';
    }
});

// Initialize once. Further equilibrium solves are driven only by input.
initCable();
generateTarget();
resetChallengeStats();
jointControls.forEach(({ output, read }) => { output.value = formatAngle(read()); });
updateSimulation();
