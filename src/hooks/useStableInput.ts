import { useCallback, useRef } from 'react';

/**
 * Hook para gerenciar inputs de forma estável, evitando perda de foco
 * devido a re-renderizações desnecessárias
 */
export const useStableInput = <T>(
  value: T,
  onChange: (value: T) => void,
  debounceMs: number = 300
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastValueRef = useRef<T>(value);

  const stableOnChange = useCallback((newValue: T) => {
    // Atualiza imediatamente para UI responsiva
    lastValueRef.current = newValue;
    
    // Debounce para evitar chamadas excessivas
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (lastValueRef.current !== value) {
        onChange(lastValueRef.current);
      }
    }, debounceMs);
  }, [onChange, value, debounceMs]);

  return {
    value: lastValueRef.current,
    onChange: stableOnChange
  };
};

/**
 * Hook para criar handlers de evento estáveis
 */
export const useStableHandlers = <T extends Record<string, any>>(
  handlers: T,
  deps: any[]
): T => {
  const handlersRef = useRef<T>(handlers);
  
  // Atualiza apenas quando as dependências mudam
  const depsRef = useRef(deps);
  const depsChanged = depsRef.current.some((dep, index) => dep !== deps[index]);
  
  if (depsChanged) {
    handlersRef.current = handlers;
    depsRef.current = deps;
  }
  
  return handlersRef.current;
};