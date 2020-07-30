
    const select = document.querySelector('.select-indicador');
    let indicadores; 

    let lista_historial = document.querySelector('.lista_historial'); 
    let listad_historial_2 = document.querySelector('.lista_historial_2');

    let date_indicador = document.querySelector('.date_indicador');

    let nombre_ind = document.querySelector('.price-title').innerText;


    function formatNumber(n) {
        n = n.toString()
        while (true) {
          var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3')
          if (n == n2) break
          n = n2
        }
        return n
      }




document.addEventListener('DOMContentLoaded', function(){
    console.log("Cargando...");

    traerIndicadores()
    .then(data => {
        insertarOpciones(data);
    })

});

function insertarOpciones(data){
    indicadores = Object.keys(data); 

    n_ind = indicadores.slice(3,16)
    
    n_ind.forEach(el => {

        const option = document.createElement('option'); 
        option.setAttribute('value', el); 

        option.innerText = el;

        select.appendChild(option);
    })
}


async function traerIndicadores(){ 

    let url = "https://mindicador.cl/api"; 
    const response = await fetch(url); 
    let indicadores = await  response.json();

    return indicadores;
}

async function traerUnIndicador(nombre_indicador){ 
    let url = `https://mindicador.cl/api/${nombre_indicador}`; 
    const response = await fetch(url); 
    let indicador = await response.json(); 

    return indicador;
}


select.addEventListener('change', function(){

    let indicadorSeleccionado = this.options[select.selectedIndex].innerText; 

    let indicador_toUpper; 

    if(indicadorSeleccionado == "uf"){
        indicador_toUpper = "UNIDAD DE FOMENTO CLP";
    }else if(indicadorSeleccionado == "dolar"){
        indicador_toUpper = "DOLAR OBSERVADO CLP";
    }else if(indicadorSeleccionado =="ivp"){
        indicador_toUpper = "INDICE VALOR PROMEDIO (ivp) CLP"
    }else if(indicadorSeleccionado == "euro"){
        indicador_toUpper = "EURO CLP";
    }else if(indicadorSeleccionado == "dolar_intercambio"){
        indicador_toUpper = "DOLAR INTERCAMBIO (desactualizado) CLP"
    }else if(indicadorSeleccionado == "ipc"){
        indicador_toUpper = "INDICE DE PRECIOS AL CONSUMIDOR (ipc)";
    }else if(indicadorSeleccionado == "utm"){
        indicador_toUpper = "UNIDAD TRIBUTARIA MENSUAL (utm) CLP"
    }else if(indicadorSeleccionado == "imacec"){
        indicador_toUpper = "INDICE MENSUAL ACTIVIDAD ECONOMICA (imacec)"
    }else if(indicadorSeleccionado == "tpm"){
        indicador_toUpper = "TASA DE POLITICA MONETARIA (tpm)"
    }else if(indicadorSeleccionado == "libra_cobre"){
        indicador_toUpper = "VALOR DE COBRE EN DOLARES"
    }else if(indicadorSeleccionado == "tasa_desempleo"){
        indicador_toUpper = "TASA DE DESEMPLEO";
    }else if(indicadorSeleccionado == "bitcoin"){
        indicador_toUpper = "BITCOIN CLP";
    }

    
    while (lista_historial.hasChildNodes()) {  
        lista_historial.removeChild(lista_historial.firstChild);
    }

    while (listad_historial_2.hasChildNodes()) {  
        listad_historial_2.removeChild(listad_historial_2.firstChild);
    }





    traerUnIndicador(indicadorSeleccionado)
    .then(data => {

        document.querySelector('.chart-bg').innerHTML = `<canvas id="line-chart" width="800" height="450"></canvas>`;
        document.querySelector('.icon-box').classList.add('showme');
        document.querySelector('.date_s').classList.add('showme');
        document.querySelector('.history').classList.add('showme');
        document.querySelector('.date_c').classList.add('showme');

        let array_chart_date = []; 
        let arrat_chart_prices = [];

        for (let index = 0; index < data.serie.length; index++) {
            let element = data.serie[index];

         

            array_chart_date.push(`${element.fecha.split('-')[2].substr(0,2)}-${element.fecha.split('-')[1]}-${element.fecha.split('-')[0]}`);
            arrat_chart_prices.push(element.valor);
        }

        new Chart(document.getElementById("line-chart"), {
            type: 'line',
            data: {
              labels: array_chart_date,
              datasets: [
                { 
                  data: arrat_chart_prices,
                  label: `Valor ${data.nombre}`,
                  borderColor: "rgb(64, 163, 255)",
                  fill: false
                }
              ]
            },
            options: {
              title: {
                display: true,
                text: 'Indicador economico ultimos 31 dias'
              }
            }
          });


        //console.log(data.serie)
        if(indicador_toUpper == "TASA DE DESEMPLEO" || indicador_toUpper == "TASA DE POLITICA MONETARIA (tpm)"
        || indicador_toUpper == "INDICE DE PRECIOS AL CONSUMIDOR (ipc)" || indicador_toUpper == "INDICE MENSUAL ACTIVIDAD ECONOMICA (imacec)"){
            document.querySelector('.price').innerText = `% ${data.serie[0].valor}`;
        }else{
            document.querySelector('.price').innerText = `$ ${formatNumber(data.serie[0].valor)}`;
        }
        
        document.querySelector('.price-title').innerText = indicador_toUpper;
        nombre_ind = indicadorSeleccionado;
        document.querySelector('.fecha_indicador').innerText = `Fecha valor mas reciente: ${data.serie[0].fecha.split('-')[2].substr(0,2)}-${data.serie[0].fecha.split('-')[1]}-${data.serie[0].fecha.split('-')[0]}`;
        //console.log(Math.floor((data.serie.length + 1) - (data.serie.length / 2)));

        for (let index = 0; index < Math.floor(data.serie.length / 2); index++) {
            let element = data.serie[index];
            let li = document.createElement('li'); 
            li.innerHTML = `<li class="text-left my-2" >Fecha: ${element.fecha.split('-')[2].substr(0,2)}-${element.fecha.split('-')[1]}-${element.fecha.split('-')[0]} <br>Valor: ${formatNumber(data.serie[index].valor)}  </li>`;

            lista_historial.appendChild(li);
            
        }


        for (let index = 15; index < data.serie.length; index++) {
            let element = data.serie[index];
            let li = document.createElement('li'); 
            li.innerHTML = `<li class="text-left my-2" >Fecha: ${element.fecha.split('-')[2].substr(0,2)}-${element.fecha.split('-')[1]}-${element.fecha.split('-')[0]} <br>Valor: ${formatNumber(data.serie[index].valor)}  </li>`;

            listad_historial_2.appendChild(li);
            
        }
    })
})


function traerFecha(e){

    fecha_ind = e.target.value;
    traerIndicadorPorFecha(fecha_ind, nombre_ind)
    .then(data => {
        console.log(data.serie.length)
         if(data.error || data.serie.length == 0 ){
            document.querySelector('.selected_date').innerText =`Fecha: No hay informacion`;
            document.querySelector('.selected_price').innerText = `Valor: No hay informacion`
         }else{
            document.querySelector('.selected_date').innerText =`Fecha Seleccionada: ${data.serie[0].fecha.split('-')[2].substr(0,2)}-${data.serie[0].fecha.split('-')[1]}-${data.serie[0].fecha.split('-')[0]} `;
            document.querySelector('.selected_price').innerText = `Valor: ${formatNumber(data.serie[0].valor)}`
         }

    })
}


async function traerIndicadorPorFecha(fecha, nombre){
    let fecha_indi = `${fecha.split('-')[2]}-${fecha.split('-')[1]}-${fecha.split('-')[0]}`
    let url = `https://mindicador.cl/api/${nombre}/${fecha_indi}`; 
    const response = await fetch(url); 
    let indicador = await response.json(); 

    return indicador;
}




