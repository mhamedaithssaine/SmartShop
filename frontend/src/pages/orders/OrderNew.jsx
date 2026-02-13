import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderApi } from '../../api/orderApi.js';
import { productApi } from '../../api/productApi.js';
import { customerApi } from '../../api/customerApi.js';
import { promoApi } from '../../api/promoApi.js';
import { Card, CardHeader, CardBody } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { formatAmount } from '../../utils/format.js';
import { isValidPromoFormat, normalizePromoCode } from '../../utils/promo.js';

export function OrderNew() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [codePromo, setCodePromo] = useState('');
  const [promoError, setPromoError] = useState('');
  const [lignes, setLignes] = useState([{ productId: '', quantite: 1 }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [cData, pData] = await Promise.all([
          customerApi.getAll(),
          productApi.getAll(),
        ]);
        if (!cancelled) {
          setCustomers(Array.isArray(cData) ? cData : []);
          setProducts(Array.isArray(pData) ? pData : []);
        }
      } catch (_) {}
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const addLigne = () => setLignes((prev) => [...prev, { productId: '', quantite: 1 }]);
  const removeLigne = (index) =>
    setLignes((prev) => prev.filter((_, i) => i !== index));
  const updateLigne = (index, field, value) =>
    setLignes((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    );

  const promoValid = !codePromo.trim() || isValidPromoFormat(codePromo);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPromoError('');
    if (!promoValid) {
      setPromoError('Code promo invalide (format PROMO-XXXX)');
      return;
    }
    const payload = {
      customerId: Number(customerId),
      codePromo: codePromo.trim() ? normalizePromoCode(codePromo) : null,
      lignes: lignes
        .filter((l) => l.productId && Number(l.quantite) > 0)
        .map((l) => ({ productId: Number(l.productId), quantite: Number(l.quantite) })),
    };
    if (!payload.lignes.length) {
      setError('Ajoutez au moins un produit.');
      return;
    }
    setLoading(true);
    try {
      const data = await orderApi.create(payload);
      navigate(`/orders/${data.id}`);
    } catch (err) {
      setError(err.message || 'Erreur création commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
      <Card>
        <CardHeader title="Nouvelle commande" />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Client</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Choisir un client</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.nom} – {c.email}</option>
                ))}
              </select>
            </div>

            <Input
              label="Code promo (optionnel, format PROMO-XXXX)"
              value={codePromo}
              onChange={(e) => {
                setCodePromo(e.target.value);
                setPromoError('');
              }}
              placeholder="PROMO-XXXX"
            />
            {promoError && <p className="text-sm text-red-600">{promoError}</p>}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Produits</label>
                <Button type="button" variant="secondary" size="sm" onClick={addLigne}>
                  Ajouter une ligne
                </Button>
              </div>
              <div className="space-y-3">
                {lignes.map((l, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                    <select
                      value={l.productId}
                      onChange={(e) => updateLigne(index, 'productId', e.target.value)}
                      className="input-field flex-1 min-w-[200px]"
                      required
                    >
                      <option value="">Produit</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nom} – {formatAmount(p.prixUnitaire)} – Stock: {p.stockDisponible}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={l.quantite}
                      onChange={(e) => updateLigne(index, 'quantite', e.target.value)}
                      className="input-field w-24"
                    />
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeLigne(index)}>
                      Retirer
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-3">
              <Button type="submit" loading={loading} disabled={!lignes.some((l) => l.productId && Number(l.quantite) > 0)}>
                Créer la commande
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/orders')}>
                Annuler
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </motion.div>
  );
}
