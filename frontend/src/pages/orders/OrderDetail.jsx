import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderApi } from '../../api/orderApi.js';
import { paymentApi } from '../../api/paymentApi.js';
import { Card, CardHeader, CardBody } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { formatAmount, formatDate } from '../../utils/format.js';

const PAYMENT_TYPES = [
  { value: 'ESPECES', label: 'Espèces (max 20 000 DH)' },
  { value: 'CHEQUE', label: 'Chèque' },
  { value: 'VIREMENT', label: 'Virement' },
];

export function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    montant: '',
    typePaiement: 'ESPECES',
    datePaiement: new Date().toISOString().slice(0, 10),
    reference: '',
    banque: '',
    dateEcheance: '',
  });
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
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
        await loadPayments();
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (id) load();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (order && payments.length > 0) {
      loadOrder();
    }
  }, [payments.length]);

  const handleAddPayment = async (e) => {
    e.preventDefault();
    const montant = Number(paymentForm.montant);
    if (paymentForm.typePaiement === 'ESPECES' && montant > 20000) {
      setError('Espèces : maximum 20 000 DH');
      return;
    }
    setPaymentSubmitting(true);
    setError('');
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
      setPaymentForm({
        montant: '',
        typePaiement: 'ESPECES',
        datePaiement: new Date().toISOString().slice(0, 10),
        reference: '',
        banque: '',
        dateEcheance: '',
      });
    } catch (err) {
      setError(err.message);
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
    if (!window.confirm('Annuler cette commande ?')) return;
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
  const canConfirm = order?.statut === 'PENDING' && restant <= 0;
  const canCancel = order?.statut === 'PENDING';
  const canAddPayment = order?.statut === 'PENDING' && restant > 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <CardHeader
          title={`Commande #${order?.id}`}
          action={
            <div className="flex gap-2">
              {canAddPayment && (
                <Button size="sm" onClick={() => setPaymentModal(true)}>
                  Ajouter un paiement
                </Button>
              )}
              {canConfirm && (
                <Button size="sm" onClick={handleConfirm} loading={actionLoading}>
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

      <Modal open={paymentModal} onClose={() => setPaymentModal(false)} title="Nouveau paiement">
        <form onSubmit={handleAddPayment} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
            <select
              value={paymentForm.typePaiement}
              onChange={(e) => setPaymentForm((f) => ({ ...f, typePaiement: e.target.value }))}
              className="input-field"
            >
              {PAYMENT_TYPES.map((t) => (
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
          {(paymentForm.typePaiement === 'CHEQUE' || paymentForm.typePaiement === 'VIREMENT') && (
            <>
              <Input
                label="Référence / N° chèque"
                value={paymentForm.reference}
                onChange={(e) => setPaymentForm((f) => ({ ...f, reference: e.target.value }))}
              />
              <Input
                label="Banque"
                value={paymentForm.banque}
                onChange={(e) => setPaymentForm((f) => ({ ...f, banque: e.target.value }))}
              />
              {paymentForm.typePaiement === 'CHEQUE' && (
                <Input
                  label="Date échéance"
                  type="date"
                  value={paymentForm.dateEcheance}
                  onChange={(e) => setPaymentForm((f) => ({ ...f, dateEcheance: e.target.value }))}
                />
              )}
            </>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={paymentSubmitting}>Enregistrer</Button>
            <Button type="button" variant="secondary" onClick={() => setPaymentModal(false)}>
              Annuler
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
