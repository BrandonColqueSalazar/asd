// Datos en localStorage
let registros = JSON.parse(localStorage.getItem('spa_registros')) || [];
let agenda   = JSON.parse(localStorage.getItem('spa_agenda'))   || [];
let carrito  = JSON.parse(localStorage.getItem('spa_carrito'))  || [];

// Helpers
function guardarLS(clave, valor){
  localStorage.setItem(clave, JSON.stringify(valor));
}

// Navegación entre módulos
document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const id = btn.dataset.modulo;
    document.querySelectorAll('.mod').forEach(m=>m.classList.remove('visible'));
    document.getElementById(id).classList.add('visible');
  });
});

// Guardar registro dueño/mascota
document.getElementById('btn-guardar-registro').addEventListener('click', ()=>{
  const dueño = {
    nombre: document.getElementById('dueño-nombre').value.trim(),
    tel:    document.getElementById('dueño-tel').value.trim(),
    email:  document.getElementById('dueño-email').value.trim()
  };
  const mascota = {
    nombre:  document.getElementById('mascota-nombre').value.trim(),
    especie: document.getElementById('mascota-especie').value.trim(),
    raza:    document.getElementById('mascota-raza').value.trim()
  };

  if(!dueño.nombre || !mascota.nombre){
    alert('Completa al menos nombre de dueño y mascota');
    return;
  }

  registros.push({
    dueño,
    mascota,
    fecha: new Date().toLocaleString()
  });
  guardarLS('spa_registros',registros);
  actualizarUI();
  document.querySelectorAll('#mod-registro input').forEach(i=>i.value='');
});

// Agendar cita
document.getElementById('btn-agendar').addEventListener('click', ()=>{
  const cita = {
    fecha:   document.getElementById('fecha').value,
    hora:    document.getElementById('hora').value,
    servicio:document.getElementById('servicio').value,
    mascota: document.getElementById('agenda-mascota').value.trim()
  };

  if(!cita.fecha || !cita.hora || !cita.servicio || !cita.mascota){
    alert('Completa todos los campos de la agenda');
    return;
  }

  agenda.unshift(cita);
  guardarLS('spa_agenda',agenda);
  actualizarUI();
  document.getElementById('agenda-mascota').value = '';
});

// Agregar productos al carrito
document.querySelectorAll('.prod').forEach(p=>{
  p.addEventListener('click', ()=>{
    const nombre = p.dataset.nombre;
    const precio = Number(p.dataset.precio);
    carrito.push({nombre,precio});
    guardarLS('spa_carrito',carrito);
    actualizarUI();
  });
});

// Enviar carrito por WhatsApp
document.getElementById('btn-whatsapp').addEventListener('click', ()=>{
  if(!carrito.length){
    alert('El carrito está vacío');
    return;
  }
  const total = carrito.reduce((s,i)=>s+i.precio,0);
  const lineas = carrito.map(i=>`- ${i.nombre} Bs.${i.precio}`).join('%0A');
  const msg = `Pedido Spa de Mascotas%0A${lineas}%0A%0ATotal: Bs.${total}`;
  // Reemplaza por tu número real
  window.open(`https://wa.me/59171234567?text=${msg}`);
});

// Refrescar pantalla
function actualizarUI(){
  // Registros
  const contReg = document.getElementById('lista-registros');
  contReg.innerHTML = registros.length
    ? registros.map(r=>`<div>🐕 ${r.mascota.nombre} (${r.mascota.especie}) - 👤 ${r.dueño.nombre}</div>`).join('')
    : '<div>Sin registros todavía</div>';

  // Agenda
  const contAg = document.getElementById('lista-agenda');
  contAg.innerHTML = agenda.length
    ? agenda.map(a=>`<div>📅 ${a.fecha} ${a.hora} - ${a.servicio} - ${a.mascota}</div>`).join('')
    : '<div>Sin citas agendadas</div>';

  // Carrito
  const contCar = document.getElementById('lista-carrito');
  const subtotal = carrito.reduce((s,i)=>s+i.precio,0);
  const total = subtotal * 1.15; // 15% IVA
  contCar.innerHTML = carrito.length
    ? carrito.map(i=>`<div>${i.nombre} - Bs.${i.precio}</div>`).join('')
    : '<div>Carrito vacío</div>';
  document.getElementById('subtotal').textContent = `Bs. ${subtotal.toFixed(2)}`;
  document.getElementById('total').textContent    = `Bs. ${total.toFixed(2)}`;
}

// Inicializar
actualizarUI();
