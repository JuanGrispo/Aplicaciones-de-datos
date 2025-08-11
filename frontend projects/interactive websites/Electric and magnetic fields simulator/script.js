//canvas
const scene=document.querySelector("#scene");
const ctx=scene.getContext('2d');
const scale = window.devicePixelRatio || 1;
//Escalado del canvas (para solucionar el problema de baja definición)
scene.width = scene.clientWidth * scale;
scene.height = scene.clientHeight * scale;

//Todos los campos almacenados
let storedFields={};
//Todos los parámetros almacenados (son 5 por campo)
let storedProperties={};




//Estas funciones son para convertir coordenadas físicas en coords del canvas
//Esto es un corrimiento del origen
const originX=scene.width/2;
const originY=scene.height/2;
const toCanvasX = x => originX + x;
const toCanvasY = y => originY - y;





























//Esta función toma el tipo de fuente, y returnea una función correspondiente
const opSourceField=(type,field)=>{
    //Todas las funciones tienen 6 argumentos:
    //x,y,rho,rint,rext,I


    //Permitividad del medio (si es 1 cuenta como el vacío)
    const epsilon=1;
    //Permeabilidad magnetica (se setea como 1)
    const mu=1;
    
    switch (type){
        //Campo de un hilo infinito con densidad lambda
        //E=lambda/(2*pi*epsilon*d) ; d=sqrt((x-x0)**2 + (y-y0)**2)
        //B=(mu*I)/(2*pi*d)
        case 'wire':
            if (field==='electric'){
                return (x,y,rho,rint,rext,I)=>{
                const d=Math.sqrt(x**2 + y**2);
                if (d===0){
                    return Infinity;
                }else{
                    return rho/(2*Math.PI*epsilon*d);
                }
                };
            } else{
                return (x,y,rho,rint,rext,I)=>{
                const d=Math.sqrt(x**2 + y**2);
                if (d===0){
                    return Infinity;
                }else{
                    return (mu*I)/(2*Math.PI*d);
                }
                };
            }
            
        //Campo de un cilindro infinito con densidad rho y radio "rint"
        //E=(rho*d)/2*epsilon si d<rint ; E=(rho*rint**2)/(2*epsilon*d) si d>rint
        //B=(mu*I*d)/2 si d<rint ; B=(mu*I*rint**2)/(2*d) si d>rint
        case 'cylinder':
            if (field==='electric'){
                return (x,y,rho,rint,rext,I)=>{
                const d=Math.sqrt(x**2 + y**2);
                if (d<=rint){
                    return (rho*d)/(2*epsilon);
                }else{
                    return (rho*rint**2)/(2*epsilon*d);
                }
                };
            }else{
                return (x,y,rho,rint,rext,I)=>{
                const d=Math.sqrt(x**2 + y**2);
                if (d<=rint){
                    return (mu*I*d)/2;
                }else{
                    return (mu*I*rint**2)/(2*d);
                }
                };
            }
            
        //Campo de una esfera con densidad rho y radio "rint"
        //E=(rho*d)/(3*epsilon) ; E=(rho*rint**3)/(3*epsilon*d**2) si d>rint
        //Por geometría, no se grafica un B para esta fuente 
        case 'sphere':
            if (field==='electric'){
                return (x,y,rho,rint,rext,I)=>{
                const d=Math.sqrt(x**2 + y**2);
                if (d<=rint){
                    return (rho*d)/(3*epsilon);
                }else{
                    return (rho*rint**3)/(3*epsilon*d**2);
                }
                };
            }
            else{
                return (x,y,rho,rint,rext,I)=>{return 0};
            }
            
        //Campo de un plano infinito en x
        //E=rho/(2*epsilon) si x>0 ; E=-rho/(2*epsilon) si x<0
        //"flath" es un plano horizontal, "flatv" es un plano vertical
        //B apunta en dirección z, por lo que no es graficable en el plano xy
        case 'flath':
            if (field==='electric'){
                return (x,y,rho,rint,rext,I)=>{
                if (y<=0){
                    return -rho/(2*epsilon);
                }else{
                    return rho/(2*epsilon);
                }
                };
            }else{
                 return (x,y,rho,rint,rext,I)=>{return 0};
            }
            
        case 'flatv':
            if (field==='electric'){
                return (x,y,rho,rint,rext,I)=>{
                    if (x<=0){
                        return -rho/(2*epsilon);
                    }else{
                        return rho/(2*epsilon);
                    }
                };
            }else{
                 return (x,y,rho,rint,rext,I)=>{return 0};
            }
        
        default:
            console.error("No se ha seleccionado una fuente");
            return (x,y,rho,rint,rext,I)=>{return 0};

    }
    
};

















//Esta función agrega los campos a la lista
//Estos campos tienen un label de acuerdo al orden en el que fueron creados
const addField=(label,field,prop)=>{
    let count=0; //contador para determinar el id de cada campo agregado
    //Esto verifica si el id ya fue agregado (si es así, cambio el contador)
    while (label+`-${count}` in storedFields){
        count++;
    }
    //Una vez termino la verificación, añado el campo a la lista
    storedFields[label+`-${count}`]=field;
    //Añado sus propiedades
    storedProperties[label+`-${count}`]=prop;
    console.log(storedFields);

    //Ahora actualizamos el panel de campos agregados
    const sourcePanel=document.querySelector("#sourcePanel");
    //Primero vaciamos el html del panel
    sourcePanel.innerHTML='<p style="color:blue">Source Panel:</p>';
    //Luego agregamos todos los campos de la lista
    Object.keys(storedFields).forEach(key=>{
        const info=document.createElement('div');
        info.id=key;
        info.style.display='flex';
        info.style.fontStyle='italic';
        info.style.fontFamily='Times new Roman, serif'
        sourcePanel.appendChild(info);

        //Label que indica el tipo de fuente y sus propiedades
        const labelInfo=document.createElement('label');
        const par = storedProperties[key]; //propiedades de esta clave
        labelInfo.innerText=`${key} --> (x,y)= (${par[0]},${par[1]}) ; rho= ${par[2]} ; rint= ${par[3]} ; rext= ${par[4]} ; I= ${par[5]}`;
        info.appendChild(labelInfo);

        //Botón para borrar el campo (también de la lista)
        const delButton=document.createElement('button');
        delButton.innerText='delete';
        delButton.style.backgroundColor='red';
        info.appendChild(delButton);
        delButton.addEventListener('click',()=>{
            info.remove();
            //Quitamos el elemento de la lista
            delete storedFields[key];
            delete storedProperties[key];
            //Actualizamos el canvas al eliminar la fuente
            graphFields();
        });

    });

};
















//Función para graficar flechas en el canvas
const drawArrow=(xi,yi,xf,yf,l,color,w,arrowFactor)=>{
    ctx.beginPath();
    ctx.strokeStyle=color;
    ctx.lineWidth=w;
    ctx.moveTo(xi,yi);
    ctx.lineTo(xf,yf);
    //punta de la flecha
    // Ángulo de la línea (para orientar la punta)
    const angle = Math.atan2(yf - yi, xf - xi);
    // Dos líneas que forman la cabeza de la flecha (pi/6 ángulo de desvío)
    const angle1 = angle + Math.PI / 6;
    const angle2 = angle - Math.PI / 6;
    const x1 = xf - (l/arrowFactor) * Math.cos(angle1);
    const y1 = yf - (l/arrowFactor) * Math.sin(angle1);
    const x2 = xf - (l/arrowFactor) * Math.cos(angle2);
    const y2 = yf - (l/arrowFactor) * Math.sin(angle2);
    ctx.moveTo(xf, yf);
    ctx.lineTo(x1, y1);
    ctx.moveTo(xf, yf);
    ctx.lineTo(x2, y2);
    
    ctx.stroke();


};
//Función para graficar la fuente según los parámetros
const graphSource=(label,par)=>{ //par=[x,y,rho,rint,rext]
    ctx.beginPath();
    ctx.strokeStyle='blue';
    ctx.lineWidth=2;
    ctx.fillStyle='skyblue';
    switch (label){
        case 'wire':
            //Punto en (x,y)
            ctx.arc(toCanvasX(par[0]),toCanvasY(par[1]),5,0,2*Math.PI);
            ctx.fill();
            break;
        case 'cylinder':
            //disco en (x,y) y radio rint
            ctx.arc(toCanvasX(par[0]),toCanvasY(par[1]),par[3],0,2*Math.PI);
            ctx.fill();
            break;
        case 'sphere':
            //disco en (x,y) y radio rint
            ctx.arc(toCanvasX(par[0]),toCanvasY(par[1]),par[3],0,2*Math.PI);
            ctx.fill();
            break;
        case 'flath':
            //linea horizontal en y cte
            ctx.moveTo(0,toCanvasY(par[1]));
            ctx.lineTo(scene.width,toCanvasY(par[1]));
            break;
        case 'flatv':
            //linea vertical en x cte
            ctx.moveTo(toCanvasX(par[0]),0);
            ctx.lineTo(toCanvasX(par[0]),scene.height);
            break;
    }
    ctx.stroke();
};

//Esta función grafica en el canvas la superposición de campos
const graphFields=(typeField)=>{
    //Se vacía el canvas primero
    ctx.clearRect(0,0,scene.width,scene.height);
    //Graficamos los ejes
    drawArrow(0,scene.height/2,scene.width,scene.height/2,scene.width,'white',5,50); //Eje horizontal
    drawArrow(scene.width/2,scene.height,scene.width/2,0,scene.height,'white',5,30); //Eje vertical

    
    //Primero las fuentes
    for (key of Object.keys(storedFields)){
        //Campo correspondiente a esa fuente
        const f=storedFields[key];
        //Parámetros correspondientes a esa fuente
        const par=storedProperties[key];

        //Graficamos esa fuente
        graphSource(key.split('-')[0],par);
    }


    //Ahora se grafica el campo total
    let ExList=[];
    let EyList=[];
    let points=[];
    //Graficamos las flechas de campo en función de x e y
    const dx=20;
    const dy=20;
    const scaleFactor = 20;
    for (let x = -originX; x < originX; x += dx) {
        for (let y = -originY; y < originY; y += dy) {
            let Ex = 0;
            let Ey = 0;
            let Bx = 0;
            let By = 0;

            for (const key of Object.keys(storedFields)) {
                const [xs, ys, ro, ri, re, I] = storedProperties[key];
                const f = storedFields[key];
                const label = key.split('-')[0];

                const dx0 = x - xs;
                const dy0 = y - ys;

                switch (label) {
                    case 'flath':
                        if (typeField==='electric'){
                            Ey += f(dx0, dy0, ro, ri, re, I);
                        }else{
                            Ey+=0;
                        }
                        break;
                    case 'flatv':
                        if (typeField==='electric'){
                            Ex += f(dx0, dy0, ro, ri, re, I);
                        }else{
                            Ex+=0;
                        }
                        break;
                    case 'wire':
                        if (typeField==='electric'){
                            const E = f(dx0, dy0, ro, ri, re, I);
                            const R = Math.sqrt(dx0 ** 2 + dy0 ** 2);
                            if (R > 1e-6) {  // evitamos división por cero
                                Ex += E * (dx0 / R);
                                Ey += E * (dy0 / R);
                            }
                        }else{
                            const B = f(dx0, dy0, ro, ri, re, I);
                            const R = Math.sqrt(dx0 ** 2 + dy0 ** 2);
                            if (R > 1e-6) {  // evitamos división por cero
                                Bx += -B * (dy0 / R);
                                By += B * (dx0 / R);
                            }
                        }
                        break;
                    case 'cylinder':
                        if (typeField==='electric'){
                            const E = f(dx0, dy0, ro, ri, re, I);
                            const R = Math.sqrt(dx0 ** 2 + dy0 ** 2);
                            if (R > 1e-6) {  // evitamos división por cero
                                Ex += E * (dx0 / R);
                                Ey += E * (dy0 / R);
                            }
                        }else{
                            const B = f(dx0, dy0, ro, ri, re, I);
                            const R = Math.sqrt(dx0 ** 2 + dy0 ** 2);
                            if (R > 1e-6) {  // evitamos división por cero
                                Bx += -B * (dy0 / R);
                                By += B * (dx0 / R);
                            }
                        }
                        break;
                    case 'sphere':
                        if (typeField==='electric'){
                            const E = f(dx0, dy0, ro, ri, re);
                            const R = Math.sqrt(dx0 ** 2 + dy0 ** 2);
                            if (R > 1e-6) {  // evitamos división por cero
                                Ex += E * (dx0 / R);
                                Ey += E * (dy0 / R);
                            }
                        }else{
                            Ex += 0;
                            Ey += 0;
                        }
                        break;
                    default:
                        console.log("No se han elegido ninguna de las opciones para graficar.");
                        break;
                        
                }
            }

            // Guardamos los valores y la posición
            points.push({ x, y, Ex, Ey });
            //Para los campos eléctricos (en rojo)
            const xi = toCanvasX(x);
            const yi = toCanvasY(y);
            const xf = toCanvasX(x + Ex * scaleFactor);
            const yf = toCanvasY(y + Ey * scaleFactor);
            drawArrow(xi, yi, xf, yf, Math.sqrt((xf-xi)**2 + (yf-yi)**2), 'red', 1,2);
            //Lo mismo para los campos magnéticos (en verde)
            const xfb = toCanvasX(x + Bx * scaleFactor);
            const yfb = toCanvasY(y + By * scaleFactor);
            drawArrow(xi, yi, xfb, yfb, Math.sqrt((xfb-xi)**2 + (yfb-yi)**2), 'green', 1,2);
        }
    }
};




















//Funciones de los botones
//El botón "newSource" abre un menú con la configuración de la nueva fuente
//El botón "addButton" crea la fuente y la añade al panel "sourcePanel"
const newSourceButton=document.querySelector("#newSource");
const addSourceButton=document.querySelector("#addButton");
addSourceButton.disabled=true; //esta deshabilitado al inicio
//Funcionalidad de los botones
newSourceButton.addEventListener('click',()=>{
    //la configuración de la nueva fuente se muestra, igual que el "addButton"
    document.querySelector('#fieldOptions').classList.toggle('show');
    document.querySelector('#sourceOptions').classList.toggle('show');
    document.querySelector('#sourceProperties').classList.toggle('show');
    document.querySelector('#addButton').classList.toggle('show');
    addSourceButton.disabled=!addSourceButton.disabled; //invierto habilitación
});
addSourceButton.addEventListener('click',()=>{

    document.querySelector("#sourceOptions").classList.remove('show');
    document.querySelector("#sourceProperties").classList.remove('show');
    document.querySelector("#addButton").classList.remove('show');
    document.querySelector("#fieldOptions").classList.remove('show');
    addSourceButton.disabled=true; //lo deshabilito

    //Esto almacena el valor del tipo de fuente elegida
    const typeSource=document.querySelector('input[name="sourceOp"]:checked')?.value;
    const fieldSource=document.querySelector('input[name="fieldOp"]:checked')?.value;
    console.log(typeSource);

    //Ahora agregamos el campo a la lista
    const fieldFunction=opSourceField(typeSource,fieldSource);
    const x0=parseFloat(document.querySelector("#x").value);
    const y0=parseFloat(document.querySelector("#y").value);
    const rho=parseFloat(document.querySelector("#rho").value);
    const I=parseFloat(document.querySelector("#I").value);
    const rint=parseFloat(document.querySelector("#rint").value);
    const rext=parseFloat(document.querySelector("#rext").value);
    const properties=[x0,y0,rho,rint,rext,I];
    addField(typeSource,fieldFunction,properties);

    //Graficamos el campo superposición en el canvas
    graphFields(fieldSource);
});


