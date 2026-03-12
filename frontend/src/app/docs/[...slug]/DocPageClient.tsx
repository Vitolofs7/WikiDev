'use client'
import { CodeRunner } from '@/code-execution/components/CodeRunner'

import ArraysDoc from '@/content/javascript/arrays.mdx'
import PromisesDoc from '@/content/javascript/promises.mdx'
// Python
import IntroduccionDoc from '@/content/python/introduccion.mdx'
import OperacionesBasicasNumerosDoc from '@/content/python/operacionesBasicasNumeros.mdx'
import OperadoresExpresionesDoc from '@/content/python/operadoresExpresiones.mdx'
import VariablesDoc from '@/content/python/variables.mdx'
import StringsDoc from '@/content/python/strings.mdx'
import ListsDoc from '@/content/python/lists.mdx'
import DecoratorsDoc from '@/content/python/decorators.mdx'
import SortingDoc from '@/content/algorithms/sorting.mdx'

const components = { CodeRunner }

const docs: Record<string, React.ComponentType<any>> = {
  'javascript/arrays': ArraysDoc,
  'javascript/promises': PromisesDoc,
  'python/introduccion': IntroduccionDoc,
  'python/operaciones-basicas-numeros': OperacionesBasicasNumerosDoc,
  'python/operadores-expresiones': OperadoresExpresionesDoc,
  'python/variables': VariablesDoc,
  'python/strings': StringsDoc,
  'python/lists': ListsDoc,
  'python/decorators': DecoratorsDoc,
  'algorithms/sorting': SortingDoc,
}

interface Props {
  docKey: string
}

export function DocPageClient({ docKey }: Props) {
  const Content = docs[docKey]
  if (!Content) return null

  return (
    <article className="prose-docs">
      <Content components={components} />
    </article>
  )
}