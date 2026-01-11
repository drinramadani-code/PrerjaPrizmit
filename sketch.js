// PRERJA E PRIZMIT ME RRAFSHIN

var perpjesa, yOfset, xOfset;
let A, B, C, D, R, prizmi, prizmi1; // koordinatat x, y, z

// Inputet nga HTML
var rX = document.getElementById('rX');
var rY = document.getElementById('rY');
var rZ = document.getElementById('rZ');

var aX = document.getElementById('aX');
var aY = document.getElementById('aY');

var bX = document.getElementById('bX');
var bY = document.getElementById('bY');

var cX = document.getElementById('cX');
var cY = document.getElementById('cY');

var dX = document.getElementById('dX');
var dY = document.getElementById('dY');

var a1X = document.getElementById('a1X');
var a1Y = document.getElementById('a1Y');
var a1Z = document.getElementById('a1Z');

// Shtojmë event listener për të rinisur skenën sa herë ndryshojnë inputet
[rX, rY, rZ, aX, aY, bX, bY, cX, cY, dX, dY, a1X, a1Y, a1Z].forEach(inp => {
  inp.addEventListener('input', rindertoSkenen);
});

// Funksioni për prerjen vertikale
function prerjeVertikale(x0, P, Q) {
  if (x0 < min(P.x, Q.x) || x0 > max(P.x, Q.x)) return null;
  if (P.x === Q.x) return null;

  let t = (x0 - P.x) / (Q.x - P.x);
  if (t < 0 || t > 1) return null;

  return {
    x: x0,
    y: P.y + t * (Q.y - P.y)
  };
}

// Funksioni për prerjen e segmentit me segmentin tjetër
function prerjeSegment(P, Q, A, B) {
  let den =
    (P.x - Q.x) * (A.y - B.y) -
    (P.y - Q.y) * (A.x - B.x);

  if (abs(den) < 1e-6) return null;

  let t =
    ((P.x - A.x) * (A.y - B.y) -
     (P.y - A.y) * (A.x - B.x)) / den;

  let u =
    ((P.x - A.x) * (P.y - Q.y) -
     (P.y - A.y) * (P.x - Q.x)) / den;

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: P.x + t * (Q.x - P.x),
      y: P.y + t * (Q.y - P.y)
    };
  }
  return null;
}

function setup() {
  frameRate(1);
  createCanvas(800, 800);

  perpjesa = 40;
  xOfset = perpjesa * 2;
  yOfset = height / 2;

  rindertoSkenen();
}

function draw() {
  background(255);

  vizatoBoshtin(perpjesa, xOfset, yOfset);
  translate(xOfset, yOfset);

  vizatoRrafshin();

  let pikatPrekje = [];

  for (let i = 0; i < prizmi.length; i++) {
    stroke(0);
    strokeWeight(0.9);
    let shkronjat = ['A', 'B', 'C', 'D'];

    text(shkronjat[i] + "'", prizmi[i].ap.x - 10, prizmi[i].ap.y - 5);
    text(shkronjat[i] + "1'", prizmi1[i].x - 10, prizmi1[i].y - 5);
    text(shkronjat[i] + "1''", prizmi1[i].pp.x - 10, prizmi1[i].pp.y - 5);
    text(shkronjat[i] + "''", prizmi[i].app.x - 10, prizmi[i].app.y - 5);

    // Pikat origjinale
    stroke('green');
    strokeWeight(6);
    point(prizmi[i].ap.x, prizmi[i].ap.y);
    point(prizmi[i].app.x, prizmi[i].app.y);
    point(prizmi1[i].x, prizmi1[i].y);
    point(prizmi1[i].pp.x, prizmi1[i].pp.y);

    // Vija origjinale e prismës
    strokeWeight(1);
    stroke(0);
    line(prizmi1[i].pp.x, prizmi1[i].pp.y, prizmi[i].app.x, prizmi[i].app.y);

    // Projektimi vertikal
    if (prizmi[i].r) {
      stroke('limegreen');
      line(prizmi[i].app.x, prizmi[i].app.y, prizmi[i].r.x, prizmi[i].r.y);
      point(prizmi[i].r.x, prizmi[i].r.y);
    }

    // Projektimi i pjerrët
    if (prizmi[i].r2) {
      stroke('limegreen');
      line(prizmi1[i].pp.x, prizmi1[i].pp.y, prizmi[i].r2.x, prizmi[i].r2.y);
      strokeWeight(6);
      point(prizmi[i].r2.x, prizmi[i].r2.y);

      // Lidhja me rrafshin
      strokeWeight(1);
      line(prizmi[i].r2.x, prizmi[i].r2.y, prizmi[i].r2.x, 0);
      line(prizmi[i].r2.x, 0, prizmi[i].r.x, prizmi[i].r.y);
    }

    // Segmentet e kuqe për prerje
    let E1 = prizmi[i].ap;
    let E2 = prizmi1[i]; 

    if (prizmi[i].r && prizmi[i].r2) {
      let G1a = { x: prizmi[i].r2.x, y: prizmi[i].r2.y };
      let G1b = { x: prizmi[i].r2.x, y: 0 };

      let G2a = { x: prizmi[i].r2.x, y: 0 };
      let G2b = { x: prizmi[i].r.x, y: prizmi[i].r.y };

      let o1 = prerjeSegment(G1a, G1b, E1, E2);
      let o2 = prerjeSegment(G2a, G2b, E1, E2);

      stroke('red');
      strokeWeight(6);
      if (o1) {
        point(o1.x, o1.y);
        pikatPrekje.push(o1);
      }
      if (o2) {
        point(o2.x, o2.y);
        pikatPrekje.push(o2);
      }
    }

    // Shtresa e kuqe e lartë
    stroke('red');
    fill(255, 0, 0, 40);
    if (pikatPrekje.length === 4) {
      strokeWeight(3);
      quad(
        pikatPrekje[0].x, pikatPrekje[0].y,
        pikatPrekje[1].x, pikatPrekje[1].y,
        pikatPrekje[2].x, pikatPrekje[2].y,
        pikatPrekje[3].x, pikatPrekje[3].y
      );
    }

    // Projektimi vertikal i kuq
    stroke('purple');
    strokeWeight(2);
    let projeksioni2 = [];
    for (let i = 0; i < pikatPrekje.length; i++) {
      let O = pikatPrekje[i];
      let P = prizmi1[i].pp;
      let Q = prizmi[i].app;

      let hit = prerjeVertikale(O.x, P, Q);

      if (hit && hit.y < O.y) {
        strokeWeight(1);
        stroke('red');
        line(O.x, O.y, hit.x, hit.y);

        strokeWeight(6);
        point(hit.x, hit.y);
        projeksioni2.push({ x: hit.x, y: hit.y });
      }
    }

    if (projeksioni2.length >= 4) {
      strokeWeight(3);
      quad(
        projeksioni2[0].x, projeksioni2[0].y,
        projeksioni2[1].x, projeksioni2[1].y,
        projeksioni2[2].x, projeksioni2[2].y,
        projeksioni2[3].x, projeksioni2[3].y
      );
    }
  }

  // Vizato skelën e prismës
  strokeWeight(1);
  stroke(0);
  fill(255, 255, 255, 0);

  // Kufijtë e prismës
  line(A1.pp.x, A1.pp.y, C1.pp.x, C1.pp.y);

  quad(A.ap.x, A.ap.y, B.ap.x, B.ap.y, C.ap.x, C.ap.y, D.ap.x, D.ap.y);
  line(A.ap.x, A.ap.y, A1.x, A1.y);
  line(B.ap.x, B.ap.y, B1.x, B1.y);
  line(C.ap.x, C.ap.y, C1.x, C1.y);
  line(D.ap.x, D.ap.y, D1.x, D1.y);

  quad(A1.x, A1.y, B1.x, B1.y, C1.x, C1.y, D1.x, D1.y);
}

// Vizato rrafshin bazë
function vizatoRrafshin() {
  stroke('blue');
  strokeWeight(3);
  fill(255, 255, 255, 0);
  triangle(0, -R.z * perpjesa, R.x * perpjesa, 0, 0, R.y * perpjesa);
  
  stroke('blue');
  strokeWeight(.7);
  text('Rz', -25, -R.z * perpjesa + 2.5); // RZ
  text('Rx', R.x * perpjesa - 10, -10); // RX
  text('Ry', -25, R.y * perpjesa + 2.5); // RZ
}

// Vizato boshtet
function vizatoBoshtin(d, x, y) {
  stroke(0);
  strokeWeight(1);
  line(0, yOfset, 1000, yOfset);
  line(xOfset, 0, xOfset, 1000);

  for (let i = 0; i <= height; i++) {
    line(xOfset - 5, i * d + d, xOfset + 5, i * d + d);
  }
  for (let i = 0; i <= width; i++) {
    line(i * d + d, yOfset - 5, i * d + d, yOfset + 5);
  }
}

// Rindërto skenën bazuar në inputet
function rindertoSkenen() {
  R = {
    x: Number(rX.value),
    y: Number(rY.value),
    z: Number(rZ.value)
  };

  A = { x: Number(aX.value), y: Number(aY.value) };
  B = { x: Number(bX.value), y: Number(bY.value) };
  C = { x: Number(cX.value), y: Number(cY.value) };
  D = { x: Number(dX.value), y: Number(dY.value) };
  A1 = { x: Number(a1X.value), y: Number(a1Y.value), z: Number(a1Z.value) };

  prizmi = [A, B, C, D, A1];

  for (let pika of prizmi) {
    pika.ap = { x: pika.x * perpjesa, y: pika.y * perpjesa };
    pika.app = { x: pika.x * perpjesa, y: 0 };
    pika.r = null;
    pika.r2 = null;
  }
  prizmi.pop();

  A1.x *= perpjesa;
  A1.y *= perpjesa;
  A1.z *= perpjesa;

  B1 = { x: B.ap.x + (A1.x - A.ap.x), y: B.ap.y + (A1.y - A.ap.y) };
  C1 = { x: C.ap.x + (A1.x - A.ap.x), y: C.ap.y + (A1.y - A.ap.y) };
  D1 = { x: D.ap.x + (A1.x - A.ap.x), y: D.ap.y + (A1.y - A.ap.y) };

  prizmi1 = [A1, B1, C1, D1];

  let referenca = A1.z;
  for (let pika of prizmi1) {
    pika.pp = { x: pika.x, y: -referenca };
  }

  // Rrafshi bazuar në R
  let T1 = { x: 0, y: -R.z * perpjesa };
  let T2 = { x: R.x * perpjesa, y: 0 };
  let T3 = { x: 0, y: R.y * perpjesa };

  // Prekje vertikale
  for (let pika of prizmi) {
    let x0 = pika.app.x;
    let prekje = [];

    let h1 = prerjeVertikale(x0, T1, T2);
    let h2 = prerjeVertikale(x0, T2, T3);
    let h3 = prerjeVertikale(x0, T3, T1);

    if (h1) prekje.push(h1);
    if (h2) prekje.push(h2);
    if (h3) prekje.push(h3);

    if (prekje.length) {
      prekje.sort((a, b) => b.y - a.y);
      pika.r = prekje[0];
    }
  }

  // Prekje pjerrëse
  for (let i = 0; i < prizmi.length; i++) {
    let P = prizmi1[i].pp;
    let Q = prizmi[i].app;

    prizmi[i].r2 =
      prerjeSegment(P, Q, T1, T2) ||
      prerjeSegment(P, Q, T2, T3) ||
      prerjeSegment(P, Q, T3, T1);
  }
}
