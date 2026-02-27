

export const USER_ROLE = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
};

export const COMMANDE_STATUT = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELED: 'CANCELED',
  REJECTED: 'REJECTED',
};

export const COMMANDE_STATUT_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: COMMANDE_STATUT.PENDING, label: 'En attente' },
  { value: COMMANDE_STATUT.CONFIRMED, label: 'Confirmée' },
  { value: COMMANDE_STATUT.CANCELED, label: 'Annulée' },
  { value: COMMANDE_STATUT.REJECTED, label: 'Rejetée' },
];

export const CUSTOMER_TIER = {
  BASIC: 'BASIC',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
};

export const PAYMENT_TYPE = {
  ESPECES: 'ESPECES',
  CHEQUE: 'CHEQUE',
  VIREMENT: 'VIREMENT',
};

export const PAYMENT_TYPE_OPTIONS = [
  { value: PAYMENT_TYPE.ESPECES, label: 'Espèces (max 20 000 DH)' },
  { value: PAYMENT_TYPE.CHEQUE, label: 'Chèque' },
  { value: PAYMENT_TYPE.VIREMENT, label: 'Virement' },
];

export const PAYMENT_MAX_ESPECES_DH = 20_000;

export const PAYMENT_STATUS = {
  EN_ATTENTE: 'EN_ATTENTE',
  ENCAISSE: 'ENCAISSE',
  REJETE: 'REJETE',
};

export const PROMO_CODE_PATTERN = /^PROMO-[A-Z0-9]{4}$/;

export const TVA_RATE = 0.2;
