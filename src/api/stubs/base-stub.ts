/**
 * Cria um stub de API que simula latência de rede
 * @param data Dados a serem retornados
 * @param delay Latência em ms (padrão: 200-500ms aleatório)
 */
export function createStub<T>(data: T, delay?: number): Promise<T> {
  const actualDelay = delay ?? Math.floor(Math.random() * 300) + 200;
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), actualDelay);
  });
}

/**
 * Cria um stub de API que simula erro
 * @param message Mensagem de erro
 * @param delay Latência em ms (padrão: 200-500ms aleatório)
 */
export function createErrorStub(
  message: string,
  delay?: number,
): Promise<never> {
  const actualDelay = delay ?? Math.floor(Math.random() * 300) + 200;
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), actualDelay);
  });
}
