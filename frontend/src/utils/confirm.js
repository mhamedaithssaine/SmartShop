import Swal from 'sweetalert2';

/**
 * Style SweetAlert2 cohérent avec le thème sombre de la plateforme (slate / violet).
 * @see https://sweetalert2.github.io/
 */

/** Thème sombre aligné sur le dashboard (slate-950, violet) */
const theme = {
  background: '#0f172a',
  color: '#e2e8f0',
  confirmButtonColor: '#8b5cf6',
  cancelButtonColor: '#475569',
};

/**
 * Affiche une boîte de confirmation (remplace window.confirm).
 * @param {string} title - Titre de l'alerte
 * @param {string} [text] - Texte optionnel
 * @param {string} [confirmText='Confirmer']
 * @param {string} [cancelText='Annuler']
 * @returns {Promise<boolean>} true si confirmé, false si annulé
 */
export async function confirmDialog(title, text = '', confirmText = 'Confirmer', cancelText = 'Annuler') {
  const result = await Swal.fire({
    title,
    text: text || undefined,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    background: theme.background,
    color: theme.color,
    confirmButtonColor: theme.confirmButtonColor,
    cancelButtonColor: theme.cancelButtonColor,
    customClass: {
      popup: 'swal-platform',
      title: 'swal-platform-title',
      htmlContainer: 'swal-platform-body',
      confirmButton: 'swal-platform-confirm',
      cancelButton: 'swal-platform-cancel',
    },
    buttonsStyling: false,
  });
  return result.isConfirmed;
}
