import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { promoApi } from '../../api/promoApi.js';
import { Card, CardHeader, CardBody } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { PROMO_CODE_PATTERN } from '../../constants/backend.js';
import { Plus, X } from 'lucide-react';
import { normalizePromoCode } from '../../utils/promo.js';

export function PromoNew() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [pourcentageRemise, setPourcentageRemise] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateExpiration, setDateExpiration] = useState('');
  const [nombreUtilisationsMax, setNombreUtilisationsMax] = useState('100');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const codeNorm = code.trim().toUpperCase();
    if (!PROMO_CODE_PATTERN.test(codeNorm)) {
      setError('Le code doit être au format PROMO-XXXX (4 caractères alphanumériques majuscules)');
      return;
    }
    const pct = Number(pourcentageRemise);
    if (Number.isNaN(pct) || pct < 0.01 || pct > 100) {
      setError('Le pourcentage doit être entre 0.01 et 100');
      return;
    }
    const maxUse = Number(nombreUtilisationsMax) || 1;
    if (maxUse < 1) {
      setError('Le nombre d\'utilisations max doit être au moins 1');
      return;
    }
    setLoading(true);
    try {
      await promoApi.create({
        code: normalizePromoCode(codeNorm),
        pourcentageRemise: pct,
        dateDebut,
        dateExpiration,
        nombreUtilisationsMax: maxUse,
      });
      navigate('/promo-codes');
    } catch (err) {
      setError(err.errors ? Object.values(err.errors).join(', ') : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader title="Nouveau code promo" />
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Code (format PROMO-XXXX)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="PROMO-XXXX"
                required
              />
              <Input
                label="Pourcentage de remise (%)"
                type="number"
                step="0.01"
                min="0.01"
                max="100"
                value={pourcentageRemise}
                onChange={(e) => setPourcentageRemise(e.target.value)}
                required
              />
              <Input
                label="Date de début"
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                required
              />
              <Input
                label="Date d'expiration"
                type="date"
                value={dateExpiration}
                onChange={(e) => setDateExpiration(e.target.value)}
                required
              />
              <Input
                label="Nombre d'utilisations max"
                type="number"
                min="1"
                value={nombreUtilisationsMax}
                onChange={(e) => setNombreUtilisationsMax(e.target.value)}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <Button type="submit" loading={loading}><Plus className="h-4 w-4 shrink-0" /> Créer</Button>
                <Button type="button" variant="secondary" onClick={() => navigate('/promo-codes')}>
                  <X className="h-4 w-4 shrink-0" /> Annuler
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
}
