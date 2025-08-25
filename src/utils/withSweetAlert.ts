import Swal from 'sweetalert2'

/**
 * Wraps a promise (usually an HTTP request) and shows a SweetAlert success or error message.
 * @param {() => Promise<any>} fn - The async function to execute.
 * @param {string} successMsg - The message to show on success.
 * @param {string} [errorMsg] - The message to show on error (optional, will use error details if not provided).
 * @returns {Promise<any>} The result of the async function.
 */
export async function withSweetAlert<T>(fn: () => Promise<T>, successMsg: string, errorMsg?: string): Promise<T | undefined> {
  try {
    const result = await fn();
    await Swal.fire({
      icon: 'success',
      title: 'Success',
      text: successMsg,
      timer: 1500,
      showConfirmButton: false
    });
    return result;
  } catch (err: any) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMsg || err?.error?.body?.[0] || err?.message || 'Request failed.',
      timer: 2000,
      showConfirmButton: false
    });
    return undefined;
  }
}
