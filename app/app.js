let DB;

// campos del formulario

const inputMascota = document.querySelector('#nombre'); 
const inputPropietario = document.querySelector('#propietario');
const inputTelefono = document.querySelector('#numero');
const inputDia = document.querySelector('#fecha');
const inputHora = document.querySelector('#hora');
const inputMensaje = document.querySelector('#sintomas');

// UI
const formulario = document.querySelector('#formulario');
const contenedorCitas = document.querySelector('#listas');

let editando;

class Citas{
    constructor(){
        this.citas = [];
    }
    
    agregarCita(cita){
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id)
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita )
    }
}


class UI{
    imprimirAlerta(mensaje, tipo){

        // crear div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('mensaje');


        // validamos tipo de mensaje 
        if(tipo === 'error'){
            divMensaje.classList.add('error');
        }else{
            divMensaje.classList.add('correcto')
        }

        // agreamos el texto
        divMensaje.textContent = mensaje;


        // agregamos al HTML
        const mostrarAlerta = document.querySelector('.alerta');
        mostrarAlerta.appendChild(divMensaje);


        // eliminar mensaje despues de 3 segundos
        setTimeout(() => {
            divMensaje.remove()
        }, 3000);

    }

    imprimirCitas(){

        this.limpiarHTML();

        // leer el contenido de la base de datos
        const objectStore = DB.transaction('citas').objectStore('citas');

        objectStore.openCursor().onsuccess = function (e){
           const cursor = e.target.result;

           if(cursor){

            const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cursor.value;
            const divCita = document.createElement('div');
            divCita.classList.add('cita')
            divCita.dataset.id = id;


            // Scripting de los elementos de la cita

            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('mascota');
            mascotaParrafo.textContent = mascota;


            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
                <span clas="span">Propietario: </span> ${propietario}
            
            `

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
                <span clas="span">Teléfono: </span> ${telefono}
            
            `

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
                <span clas="span">Fecha: </span> ${fecha}
            
            `

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
                <span clas="span">Hora: </span> ${hora}
            
            `

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
                <span clas="">Sintomas: </span> ${sintomas}
            
            `

            // crear boton eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn_eliminar');
            btnEliminar.innerHTML = 'Eliminar <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);transform: rotate(90deg);msFilter:progid:DXImageTransform.Microsoft.BasicImage(rotation=1);"><path d="M9.172 16.242 12 13.414l2.828 2.828 1.414-1.414L13.414 12l2.828-2.828-1.414-1.414L12 10.586 9.172 7.758 7.758 9.172 10.586 12l-2.828 2.828z"></path><path d="M12 22c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z"></path></svg>';
            btnEliminar.onclick = () => eliminarCita(id);



            // creamos el boton de editar
            const btnEditar = document.createElement('button');
            const cita = cursor.value;
            btnEditar.classList.add('btn_editar')
            btnEditar.innerHTML = 'Editar <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);transform: rotate(90deg);msFilter:progid:DXImageTransform.Microsoft.BasicImage(rotation=1);"><path d="M4 21a1 1 0 0 0 .24 0l4-1a1 1 0 0 0 .47-.26L21 7.41a2 2 0 0 0 0-2.82L19.42 3a2 2 0 0 0-2.83 0L4.3 15.29a1.06 1.06 0 0 0-.27.47l-1 4A1 1 0 0 0 3.76 21 1 1 0 0 0 4 21zM18 4.41 19.59 6 18 7.59 16.42 6zM5.91 16.51 15 7.41 16.59 9l-9.1 9.1-2.11.52z"></path></svg>'

            btnEditar.onclick = () => cargarEdicion(cita);

            // agregar los parrafos al div cita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            // agregar la cita al html 
            contenedorCitas.appendChild(divCita);


            // al siguiente iterador

            cursor.continue();
            
           }
        }
        

    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild( contenedorCitas.firstChild)
        }
    }
   
}

const ui = new UI();
const administrarCitas = new Citas();


window.onload = () =>{
    eventListeners();

    crearDataBase();
}


// registrar eventos


function eventListeners(){
    inputMascota.addEventListener('input', datosCitas);
    inputPropietario.addEventListener('input', datosCitas);
    inputTelefono.addEventListener('input', datosCitas);
    inputDia.addEventListener('input', datosCitas);
    inputHora.addEventListener('input', datosCitas);
    inputMensaje.addEventListener('input', datosCitas);

    formulario.addEventListener('submit', nuevaCita);
}


// objeto con la informacion de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    hora: '',
    sintomas: ''
}



// agrega datos al objeto cita
function datosCitas(e){
    citaObj[e.target.name] = e.target.value;

}

// valida y agrega una nueva cita a la clase citas

function nuevaCita(e){
    e.preventDefault();

    // extraer la informacion del objeto de cita
    const { mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    // validar

    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error')

        return;
    }

    if(editando){
     

        // pasar el objeto de la cita edición
        administrarCitas.editarCita({...citaObj})

        // editar en indexDB
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');

        objectStore.put(citaObj);

        transaction.oncomplete = function(){
            // agregar alerta
            ui.imprimirAlerta('Editado correctamente')

            // regresar el texto del boton a su estado original
            formulario.querySelector('input[type="submit"]').value = 'Crear Cita';
    
    
            // sacar modo edición
            editando = false;
        }

        transaction.onerror = function(){
            // console.log('error')
        }


    }else{
        
        // generar id unico
        citaObj.id = Date.now();

        // creando una nueva cita
        administrarCitas.agregarCita({...citaObj});

        //insertar registro en el indexDB
        const transaction = DB.transaction(['citas'], 'readwrite');

        // habilitar el object store
        const objectStore = transaction.objectStore('citas')

        // insertar en el objeto
        objectStore.add(citaObj);

        transaction.oncomplete = function(){
            // imprimir mensaje de correcto
             ui.imprimirAlerta('Se agregó correctamente');
        }


    }


    // reiniciamos objeto
    reiniciarObjeto();

    // reiniciamos el formulario
    formulario.reset();


    // Mostrar citas en el HTML
    ui.imprimirCitas();
}

function reiniciarObjeto(){
    citaObj.mascota = '',
    citaObj.propietario = '',
    citaObj.telefono = '',
    citaObj.fecha = '',
    citaObj.hora = '',
    citaObj.sintomas = ''

}

function eliminarCita(id){
    // Eliminar cita
    const transaction = DB.transaction(['citas'], 'readwrite')
    const objectStore = transaction.objectStore('citas')

    objectStore.delete(id);

    transaction.oncomplete = function(){
        // Muestre mensaje
           ui.imprimirAlerta('La cita se eliminó correctamente')


        // Refrescar cita
            ui.imprimirCitas();
    }

    transaction.onerror = function(){
        // console.log('Hubo un error')
    }


}




// carga los datos y el modo edicion
function cargarEdicion(cita){
    const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

    // llenar los inputs
    inputMascota.value = mascota;
    inputPropietario.value = propietario;
    inputTelefono.value = telefono;
    inputDia.value = fecha;
    inputHora.value = hora;
    inputMensaje.value = sintomas;


    // llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;


    // cambiar el texto del boton
    formulario.querySelector('input[type="submit"]').value = 'Guardar Cambios';


    editando = true;
}

function crearDataBase(){
    // base de datos en version 1.0
    const crearDB = window.indexedDB.open('citas', 1);

    // si hay error
    crearDB.onerror = function(){
        // console.log('error al crear la base de datos')
    }


    // si todo está bien
    crearDB.onsuccess = function(){

        DB = crearDB.result;

        // mostrar cita al cargar (cuando indexDB esté listo)
        ui.imprimirCitas()

    }


    // definir esquema

    crearDB.onupgradeneeded = function(e){
        const db = e.target.result;

        const objectStore = db.createObjectStore('citas', {
            keyPath: 'id', 
            autoIncrement: true
        });

        // definir columnas

        objectStore.createIndex('mascota', 'mascota', { unique : false})
        objectStore.createIndex('propietario', 'propietario', { unique : false})
        objectStore.createIndex('telefono', 'telefono', { unique : false})
        objectStore.createIndex('fecha', 'fecha', { unique : false})
        objectStore.createIndex('hora', 'hora', { unique : false})
        objectStore.createIndex('sintomas', 'sintomas', { unique : false})
        objectStore.createIndex('id', 'id', { unique : true});


    }


}
