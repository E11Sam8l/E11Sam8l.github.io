/** Bound waits without leaving timers behind or cancelling shared module loads. */
export async function withResourceDeadline<T>(work: Promise<T>, milliseconds: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      work,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('Page resources took too long to load')), milliseconds)
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}
