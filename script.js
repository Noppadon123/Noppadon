const gaugesState = {
  speedometer: 0,
  tachometer: 0,
  tempGauge: 0,
  tpsGauge: 0,
  batteryGauge: 0,
};

const maxValues = {
  speedometer: 160,
  tachometer: 10000,
  tempGauge: 120,
  tpsGauge: 100,
  batteryGauge: 100,
};

function drawGauge(canvasId, value, maxValue, label, unit) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = Math.min(cx, cy) - 15;
  const startAngle = 0.75 * Math.PI;
  const endAngle = 2.25 * Math.PI;
  const angleRange = endAngle - startAngle;
  const angle = startAngle + (value / maxValue) * angleRange;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background arc
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle, false);
  ctx.lineWidth = 15;
  ctx.strokeStyle = '#4a1500';
  ctx.shadowColor = 'rgba(255, 140, 0, 0.8)';
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Filled arc
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, angle, false);
  ctx.lineWidth = 15;
  ctx.strokeStyle = 'orange';
  ctx.shadowColor = 'orange';
  ctx.shadowBlur = 14;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Needle (red)
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#ff0000';
  ctx.shadowColor = '#ff0000';
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Center circle
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffcc33';
  ctx.shadowColor = '#ffcc33';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Label text
  ctx.font = 'bold 18px Arial';
  ctx.fillStyle = '#ffbb33';
  ctx.textAlign = 'center';
  ctx.fillText(label, cx, cy - 25);

  // Value text
  ctx.font = 'bold 34px Arial';
  ctx.fillStyle = '#fff1b8';
  ctx.fillText(`${Math.floor(value)} ${unit}`, cx, cy + 50);
}

function animateGauges(timestamp = 0) {
  const speedStep = 0.4;
  const rpmStep = 25;
  const tempStep = 0.15;
  const tpsStep = 0.3;
  const batteryStep = 0.2;

  gaugesState.speedometer += speedStep;
  if (gaugesState.speedometer > maxValues.speedometer) gaugesState.speedometer = 0;

  gaugesState.tachometer += rpmStep;
  if (gaugesState.tachometer > maxValues.tachometer) gaugesState.tachometer = 0;

  gaugesState.tempGauge += tempStep;
  if (gaugesState.tempGauge > maxValues.tempGauge) gaugesState.tempGauge = 0;

  gaugesState.tpsGauge += tpsStep;
  if (gaugesState.tpsGauge > maxValues.tpsGauge) gaugesState.tpsGauge = 0;

  gaugesState.batteryGauge += batteryStep;
  if (gaugesState.batteryGauge > maxValues.batteryGauge) gaugesState.batteryGauge = 0;

  drawGauge('speedometer', gaugesState.speedometer, maxValues.speedometer, 'ความเร็ว', 'km/h');
  drawGauge('tachometer', gaugesState.tachometer, maxValues.tachometer, 'รอบเครื่อง', 'RPM');
  drawGauge('tempGauge', gaugesState.tempGauge, maxValues.tempGauge, 'อุณหภูมิ', '°C');
  drawGauge('tpsGauge', gaugesState.tpsGauge, maxValues.tpsGauge, 'TPS', '%');
  drawGauge('batteryGauge', gaugesState.batteryGauge, maxValues.batteryGauge, 'แบตเตอรี่', '%');

  if (!animateGauges.lastGearChange || timestamp - animateGauges.lastGearChange > 4000) {
    const gearOptions = ['N', '1', '2', '3', '4', '5', '6'];
    const gear = gearOptions[Math.floor(Math.random() * gearOptions.length)];
    document.getElementById('gear').textContent = gear;

    const odometer = (Math.random() * 9999).toFixed(1);
    document.getElementById('odometer').textContent = odometer;

    animateGauges.lastGearChange = timestamp;
  }

  const fuelPercent = Math.floor((gaugesState.speedometer / maxValues.speedometer) * 100);
  const batteryPercent = Math.floor(gaugesState.batteryGauge);

  document.getElementById('fuelFill').style.width = fuelPercent + '%';
  document.getElementById('fuelPercent').textContent = fuelPercent + '%';

  document.getElementById('batteryFill').style.width = batteryPercent + '%';
  document.getElementById('batteryPercent').textContent = batteryPercent + '%';

  requestAnimationFrame(animateGauges);
}

animateGauges();
