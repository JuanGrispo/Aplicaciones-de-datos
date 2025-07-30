//canvas
const scene=document.querySelector("#scene");
const ctx=scene.getContext('2d');
const scale = window.devicePixelRatio || 1;
//Escalado del canvas (para solucionar el problema de baja definición)
scene.width = scene.clientWidth * scale;
scene.height = scene.clientHeight * scale;
//botón de inicio
const startButton=document.querySelector("#startButton");
//valores de los parámetros
const lambdaVal=document.querySelector("#lambda");
const n2Val=document.querySelector("#n2");
const bVal=document.querySelector("#b");
const dVal=document.querySelector("#d");
//labels con los valores de los parámetros
const lambdaLab=document.querySelector("#lambdaValue");
const n2Lab=document.querySelector("#n2Value");
const bLab=document.querySelector("#bValue");
const dLab=document.querySelector("#dValue");
//Escala: 0.01mm = 10px
const factor=1000



//Función para convertir la longitud de onda de 380 a 780 nm en un color visible
function wavelengthToRGB(lambda) {
    let R, G, B, alpha;

    if (lambda >= 380 && lambda < 440) {
        R = -(lambda - 440) / (440 - 380);
        G = 0;
        B = 1;
    } else if (lambda >= 440 && lambda < 490) {
        R = 0;
        G = (lambda - 440) / (490 - 440);
        B = 1;
    } else if (lambda >= 490 && lambda < 510) {
        R = 0;
        G = 1;
        B = -(lambda - 510) / (510 - 490);
    } else if (lambda >= 510 && lambda < 580) {
        R = (lambda - 510) / (580 - 510);
        G = 1;
        B = 0;
    } else if (lambda >= 580 && lambda < 645) {
        R = 1;
        G = -(lambda - 645) / (645 - 580);
        B = 0;
    } else if (lambda >= 645 && lambda <= 780) {
        R = 1;
        G = 0;
        B = 0;
    } else {
        R = G = B = 0; // fuera del espectro visible
    }

    // Atenuación fuera del rango central
    if (lambda >= 380 && lambda < 420) {
        alpha = 0.3 + 0.7 * (lambda - 380) / (420 - 380);
    } else if (lambda >= 700 && lambda <= 780) {
        alpha = 0.3 + 0.7 * (780 - lambda) / (780 - 700);
    } else if (lambda >= 420 && lambda < 700) {
        alpha = 1;
    } else {
        alpha = 0;
    }

    // Convertir a valores de 0–255
    R = Math.round(R * 255);
    G = Math.round(G * 255);
    B = Math.round(B * 255);

    return `rgba(${R},${G},${B},${alpha})`;
}






//Dibujar la interfaz con las dos rendijas
//parámetro b: ancho de rendijas (en px)
//parámetro d: distancia entre rendijas (en px)
const interface=(b,d)=>{
    const centerX=scene.width/2;
    const centerY=scene.height/2;
    ctx.beginPath();
    //Son 3 rectas, separadas por dos rendijas
    ctx.strokeStyle='white';
    ctx.lineWidth=5;
    //primer trazo (central)
    const y1=centerY-(d-b)/2;
    const y2=centerY+(d-b)/2;
    ctx.moveTo(centerX,y1);
    ctx.lineTo(centerX,y2);
    //segundo trazo (superior)
    ctx.moveTo(centerX,0);
    ctx.lineTo(centerX,y1-b);
    //tercer trazo (inferior);
    ctx.moveTo(centerX,scene.height);
    ctx.lineTo(centerX,y2+b);
    ctx.stroke();
};





//Trayecto de onda plana con cierta longitud de onda
//recibe argumentos en mm: b y d // recibe lambda en nm // x donde se encuentra la onda
const flatWave=(b,d,lambda,step,x)=>{


    //Se limpia la escena antes de graficar
    ctx.clearRect(0,0,scene.width,scene.height);

    //se van a dibujar 10 lineas móviles (simulando una onda plana)
    ctx.beginPath();
    ctx.lineWidth=1;
    ctx.strokeStyle=wavelengthToRGB(lambda);
    for (let i=0; i<10 ; i++){
        //La onda no debe transpasar la interfaz
        const xFlat=x-step*i;
        if (xFlat<(scene.width/2)){
            ctx.moveTo(xFlat,0);
            ctx.lineTo(xFlat,scene.height);
        }
    }
    ctx.stroke();


    //se dibuja la interfaz
    interface(b*factor,d*factor);
};



//Ondas esféricas de Huygens al atravesar la interfaz
const huygensWave=(b,d,lambda,n,r)=>{

    //valores de y donde se va a generar la onda esferica
    const centerX=scene.width/2;
    const centerY=scene.height/2;
    const y1=centerY-d*factor/2;
    const y2=centerY+d*factor/2;


    //se van a dibujar ondas semicirculares con radio variable
    ctx.beginPath();
    ctx.lineWidth=1;
    ctx.strokeStyle=wavelengthToRGB(lambda/n);
    ctx.arc(centerX,y1,r,-Math.PI/2,Math.PI/2);
    ctx.arc(centerX,y2,r,-Math.PI/2,Math.PI/2);
    ctx.stroke();


    //se dibuja la interfaz
    interface(b*factor,d*factor);
};



//Intensidad en la pantalla producto de la interferencia y difracción
//Se va a realizar la aproximación de campo lejano (Fraunhofer)
//es decir: sin(theta) = y/L (L es la distancia entre interfaz y pantalla)
const intensityPattern=(I0,b,d,lambda,n)=>{

    //El patrón de difracción varía según la posición "y"
    //Se van a crear varias líneas o secciones infinitesimales de y
    //cada una de esas secciones van a tener su intensidad
    //let y=-scene.height/2; //desplazamiento de escala
    const dy=1;
    //Debo convertir lambda en pixeles (primero de nm a mm)
    const lambdapx=(lambda*factor)*(1e-6);
    ctx.beginPath();
    ctx.lineWidth=1;
    //la longitud de onda de salida será menor si n2>1
    ctx.strokeStyle=wavelengthToRGB(lambda/n);
    for (let y=-scene.height/2 ; y <= scene.height/2 ; y+=dy){
        //L=scene.width/2
        const cos=Math.cos((Math.PI*(d*factor)*y*n)/(lambdapx*scene.width/2))**2;
        const xsinc=(Math.PI*(b*factor)*y*n)/(lambdapx*scene.width/2);
        let sinc; //controlamos que no se produzca indeterminación 0/0
        if (xsinc === 0) {
            sinc = 1;
        } else {
            sinc = (Math.sin(xsinc) / xsinc) ** 2;
        }
        I=I0*cos*sinc;
        console.log("I= "+I);

        //Dibujamos los trazos (la intensidad se va a ver en la longitud horizontal)
        ctx.moveTo(scene.width,y+scene.height/2);
        ctx.lineTo(scene.width - I,y+scene.height/2);

    }
    ctx.stroke();
};















//El valor mostrado en el div de cada parámetro se actualiza a medida que se va cambiando
setInterval(()=>{
    lambdaLab.innerText=lambdaVal.value;
    n2Lab.innerText=n2Val.value;
    bLab.innerText=bVal.value;
    dLab.innerText=dVal.value;
},10);
//Botón de start
startButton.addEventListener('click',()=>{

    //seteamos un valor fijo para cada parámetro
    const b=bVal.value,d=dVal.value,lambda=lambdaVal.value, I0=300,n=n2Val.value;

    let x=0;
    const step=3;
    //el x incrementa cada 30ms
    const flatInterval=setInterval(()=>{
        flatWave(b,d,lambda,step,x);
        x+=step;

        //si x (y las otras ondas planas) sobrepasa la interfaz, detengo el intervalo
        if (x>(scene.width/2 + step*10)){
            clearInterval(flatInterval);
            console.log("La onda plana atravesó la interfaz");


            //Ahora aparece la onda esferica
            //onda esférica
            //el radio incrementa cada 100ms
            let r=1
            const stepR=3;
            const esphericInterval=setInterval(()=>{
                huygensWave(b,d,lambda,n,r);
                r+=stepR;

                //Si transpasa la pantalla, se detiene el intervalo
                if (r>=scene.width/2){
                    clearInterval(esphericInterval);
                    console.log("La onda esférica ha impactado sobre la pantalla");

                    //Dibujamos el patrón de difracción
                    let I0var=50;
                    const dI0=5;
                    const intensityInterval=setInterval(()=>{
                        intensityPattern(I0var,b,d,lambda,n);
                        I0var+=dI0;
                        if (I0var>120){
                            clearInterval(intensityInterval);
                            console.log("Graficado el patrón de difracción");

                        }
                    },30);
                }
            },30);
        }

        
    },30);

    
});



/*IMPORTANTE: si incrementa demasiado n2, la longitud de onda al atravesar las
ranuras será menor, por lo que es posible que no se observe el patrón de
interferencia. Esto sucede porque las longitudes de onda menores a la visible
pertenecen a la región de ultravioleta no visible, es decir, los patrones 
están pero no se pueden ver.
*/