'use client'
import { CodeRunner } from '@/code-execution/components/CodeRunner'
import dynamic from 'next/dynamic'

const components = { CodeRunner }

const docs: Record<string, React.ComponentType<any>> = {
  'javascript/arrays': dynamic(() => import('@/content/javascript/arrays.mdx')),
  'javascript/promises': dynamic(() => import('@/content/javascript/promises.mdx')),
  'algorithms/sorting': dynamic(() => import('@/content/algorithms/sorting.mdx')),
  // python/el-camino-del-programa
  'python/el-camino-del-programa/que-es-un-programa': dynamic(() => import('@/content/python/el-camino-del-programa/que-es-un-programa.mdx')),
  'python/el-camino-del-programa/ejecutar-python': dynamic(() => import('@/content/python/el-camino-del-programa/ejecutar-python.mdx')),
  'python/el-camino-del-programa/el-primer-programa': dynamic(() => import('@/content/python/el-camino-del-programa/el-primer-programa.mdx')),
  'python/el-camino-del-programa/valores-y-tipos': dynamic(() => import('@/content/python/el-camino-del-programa/valores-y-tipos.mdx')),
  'python/el-camino-del-programa/operadores-aritmeticos': dynamic(() => import('@/content/python/el-camino-del-programa/operadores-aritmeticos.mdx')),
  'python/el-camino-del-programa/lenguajes-formales-y-naturales': dynamic(() => import('@/content/python/el-camino-del-programa/lenguajes-formales-y-naturales.mdx')),
  'python/el-camino-del-programa/depuracion': dynamic(() => import('@/content/python/el-camino-del-programa/depuracion.mdx')),
  // python/control-de-flujo-y-operaciones-avanzadas
  'python/control-de-flujo-y-operaciones-avanzadas/sentencias-de-asignacion': dynamic(() => import('@/content/python/control-de-flujo-y-operaciones-avanzadas/sentencias-de-asignacion.mdx')),
  'python/control-de-flujo-y-operaciones-avanzadas/como-python-evalua-el-codigo': dynamic(() => import('@/content/python/control-de-flujo-y-operaciones-avanzadas/como-python-evalua-el-codigo.mdx')),
  'python/control-de-flujo-y-operaciones-avanzadas/condicionales': dynamic(() => import('@/content/python/control-de-flujo-y-operaciones-avanzadas/condicionales.mdx')),
  'python/control-de-flujo-y-operaciones-avanzadas/operaciones-con-cadenas-de-texto': dynamic(() => import('@/content/python/control-de-flujo-y-operaciones-avanzadas/operaciones-con-cadenas-de-texto.mdx')),
  'python/control-de-flujo-y-operaciones-avanzadas/entrada-de-datos-y-validacion': dynamic(() => import('@/content/python/control-de-flujo-y-operaciones-avanzadas/entrada-de-datos-y-validacion.mdx')),
  'python/control-de-flujo-y-operaciones-avanzadas/bucles': dynamic(() => import('@/content/python/control-de-flujo-y-operaciones-avanzadas/bucles.mdx')),
  'python/control-de-flujo-y-operaciones-avanzadas/compresion-en-python': dynamic(() => import('@/content/python/control-de-flujo-y-operaciones-avanzadas/compresion-en-python.mdx')),
  'python/control-de-flujo-y-operaciones-avanzadas/estructuras-de-datos-basicas': dynamic(() => import('@/content/python/control-de-flujo-y-operaciones-avanzadas/estructuras-de-datos-basicas.mdx')),
  'python/control-de-flujo-y-operaciones-avanzadas/depuracion-aplicada': dynamic(() => import('@/content/python/control-de-flujo-y-operaciones-avanzadas/depuracion-aplicada.mdx')),
  // python/funciones-basicas
  'python/funciones-basicas/que-es-una-funcion': dynamic(() => import('@/content/python/funciones-basicas/que-es-una-funcion.mdx')),
  'python/funciones-basicas/sintaxis-y-estructura': dynamic(() => import('@/content/python/funciones-basicas/sintaxis-y-estructura.mdx')),
  'python/funciones-basicas/llamadas-a-funciones': dynamic(() => import('@/content/python/funciones-basicas/llamadas-a-funciones.mdx')),
  'python/funciones-basicas/parametros-y-argumentos': dynamic(() => import('@/content/python/funciones-basicas/parametros-y-argumentos.mdx')),
  'python/funciones-basicas/valores-de-retorno': dynamic(() => import('@/content/python/funciones-basicas/valores-de-retorno.mdx')),
  'python/funciones-basicas/funciones-integradas-basicas': dynamic(() => import('@/content/python/funciones-basicas/funciones-integradas-basicas.mdx')),
  'python/funciones-basicas/variables-y-ambito': dynamic(() => import('@/content/python/funciones-basicas/variables-y-ambito.mdx')),
  'python/funciones-basicas/funciones-matematicas': dynamic(() => import('@/content/python/funciones-basicas/funciones-matematicas.mdx')),
  'python/funciones-basicas/documentacion': dynamic(() => import('@/content/python/funciones-basicas/documentacion.mdx')),
  'python/funciones-basicas/flujo-de-ejecucion': dynamic(() => import('@/content/python/funciones-basicas/flujo-de-ejecucion.mdx')),
  // python/funciones-intermedias
  'python/funciones-intermedias/composicion-de-funciones': dynamic(() => import('@/content/python/funciones-intermedias/composicion-de-funciones.mdx')),
  'python/funciones-intermedias/argumentos-avanzados': dynamic(() => import('@/content/python/funciones-intermedias/argumentos-avanzados.mdx')),
  'python/funciones-intermedias/funciones-integradas-intermedias': dynamic(() => import('@/content/python/funciones-intermedias/funciones-integradas-intermedias.mdx')),
  'python/funciones-intermedias/logica-booleana-any-all': dynamic(() => import('@/content/python/funciones-intermedias/logica-booleana-any-all.mdx')),
  'python/funciones-intermedias/iteracion-y-control': dynamic(() => import('@/content/python/funciones-intermedias/iteracion-y-control.mdx')),
  'python/funciones-intermedias/iteracion-inversa-reversed': dynamic(() => import('@/content/python/funciones-intermedias/iteracion-inversa-reversed.mdx')),
  'python/funciones-intermedias/funciones-texto-y-numeros': dynamic(() => import('@/content/python/funciones-intermedias/funciones-texto-y-numeros.mdx')),
  'python/funciones-intermedias/funciones-adicionales': dynamic(() => import('@/content/python/funciones-intermedias/funciones-adicionales.mdx')),
  'python/funciones-intermedias/diagramas-de-pila': dynamic(() => import('@/content/python/funciones-intermedias/diagramas-de-pila.mdx')),
  // python/funciones-avanzadas
  'python/funciones-avanzadas/funciones-como-objetos': dynamic(() => import('@/content/python/funciones-avanzadas/funciones-como-objetos.mdx')),
  'python/funciones-avanzadas/funciones-anidadas-y-closures': dynamic(() => import('@/content/python/funciones-avanzadas/funciones-anidadas-y-closures.mdx')),
  'python/funciones-avanzadas/funciones-integradas-avanzadas': dynamic(() => import('@/content/python/funciones-avanzadas/funciones-integradas-avanzadas.mdx')),
  'python/funciones-avanzadas/evaluacion-dinamica': dynamic(() => import('@/content/python/funciones-avanzadas/evaluacion-dinamica.mdx')),
  'python/funciones-avanzadas/depuracion': dynamic(() => import('@/content/python/funciones-avanzadas/depuracion.mdx')),
  'python/funciones-avanzadas/lambda-introduccion': dynamic(() => import('@/content/python/funciones-avanzadas/lambda-introduccion.mdx')),
  'python/funciones-avanzadas/lambda-uso-basico': dynamic(() => import('@/content/python/funciones-avanzadas/lambda-uso-basico.mdx')),
  'python/funciones-avanzadas/lambda-funciones-integradas': dynamic(() => import('@/content/python/funciones-avanzadas/lambda-funciones-integradas.mdx')),
  'python/funciones-avanzadas/lambda-con-estructuras': dynamic(() => import('@/content/python/funciones-avanzadas/lambda-con-estructuras.mdx')),
  'python/funciones-avanzadas/lambda-avanzada': dynamic(() => import('@/content/python/funciones-avanzadas/lambda-avanzada.mdx')),
  'python/funciones-avanzadas/programacion-funcional': dynamic(() => import('@/content/python/funciones-avanzadas/lambda-programacion-funcional.mdx')),
  'python/funciones-avanzadas/casos-reales': dynamic(() => import('@/content/python/funciones-avanzadas/lambda-casos-reales.mdx')),
  'python/funciones-avanzadas/buenas-practicas': dynamic(() => import('@/content/python/funciones-avanzadas/lambda-buenas-practicas.mdx')),
  'python/funciones-avanzadas/trucos-avanzados': dynamic(() => import('@/content/python/funciones-avanzadas/lambda-trucos-avanzados.mdx')),

}

interface Props {
  docKey: string
}

export function DocPageClient({ docKey }: Props) {
  console.log('docKey recibido:', docKey)
  console.log('existe en docs:', docKey in docs)
  const Content = docs[docKey]
  if (!Content) return null

  return (
    <article className="prose-docs">
      <Content components={components} />
    </article>
  )
}