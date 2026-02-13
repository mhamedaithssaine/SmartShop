import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { customerApi } from '../../api/customerApi.js';
import { Card, CardHeader, CardBody } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';

export function ClientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await customerApi.getById(id);
        if (!cancelled) {
          setNom(data.nom || '');
          setEmail(data.email || '');
          setTelephone(data.telephone || '');
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Client introuvable');
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    }
    if (id) load();
    return () => { cancelled = true; };
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { nom, email, telephone };
      if (password.trim()) payload.password = password;
      await customerApi.update(id, payload);
      navigate(`/clients/${id}`);
    } catch (err) {
      setError(err.errors ? Object.values(err.errors).join(', ') : err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
      <Card>
        <CardHeader title="Modifier le client" />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Téléphone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
            />
            <Input
              label="Nouveau mot de passe (laisser vide pour ne pas changer)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-3">
              <Button type="submit" loading={loading}>Enregistrer</Button>
              <Button type="button" variant="secondary" onClick={() => navigate(`/clients/${id}`)}>
                Annuler
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </motion.div>
  );
}
