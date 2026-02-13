import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productApi } from '../../api/productApi.js';
import { Card, CardHeader, CardBody } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';

export function ProductNew() {
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [prixUnitaire, setPrixUnitaire] = useState('');
  const [stockDisponible, setStockDisponible] = useState('');
  const [categorie, setCategorie] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await productApi.create({
        nom,
        prixUnitaire: Number(prixUnitaire) || 0,
        stockDisponible: Number(stockDisponible) || 0,
        categorie: categorie || null,
      });
      navigate('/products');
    } catch (err) {
      setError(err.errors ? Object.values(err.errors).join(', ') : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
      <Card>
        <CardHeader title="Nouveau produit" />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
            <Input
              label="Prix unitaire HT (DH)"
              type="number"
              step="0.01"
              min="0.01"
              value={prixUnitaire}
              onChange={(e) => setPrixUnitaire(e.target.value)}
              required
            />
            <Input
              label="Stock disponible"
              type="number"
              min="0"
              value={stockDisponible}
              onChange={(e) => setStockDisponible(e.target.value)}
              required
            />
            <Input
              label="Catégorie"
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-3">
              <Button type="submit" loading={loading}>Créer</Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/products')}>
                Annuler
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </motion.div>
  );
}
