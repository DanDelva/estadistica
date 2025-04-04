let numeros = [];

function agregarNumero() {
    let input = document.getElementById("numero");
    let valores = input.value.split(/[ ,]+/).map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    
    if (valores.length > 0) {
        numeros.push(...valores);
        document.getElementById("listaNumeros").innerText = "Números ingresados: " + numeros.join(", ");
        input.value = "";
    }
} 

function generarTabla() {
    if (numeros.length === 0) {
        alert("Por favor, ingrese al menos un número.");
        return;
    }

    numeros.sort((a, b) => a - b);
    document.getElementById("numerosOrdenados").innerText = "Números ordenados: " + numeros.join(", ");

    let min = Math.floor(Math.min(...numeros));
    let max = Math.ceil(Math.max(...numeros));
    let rango = max - min;
    let k = Math.ceil(1 + 3.322 * Math.log10(numeros.length)); // Regla de Sturges corregida
    let c = Math.ceil(rango / k);

    document.getElementById("cantidadNumeros").innerText = numeros.length;
    document.getElementById("numeroClases").innerText = k;
    document.getElementById("rango").innerText = rango;
    document.getElementById("tamanoClase").innerText = c;

    let intervalos = [];
    let inicio = min;
    for (let i = 0; i < k; i++) {
        let fin = (i === k - 1) ? max : inicio + c - 1;
        intervalos.push([inicio, fin]);
        inicio = fin + 1;
    }

    let frecuencia = new Array(k).fill(0);
    for (let num of numeros) {
        for (let j = 0; j < intervalos.length; j++) {
            if (num >= intervalos[j][0] && num <= intervalos[j][1]) {
                frecuencia[j]++;
                break;
            }
        }
    }

    let frecuenciaAcumulada = [];
    let sumaFrecuencia = 0;
    for (let i = 0; i < frecuencia.length; i++) {
        sumaFrecuencia += frecuencia[i];
        frecuenciaAcumulada.push(sumaFrecuencia);
    }

    let frecuenciaRelativa = frecuencia.map(f => (f / numeros.length).toFixed(4));
    let frecuenciaRelativaAcumulada = frecuenciaAcumulada.map(F => (F / numeros.length).toFixed(4));

    let marcaClase = intervalos.map(intervalo => Math.round((intervalo[0] + intervalo[1]) / 2));

    let tablaHTML = `<table class="table table-bordered">
                        <thead class="table-primary">
                            <tr>
                                <th>Intervalo</th>
                                <th>Xi'</th>
                                <th>fi</th>
                                <th>Fi</th>
                                <th>hi</th>
                                <th>Hi</th>
                            </tr>
                        </thead>
                        <tbody>`;

    intervalos.forEach((int, i) => {
        tablaHTML += `<tr>
                        <td>[${int[0]} - ${int[1]}]</td>
                        <td>${marcaClase[i]}</td>
                        <td>${frecuencia[i]}</td>
                        <td>${frecuenciaAcumulada[i]}</td>
                        <td>${frecuenciaRelativa[i]}</td>
                        <td>${frecuenciaRelativaAcumulada[i]}</td>
                    </tr>`;
    });

    tablaHTML += `</tbody></table>`;
    document.getElementById("resultado").innerHTML = tablaHTML;

    generarGrafica(intervalos.map(int => `[${int[0]} - ${int[1]}]`), frecuencia);
}

function generarGrafica(intervalos, frecuencias) {
    let ctx = document.getElementById("graficaFrecuencia").getContext("2d");

    if (window.miGrafico) {
        window.miGrafico.destroy();
    }

    window.miGrafico = new Chart(ctx, {
        type: "bar",
        data: {
            labels: intervalos,
            datasets: [{
                label: "Frecuencia Absoluta (fi)",
                data: frecuencias,
                backgroundColor: "rgba(0, 123, 255, 0.6)",
                borderColor: "rgba(0, 123, 255, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Intervalos"
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Frecuencia Absoluta"
                    }
                }
            }
        }
    });
}
