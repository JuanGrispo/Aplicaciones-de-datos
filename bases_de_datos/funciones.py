# -*- coding: utf-8 -*-
"""
Created on Tue Jan 23 09:22:08 2024

@author: jgris
"""

import sqlite3 as sql
import numpy as np

#creador de tabla
def createTable(nombre,nombre_tabla):
    
    try:
        conn=sql.connect(nombre)
        cursor=conn.cursor() #creamos un cursor para crear la tabla
        cursor.execute(f'CREATE TABLE IF NOT EXISTS {nombre_tabla} (id INTEGER PRIMARY KEY);')
        conn.commit()
        print(f'Tabla {nombre_tabla} creada exitosamente')
    except Exception as e:
        print("No pudo crearse la tabla")
    finally:
        if conn:
            conn.close() #cerrar


#creador de campos
#tipos de campo: TEXT, INTEGER
def createField(nombre,nombre_tabla,campo,tipo):
    try:
        conn=sql.connect(nombre)
        cursor=conn.cursor() #creamos un cursor para crear la tabla
        
        cursor.execute(f'ALTER TABLE {nombre_tabla} ADD COLUMN {campo} {tipo};')
        conn.commit()
        print(f'Campo {campo} creado exitosamente')
    except Exception as e:
        print("No pudo crearse el campo")
    finally:
        if conn:
            conn.close() #cerrar

#creador de registros
def createRegister(nombre,nombre_tabla,registros):
    conn = sql.connect(nombre)
    cursor = conn.cursor()
    
    #obtiene los nombres de los campos y los convierte en una lista
    cursor.execute(f'PRAGMA table_info({nombre_tabla});')
    informacion_tabla = cursor.fetchall()

    # Extraer los nombres de los campos de la información de la tabla
    #columna[1] son los nombres, columna[2] son los tipos
    info_campos = [(columna[1],columna[2]) for columna in informacion_tabla]
    #esto me da una lista con los nombres de los campos
    nom=info_campos[1:]
    tipo=info_campos[2:]
    
    #campos sin id
    campos_sin_id=info_campos[1:]
    
    print(info_campos)
    
    try:
        """
        # Agregar registros a la tabla
        registros = [
            ("Juan", 25),
            ("María", 30),
            ("Pedro", 22)
        ]
        """
        camp=', '.join(n for n,_ in info_campos if n!='id')
        marcadores=', '.join(['?' for n,_ in info_campos if n!='id'])
        #cursor.execute(f'INSERT INTO {nombre_tabla} VALUES (?,?);', registros)
        cursor.execute(f'INSERT INTO {nombre_tabla} ({camp}) VALUES ({marcadores});', registros)
        conn.commit()
        print("Registro agregado exitosamente.")
    except Exception as e:
        print(f"Error al introducir los registros: {e}")
        if (len(registros)>len(nom)):
            print("Has excedido la cantidad de campos.")
        elif (len(registros)<len(nom)):
            print("Te faltaron valores para introducir.")
        else:
            print("El tipo de campo no coincide con lo que has escrito.")
    finally:
        if conn:
            conn.close() #cerrar
    
#funcion para ver los campos
def ver_campos(nombre,nombre_tabla):
    conn = sql.connect(nombre)
    cursor = conn.cursor()
    
    #obtiene los nombres de los campos y los convierte en una lista
    cursor.execute(f'PRAGMA table_info({nombre_tabla});')
    informacion_tabla = cursor.fetchall()

    # Extraer los nombres de los campos de la información de la tabla
    #columna[1] son los nombres, columna[2] son los tipos
    info_campos = [(columna[1],columna[2]) for columna in informacion_tabla]
    #esto me da una lista con los nombres de los campos
    print(info_campos)
    
    for nom,tipo in info_campos:
        print(f'Campo {nom}, tipo {tipo}')
    
    return info_campos



#obtener registros
def obt_reg(nombre,nombre_tabla):
    conn = sql.connect(nombre)
    cursor = conn.cursor()

    try:
        # Ejecutar una consulta SELECT para obtener todos los registros de la tabla
        cursor.execute(f'SELECT * FROM {nombre_tabla}')

        # Obtener todos los registros
        registros = cursor.fetchall()

        # Imprimir los registros (o realizar otras operaciones)
        return registros
    except Exception as e:
        print(f"Error al obtener registros: {e}")
    finally:
        if conn:
            conn.close()




#Borrar un registro
def del_reg(nombre, nombre_tabla, id_a_borrar):
    conn = sql.connect(nombre)
    cursor = conn.cursor()

    try:
        # Ejecutar una consulta DELETE para borrar el registro con el ID específico
        cursor.execute(f'DELETE FROM {nombre_tabla} WHERE id = ?', (id_a_borrar,))

        # Confirmar la operación
        conn.commit()
        print(f"Registro con ID {id_a_borrar} borrado exitosamente.")

    except Exception as e:
        print(f"Error al borrar el registro: {e}")
    finally:
        if conn:
            conn.close()


#obtener todas las tablas
def obtener_tablas(nombre_base):
    conn = sql.connect(nombre_base)
    cursor = conn.cursor()

    try:
        # Ejecutar una consulta SQL para obtener todas las tablas de la base de datos
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        resultados = cursor.fetchall()

        # Extraer los nombres de las tablas de los resultados
        tablas = [resultado[0] for resultado in resultados]

        return tablas
    except Exception as e:
        print(f"Error al obtener las tablas: {e}")
    finally:
        if conn:
            conn.close()


#Eliminar una tabla de la base de datos
def eliminar_tabla(nombre_base, nombre_tabla):
    conn = sql.connect(nombre_base)
    cursor = conn.cursor()

    try:
        # Ejecutar una consulta SQL para eliminar la tabla
        cursor.execute(f'DROP TABLE IF EXISTS {nombre_tabla}')

        # Confirmar la operación
        conn.commit()
        print(f"Tabla {nombre_tabla} eliminada exitosamente.")
    except Exception as e:
        print(f"Error al eliminar la tabla: {e}")
    finally:
        if conn:
            conn.close()



def eliminar_campo(nombre_base, nombre_tabla, nombre_campo):
    conn = sql.connect(nombre_base)
    cursor = conn.cursor()

    try:
        # Ejecutar una consulta SQL para eliminar el campo de la tabla
        cursor.execute(f'ALTER TABLE {nombre_tabla} DROP COLUMN {nombre_campo};')

        # Confirmar la operación
        conn.commit()
        print(f"Campo {nombre_campo} eliminado exitosamente de la tabla {nombre_tabla}.")
    except Exception as e:
        print(f"Error al eliminar el campo: {e}")
    finally:
        if conn:
            conn.close()


"""
# Ejemplo de uso
nombre_base_datos = "mi_base_de_datos2.db"
nombre_tabla = "mi_tabla"
campo="campo1"
tipo="TEXT"


# Crear la tabla
createTable(nombre_base_datos, nombre_tabla)

# Agregar campos a la tabla
createField(nombre_base_datos, nombre_tabla, campo,tipo)
createField(nombre_base_datos, nombre_tabla, "campo2","TEXT")
createField(nombre_base_datos, nombre_tabla, "campo3","INTEGER")


#vemos los campos de la tabla
ver_campos(nombre_base_datos,nombre_tabla)


#introduzco registro
#registro
reg=["a","b",5]
createRegister(nombre_base_datos, nombre_tabla,reg)
"""