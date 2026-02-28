import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderApi } from '../../api/orderApi.js';
import { paymentApi } from '../../api/paymentApi.js';
import { useAuth } from '../../state/AuthContext.jsx';
import { Card, CardHeader, CardBody } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { formatAmount, formatDate } from '../../utils/format.js';
import { PAYMENT_TYPE_OPTIONS, PAYMENT_MAX_ESPECES_DH, PAYMENT_TYPE, COMMANDE_STATUT } from '../../constants/backend.js';
import { confirmDialog } from '../../utils/confirm.js';

export function OrderDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [order, setOrder] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    montant: '',
    typePaiement: PAYMENT_TYPE.ESPECES,
    datePaiement: new Date().toISOString().slice(0, 10),
    reference: '',
    banque: '',
    dateEcheance: '',
  });
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadOrder = async () => {
    try {
      const data = await orderApi.getById(id);
      setOrder(data);
    } catch (e) {
      setError(e.message || 'Commande introuvable');
    }
  };

  const loadPayments = async () => {
    try {
      const data = await paymentApi.getByOrder(id);
      setPayments(Array.isArray(data) ? data : []);
    } catch (_) {}
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        await loadOrder();
        if (isAdmin) await loadPayments();
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (id) load();
    return () => { cancelled = true; };
  }, [id, isAdmin]);

  useEffect(() => {
    if (isAdmin && order && payments.length > 0) {
      loadOrder();
    }
  }, [isAdmin, order, payments.length]);

  const handleAddPayment = async (e) => {
    e.preventDefault();
    setPaymentError('');
    const montant = Number(paymentForm.montant);
    if (paymentForm.typePaiement === PAYMENT_TYPE.ESPECES && montant > PAYMENT_MAX_ESPECES_DH) {
      setPaymentError('Espèces : maximum 20 000 DH');
      return;
    }
    setPaymentSubmitting(true);
    try {
      const payload = {
        montant,
        typePaiement: paymentForm.typePaiement,
        datePaiement: paymentForm.datePaiement,
        reference: paymentForm.reference || null,
        banque: paymentForm.banque || null,
        dateEcheance: paymentForm.dateEcheance || null,
      };
      await paymentApi.create(id, payload);
      await loadPayments();
      await loadOrder();
      setPaymentModal(false);
      setPaymentError('');
      setPaymentForm({
        montant: '',
        typePaiement: PAYMENT_TYPE.ESPECES,
        datePaiement: new Date().toISOString().slice(0, 10),
        reference: '',
        banque: '',
        dateEcheance: '',
      });
    } catch (err) {
      setPaymentError(err.message || 'Erreur lors de l\'enregistrement du paiement');
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    setActionLoading(true);
    setError('');
    try {
      await orderApi.confirm(id);
      await loadOrder();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    const ok = await confirmDialog('Annuler cette commande ?', '', 'Annuler la commande', 'Retour');
    if (!ok) return;
    setActionLoading(true);
    setError('');
    try {
      await orderApi.cancel(id);
      await loadOrder();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error}
        <Link to="/orders" className="ml-4 text-primary-600 hover:underline">Retour</Link>
      </div>
    );
  }

  const restant = order?.montantRestant ?? 0;
  const canConfirm = isAdmin && order?.statut === COMMANDE_STATUT.PENDING && restant <= 0;
  const canCancel = isAdmin && order?.statut === COMMANDE_STATUT.PENDING;
  const canAddPayment = isAdmin && order?.statut === COMMANDE_STATUT.PENDING && restant > 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <CardHeader
          title={`Commande #${order?.id}`}
          action={
            <div className="flex flex-wrap gap-2">
              {canAddPayment && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => {
                    setPaymentError('');
                    setPaymentModal(true);
                  }}
                >
                  Ajouter un paiement
                </Button>
              )}
              {canConfirm && (
                <Button variant="success" size="sm" onClick={handleConfirm} loading={actionLoading}>
                  Confirmer la commande
                </Button>
              )}
              {canCancel && (
                <Button variant="danger" size="sm" onClick={handleCancel} loading={actionLoading}>
                  Annuler
                </Button>
              )}
              <Link to="/orders">
                <Button variant="secondary" size="sm">Retour</Button>
              </Link>
            </div>
          }
        />
        <CardBody className="space-y-6">
          {error && order && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex flex-wrap gap-4">
            <span><strong>Client :</strong> {order?.customerNom}</span>
            <span><Badge value={order?.statut} /></span>
            <span><strong>Restant dû :</strong> {formatAmount(order?.montantRestant)}</span>
          </div>

          {order?.lignes?.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium text-slate-700">Lignes</h3>
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-600">Produit</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-600">Qté</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-600">P.U.</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {order.lignes.map((l) => (
                    <tr key={l.id}>
                      <td className="px-4 py-2">{l.productNom}</td>
                      <td className="px-4 py-2 text-right">{l.quantite}</td>
                      <td className="px-4 py-2 text-right">{formatAmount(l.prixUnitaire)}</td>
                      <td className="px-4 py-2 text-right">{formatAmount(l.totalLigne)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <dl className="grid grid-cols-1 gap-2 border-t border-slate-200 pt-4 sm:grid-cols-2">
            <div><dt className="text-slate-500">Sous-total HT</dt><dd>{formatAmount(order?.sousTotal)}</dd></div>
            <div><dt className="text-slate-500">Remise fidélité</dt><dd>{formatAmount(order?.remiseFidelite)}</dd></div>
            <div><dt className="text-slate-500">Remise promo</dt><dd>{formatAmount(order?.remisePromo)}</dd></div>
            <div><dt className="text-slate-500">HT après remise</dt><dd>{formatAmount(order?.montantHTApresRemise)}</dd></div>
            <div><dt className="text-slate-500">TVA 20%</dt><dd>{formatAmount(order?.tva)}</dd></div>
            <div><dt className="text-slate-500 font-medium">Total TTC</dt><dd className="font-medium">{formatAmount(order?.totalTTC)}</dd></div>
            <div><dt className="text-slate-500 font-medium">Montant restant</dt><dd className="font-medium">{formatAmount(order?.montantRestant)}</dd></div>
          </dl>
        </CardBody>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader title="Paiements" />
          <CardBody>
            {payments.length === 0 ? (
              <p className="text-slate-500">Aucun paiement.</p>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-600">N°</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-600">Type</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-600">Montant</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-600">Statut</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-2">{p.numeroPaiement}</td>
                      <td className="px-4 py-2"><Badge value={p.typePaiement} /></td>
                      <td className="px-4 py-2 text-right">{formatAmount(p.montant)}</td>
                      <td className="px-4 py-2"><Badge value={p.statut} /></td>
                      <td className="px-4 py-2">{formatDate(p.datePaiement)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      )}

      <Modal
        open={paymentModal}
        onClose={() => {
          setPaymentModal(false);
          setPaymentError('');
        }}
        title="Nouveau paiement"
      >
        <form onSubmit={handleAddPayment} className="space-y-4">
          {paymentError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {paymentError}
            </p>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
            <select
              value={paymentForm.typePaiement}
              onChange={(e) => setPaymentForm((f) => ({ ...f, typePaiement: e.target.value }))}
              className="input-field"
            >
              {PAYMENT_TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <Input
            label="Montant (DH)"
            type="number"
            step="0.01"
            min="0.01"
            value={paymentForm.montant}
            onChange={(e) => setPaymentForm((f) => ({ ...f, montant: e.target.value }))}
            required
          />
          <Input
            label="Date paiement"
            type="date"
            value={paymentForm.datePaiement}
            onChange={(e) => setPaymentForm((f) => ({ ...f, datePaiement: e.target.value }))}
            required
          />
          {paymentForm.typePaiement === PAYMENT_TYPE.ESPECES && (
            <Input
              label="Numéro de reçu (obligatoire)"
              value={paymentForm.reference}
              onChange={(e) => setPaymentForm((f) => ({ ...f, reference: e.target.value }))}
              required
            />
          )}
          {(paymentForm.typePaiement === PAYMENT_TYPE.CHEQUE || paymentForm.typePaiement === PAYMENT_TYPE.VIREMENT) && (
            <>
              <Input
                label={paymentForm.typePaiement === PAYMENT_TYPE.CHEQUE ? 'N° chèque (obligatoire)' : 'Référence virement (obligatoire)'}
                value={paymentForm.reference}
                onChange={(e) => setPaymentForm((f) => ({ ...f, reference: e.target.value }))}
                required
              />
              <Input
                label="Banque (obligatoire)"
                value={paymentForm.banque}
                onChange={(e) => setPaymentForm((f) => ({ ...f, banque: e.target.value }))}
                required
              />
              {paymentForm.typePaiement === PAYMENT_TYPE.CHEQUE && (
                <Input
                  label="Date échéance (obligatoire)"
                  type="date"
                  value={paymentForm.dateEcheance}
                  onChange={(e) => setPaymentForm((f) => ({ ...f, dateEcheance: e.target.value }))}
                  required
                />
              )}
            </>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="success" loading={paymentSubmitting}>
              Enregistrer le paiement
            </Button>
            <Button type="button" variant="secondary" onClick={() => setPaymentModal(false)}>
              Annuler
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
