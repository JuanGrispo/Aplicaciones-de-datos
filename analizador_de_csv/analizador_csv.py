# -*- coding: utf-8 -*-
"""
Created on Tue Jan 23 20:01:58 2024

@author: jgris
"""
"""
import os


os.chdir("C:Users\\jgris\\archivos python\\analizador de csv")

directorio_actual = os.getcwd()

print("Directorio actual:", directorio_actual)

"""
#para archivos wav
from scipy.io import wavfile
#para achivos mp3
#from pydub import AudioSegment



import pandas as pd
from tkinter import *
from tkinter import filedialog
from scipy.optimize import curve_fit
import matplotlib.pyplot as plt
import numpy as np

from funciones import *

ventana=Tk()
ventana.title("Analizador de csv")
ventana.iconbitmap("imagenes/icono.ico")
ventana.geometry('600x300')
ventana.config(bg="sky blue")
ventana.resizable(0,0)#no permite cambiar dimensiones de ventana


bienvenida=Label(ventana,text="Bienvenidos al analizador de csv",anchor="nw")
bienvenida.pack()




#frame
frame=Frame(ventana,bg="sky blue")
frame.config(width="600",height="300")
frame.pack()


#boton para cargar datos
# Botón para cargar datos
boton_cargar =Button(frame, text="Cargar Datos", command=lambda:f_cargar_datos())
boton_cargar.pack(pady=20)

#etiqueta para comprobar si se importaron los datos
etiqueta_estado =Label(frame, text="")
etiqueta_estado.pack()

#etiqueta con las columnas del archivo csv
etiqueta_col=Label(frame,text="")
etiqueta_col.pack()

#etiqueta con los resultados de los ajustes
etiqueta_ajuste=Label(frame,text="")
etiqueta_ajuste.pack()

#etiqueta con los resultados de la transformada de fourier
etiqueta_fourier=Label(frame,text="")
etiqueta_fourier.pack()

def f_cargar_datos():
    # Abrir el cuadro de diálogo para seleccionar un archivo CSV
    archivo_path = filedialog.askopenfilename(filetypes=[("Archivos CSV", "*.csv")])
    if archivo_path:
            try:
                # Cargar datos con Pandas
                datos = pd.read_csv(archivo_path,decimal=',')
                
                datos=np.column_stack((np.array(datos.iloc[:,0]),np.array(datos.iloc[:,1])))
                print(datos.shape)
                #columnas=datos.columns.tolist()
                #print(columnas)
                """
                dicc_columnas={}
                
                texto_add="Columnas del archivo: "
                
                for i in columnas:
                    print(datos[i])
                    texto_add+=str(i)+"\n"
                    etiqueta_col.config(text=texto_add)
                    dicc_columnas={i : datos[i].tolist()}
                """
                # Actualizar el estado
                
                etiqueta_estado.config(text="Estado: Datos cargados y analizados correctamente.")
                
                #almacenamos los datos en una variable global
                global datos_cargados
                datos_cargados=datos
                
            except Exception as e:
                # Manejar errores al cargar o analizar los datos
                etiqueta_estado.config(text=f"Estado: Error: {str(e)}")


def wav_to_array():
    archivo_path = filedialog.askopenfilename(filetypes=[("Archivos WAV", "*.wav")])
    if archivo_path:
        try:
            #Esto solo da la amplitud de la señal
            tasa_muestreo,datos_wav=wavfile.read(archivo_path)
            #Para obtener el tiempo de la señal, debo crear el
            #array de tiempo
            tiempo = np.arange(len(datos_wav)) / tasa_muestreo
            
            datos=np.column_stack((tiempo,datos_wav))
            
            print(datos.shape)
            #almacenamos los datos en una variable global
            global datos_cargados
            datos_cargados=datos
            
            etiqueta_estado.config(text="Estado: Datos cargados y analizados correctamente.")
            
            
        except Exception as e:
            etiqueta_estado.config(text=f"Estado: Error: {str(e)}")

"""
def mp3_to_array():
    archivo_path = filedialog.askopenfilename(filetypes=[("Archivos MP3", "*.mp3")])
    
    try:
        # Cargar el archivo MP3 utilizando pydub
        audio = AudioSegment.from_mp3(archivo_path)

        # Obtener los datos de audio como un array NumPy
        audio_array = np.array(audio.get_array_of_samples())
        
        # Obtener el vector de tiempo en segundos
        #audio.frame_rate es la frecuencia de muestreo
        duracion = len(audio_array) / audio.frame_rate
        tiempo = np.linspace(0, duracion, len(audio_array))

        datos=np.column_stack(tiempo,audio_array)
        
        global datos_cargados
        datos_cargados=datos

        etiqueta_estado.config(text="Estado: Datos cargados y analizados correctamente.")

    except Exception as e:
        etiqueta_estado.config(text=f"Estado: Error: {str(e)}")
"""

#Creamos un menu
barra_menu=Menu(ventana)

menu=Menu(barra_menu,tearoff=0)
menu.add_command(label="Graficar y(x)",command=lambda:graficar(datos_cargados,etiqueta_estado))
#menu.add_command(label="Ajuste por cuadrados mínimos",command=lambda:regresion(datos_cargados, etiqueta_estado, etiqueta_ajuste,1))

#submenu en "ajuste por cuadrados minimos"
submenu=Menu(menu,tearoff=0)
submenu.add_command(label="Lineal y=a*x+b",
                    command=lambda:regresion(datos_cargados, etiqueta_estado, etiqueta_ajuste,1))
submenu.add_command(label="Cuadratica y=a*x**2 + b*x + c",
                    command=lambda:regresion(datos_cargados, etiqueta_estado, etiqueta_ajuste,2))
submenu.add_command(label="Exponencial y=a*exp(b*x+c)",
                    command=lambda:regresion(datos_cargados, etiqueta_estado, etiqueta_ajuste,3))
submenu.add_command(label="Onda y=a*sin(b*x+c)",
                    command=lambda:regresion(datos_cargados, etiqueta_estado, etiqueta_ajuste,4))
menu.add_cascade(label="Ajuste por cuadrados mínimos",menu=submenu)

menu.add_command(label="Transformada de Fourier",command=lambda:trans_fourier(datos_cargados,etiqueta_estado,etiqueta_fourier))
menu.add_separator()
menu.add_command(label="Salir",command=lambda:salida())





#menu para convertir archivos a datos
menu2=Menu(barra_menu,tearoff=0)
menu2.add_command(label="Convertir wav a datos",command=lambda:wav_to_array())
#menu2.add_command(label="Convertir mp3 a datos",command=lambda:mp3_to_array())


def salida():
    resultado=messagebox.askyesno("Salir del programa","¿Seguro que quieres salir?")
    if resultado:
        ventana.destroy()
    else:
        print("No has salido del programa.")
    
    
    
barra_menu.add_cascade(label="Archivo", menu=menu)
barra_menu.add_cascade(label="Conversión", menu=menu2)

#Añado la barra a la ventana
ventana.config(menu=barra_menu)

ventana.mainloop()
