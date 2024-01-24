# -*- coding: utf-8 -*-
"""
Created on Tue Jan 23 20:01:41 2024

@author: jgris
"""
from scipy.optimize import curve_fit
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np


#Graficar funcion
def graficar(datos_cargados,etiqueta_estado):
    if datos_cargados is not None:
        plt.scatter(np.array(datos_cargados[:,0]),
                    np.array(datos_cargados[:,1]))
        plt.xlabel('x')
        plt.ylabel('y')
        plt.title('Gráfico de y(x)')
        plt.show()
        
        etiqueta_estado.config(text="Estado: Gráfico realizado exitosamente.")
    else:
        etiqueta_estado.config(text="Estado: Carga los datos antes de intentar graficar.")
    
    """
    x=datos[:1]
    y=datos[:2]
    plt.plot(x,y,'r-')
    plt.title(f'Grafico de {col2}({col1})')
    plt.xlabel(f'{col1}')
    plt.ylabel(f'{col2}')
    plt.show()
    """
    
#Ajuste por cuadrados minimos lineal
def regresion(datos_cargados,etiqueta_estado,etiqueta_ajuste,opcion):    
    if datos_cargados is not None:
        try:
            
            if opcion==1:
                def f(x,a,b):
                    return a*x+b
            elif opcion==2:
                def f(x,a,b,c):
                    return a*x**2+b*x+c
            elif opcion==3:
                def f(x,a,b,c):
                    return a*np.exp(b*x+c)
            else:
                def f(x,a,b,c):
                    return a*np.sin(b*x+c)
            
            
            x=np.array(datos_cargados[:,0])
            y=np.array(datos_cargados[:,1])
            
            param,covarianza=curve_fit(f,x,y)
            print(param)
           
            
            
            y_ajuste=f(x,*param)
            
            plt.scatter(np.array(datos_cargados[:,0]),
                        np.array(datos_cargados[:,1]), label="Datos")
            plt.plot(x,y_ajuste,'g-',label="Ajuste")
            plt.xlabel('x')
            plt.ylabel('y')
            plt.title('Gráfico de y(x)')
            plt.legend()
            plt.grid(True)
            plt.show()
            
            
            err=np.diag(covarianza)
            print(err)
            
            
            etiqueta_estado.config(text="Estado: Ajuste con parámetros definidos.")
            
            if opcion==1:
                etiqueta_ajuste.config(text=f"Ajuste lineal: y = ({param[0]:.2f}+-{err[0]:.2f})x + ({param[1]:.2f}+-{err[1]:.2f})")
            elif opcion==2:
                etiqueta_ajuste.config(text=f"Ajuste cuadrático: y = ({param[0]:.2f}+-{err[0]:.2f})x**2 + ({param[1]:.2f}+-{err[1]:.2f})x + ({param[2]:.2f}+-{err[2]:.2f})")
            elif opcion==3:
                etiqueta_ajuste.config(text=f"Ajuste exponencial: y = ({param[0]:.2f}+-{err[0]:.2f})exp(({param[1]:.2f}+-{err[1]:.2f})x + ({param[2]:.2f}+-{err[2]:.2f}))")
            else:
                etiqueta_ajuste.config(text=f"Ajuste sinusoidal: y = ({param[0]:.2f}+-{err[0]:.2f})sin(({param[1]:.2f}+-{err[1]:.2f})x + ({param[2]:.2f}+-{err[2]:.2f}))")
           
        except RuntimeError:
            etiqueta_estado.config(text="Estado: Ajuste con parámetros desbordados.")
    else:
        etiqueta_estado.config(text="Estado: Carga los datos antes de intentar ajustar.")
    
        

def trans_fourier(datos_cargados,etiqueta_estado,etiqueta_fourier):
    if datos_cargados is not None:
        try:
            x=np.array(datos_cargados[:,0])
            y=np.array(datos_cargados[:,1])
            
            dft_resultado = np.fft.fft(y)
            #espectro de frecuencias
            frecuencias = np.fft.fftfreq(len(x), d=(x[1]-x[0]))
            
            #amplitudes de la transformada
            amplitudes = np.abs(dft_resultado)
            
            #frecuencia de amplitud máxima
            amp_max=np.max(amplitudes)
            indice=np.argmax(amplitudes)
            frec_max=frecuencias[indice]
            
            # Grafica los datos originales y el espectro de frecuencias
            plt.subplot(2, 1, 1)
            plt.plot(x, y)
            plt.title('Datos Originales')
            
            plt.subplot(2, 1, 2)
            plt.plot(frecuencias, amplitudes)
            plt.title('Espectro de Frecuencias')
            plt.xlabel('Frecuencia')
            plt.ylabel('Amplitud')
            
            plt.tight_layout()
            plt.show()
            
            etiqueta_estado.config(text="Estado: Transformada realizada correctamente.")
            etiqueta_fourier.config(text=f'Estado: Transformada con amplitud máxima de {amp_max:.2f} y frecuencia máxima de {frec_max:.2f} .')
        except Exception as e:
            etiqueta_estado.config(text="Estado: Error en la carga del archivo.")
    else:
        etiqueta_estado.config(text="Estado: Carga los datos antes de intentar transformar.")








    