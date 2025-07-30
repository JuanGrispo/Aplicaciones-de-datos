//canvas
const scene=document.querySelector("#scene");
const ctx=scene.getContext('2d');
const scale = window.devicePixelRatio || 1;
//Escalado en el canvas (para no tener errores de poca definición)
scene.width = scene.clientWidth * scale;
scene.height = scene.clientHeight * scale;
//valores de la barra y del label
const lambdaVal=document.querySelector("#lambda");
const lambdaLab=document.querySelector("#lambdaValue");
const L1Val=document.querySelector("#L1");
const L1Lab=document.querySelector("#L1Value");
const L2Val=document.querySelector("#L2");
const L2Lab=document.querySelector("#L2Value");
//Escala: 1cm = 1px
const factor=1;
//Centro del canvas
const centerX=scene.width/2;
const centerY=scene.height/2;





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






//Esta función crea el láser, el divisor de haz y la pantalla
const createDevices=(laserWidth,beamDivSize,screenSize)=>{


    //láser ---> se encuentra en centerX e Y=0
    ctx.beginPath();
    ctx.strokeStyle='gray';
    ctx.fillStyle='white';
    ctx.font="16px Arial";
    ctx.lineWidth=3;
    ctx.fillText("Láser",centerX-laserWidth/2-50,20);
    ctx.strokeRect(centerX-laserWidth/2,0, laserWidth,3*laserWidth);
    ctx.stroke();

    //divisor de haz (se encuentra en el centro del canvas)
    //Es un rectángulo con una línea diagonal
    ctx.beginPath();
    ctx.strokeStyle='white';
    ctx.lineWidth=5;
    ctx.fillStyle='white';
    ctx.font="16px Arial";
    ctx.fillText("Divisor",centerX-beamDivSize/2+50, centerY-beamDivSize/2-5);
    ctx.moveTo(centerX-beamDivSize/2, centerY-beamDivSize/2);
    ctx.lineTo(centerX+beamDivSize/2, centerY+beamDivSize/2);
    ctx.strokeRect(centerX-beamDivSize/2, centerY-beamDivSize/2, beamDivSize,beamDivSize);
    ctx.stroke();


    //Pantalla (se encuentra en el lado derecho del canvas)
    ctx.beginPath();
    ctx.strokeStyle='red';
    ctx.lineWidth=3;
    ctx.fillStyle='red';
    ctx.font="16px Arial";
    ctx.fillText("Pantalla",scene.width - screenSize-20, centerY - screenSize/2-5);
    ctx.strokeRect(scene.width - screenSize, centerY - screenSize/2, screenSize, screenSize);
    ctx.stroke();


};








//Esta función crea los haces del experimento, y el patrón de interferencia en la pantalla
const interferencePattern=(lambda,l1,l2,n,laserWidth,beamDivSize,screenSize)=>{
    const delta=l1-l2;
    const factorExt=1000;
    //haces de luz (tanto el incidente como los resultantes)
    ctx.beginPath();
    ctx.strokeStyle=wavelengthToRGB(lambda);
    ctx.lineWidth=2;
    //haz incidente
    ctx.moveTo(centerX,3*laserWidth);
    ctx.lineTo(centerX,centerY);
    //haces luego de atravesar el divisor de haz
    ctx.lineTo(centerX,centerY + beamDivSize/2 + (l1-10)*factor*factorExt);
    ctx.moveTo(centerX,centerY);
    ctx.lineTo(centerX - beamDivSize/2 - (l2-10)*factor*factorExt,centerY);
    //haz incidente sobre la pantalla
    ctx.moveTo(centerX,centerY);
    ctx.lineTo(scene.width - screenSize/2,centerY);
    ctx.stroke();


    //Espejos 1 y 2 (aqui multiplicamos por factor externo para que se vea el desplazamiento de los espejos)
    const mirrorWidth=40;
    ctx.beginPath();
    ctx.strokeStyle='white';
    ctx.lineWidth=6;
    ctx.fillStyle='white';
    ctx.font="16px Arial";
    //primer espejo
    ctx.fillText("Espejo 1",centerX-mirrorWidth/2,centerY + beamDivSize/2 + (l1-10)*factor*factorExt+20);
    ctx.moveTo(centerX-mirrorWidth/2,centerY + beamDivSize/2 + (l1-10)*factor*factorExt);
    ctx.lineTo(centerX+mirrorWidth/2,centerY + beamDivSize/2 + (l1-10)*factor*factorExt);
    //segundo espejo
    ctx.fillText("Espejo 2",centerX - beamDivSize/2 - (l2-10)*factor*factorExt-70,centerY-mirrorWidth/2+30);
    ctx.moveTo(centerX - beamDivSize/2 - (l2-10)*factor*factorExt,centerY-mirrorWidth/2);
    ctx.lineTo(centerX - beamDivSize/2 - (l2-10)*factor*factorExt,centerY+mirrorWidth/2);
    ctx.stroke();


    //patrón circular de interferencia
    //El radio de los anillos está basado en las franjas de Haidinger
    //D se va a setear en 10cm
    const D=10*factor; //10cm en px
    const lambdaPx=lambda*(1e-7)*factor; //convierto de nm a cm, y luego a px
    //El radio de interferencia va a aumentar hasta que sobrepasa la pantalla
    //m es el orden del anillo luminoso
    ctx.beginPath();
    ctx.strokeStyle=wavelengthToRGB(lambda);
    ctx.lineWidth=1;
    if (delta === 0) return; // o manejarlo con una franja central fija

    for (let m = 0; m < 10; m++) {
        const argumento = (2 / delta) * (delta - (m * lambdaPx / 2));
        if (argumento < 0 || isNaN(argumento)) {
            ctx.arc(scene.width - screenSize/2,centerY,
            5, 0, Math.PI*2
            );
            ctx.fill();
            break;
        } // termina el bucle si la raíz es inválida

        const rm = D * Math.sqrt(argumento);
        ctx.arc(scene.width - screenSize/2,centerY,
                rm, 0, Math.PI*2
            );
            //console.log('rm: '+rm + "; m:"+m);
        if (rm > screenSize / 2) break;
    }
    ctx.stroke();



    
};


//La animación se actualiza cada 10 ms
setInterval(()=>{
    //vaciamos el canvas en cada iteración
    ctx.clearRect(0,0,scene.width,scene.height);

    //Actualización de valores de L1,L2 y lambda
    lambdaLab.innerText=lambdaVal.value;
    L1Lab.innerText=L1Val.value;
    L2Lab.innerText=L2Val.value;

    //Actualizamos la ilustración con respecto a los valores de los parámetros
    interferencePattern(lambdaVal.value,L1Val.value,L2Val.value,1,20,80,320);
    createDevices(20,80,320);

},10);

