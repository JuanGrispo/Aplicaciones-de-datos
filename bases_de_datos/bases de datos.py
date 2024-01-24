# -*- coding: utf-8 -*-
"""
Created on Tue Jan 23 09:19:59 2024

@author: jgris
"""

import os

directorio_actual = os.getcwd()
print("Directorio actual:", directorio_actual)



from PIL import Image, ImageTk
"""
def cargar_imagen(ruta, ancho, alto):
    imagen = Image.open(ruta)
    imagen = imagen.resize((ancho, alto), Image.antialias)
    imagen_tk = ImageTk.PhotoImage(imagen)
    return imagen_tk
"""


import tkinter as tk #Interfaz grafica
from funciones import * #importo las funciones



"""-------FUNCIONES ADICIONALES--------"""
def db_name_table(nombre,nombre_tabla):
    nombre_base=nombre + ".db"
    createTable(nombre_base, nombre_tabla) #Creamos tabla
    boton_db1.configure(state="disabled") #deshabilito el boton
    
    
    #Nueva configuración de botones y entradas
    mensaje_campos=tk.Label(frame,text="Agregar un campo: ",
                            anchor="center",bg='blue',fg="white")
    mensaje_campos.grid(row=4,column=0)
    
    entrada_campos=tk.Entry(frame,justify="center")
    entrada_campos.grid(row=4,column=1)
    
    mensaje_tipo=tk.Label(frame,text="Definir tipo: ",
                          anchor="center",bg='blue',fg="white")
    mensaje_tipo.grid(row=5,column=0)
    
    
    """
    entrada_tipo=tk.Entry(frame)
    entrada_tipo.grid(row=5,column=1)
    """
    entrada_tipo1=tk.Radiobutton(frame,text="flotante",value="FLOAT",variable=x).grid(row=5,column=1)
    entrada_tipo2=tk.Radiobutton(frame,text="texto",value="TEXT",variable=x).grid(row=6,column=1)
    entrada_tipo3=tk.Radiobutton(frame,text="fecha",value="DATETIME",variable=x).grid(row=7,column=1)
    
    campos=tk.Button(frame,text="Crear campo",
                     width=20,height=3,bg='blue',fg="white",
                     command=lambda:db_field(nombre_base,nombre_tabla,entrada_campos.get(),x.get()))
    campos.grid(row=8,column=1)
    terminar_campos=tk.Button(frame,text="Terminar",
                     width=20,height=3,bg='blue',fg="white",
                     command=lambda:terminar_field())
    terminar_campos.grid(row=9,column=1)
    
    
    
    def terminar_field():
        campos.configure(state="disabled")
        terminar_campos.configure(state="disabled")
        
        #consigo la lista de los campos
        info_camp=ver_campos(nombre_base, nombre_tabla)
        
        texto_campos="""Lista de campos: """
        lista_campos=tk.Label(frame,text=texto_campos,
                              anchor="center",bg='blue',fg="white")
        lista_campos.grid(row=10,column=0)
        
        
        for nom,tipo in info_camp:
            texto_campos+=f'{nom} {tipo} \n'
            lista_campos.config(text=texto_campos)
        
        
        
        #Creo un entry con su respectivo mensaje para introducir registros
        mens_registro=tk.Label(frame,text="Introduce registro",
                               anchor="center",bg='blue',fg="white")
        mens_registro.grid(row=0,column=2)
    
        ent_registro=tk.Entry(frame,justify="center")
        ent_registro.grid(row=1,column=2)
        
       
        #Boton para crear registro
        bot_registro=tk.Button(frame,text="Crear registro",
                         width=20,height=3,bg='blue',fg="white",
                         command=lambda:regist(nombre_base,nombre_tabla,ent_registro.get()))
        bot_registro.grid(row=2,column=2)    
        
        
        #lista de todos los registros
        texto_registros="""Todos los registros: """
        todos_registros=tk.Label(frame,text=texto_registros,
                                 anchor="center",bg='blue',fg="white")
        todos_registros.grid(row=10,column=1)
        
        
        
        
        #Botón para eliminar registro
        casilla_elim=tk.Entry(frame,textvariable=Id,justify="center").grid(row=4,column=2)
        bot_elim=tk.Button(frame,text="Eliminar registro por id",
                         width=20,height=3,bg='blue',fg="white",
                         command=lambda:eliminar_reg(nombre_base,nombre_tabla,Id.get()))
        bot_elim.grid(row=5,column=2)    
        
        
        
        #Botón para habilitar la creacion de otra tabla
        bot_reinicio=tk.Button(frame,text="Reiniciar proceso",
                         width=20,height=3,bg='blue',fg="white",
                         command=lambda:reiniciar())
        bot_reinicio.grid(row=6,column=2)
        
        
        
        #Casilla para ver las tablas y eliminar una tabla
        texto_tablas="""Todas las tablas: """
        todas_tablas=tk.Label(frame,text=texto_tablas,
                                 anchor="center",bg='blue',fg="white")
        todas_tablas.grid(row=10,column=2)
        
        
        
        ent_elim_tabla=tk.Entry(frame,textvariable=e_tabla,
                                justify="center").grid(row=7,column=2)
        bot_elim_tabla=tk.Button(frame,text="Borrar tabla",
                         width=20,height=3,bg='blue',fg="white",
                         command=lambda:borrar_tabla(nombre_base,e_tabla.get()))
        bot_elim_tabla.grid(row=8,column=2)
        
        
        #lo mismo para eliminar campos
        
        ent_elim_campo=tk.Entry(frame,textvariable=e_campo,
                                justify="center").grid(row=7,column=3)
        bot_elim_campo=tk.Button(frame,text="Borrar campo",
                         width=20,height=3,bg='blue',fg="white",
                         command=lambda:borrar_campo(nombre_base,nombre_tabla,e_campo.get()))
        bot_elim_campo.grid(row=8,column=3)
        
        
        
        
        
        #boton para actualizar campos,registros y tablas
        bot_actualizar=tk.Button(frame,text="Actualizar",
                         width=20,height=3,bg='green',fg="white",
                         command=lambda:actualizar(nombre_base,nombre_tabla))
        bot_actualizar.grid(row=9,column=2)
        
        
        def borrar_campo(nombre_base,nombre_tabla,nombre_campo):
            eliminar_campo(nombre_base, nombre_tabla, nombre_campo)
        
        #FUNCION ACTUALIZAR
        def actualizar(nombre_base,nombre_tabla):
            texto_campos="""Lista de campos: """
            texto_registros="""Todos los registros: """
            texto_tablas="""Todas las tablas: """
            tab=obtener_tablas(nombre_base)
            reg=obt_reg(nombre_base, nombre_tabla)
            cam=ver_campos(nombre_base, nombre_tabla)
            
            t_tab=""""""
            t_reg=""""""
            t_cam=""""""
            for t in tab:
                t_tab+=(str(t)+'\n')
                print(t_tab)
            for r in reg:
                t_reg+=(str(r)+'\n')
            for nomc,tipo in cam:
                t_cam+=f'{nomc}, tipo {tipo} \n'
            
            t_tablas=texto_tablas+t_tab
            t_registros=texto_registros+t_reg
            t_campos=texto_campos+t_cam
            todas_tablas.config(text=t_tablas)
            todos_registros.config(text=t_registros)
            lista_campos.config(text=t_campos)
            
            
            
        
        def borrar_tabla(nombre_base,nombre_tabla):
            eliminar_tabla(nombre_base, nombre_tabla)
        
        def reiniciar():
            boton_db1.configure(state="normal")
        
        
        def eliminar_reg(nombre_base,nombre_tabla,ID):
            del_reg(nombre_base, nombre_tabla, ID)
        
        def regist(nombre_base,nombre_tabla,cadena_registro):
            registro=cadena_registro.split(',')
            print(registro)
            createRegister(nombre_base,nombre_tabla,registro)
            
            #obtengo todos los registros y los imprimo abajo
            texto_adicional=""""""
            reg=obt_reg(nombre_base, nombre_tabla)
            for r in reg:
                texto_adicional+=str(r)+'\n'
            lista_registros=texto_registros+texto_adicional
            todos_registros.config(text=lista_registros)
        
                
        
    
    def db_field(nombre,nombre_tabla,campo,tipo):
        createField(nombre,nombre_tabla,campo,tipo) #Creamos campo
        


    












#Crear la ventana
ventana=tk.Tk()
ventana.iconbitmap("imagenes/icono.ico") #icono
ventana.title("Creador de bases de datos")
ventana.geometry('900x600')
ventana.config(bg="blue")
ventana.resizable(0,0)#no permite cambiar dimensiones de ventana


x=tk.StringVar()
Id=tk.IntVar()
e_tabla=tk.StringVar()
e_campo=tk.StringVar()

#Texto
bienvenida=tk.Label(ventana,text="Bienvenidos al creador de bases de datos.")
bienvenida.pack()





#Frame
frame=tk.Frame(ventana,bg='blue')
frame.config(width='900',height='600')
frame.pack()
#imagen del frame


"""
# Cargar la imagen
imagen_fondo = cargar_imagen("imagenes/fondo.jpg", 900, 600)

# Crear un Canvas dentro del Frame
canvas = tk.Canvas(frame, width=900, height=600)
canvas.pack(fill="both", expand=True)

# Colocar la imagen en el Canvas
canvas.create_image(0, 0, anchor="nw", image=imagen_fondo)
"""
"""
Imagen = tk.Label(frame, image=imagen)
Imagen.place(x=0, y=0, relwidth=1, relheight=1)  # Cubre toda la ventana
Imagen.pack()
"""

















"""------BOTONES------"""
#ayuda: puedo deshabilitar un botón con state:DISABLED

#Entrada para introducir nombre de base de datos y tabla
mensaje_nombrebd=tk.Label(frame,
                          text="Nombre de la base de datos",
                          anchor="center",bg='blue',fg="white")
mensaje_nombrebd.grid(row=0,column=0)
nombrebd=tk.Entry(frame,justify="center")
nombrebd.grid(row=0,column=1)

mensaje_tabla=tk.Label(frame,text="Nombre de la tabla",
                       anchor="center",bg='blue',fg="white")
mensaje_tabla.grid(row=1,column=0)
nombre_tabla=tk.Entry(frame,justify="center")
nombre_tabla.grid(row=1,column=1)

#Boton de crear base de datos y tabla
##nota: al usar "command", uso la función lambda para que la funcion se ejecute despues de crear el boton
boton_db1=tk.Button(frame,text="Crear base de datos y tabla",
                 width=20,height=3,bg='blue',fg="white",
                 command=lambda:db_name_table(nombrebd.get(),nombre_tabla.get()))
boton_db1.grid(row=2,column=1)



#Mantener la ventana
ventana.mainloop()